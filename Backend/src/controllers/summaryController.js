import OpenAI from 'openai'
import { Course } from '../models/Course.js'
import { Review } from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const summarizeCourseReviews = asyncHandler(async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ message: 'AI summaries are unavailable because OPENAI_API_KEY is not configured' })
  }

  const course = await Course.findById(req.params.courseId).select('teacher')
  if (!course) return res.status(404).json({ message: 'Course not found' })
  if (req.user.role === 'teacher' && course.teacher.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only summarize reviews for your own courses' })
  }

  const reviews = await Review.find({ course: course.id, status: 'approved' }).select('text ratings tags')
  if (!reviews.length) return res.status(404).json({ message: 'There are no approved reviews to summarize' })

  const reviewText = reviews
    .map((review, index) => `Review ${index + 1}: ${review.text}`)
    .join('\n\n')
    .slice(0, 24000)

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.4',
    store: false,
    instructions: 'Summarize course reviews in 3-5 neutral bullet points. Identify recurring strengths and concerns, do not infer author identities, and do not quote individual reviews.',
    input: reviewText,
    max_output_tokens: 300,
  })

  res.json({ summary: response.output_text, reviewCount: reviews.length })
})
