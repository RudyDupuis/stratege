import { NextFunction, Request, Response } from 'express'
import { isUndefined } from '../../shared/utils/TypeGuard'
import env from '../config/env'
import jwt from 'jsonwebtoken'

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  if (isUndefined(env.JWT_SECRET)) {
    res.status(500).json({ message: "Configuration manquante du serveur: 'JWT_SECRET" })
    return
  }

  const authHeader = req.headers.authorization

  if (isUndefined(authHeader)) {
    res.status(401).json({ message: "Vous n'avez pas d'authentification" })
    return
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, env.JWT_SECRET, (err, decodedToken) => {
    if (
      err ||
      isUndefined(decodedToken) ||
      typeof decodedToken === 'string' ||
      !('id' in decodedToken)
    ) {
      res.status(403).json({ message: 'Token non valide' })
      return
    }

    req.userId = decodedToken.id
    next()
  })
}
