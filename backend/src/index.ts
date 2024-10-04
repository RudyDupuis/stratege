import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import socketHandlers from '@/socketHandlers/socketHandlers'
import env from './config/envConfig'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: env.FRONT_URL
  }
})

socketHandlers(io)
server.listen(3000)
