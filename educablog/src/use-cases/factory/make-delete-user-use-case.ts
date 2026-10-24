import { UserRepository } from '../../repositories/mongoose/user.repository'
import { DeleteUserUseCase } from '../delete-user'

export function makeDeleteUserUseCase() {
  return new DeleteUserUseCase(new UserRepository())
}
