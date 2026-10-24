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

const makeRes = () => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), send: vi.fn() }
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
})
