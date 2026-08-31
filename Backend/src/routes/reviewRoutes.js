import { Router } from 'express'
import { createReport } from '../controllers/reportController.js'
import { acknowledgeReview, markHelpful, myReviews, teacherReviews, teacherReviewStats } from '../controllers/reviewController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const reviewRouter = Router()
reviewRouter.get('/mine', requireAuth, allowRoles('student'), myReviews)
reviewRouter.get('/teacher', requireAuth, allowRoles('teacher'), teacherReviews)
reviewRouter.get('/teacher/stats', requireAuth, allowRoles('teacher'), teacherReviewStats)
reviewRouter.post('/:reviewId/helpful', requireAuth, markHelpful)
reviewRouter.post('/:reviewId/acknowledge', requireAuth, allowRoles('teacher'), acknowledgeReview)
reviewRouter.post('/:reviewId/reports', requireAuth, allowRoles('teacher', 'admin'), createReport)
