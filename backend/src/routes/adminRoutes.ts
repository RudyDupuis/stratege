import express, { Request, Response } from 'express'
import { gameGiveUpTimers } from '../socketHandlers/gameHandlers/record/gameGiveUpTimerRecord'
import { games } from '../socketHandlers/gameHandlers/record/gameRecords'
import { gameTurnTimers } from '../socketHandlers/gameHandlers/record/gameTurnTimerRecords'
import { rooms } from '../socketHandlers/roomHandlers/record/roomRecords'

const router = express.Router()

router.get('/socket-info', async (req: Request, res: Response) => {
  res.status(200).json({
    rooms: Object.keys(rooms),
    games: Object.keys(games),
    gameTurnTimers: Object.keys(gameTurnTimers),
    gameGiveUpTimers: Object.keys(gameGiveUpTimers)
  })
})
router.get('/socket-info/rooms', async (req: Request, res: Response) => {
  res.status(200).json({
    rooms
  })
})
router.get('/socket-info/games', async (req: Request, res: Response) => {
  res.status(200).json({
    games
  })
})

export default router
