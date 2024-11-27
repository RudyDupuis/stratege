import { Server, Socket } from 'socket.io'
import { passTurnHandler } from './controlHandlers/passTurnHandler'
import giveUpHandler from './controlHandlers/giveUpHandler'
import movePawnHandler from './actionHandlers/movePawnHandler'
import killPawnHandler from './actionHandlers/killPawnHandler'
import pushPawnHandler from './actionHandlers/pushPawnHandler'
import pullPawnHandler from './actionHandlers/pullPawnHandler'
import rotatePawnHandler from './actionHandlers/rotatePawnHandler'

export function gameHandlers(socket: Socket, io: Server) {
  passTurnHandler(socket, io)
  giveUpHandler(socket, io)
  movePawnHandler(socket, io)
  killPawnHandler(socket, io)
  pushPawnHandler(socket, io)
  pullPawnHandler(socket, io)
  rotatePawnHandler(socket, io)
}
