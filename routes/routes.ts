import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../db/models/user'

const router = express.Router()

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body

    if (username.length <= 3) {
      return res
        .status(400)
        .json({ message: `username must be longer than 3 characters` })
    }

    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: `password must be longer than 5 characters` })
    }

    const foundUser = await User.findOne({ where: { username: `${username}` } })

    if (foundUser) {
      return res.status(400).json({ message: `username is already in use.` })
    }

    const salt = await bcrypt.genSalt(10)
    const newUser = {
      username: username as string,
      password: await bcrypt.hash(password, salt),
    }

    const user = await User.create(newUser)

    res.json(user)
  }
)

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          res.status(400)
          return res.send({ message: 'invalid username or password' })
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            res.status(400)
            return res.send({ message: 'invalid username or password' })
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
