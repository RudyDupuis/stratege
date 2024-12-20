import express from 'express'
import env from '../../config/env'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { isUndefined } from '../../../shared/utils/TypeGuard'

const router = express.Router()

router.get('/', passport.authenticate('google', { scope: ['profile'] }))
router.get('/callback', passport.authenticate('google'), (req, res) => {
  if (isUndefined(env.JWT_SECRET)) {
    throw new Error('Missing environment variables for JWT initialization')
  }

  const user = req.user
  if (isUndefined(user)) {
    throw new Error('Utilisateur introuvable')
  }

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '7d'
  })
  res.redirect(env.FRONT_URL + '?token=' + token)
})

export default router
