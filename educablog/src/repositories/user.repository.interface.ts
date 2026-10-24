import { IUser } from '../entities/models/user.interface'

export interface IUserRepository {
  create(user: IUser): Promise<IUser>
  findByUsername(username: string): Promise<IUser | undefined>
  findByUsernameAndRole(
    username: string,
    isTeacher: boolean,
  ): Promise<IUser | undefined>
  signIn(username: string): Promise<IUser | undefined>
  findById(id: string): Promise<IUser | undefined>
  findAll(filter?: { isTeacher?: boolean }): Promise<IUser[]>
  update(id: string, data: Partial<IUser>): Promise<IUser | undefined>
  delete(id: string): Promise<IUser | undefined>
}
