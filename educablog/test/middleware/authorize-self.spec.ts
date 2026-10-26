import { describe, it, expect, vi } from 'vitest'
import { Request, Response } from 'express'
import { authorizeSelfOrTeacher } from '../../src/http/middleware/jwt-validate'

const run = (user: object | undefined, id: string) => {
  const res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
    locals: { user },
  } as unknown as Response & { status: ReturnType<typeof vi.fn> }
  const next = vi.fn()
  authorizeSelfOrTeacher({ params: { id } } as unknown as Request, res, next)
  return { res, next }
}

describe('authorizeSelfOrTeacher', () => {
  it('permite professor em qualquer id', () => {
    expect(run({ isTeacher: true }, 'x').next).toHaveBeenCalled()
  })

  it('permite aluno no próprio id', () => {
    expect(run({ id: 'a', isTeacher: false }, 'a').next).toHaveBeenCalled()
  })

  it('bloqueia aluno em outro id', () => {
    const { res, next } = run({ id: 'a', isTeacher: false }, 'b')
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('bloqueia aluno com token sem id', () => {
    const { res, next } = run({ isTeacher: false }, 'b')
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
