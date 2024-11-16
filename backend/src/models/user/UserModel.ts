import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/sequelize'
import User from '../../../shared/user/entities/User'

class UserModel extends Model<Optional<User, 'id'> & { googleId: number }> {
  declare pseudo: string
  declare avatarId: number
  declare eloScore: number
  declare readonly googleId: string
  declare readonly id: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pseudo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatarId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eloScore: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
)

export default UserModel
