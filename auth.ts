import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import User from './db/models/user'
import { Strategy as JWTstrategy } from 'passport-jwt'
import { ExtractJwt as ExtractJWT } from 'passport-jwt'

passport.use(
  'login',
  new localStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const foundUser = await User.findOne({
          where: { username: `${username}` },
        })

        if (!foundUser) {
          return done('failed login', null)
        }

        const isValidPassword = async (password: string) => {
          const compare = await bcrypt.compare(password, foundUser.password)
          return compare
        }

        const validate = await isValidPassword(password)

        if (!validate) {
          return done('failed login', null)
        }

        return done(null, foundUser)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await User.findOne({
          where: { username: `${token.user.username}` },
        })
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }
        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)
