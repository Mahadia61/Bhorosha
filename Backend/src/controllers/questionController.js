import { Course } from '../models/Course.js'
import { Question } from '../models/Question.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { presentQuestion } from '../utils/presenters.js'

export const listCourseQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ course: req.params.courseId })
    .populate('author', 'name')
    .populate('answer.teacher', 'name department')
    .sort({ createdAt: -1 })
  res.json({ questions: questions.map(question => presentQuestion(question)) })
})

export const createQuestion = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })
  const { text, anonymous } = req.body
  if (!text?.trim()) return res.status(400).json({ message: 'Question text is required' })
  const question = await Question.create({ text: text.trim(), anonymous, course: course.id, author: req.user.id })
  res.status(201).json({ question: presentQuestion(question) })
})

export const teacherQuestions = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacher: req.user.id }).select('_id')
  const questions = await Question.find({ course: { $in: courses.map(course => course._id) } })
    .populate('course', 'code title')
    .populate('author', 'name')
    .populate('answer.teacher', 'name department')
    .sort({ createdAt: -1 })
  res.json({ questions: questions.map(question => presentQuestion(question)) })
})

export const answerQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId).populate('course', 'teacher')
  if (!question) return res.status(404).json({ message: 'Question not found' })
  if (question.course.teacher.toString() !== req.user.id) return res.status(403).json({ message: 'Only the course teacher can answer this question' })
  if (!req.body.text?.trim()) return res.status(400).json({ message: 'An answer is required' })
  question.answer = { text: req.body.text.trim(), teacher: req.user.id, answeredAt: new Date() }
  await question.save()
  res.json({ question: presentQuestion(question) })
})
