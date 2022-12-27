import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import User from './db/models/user'
import { Strategy as JWTstrategy } from 'passport-jwt'
import { ExtractJwt as ExtractJWT } from 'passport-jwt'

passport.use(
  'signup',
  new localStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const salt = await bcrypt.genSalt(10)
        const newUser = {
          username: username as string,
          password: await bcrypt.hash(password, salt),
        }

        const created_user = await User.create(newUser)

        return done(null, created_user)
      } catch (error) {
        done(error)
      }
    }
  )
)

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
          return done(null, false, { message: 'User not found' })
        }

        const isValidPassword = async (password: string) => {
          const compare = await bcrypt.compare(password, foundUser.password)
          return compare
        }

        const validate = await isValidPassword(password)

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }

        return done(null, foundUser, { message: 'Logged in sucessfully' })
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
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)
