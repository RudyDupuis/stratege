import session from 'express-session'
import env from './env'
import { isUndefined } from '../../shared/utils/TypeGuard'

if (isUndefined(env.SESSION_SECRET)) {
  throw new Error('Missing environment variables for session initialization')
}

export default session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})
