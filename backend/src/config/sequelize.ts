import { Sequelize } from 'sequelize'
import env from './env'
import { isUndefined } from '../../shared/utils/TypeGuard'

if (isUndefined(env.DB_NAME) || isUndefined(env.DB_USER) || isUndefined(env.DB_PASSWORD)) {
  throw new Error('Missing environment variables for database connection')
}

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'postgres'
})

export default sequelize
