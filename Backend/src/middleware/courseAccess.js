import { Course } from '../models/Course.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireCourseAccess = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  const allowed = req.user.role === 'admin'
    || (req.user.role === 'student' && course.department === req.user.department)
    || (req.user.role === 'teacher' && course.teacher.toString() === req.user.id)

  if (!allowed) return res.status(403).json({ message: 'You do not have access to this course' })
  req.course = course
  next()
})
