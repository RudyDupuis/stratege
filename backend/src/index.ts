import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import socketHandlers from '@/socketHandlers/socketHandlers'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173' // mettre dans un .env
  }
})

socketHandlers(io)

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Le serveur tourne au port ${PORT}`)
})
