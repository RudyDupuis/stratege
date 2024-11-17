import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import socketHandlers from './socketHandlers/socketHandlers'
import env from './config/env'
import sequelize from './config/sequelize'
import passport from './config/passport'
import googleAuthRoutes from './routes/auth/googleAuthRoutes'
import session from './config/session'
import userRoutes from './routes/userRoutes'

const app = express()
app.use(express.json())
app.use(cors({ origin: env.FRONT_URL }))
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: env.FRONT_URL
  }
})

app.use(session)

passport.initialize()
passport.session()

app.use('/auth/google', googleAuthRoutes)
app.use('/user', userRoutes)

sequelize.sync().then(() => {
  console.log('Base de donnée initialisée')
})

socketHandlers(io)
server.listen(3000)
