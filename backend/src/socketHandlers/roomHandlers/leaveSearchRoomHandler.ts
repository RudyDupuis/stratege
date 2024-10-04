import { Socket } from 'socket.io'

export default function leaveSearchRoomHandler(
  socket: Socket,
  availablePublicRooms: Record<string, Set<string>>,
  rooms: Record<string, Set<string>>
) {
  socket.on('leaveSearchRoom', () => {
    for (const roomId in availablePublicRooms) {
      if (availablePublicRooms[roomId].has(socket.id)) {
        delete availablePublicRooms[roomId]
      }
    }
    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        delete rooms[roomId]
      }
    }
  })
}
