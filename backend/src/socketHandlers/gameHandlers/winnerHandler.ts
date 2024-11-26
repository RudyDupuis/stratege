import GameState from '../../../shared/gameState/entities/GameState'
import { isDefined, isNull, isUndefined } from '../../../shared/utils/TypeGuard'
import { Server } from 'socket.io'
import { rooms } from '../roomHandlers/roomHandlers'
import { Callback } from '../socketHandlers'
import UserModel from '../../models/user/UserModel'
import userModelToEntity from '../../models/user/userModelToEntity'
import { endGameInformationToDto } from '../../../shared/gameState/mappers/endGameInformationMapper'
import { calculateEloScore } from '../../utils/gameMethods'

export default async function winnerHandler(
  gameState: GameState,
  gameTurnTimers: Record<string, NodeJS.Timeout>,
  roomId: string,
  io: Server,
  callback: Callback
) {
  gameState.checkIfThereIsAWinner()
  const winnerRole = gameState.winner

  if (isDefined(winnerRole)) {
    if (isDefined(gameTurnTimers[roomId])) {
      clearTimeout(gameTurnTimers[roomId])
      delete gameTurnTimers[roomId]
    }

    const playersInfo = rooms[roomId].playersInfo

    const winningPlayerInfo = playersInfo.find((player) => player.role === winnerRole)
    const losingPlayerInfo = playersInfo.find((player) => player.role !== winnerRole)

    if (isUndefined(winningPlayerInfo) || isUndefined(losingPlayerInfo)) {
      return callback({
        error: 'Erreur lors de la récupération des informations des joueurs en fin partie'
      })
    }

    if (rooms[roomId].type === 'private') {
      return io.to(roomId).emit(
        'endGameInformation',
        endGameInformationToDto({
          winner: {
            playerRole: winningPlayerInfo.role
          },
          loser: {
            playerRole: losingPlayerInfo.role
          }
        })
      )
    }

    const winningPlayerModel = await UserModel.findOne({
      where: {
        id: winningPlayerInfo.userId
      }
    })

    const losingPlayerModel = await UserModel.findOne({
      where: {
        id: losingPlayerInfo.userId
      }
    })

    if (isNull(winningPlayerModel) || isNull(losingPlayerModel)) {
      return callback({
        error: 'Erreur lors de la récupération des joueurs en fin partie'
      })
    }

    winningPlayerModel.update({
      eloScore: calculateEloScore(winningPlayerModel.eloScore, losingPlayerModel.eloScore, true)
    })
    losingPlayerModel.update({
      eloScore: calculateEloScore(losingPlayerModel.eloScore, winningPlayerModel.eloScore, false)
    })

    await winningPlayerModel.save()
    await losingPlayerModel.save()

    io.to(roomId).emit(
      'endGameInformation',
      endGameInformationToDto({
        winner: {
          playerRole: winningPlayerInfo.role,
          user: userModelToEntity(winningPlayerModel)
        },
        loser: {
          playerRole: losingPlayerInfo.role,
          user: userModelToEntity(losingPlayerModel)
        }
      })
    )
  }
}
