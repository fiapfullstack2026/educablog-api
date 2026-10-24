import { Request, Response } from 'express'
import z from 'zod'
import { makeDeleteUserUseCase } from '../../../use-cases/factory/make-delete-user-use-case'

export async function remove(req: Request, res: Response) {
  const { id } = z.object({ id: z.string() }).parse(req.params)

  await makeDeleteUserUseCase().handler(id)

  return res.status(204).send()
}
