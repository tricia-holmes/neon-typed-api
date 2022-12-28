import express, { Request, Response} from 'express'
import randomWords from 'random-words'

const router = express.Router()

router.get(
  '/profile',
  async (req: Request, res: Response) => {
    res.json(req.user)
  }
)

router.get('/words', (req: Request, res: Response) => {
  const words = randomWords(250)
  res.json({
    message: 'Here are the randomized words!',
    user: req.user,
    token: req.query.secret_token,
    words: words,
  })
})

export default router
