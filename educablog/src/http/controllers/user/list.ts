import { Request, Response } from 'express'
import z from 'zod'
import { makeListUsersUseCase } from '../../../use-cases/factory/make-list-users-use-case'

export async function list(req: Request, res: Response) {
  const { isTeacher } = z
    .object({ isTeacher: z.enum(['true', 'false']).optional() })
    .parse(req.query)

  const users = await makeListUsersUseCase().handler({
    isTeacher: isTeacher === undefined ? undefined : isTeacher === 'true',
  })

  return res
    .status(200)
    .json({ success: true, count: users.length, data: users })
}
