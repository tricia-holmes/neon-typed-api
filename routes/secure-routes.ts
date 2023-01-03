import express, { Request, Response } from 'express'
import randomWords from 'random-words'
import TypingTest from '../db/models/typingTest'
import { sequelize } from '../db/index'

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

router.post('/typing-tests', async (req: Request, res: Response) => {
  const currentUser = req.user as any
  const { wpm, accuracy } = req.body

  if (wpm !== 0 && !wpm) {
    return res.status(400).json({ message: `wpm is not defined` })
  }

  if (accuracy !== 0 && !accuracy) {
    return res.status(400).json({ message: `accuracy is not defined` })
  }

  const newTypingTest: any = {
    wpm,
    accuracy,
    userId: currentUser.id,
  }

  const typingTest = await TypingTest.create(newTypingTest)

  res.json(typingTest)
})

router.get('/typing-tests', async (req: Request, res: Response) => {
  const currentUser = req.user as any

  const typingTests = await TypingTest.findAll({
    where: { userId: currentUser.id },
    order: [['createdAt', 'DESC']],
  })

  res.json(typingTests)
})

router.get('/typing-tests/highscores', async (req: Request, res: Response) => {
  const typingTests = await sequelize.query(
    `
    SELECT username, wpm, accuracy, top_scores.created_at
    FROM (
      SELECT DISTINCT ON (user_id) * 
      FROM typing_tests
      ORDER BY user_id, wpm DESC
      LIMIT 10
    ) AS top_scores
    JOIN users
    ON top_scores.user_id = users.id
    ORDER BY top_scores.wpm DESC 
    `,
    {
      model: TypingTest,
      mapToModel: true,
    }
  )

  res.json(typingTests)
})

export default router
