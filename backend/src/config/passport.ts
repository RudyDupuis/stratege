import passport from 'passport'
import env from './env'
import { Strategy } from 'passport-google-oauth2'
import { isNull, isUndefined } from '../../shared/utils/TypeGuard'
import UserModel from '../models/user/UserModel'

if (isUndefined(env.GOOGLE_CLIENT_ID) || isUndefined(env.GOOGLE_CLIENT_SECRET)) {
  throw new Error('Missing environment variables for Google authentication')
}

passport.use(
  new Strategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.BACKEND_URL + '/auth/google/callback'
    },
    async function (_accessToken, _refreshToken, profile, done) {
      try {
        let user = await UserModel.findOne({ where: { googleId: profile.id } })

        if (isNull(user)) {
          user = await UserModel.create({
            googleId: profile.id,
            pseudo: profile.displayName,
            avatarId: 1,
            eloScore: 1500
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserModel.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
