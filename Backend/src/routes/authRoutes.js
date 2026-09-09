import { Router } from 'express'
import { login, me, register, verifyTeacher } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('/verify-teacher', verifyTeacher)
authRouter.post('/login', login)
authRouter.get('/me', requireAuth, me)
