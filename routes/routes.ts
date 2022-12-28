import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    if (body.username === '') {
      return res.status(400).json(`username can't be blank`)
    }

    if (body.username.length <= 3) {
      return res.status(400).json(`username must be longer than 3 characters`)
    }

    if (body.password === '') {
      return res.status(400).json(`password can't be blank`)
    }

    res.json({ message: 'Signup sucessful', user: body.username })
  }
)

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occured.')

          return next(error)
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            return next(error)
          }

          const body = { _id: user._id, username: user.username }
          const token = jwt.sign({ user: body }, 'TOP_SECRET')

          return res.json({ token })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  }
)

export default router
