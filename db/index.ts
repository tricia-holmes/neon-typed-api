import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const envConfig = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
} as any

const env = process.env.NODE_ENV || 'development'
const config = envConfig[env]
const sequelize = new Sequelize(config.url, config)

export { Sequelize, sequelize }
