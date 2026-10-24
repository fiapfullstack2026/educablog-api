import { IUser } from '../entities/models/user.interface'
import { IUserRepository } from '../repositories/user.repository.interface'
import { UserNotFoundError } from './errors/user-not-found-error'

export class GetUserUseCase {
  constructor(private repository: IUserRepository) {}

  async handler(id: string): Promise<IUser> {
    const user = await this.repository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }
}
