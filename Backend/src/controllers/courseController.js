import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { normalizeDepartment } from '../utils/departments.js'

async function coursePayload(input) {
  const code = typeof input.code === 'string' ? input.code.trim().toUpperCase() : ''
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const department = normalizeDepartment(input.department)
  const credits = Number(input.credits)
  const semester = typeof input.semester === 'string' ? input.semester.trim() : ''
  const tags = Array.isArray(input.tags)
    ? [...new Set(input.tags.filter(tag => typeof tag === 'string').map(tag => tag.trim()).filter(Boolean))].slice(0, 20)
    : []

  if (!code || !title || !department || !Number.isFinite(credits) || credits < 0 || credits > 10 || !input.teacher) {
    const error = new Error('Course code, title, supported department, teacher, and credits from 0 to 10 are required')
    error.statusCode = 400
    throw error
  }

  const teacher = await User.findOne({ _id: input.teacher, role: 'teacher', active: true }).select('department')
  if (!teacher) {
    const error = new Error('Select an active teacher account')
    error.statusCode = 400
    throw error
  }
  if (teacher.department !== department) {
    const error = new Error('The assigned teacher must belong to the course department')
    error.statusCode = 400
    throw error
  }

  return { code, title, department, teacher: teacher._id, credits, semester, tags }
}

export const listCourses = asyncHandler(async (req, res) => {
  const query = req.query.q ? { $or: [{ code: new RegExp(req.query.q, 'i') }, { title: new RegExp(req.query.q, 'i') }] } : {}
  if (req.user?.role === 'student') query.department = req.user.department
  if (req.user?.role === 'teacher') query.teacher = req.user.id
  const courses = await Course.find(query).populate('teacher', 'name department').sort({ code: 1 })
  res.json({ courses })
})

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId).populate('teacher', 'name department')
  if (!course) return res.status(404).json({ message: 'Course not found' })
  if (req.user?.role === 'student' && course.department !== req.user.department) {
    return res.status(403).json({ message: 'This course is outside your department' })
  }
  const ratings = await Review.aggregate([
    { $match: { course: course._id, status: 'approved' } },
    { $group: { _id: null, count: { $sum: 1 }, average: { $avg: { $avg: ['$ratings.teachingQuality', '$ratings.workload', '$ratings.gradingFairness', '$ratings.courseStructure', '$ratings.availability'] } } } },
  ])
  res.json({ course, summary: ratings[0] || { count: 0, average: null } })
})

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(await coursePayload(req.body))
  res.status(201).json({ course })
})

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })
  const payload = await coursePayload({
    code: req.body.code ?? course.code,
    title: req.body.title ?? course.title,
    department: req.body.department ?? course.department,
    teacher: req.body.teacher ?? course.teacher,
    credits: req.body.credits ?? course.credits,
    semester: req.body.semester ?? course.semester,
    tags: req.body.tags ?? course.tags,
  })
  course.set(payload)
  await course.save()
  res.json({ course })
})
