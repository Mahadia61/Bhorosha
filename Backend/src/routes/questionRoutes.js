import { Router } from 'express'
import { answerQuestion, teacherQuestions } from '../controllers/questionController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const questionRouter = Router()
questionRouter.get('/teacher', requireAuth, allowRoles('teacher'), teacherQuestions)
questionRouter.post('/:questionId/answer', requireAuth, allowRoles('teacher'), answerQuestion)
