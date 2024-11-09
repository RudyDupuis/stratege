import express, { Request, Response } from 'express'
import { authenticateToken } from '../middleswares/authMiddleware'
import UserModel from '../models/user/UserModel'
import { isNull } from '../../shared/utils/TypeGuard'
import userModelToEntity from '../models/user/userModelToEntity'
import { userToDto } from '../../shared/user/mappers/userMapper'

const router = express.Router()

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserModel).id
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

export default router
