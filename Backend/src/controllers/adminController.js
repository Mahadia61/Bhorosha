import { teacherEmailPattern, normalizeEmail } from '../utils/teacherIdentity.js'
import { User } from '../models/User.js'
import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { Question } from '../models/Question.js'
import { Report } from '../models/Report.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { normalizeDepartment } from '../utils/departments.js'


export const listProfessors = asyncHandler(async (req, res) => {
  const query = { role: 'teacher', active: true }
  if (req.user.role === 'student') query.department = req.user.department
  const fields = req.user.role === 'admin' ? 'name email department active accountStatus createdAt' : 'name department accountStatus'
  const professors = await User.find(query).select(fields).sort({ name: 1 })
  res.json({ professors })
})

export const professorCourses = asyncHandler(async (req, res) => {
  const professor = await User.findOne({ _id: req.params.professorId, role: 'teacher', active: true }).select('name department accountStatus')
  if (!professor) return res.status(404).json({ message: 'Professor not found' })
  if (req.user.role === 'student' && professor.department !== req.user.department) {
    return res.status(403).json({ message: 'This professor is outside your department' })
  }
  const courses = await Course.find({ teacher: professor.id }).select('code title credits semester department').sort({ code: 1 })
  res.json({ professor, courses })
})

export const createProfessor = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body
  const normalizedEmail = normalizeEmail(email)
  const normalizedDepartment = normalizeDepartment(department)
  if (typeof name !== 'string' || !name.trim() || !teacherEmailPattern.test(normalizedEmail) || !normalizedDepartment) {
    return res.status(400).json({ message: 'Name, valid CUET teacher email, and department are required' })
  }
  const professor = await User.create({ name: name.trim(), email: normalizedEmail, role: 'teacher', department: normalizedDepartment, accountStatus: 'unclaimed' })
  res.status(201).json({ professor })
})

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role department active accountStatus createdAt').sort({ createdAt: -1 })
  res.json({ users })
})

export const updateUser = asyncHandler(async (req, res) => {
  if (typeof req.body.active !== 'boolean') return res.status(400).json({ message: 'active must be true or false' })
  const user = await User.findById(req.params.userId).select('name email role department active accountStatus createdAt')
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.id === req.user.id && !req.body.active) return res.status(400).json({ message: 'You cannot disable your own admin account' })
  user.active = req.body.active
  await user.save()
  res.json({ user })
})

export const platformAnalytics = asyncHandler(async (_req, res) => {
  const [users, courses, reviews, questions, pendingReports, anonymousPosts, volume, departments, courseRatings] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Review.countDocuments({ status: 'approved' }),
    Question.countDocuments(),
    Report.countDocuments({ status: 'pending' }),
    Promise.all([Review.countDocuments({ anonymous: true }), Question.countDocuments({ anonymous: true })]).then(values => values[0] + values[1]),
    Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Course.aggregate([
      { $lookup: { from: 'reviews', let: { courseId: '$_id' }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$course', '$$courseId'] }, { $eq: ['$status', 'approved'] }] } } }], as: 'reviews' } },
      { $group: { _id: '$department', courses: { $sum: 1 }, reviews: { $sum: { $size: '$reviews' } } } },
      { $sort: { _id: 1 } },
    ]),
    Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$course', reviewCount: { $sum: 1 }, average: { $avg: { $avg: ['$ratings.teachingQuality', '$ratings.workload', '$ratings.gradingFairness', '$ratings.courseStructure', '$ratings.availability'] } } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { _id: 0, courseId: '$course._id', code: '$course.code', title: '$course.title', department: '$course.department', reviewCount: 1, average: 1 } },
    ]),
  ])
  const totalPosts = reviews + questions
  const averageRating = courseRatings.length
    ? courseRatings.reduce((sum, item) => sum + item.average, 0) / courseRatings.length
    : null
  res.json({
    metrics: { users, courses, reviews, questions, pendingReports, anonymousPosts, anonymousRate: totalPosts ? anonymousPosts / totalPosts : 0, averageRating },
    volume,
    departments,
    topCourses: [...courseRatings].sort((a, b) => b.average - a.average).slice(0, 5),
    bottomCourses: [...courseRatings].sort((a, b) => a.average - b.average).slice(0, 5),
  })
})
