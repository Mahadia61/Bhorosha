import { Router } from 'express'
import { answerProfessorQuestion, createProfessorQuestion, createProfessorReview, myProfessorQuestions, professorFeedback } from '../controllers/professorController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const professorRouter = Router()
professorRouter.get('/:professorId/feedback', requireAuth, professorFeedback)
professorRouter.post('/:professorId/reviews', requireAuth, allowRoles('student'), createProfessorReview)
professorRouter.post('/:professorId/questions', requireAuth, allowRoles('student'), createProfessorQuestion)
professorRouter.get('/me/questions', requireAuth, allowRoles('teacher'), myProfessorQuestions)
professorRouter.post('/questions/:questionId/answer', requireAuth, allowRoles('teacher'), answerProfessorQuestion)
