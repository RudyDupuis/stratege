<script setup lang="ts">
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { Orientation } from '@shared/pawn/entities/OrientationEnum'
import { Player } from '@shared/gameState/entities/PlayerEnum'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { computed, ref } from 'vue'
import PawnComponent from './PawnComponent.vue'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import type { gameData } from '../BoardGameHandler.vue'

const props = defineProps<{
  gameData: gameData
  resetTarget: () => void
}>()

const actions = defineModel<'move_kill' | 'push_pull'>()
const errorMessage = ref<string | undefined>(undefined)
const opponentIsNotConnectedErrorMessage = ref<string | undefined>(undefined)

function passTurn() {
  if (!props.gameData.isPlayerTurn) {
    return
  }

  props.gameData.socket.emit(
    'passTurn',
    props.gameData.roomId,
    props.gameData.player,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
  props.resetTarget()
}

function rotatePawn(orientation: Orientation) {
  if (isUndefined(props.gameData.targetPawn) || !props.gameData.isPlayerTurn) {
    return
  }

  let orientationAccordingToBoardGameDirection: Orientation
  if (props.gameData.player === Player.Player2) {
    switch (orientation) {
      case Orientation.NW:
        orientationAccordingToBoardGameDirection = Orientation.SE
        break
      case Orientation.NE:
        orientationAccordingToBoardGameDirection = Orientation.SW
        break
      case Orientation.SE:
        orientationAccordingToBoardGameDirection = Orientation.NW
        break
      case Orientation.SW:
        orientationAccordingToBoardGameDirection = Orientation.NE
        break
    }
  } else {
    orientationAccordingToBoardGameDirection = orientation
  }

  props.gameData.socket.emit(
    'rotatePawn',
    props.gameData.roomId,
    props.gameData.player,
    props.gameData.targetPawn,
    orientationAccordingToBoardGameDirection,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
  props.resetTarget()
}

function changeActions() {
  actions.value = actions.value === 'move_kill' ? 'push_pull' : 'move_kill'
}

const pawnColor = computed(() => {
  switch (props.gameData.player) {
    case Player.Player1:
      return 'bg-player1'
    case Player.Player2:
      return 'bg-player2'
  }
})

props.gameData.socket.on('playerCount', (count: number) => {
  if (count === 2) {
    return (opponentIsNotConnectedErrorMessage.value = undefined)
  }

  opponentIsNotConnectedErrorMessage.value = 'Votre adversaire est déconnecté ...'
})
</script>

<template>
  <section
    v-if="isUndefined(gameData.gameState.winner)"
    class="flex flex-col justify-center items-center size-full"
  >
    <p class="medium-title mb-10">
      {{ gameData.isPlayerTurn ? 'A vous de jouer !' : 'Au tour de votre adversaire ...' }}
    </p>

    <section
      v-show="gameData.isPlayerTurn"
      class="flex flex-col justify-center items-center size-full"
    >
      <div v-show="isDefined(gameData.targetPawn)" class="mb-10">
        <p class="small-title">Action à réaliser</p>
        <button @click="changeActions" class="button small-button mb-10">
          {{ actions === 'move_kill' ? 'Se déplacer' : 'Pousser/Tirer' }}
        </button>

        <p class="small-title mb-3">Orienter</p>
        <div class="flex space-x-8 justify-center items-center">
          <button @click="rotatePawn(Orientation.NW)">
            <PawnComponent
              sizeClass="size-10"
              :colorClass="pawnColor"
              orientationClass="rotate-0"
            />
          </button>
          <button @click="rotatePawn(Orientation.NE)">
            <PawnComponent
              sizeClass="size-10"
              :colorClass="pawnColor"
              orientationClass="rotate-90"
            />
          </button>
          <button @click="rotatePawn(Orientation.SW)">
            <PawnComponent
              sizeClass="size-10"
              :colorClass="pawnColor"
              orientationClass="rotate-270"
            />
          </button>
          <button @click="rotatePawn(Orientation.SE)">
            <PawnComponent
              sizeClass="size-10"
              :colorClass="pawnColor"
              orientationClass="rotate-180"
            />
          </button>
        </div>
      </div>
      <p v-show="isUndefined(gameData.targetPawn)" class="mb-10">Cliquez sur l'un de vos pions</p>

      <button @click="passTurn" class="button mb-10">Passer son tour</button>
    </section>
  </section>
  <p v-else class="medium-title size-full mb-20">
    {{
      gameData.gameState.winner === gameData.player ? 'Vous avez gagnez !' : 'Vous avez perdu ...'
    }}
  </p>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
  <ErrorDisplayer
    v-if="isDefined(opponentIsNotConnectedErrorMessage)"
    v-model="opponentIsNotConnectedErrorMessage"
  />
</template>
