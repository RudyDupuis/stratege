import express, { Request, Response } from 'express'

const app = express()
const PORT = 3000

app.get('/', (_req: Request, res: Response) => {
  res.send('Stratège Backend Api')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
