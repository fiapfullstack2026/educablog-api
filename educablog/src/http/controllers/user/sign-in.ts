import z from 'zod'
import { Request, Response } from 'express'
import { makeSignInUseCase } from '../../../use-cases/factory/make-sign-in-use-case'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function signIn(req: Request, resp: Response) {
  const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
  })

  const { username, password } = bodySchema.parse(req.body)

  const signInUseCase = makeSignInUseCase()
  const user = await signInUseCase.handler(username)

  if (!user) {
    return resp
      .status(400)
      .send({ success: false, message: 'Usuário não encontrado' })
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password)
  if (!doesPasswordMatch) {
    return resp
      .status(401)
      .send({ success: false, message: 'Credenciais inválidas' })
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev-secret'
  const token = jwt.sign(
    {
      id: user._id?.toString(),
      username: user.username,
      isTeacher: user.isTeacher,
    },
    jwtSecret,
    {
      expiresIn: '1h',
    },
  )

  return resp.status(200).send({ success: true, token })
}
