import { Router } from 'express'
import { answerQuestion, myQuestions, teacherQuestions } from '../controllers/questionController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const questionRouter = Router()
questionRouter.get('/teacher', requireAuth, allowRoles('teacher'), teacherQuestions)
questionRouter.get('/mine', requireAuth, allowRoles('student'), myQuestions)
questionRouter.post('/:questionId/answer', requireAuth, allowRoles('teacher'), answerQuestion)
