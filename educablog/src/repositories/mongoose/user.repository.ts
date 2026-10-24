import mongoose from 'mongoose'
import { IUser } from '../../entities/models/user.interface'
import { IUserRepository } from '../user.repository.interface'
import { userSchema } from '../../entities/user.schema'

const UserModel =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export class UserRepository implements IUserRepository {
  async signIn(username: string): Promise<IUser | undefined> {
    return await this.findByUsername(username)
  }

  async findByUsername(username: string): Promise<IUser | undefined> {
    return (await UserModel.findOne({ username }).lean()) || undefined
  }

  async findByUsernameAndRole(
    username: string,
    isTeacher: boolean,
  ): Promise<IUser | undefined> {
    return (
      (await UserModel.findOne({ username, isTeacher }).lean()) || undefined
    )
  }

  async create(user: IUser): Promise<IUser> {
    return (await new UserModel(user).save()) as unknown as IUser
  }

  async findById(id: string): Promise<IUser | undefined> {
    return (
      (await UserModel.findById(id).select('-password').lean()) || undefined
    )
  }

  async findAll(filter: { isTeacher?: boolean } = {}): Promise<IUser[]> {
    const query =
      filter.isTeacher === undefined ? {} : { isTeacher: filter.isTeacher }
    return (await UserModel.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IUser[]
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | undefined> {
    return (
      (await UserModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
        .select('-password')
        .lean()) || undefined
    )
  }

  async delete(id: string): Promise<IUser | undefined> {
    return (
      (await UserModel.findByIdAndDelete(id).select('-password').lean()) ||
      undefined
    )
  }
}
