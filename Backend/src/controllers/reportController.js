import { Report } from '../models/Report.js'
import { Review } from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { notifyAdmins } from '../utils/notifications.js'

export const createReport = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId).populate('course', 'teacher')
  if (!review) return res.status(404).json({ message: 'Review not found' })
  if (req.user.role === 'teacher' && review.course.teacher.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only flag reviews for your own courses' })
  }
  if (!req.body.reason?.trim()) return res.status(400).json({ message: 'A report reason is required' })
  const report = await Report.create({ review: review.id, reporter: req.user.id, reason: req.body.reason.trim() })
  await notifyAdmins('New moderation report', `A ${req.user.role} reported content for review.`)
  res.status(201).json({ report })
})

export const listReports = asyncHandler(async (_req, res) => {
  const reports = await Report.find({ status: 'pending' })
    .populate({ path: 'review', populate: { path: 'course', select: 'code title' } })
    .populate('reporter', 'name role')
    .sort({ createdAt: -1 })
  res.json({ reports })
})

export const resolveReport = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!['resolved', 'dismissed'].includes(status)) return res.status(400).json({ message: 'Status must be resolved or dismissed' })
  const report = await Report.findByIdAndUpdate(req.params.reportId, { status }, { new: true })
  if (!report) return res.status(404).json({ message: 'Report not found' })
  res.json({ report })
})
