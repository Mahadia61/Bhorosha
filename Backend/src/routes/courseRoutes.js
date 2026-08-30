import { Router } from 'express'
import { createCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js'
import { createQuestion, listCourseQuestions } from '../controllers/questionController.js'
import { createReview, listCourseReviews } from '../controllers/reviewController.js'
import { summarizeCourseReviews } from '../controllers/summaryController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const courseRouter = Router()
courseRouter.get('/', listCourses)
courseRouter.get('/:courseId', getCourse)
courseRouter.post('/', requireAuth, allowRoles('admin'), createCourse)
courseRouter.patch('/:courseId', requireAuth, allowRoles('admin'), updateCourse)
courseRouter.get('/:courseId/reviews', listCourseReviews)
courseRouter.post('/:courseId/reviews', requireAuth, allowRoles('student'), createReview)
courseRouter.post('/:courseId/reviews/summary', requireAuth, allowRoles('teacher', 'admin'), summarizeCourseReviews)
courseRouter.get('/:courseId/questions', listCourseQuestions)
courseRouter.post('/:courseId/questions', requireAuth, allowRoles('student'), createQuestion)
