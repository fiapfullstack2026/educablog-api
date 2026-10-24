import { UserRepository } from '../../repositories/mongoose/user.repository'
import { UpdateUserUseCase } from '../update-user'

export function makeUpdateUserUseCase() {
  return new UpdateUserUseCase(new UserRepository())
}
