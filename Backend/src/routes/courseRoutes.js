import { Router } from 'express'
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js'
import { createQuestion, listCourseQuestions } from '../controllers/questionController.js'
import { createReview, listCourseReviews } from '../controllers/reviewController.js'
import { summarizeCourseReviews } from '../controllers/summaryController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { requireCourseAccess } from '../middleware/courseAccess.js'

export const courseRouter = Router()
courseRouter.get('/', requireAuth, listCourses)
courseRouter.get('/:courseId', requireAuth, requireCourseAccess, getCourse)
courseRouter.post('/', requireAuth, allowRoles('admin'), createCourse)
courseRouter.patch('/:courseId', requireAuth, allowRoles('admin'), updateCourse)
courseRouter.delete('/:courseId', requireAuth, allowRoles('admin'), deleteCourse)
courseRouter.get('/:courseId/reviews', requireAuth, requireCourseAccess, listCourseReviews)
courseRouter.post('/:courseId/reviews', requireAuth, allowRoles('student'), requireCourseAccess, createReview)
courseRouter.post('/:courseId/reviews/summary', requireAuth, allowRoles('teacher', 'admin'), requireCourseAccess, summarizeCourseReviews)
courseRouter.get('/:courseId/questions', requireAuth, requireCourseAccess, listCourseQuestions)
courseRouter.post('/:courseId/questions', requireAuth, allowRoles('student'), requireCourseAccess, createQuestion)
