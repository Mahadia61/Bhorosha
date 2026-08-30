import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listCourses = asyncHandler(async (req, res) => {
  const query = req.query.q ? { $or: [{ code: new RegExp(req.query.q, 'i') }, { title: new RegExp(req.query.q, 'i') }] } : {}
  const courses = await Course.find(query).populate('teacher', 'name department').sort({ code: 1 })
  res.json({ courses })
})

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId).populate('teacher', 'name department')
  if (!course) return res.status(404).json({ message: 'Course not found' })
  const ratings = await Review.aggregate([
    { $match: { course: course._id, status: 'approved' } },
    { $group: { _id: null, count: { $sum: 1 }, average: { $avg: { $avg: ['$ratings.teachingQuality', '$ratings.workload', '$ratings.gradingFairness', '$ratings.courseStructure', '$ratings.availability'] } } } },
  ])
  res.json({ course, summary: ratings[0] || { count: 0, average: null } })
})

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body)
  res.status(201).json({ course })
})

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true, runValidators: true })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  res.json({ course })
})
