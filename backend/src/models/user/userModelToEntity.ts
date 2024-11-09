import User from '../../../shared/user/entities/User'
import UserModel from './UserModel'

export default function userModelToEntity(userModel: UserModel) {
  return new User(userModel.id, userModel.pseudo, userModel.elo_score)
}
