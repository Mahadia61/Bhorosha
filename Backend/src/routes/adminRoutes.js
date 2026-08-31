import { Router } from 'express'
import { createProfessor, listProfessors } from '../controllers/adminController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const adminRouter = Router()
adminRouter.get('/professors', requireAuth, listProfessors)
adminRouter.post('/professors', requireAuth, allowRoles('admin'), createProfessor)
