import { UserRepository } from '../../repositories/mongoose/user.repository'
import { ListUsersUseCase } from '../list-users'

export function makeListUsersUseCase() {
  return new ListUsersUseCase(new UserRepository())
}
