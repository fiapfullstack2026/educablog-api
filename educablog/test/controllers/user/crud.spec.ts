import { describe, it, expect, vi } from 'vitest'
import { Request, Response } from 'express'

const handlers = vi.hoisted(() => ({
  get: vi.fn(),
  list: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

vi.mock('../../../src/use-cases/factory/make-get-user-use-case', () => ({
  makeGetUserUseCase: () => ({ handler: handlers.get }),
}))
vi.mock('../../../src/use-cases/factory/make-list-users-use-case', () => ({
  makeListUsersUseCase: () => ({ handler: handlers.list }),
}))
vi.mock('../../../src/use-cases/factory/make-update-user-use-case', () => ({
  makeUpdateUserUseCase: () => ({ handler: handlers.update }),
}))
vi.mock('../../../src/use-cases/factory/make-delete-user-use-case', () => ({
  makeDeleteUserUseCase: () => ({ handler: handlers.remove }),
}))

import { get } from '../../../src/http/controllers/user/get'
import { list } from '../../../src/http/controllers/user/list'
import { update } from '../../../src/http/controllers/user/update'
import { remove } from '../../../src/http/controllers/user/remove'

const makeRes = (user: object = { isTeacher: true }) => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn(),
    locals: { user },
  }
  return res as unknown as Response & typeof res
}

describe('user controllers', () => {
  it('get deve retornar 200 com o usuário', async () => {
    handlers.get.mockResolvedValue({ username: 'a' })
    const res = makeRes()
    await get({ params: { id: '1' } } as unknown as Request, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { username: 'a' },
    })
  })

  it('list deve converter isTeacher da query para boolean', async () => {
    handlers.list.mockResolvedValue([])
    const res = makeRes()
    await list({ query: { isTeacher: 'false' } } as unknown as Request, res)
    expect(handlers.list).toHaveBeenCalledWith({ isTeacher: false })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('list sem query não deve filtrar', async () => {
    handlers.list.mockResolvedValue([])
    await list({ query: {} } as unknown as Request, makeRes())
    expect(handlers.list).toHaveBeenCalledWith({ isTeacher: undefined })
  })

  it('update deve retornar 204', async () => {
    handlers.update.mockResolvedValue({})
    const res = makeRes()
    await update(
      { params: { id: '1' }, body: { username: 'b' } } as unknown as Request,
      res,
    )
    expect(handlers.update).toHaveBeenCalledWith('1', { username: 'b' })
    expect(res.status).toHaveBeenCalledWith(204)
  })

  it('remove deve retornar 204', async () => {
    handlers.remove.mockResolvedValue({})
    const res = makeRes()
    await remove({ params: { id: '1' } } as unknown as Request, res)
    expect(res.status).toHaveBeenCalledWith(204)
  })

  it('list como aluno deve retornar somente ele mesmo', async () => {
    handlers.get.mockResolvedValue({ username: 'aluno' })
    handlers.list.mockClear()
    const res = makeRes({ id: 'abc', isTeacher: false })
    await list({ query: {} } as unknown as Request, res)
    expect(handlers.get).toHaveBeenCalledWith('abc')
    expect(handlers.list).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: [{ username: 'aluno' }],
    })
  })

  it('list como aluno sem id no token deve retornar 403', async () => {
    const res = makeRes({ isTeacher: false })
    await list({ query: {} } as unknown as Request, res)
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('update como aluno não pode alterar isTeacher', async () => {
    handlers.update.mockClear()
    const res = makeRes({ id: '1', isTeacher: false })
    await update(
      { params: { id: '1' }, body: { isTeacher: true } } as unknown as Request,
      res,
    )
    expect(res.status).toHaveBeenCalledWith(403)
    expect(handlers.update).not.toHaveBeenCalled()
  })

  it('update como aluno pode alterar os próprios dados', async () => {
    handlers.update.mockResolvedValue({})
    const res = makeRes({ id: '1', isTeacher: false })
    await update(
      { params: { id: '1' }, body: { username: 'novo' } } as unknown as Request,
      res,
    )
    expect(res.status).toHaveBeenCalledWith(204)
  })
})
