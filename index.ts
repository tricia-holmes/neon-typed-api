import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import randomWords from 'random-words'
import User from './db/models/user'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.get('/words', (req: Request, res: Response) => {
  const words = randomWords(250)
  res.json(words)
})

app.post('/signup', async (req: Request, res: Response) => {
  const body = req.body

  if (body.username === '') {
    return res.status(400).send(`username can't be blank`)
  }

  if (body.username.length <= 3) {
    return res.status(400).send(`username must be longer than 3 characters`)
  }

  if (body.password === '') {
    return res.status(400).send(`password can't be blank`)
  }

  const salt = await bcrypt.genSalt(10)
  const newUser = {
    username: body.username as string,
    password: await bcrypt.hash(body.password, salt),
  }

  const created_user = await User.create(newUser)
  res.status(201).json(created_user)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
