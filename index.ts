import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import routes from './routes/routes'
import secureRoutes from './routes/secure-routes'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

require('./auth')

app.use(cors())
app.use(express.json())

app.use('/', routes)
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoutes)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
