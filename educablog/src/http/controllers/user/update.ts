import { Request, Response } from 'express'
import z from 'zod'
import { makeUpdateUserUseCase } from '../../../use-cases/factory/make-update-user-use-case'

export async function update(req: Request, res: Response) {
  const bodySchema = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    isTeacher: z.boolean().optional(),
  })
  const { id } = z.object({ id: z.string() }).parse(req.params)
  const data = bodySchema.parse(req.body)

  await makeUpdateUserUseCase().handler(id, data)

  return res.status(204).send()
}
