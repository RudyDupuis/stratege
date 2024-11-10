import express, { Request, Response } from 'express'
import { authenticateToken } from '../middleswares/authMiddleware'
import UserModel from '../models/user/UserModel'
import { isNull } from '../../shared/utils/TypeGuard'
import userModelToEntity from '../models/user/userModelToEntity'
import { userToDto } from '../../shared/user/mappers/userMapper'

const router = express.Router()

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const user = await UserModel.findByPk(userId)

    if (isNull(user)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    res.status(200).json(userToDto(userModelToEntity(user)))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Une erreur est survenue' })
  }
})

router.patch('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const user = await UserModel.findByPk(userId)

    if (isNull(user)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    user.pseudo = req.body.pseudo
    user.pictureId = req.body.pictureId

    if (user.pseudo.length < 3 || user.pseudo.length > 20) {
      return res.status(400).json({ message: 'Le pseudo doit contenir entre 3 et 20 caractères.' })
    }

    await user.save()
    res.status(200).json(userToDto(userModelToEntity(user)))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Une erreur est survenue' })
  }
})

export default router
