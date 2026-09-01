import { Router } from 'express'
import { createProfessor, listProfessors, listUsers, platformAnalytics, professorCourses, updateUser } from '../controllers/adminController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const adminRouter = Router()
adminRouter.get('/professors', requireAuth, listProfessors)
adminRouter.get('/professors/:professorId/courses', requireAuth, professorCourses)
adminRouter.post('/professors', requireAuth, allowRoles('admin'), createProfessor)
adminRouter.get('/users', requireAuth, allowRoles('admin'), listUsers)
adminRouter.patch('/users/:userId', requireAuth, allowRoles('admin'), updateUser)
adminRouter.get('/analytics', requireAuth, allowRoles('admin'), platformAnalytics)
