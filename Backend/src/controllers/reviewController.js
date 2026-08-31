import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { censorProfanity } from '../utils/profanity.js'
import { presentReview } from '../utils/presenters.js'

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
