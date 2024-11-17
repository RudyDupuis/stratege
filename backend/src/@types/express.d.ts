import UserModel from '../models/user/UserModel'

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserModel {}
    interface Request {
      userId?: string
    }
  }
}
