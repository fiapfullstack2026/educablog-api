import express from 'express'
import { register } from './register'
import { signIn } from './sign-in'
import { list } from './list'
import { get } from './get'
import { update } from './update'
import { remove } from './remove'
import {
  authenticate,
  authorize,
  authorizeSelfOrTeacher,
} from '../../middleware/jwt-validate'

export const routerUser = express.Router()

routerUser.post('/register', register)
routerUser.post('/signin', signIn)

routerUser.get('/', authenticate, list)
routerUser.get('/:id', authenticate, authorizeSelfOrTeacher, get)
routerUser.put('/:id', authenticate, authorizeSelfOrTeacher, update)
routerUser.delete('/:id', authenticate, authorize, remove)
