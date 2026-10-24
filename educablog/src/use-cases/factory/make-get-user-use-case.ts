import { UserRepository } from '../../repositories/mongoose/user.repository'
import { GetUserUseCase } from '../get-user'

export function makeGetUserUseCase() {
  return new GetUserUseCase(new UserRepository())
}
