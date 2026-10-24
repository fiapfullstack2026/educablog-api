import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetUserUseCase } from '../../src/use-cases/get-user'
import { ListUsersUseCase } from '../../src/use-cases/list-users'
import { UpdateUserUseCase } from '../../src/use-cases/update-user'
import { DeleteUserUseCase } from '../../src/use-cases/delete-user'
import { UserNotFoundError } from '../../src/use-cases/errors/user-not-found-error'
import { UserAlreadyExistsError } from '../../src/use-cases/errors/user-already-exists-error'

const repository = {
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByUsernameAndRole: vi.fn(),
}

const user = { username: 'maria', password: 'x', isTeacher: true }

beforeEach(() => vi.resetAllMocks())

describe('GetUserUseCase', () => {
  it('deve retornar o usuário', async () => {
    repository.findById.mockResolvedValue(user)
    expect(await new GetUserUseCase(repository as never).handler('1')).toBe(user)
  })

  it('deve lançar UserNotFoundError quando não existe', async () => {
    repository.findById.mockResolvedValue(undefined)
    await expect(
      new GetUserUseCase(repository as never).handler('1'),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})

describe('ListUsersUseCase', () => {
  it('deve repassar o filtro ao repositório', async () => {
    repository.findAll.mockResolvedValue([user])
    const result = await new ListUsersUseCase(repository as never).handler({
      isTeacher: false,
    })
    expect(repository.findAll).toHaveBeenCalledWith({ isTeacher: false })
    expect(result).toEqual([user])
  })
})

describe('DeleteUserUseCase', () => {
  it('deve remover o usuário', async () => {
    repository.delete.mockResolvedValue(user)
    expect(await new DeleteUserUseCase(repository as never).handler('1')).toBe(
      user,
    )
  })

  it('deve lançar UserNotFoundError quando não existe', async () => {
    repository.delete.mockResolvedValue(undefined)
    await expect(
      new DeleteUserUseCase(repository as never).handler('1'),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})

describe('UpdateUserUseCase', () => {
  const sut = () => new UpdateUserUseCase(repository as never)

  it('deve lançar UserNotFoundError quando não existe', async () => {
    repository.findById.mockResolvedValue(undefined)
    await expect(sut().handler('1', { username: 'a' })).rejects.toBeInstanceOf(
      UserNotFoundError,
    )
  })

  it('deve lançar UserAlreadyExistsError ao colidir username e perfil', async () => {
    repository.findById.mockResolvedValue(user)
    repository.findByUsernameAndRole.mockResolvedValue({ username: 'joao' })
    await expect(
      sut().handler('1', { username: 'joao' }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('deve hashear a senha ao atualizar', async () => {
    repository.findById.mockResolvedValue(user)
    repository.update.mockResolvedValue(user)
    await sut().handler('1', { password: 'nova' })
    const sent = repository.update.mock.calls[0][1]
    expect(sent.password).not.toBe('nova')
    expect(repository.findByUsernameAndRole).not.toHaveBeenCalled()
  })
})
