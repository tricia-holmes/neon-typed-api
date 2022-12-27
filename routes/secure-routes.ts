import express, {Request, Response, NextFunction} from 'express'
import randomWords from 'random-words'

const router = express.Router()

router.get('/words', (req: Request, res: Response, next: NextFunction) => {
  const words = randomWords(250)
  res.json({
    message: 'Here are the randomized words!',
    user: req.user,
    token: req.query.secret_token,
    words: words,
  })
})

export default router