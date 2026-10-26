import { Request, Response } from 'express'
import z from 'zod'
import { makeGetUserUseCase } from '../../../use-cases/factory/make-get-user-use-case'
import { makeListUsersUseCase } from '../../../use-cases/factory/make-list-users-use-case'

export async function list(req: Request, res: Response) {
  const caller = res.locals.user

  if (!caller?.isTeacher) {
    if (!caller?.id) {
      return res.status(403).send({
        success: false,
        message: 'Token sem identificação do usuário, faça login novamente',
      })
    }
    const self = await makeGetUserUseCase().handler(caller.id)
    return res.status(200).json({ success: true, count: 1, data: [self] })
  }

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
