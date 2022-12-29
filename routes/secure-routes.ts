import express, { Request, Response } from 'express'
import randomWords from 'random-words'
import TypingTests from '../db/models/typingTest'

const router = express.Router()

router.get('/profile', async (req: Request, res: Response) => {
  res.json(req.user)
})

router.get('/words', (req: Request, res: Response) => {
  const words = randomWords(250)
  res.json({
    message: 'Here are the randomized words!',
    user: req.user,
    token: req.query.secret_token,
    words: words,
  })
})

router.post('/typing-test', async (req: Request, res: Response) => {
  const currentUser = req.user as any
  const { wpm, accuracy } = req.body

  const newTypingTest: any = {
    wpm,
    accuracy,
    userId: currentUser.id,
  }

  const typingTest = await TypingTests.create(newTypingTest)

  res.json(typingTest)
})

export default router
