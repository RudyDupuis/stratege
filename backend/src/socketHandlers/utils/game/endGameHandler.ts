import { endGameInformationToDto } from '../../../../shared/gameState/mappers/endGameInformationMapper'
import { isDefined, isNull, isUndefined } from '../../../../shared/utils/TypeGuard'
import { Server } from 'socket.io'
import UserModel from '../../../models/user/UserModel'
import userModelToEntity from '../../../models/user/userModelToEntity'
import { games } from '../../../socketHandlers/gameHandlers/record/gameRecords'
import { deleteGameTurnTimer } from '../../../socketHandlers/gameHandlers/record/gameTurnTimerRecords'
import { rooms } from '../../../socketHandlers/roomHandlers/record/roomRecords'
import { Callback } from '../../../socketHandlers/socketHandlers'
import { RoomType } from '../../../../shared/room/entities/RoomTypeEnum'

export default async function endGameHandler(roomId: string, io: Server, callback: Callback) {
  const gameState = games[roomId]
  const room = rooms[roomId]

  if (isUndefined(gameState) || isUndefined(room)) {
    return
  }

  gameState.checkIfThereIsAWinner()
  const winnerRole = gameState.winner

  if (isDefined(winnerRole)) {
    deleteGameTurnTimer(roomId)

    const playersInfo = rooms[roomId].playersInfo

    const winningPlayerInfo = playersInfo.find((player) => player.role === winnerRole)
    const losingPlayerInfo = playersInfo.find((player) => player.role !== winnerRole)

    if (isUndefined(winningPlayerInfo) || isUndefined(losingPlayerInfo)) {
      return callback({
        error: 'Erreur lors de la récupération des informations des joueurs en fin partie'
      })
    }

    if (rooms[roomId].type !== RoomType.Public) {
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

function calculateEloScore(playerElo: number, opponentElo: number, didPlayerWin: boolean) {
  const K = 32
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
  return Math.round(playerElo + K * ((didPlayerWin ? 1 : 0) - expectedScore))
}
