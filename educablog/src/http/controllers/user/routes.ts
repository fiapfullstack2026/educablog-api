import express from 'express'
import { register } from './register'
import { signIn } from './sign-in'
import { list } from './list'
import { get } from './get'
import { update } from './update'
import { remove } from './remove'
import { authenticate, authorize } from '../../middleware/jwt-validate'

export const routerUser = express.Router()

routerUser.post('/register', register)
routerUser.post('/signin', signIn)

routerUser.get('/', authenticate, authorize, list)
routerUser.get('/:id', authenticate, authorize, get)
routerUser.put('/:id', authenticate, authorize, update)
routerUser.delete('/:id', authenticate, authorize, remove)
