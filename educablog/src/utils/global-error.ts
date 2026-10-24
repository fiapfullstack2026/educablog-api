/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import { treeifyError, ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import { ResourceNotFoundError } from '../use-cases/errors/resource-not-found-error'
import { UserNotFoundError } from '../use-cases/errors/user-not-found-error'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error'

interface HttpError extends Error {
  statusCode: number
  expose: boolean
  type?: string
}

function isHttpError(err: unknown): err is HttpError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    'expose' in err &&
    (err as HttpError).expose === true
  )
}

export function globalError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.flatten().fieldErrors,
    })
  }

  if (
    err instanceof ResourceNotFoundError ||
    err instanceof UserNotFoundError
  ) {
    return res.status(404).json({
      success: false,
      message: err.message,
    })
  }

  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    })
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.errors,
    })
  }

  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message:
        err.type === 'entity.parse.failed'
          ? 'JSON inválido no corpo da requisição'
          : err.message,
    })
  }

  if (err instanceof UserAlreadyExistsError) {
    return res.status(409).json({
      success: false,
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  })
}
