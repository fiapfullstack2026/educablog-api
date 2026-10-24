import { IUser } from '../entities/models/user.interface'
import { IUserRepository } from '../repositories/user.repository.interface'

export class ListUsersUseCase {
  constructor(private repository: IUserRepository) {}

  async handler(filter?: { isTeacher?: boolean }): Promise<IUser[]> {
    return this.repository.findAll(filter)
  }
}
