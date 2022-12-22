import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import randomWords from 'random-words'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Typescript Server')
})

app.get('/words', (req: Request, res: Response) => {
  const words = randomWords(250)
  res.json(words)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
