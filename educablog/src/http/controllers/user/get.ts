import { Request, Response } from 'express'
import z from 'zod'
import { makeGetUserUseCase } from '../../../use-cases/factory/make-get-user-use-case'

export async function get(req: Request, res: Response) {
  const { id } = z.object({ id: z.string() }).parse(req.params)

  const user = await makeGetUserUseCase().handler(id)

  return res.status(200).json({ success: true, data: user })
}
