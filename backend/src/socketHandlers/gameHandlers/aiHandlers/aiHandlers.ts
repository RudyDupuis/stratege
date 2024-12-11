import { Server } from 'socket.io'
import { Callback } from 'src/socketHandlers/socketHandlers'
import playAMoveRecursively from './playAMoveRecursively'

export default function aiHandlers(roomId: string, io: Server, callback: Callback) {
  setTimeout(() => playAMoveRecursively(roomId, io, callback), 1000)
}
