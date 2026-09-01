import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { censorProfanity } from '../utils/profanity.js'
import { presentReview } from '../utils/presenters.js'
import { notify } from '../utils/notifications.js'

export const listCourseReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId, status: 'approved' })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
  res.json({ reviews: reviews.map(review => presentReview(review)) })
})

export const createReview = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })
  const { ratings, text, tags, anonymous } = req.body
  if (!text?.trim()) return res.status(400).json({ message: 'Review text is required' })
  const review = await Review.create({
    course: course.id,
    author: req.user.id,
    ratings,
    text: censorProfanity(text.trim()),
    tags,
    anonymous,
    status: 'approved',
  })
  await notify(course.teacher, 'New course review', `A student posted feedback for ${course.code}.`)
  res.status(201).json({ review: presentReview(review) })
})

export const myReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ author: req.user.id }).populate('course', 'code title').sort({ createdAt: -1 })
  res.json({ reviews })
})

export const teacherReviews = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacher: req.user.id }).select('_id')
  const reviews = await Review.find({ course: { $in: courses.map(course => course._id) } })
    .populate('course', 'code title')
    .populate('author', 'name')
    .sort({ createdAt: -1 })
  res.json({ reviews: reviews.map(review => presentReview(review)) })
})

export const teacherReviewStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacher: req.user.id }).select('_id')
  const courseIds = courses.map(course => course._id)
  const [summary] = await Review.aggregate([
    { $match: { course: { $in: courseIds }, status: 'approved' } },
    { $group: { _id: null, totalReviews: { $sum: 1 }, average: { $avg: { $avg: ['$ratings.teachingQuality', '$ratings.workload', '$ratings.gradingFairness', '$ratings.courseStructure', '$ratings.availability'] } }, tags: { $push: '$tags' } } },
  ])
  const trend = await Review.aggregate([
    { $match: { course: { $in: courseIds }, status: 'approved' } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, average: { $avg: { $avg: ['$ratings.teachingQuality', '$ratings.workload', '$ratings.gradingFairness', '$ratings.courseStructure', '$ratings.availability'] } }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])
  const pendingQuestions = await (await import('../models/Question.js')).Question.countDocuments({ course: { $in: courseIds }, 'answer.text': { $exists: false } })
  const tagCounts = new Map()
  for (const tags of summary?.tags || []) for (const tag of tags) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  res.json({ stats: { totalReviews: summary?.totalReviews || 0, average: summary?.average ?? null, pendingQuestions, tags: [...tagCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count), trend: trend.map(item => ({ month: `${months[item._id.month - 1]} ${item._id.year}`, average: item.average, count: item.count })) } })
})

export const acknowledgeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId).populate('course', 'teacher')
  if (!review) return res.status(404).json({ message: 'Review not found' })
  if (review.course.teacher.toString() !== req.user.id) return res.status(403).json({ message: 'Only the course teacher can acknowledge a review' })
  review.acknowledgedBy = req.user.id
  await review.save()
  res.json({ review: presentReview(review) })
})

export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) return res.status(404).json({ message: 'Review not found' })
  const userId = req.user.id
  const alreadyMarked = review.helpfulBy.some(id => id.toString() === userId)
  review.helpfulBy = alreadyMarked
    ? review.helpfulBy.filter(id => id.toString() !== userId)
    : [...review.helpfulBy, req.user._id]
  await review.save()
  res.json({ helpfulCount: review.helpfulBy.length, markedHelpful: !alreadyMarked })
})
