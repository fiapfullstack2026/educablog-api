import bcrypt from 'bcryptjs'
import { IUser } from '../entities/models/user.interface'
import { IUserRepository } from '../repositories/user.repository.interface'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UserNotFoundError } from './errors/user-not-found-error'

export class UpdateUserUseCase {
  constructor(private repository: IUserRepository) {}

  async handler(id: string, data: Partial<IUser>): Promise<IUser> {
    const current = await this.repository.findById(id)

    if (!current) {
      throw new UserNotFoundError()
    }

    const username = data.username ?? current.username
    const isTeacher = data.isTeacher ?? current.isTeacher ?? false

    if (
      username !== current.username ||
      isTeacher !== (current.isTeacher ?? false)
    ) {
      const existing = await this.repository.findByUsernameAndRole(
        username,
        isTeacher,
      )
      if (existing) {
        throw new UserAlreadyExistsError()
      }
    }

    const changes: Partial<IUser> = { ...data }
    if (data.password) {
      changes.password = await bcrypt.hash(data.password, 10)
    }

    const updated = await this.repository.update(id, changes)

    if (!updated) {
      throw new UserNotFoundError()
    }

    return updated
  }
}
