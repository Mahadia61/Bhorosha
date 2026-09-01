import { User } from '../models/User.js'
import { ProfessorReview } from '../models/ProfessorReview.js'
import { ProfessorQuestion } from '../models/ProfessorQuestion.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { censorProfanity } from '../utils/profanity.js'
import { presentQuestion, presentReview } from '../utils/presenters.js'
import { notify } from '../utils/notifications.js'

async function findAccessibleProfessor(id, user) {
  const professor = await User.findOne({ _id: id, role: 'teacher', active: true }).select('name department')
  if (!professor) return null
  if (user.role === 'student' && professor.department !== user.department) return false
  return professor
}

export const professorFeedback = asyncHandler(async (req, res) => {
  const professor = await findAccessibleProfessor(req.params.professorId, req.user)
  if (professor === false) return res.status(403).json({ message: 'This professor is outside your department' })
  if (!professor) return res.status(404).json({ message: 'Professor not found' })
  const [reviews, questions] = await Promise.all([
    ProfessorReview.find({ professor: professor.id, status: 'approved' }).populate('author', 'name').sort({ createdAt: -1 }),
    ProfessorQuestion.find({ professor: professor.id }).populate('author', 'name').populate('answer.teacher', 'name').sort({ createdAt: -1 }),
  ])
  res.json({ professor, reviews: reviews.map(review => presentReview(review, { includeAuthor: true })), questions: questions.map(question => presentQuestion(question)) })
})

export const createProfessorReview = asyncHandler(async (req, res) => {
  const professor = await findAccessibleProfessor(req.params.professorId, req.user)
  if (professor === false) return res.status(403).json({ message: 'This professor is outside your department' })
  if (!professor) return res.status(404).json({ message: 'Professor not found' })
  const { rating, text, anonymous } = req.body
  if (!text?.trim() || !Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'A review and rating from 1 to 5 are required' })
  const review = await ProfessorReview.create({ professor: professor.id, author: req.user.id, rating, text: censorProfanity(text.trim()), anonymous, status: 'approved' })
  await notify(professor.id, 'New professor review', 'A student posted feedback on your professor profile.')
  res.status(201).json({ review: presentReview(review) })
})

export const createProfessorQuestion = asyncHandler(async (req, res) => {
  const professor = await findAccessibleProfessor(req.params.professorId, req.user)
  if (professor === false) return res.status(403).json({ message: 'This professor is outside your department' })
  if (!professor) return res.status(404).json({ message: 'Professor not found' })
  if (!req.body.text?.trim()) return res.status(400).json({ message: 'A question is required' })
  const question = await ProfessorQuestion.create({ professor: professor.id, author: req.user.id, text: req.body.text.trim(), anonymous: req.body.anonymous })
  await notify(professor.id, 'New professor question', 'A student asked a question on your professor profile.')
  res.status(201).json({ question: presentQuestion(question) })
})

export const answerProfessorQuestion = asyncHandler(async (req, res) => {
  const question = await ProfessorQuestion.findById(req.params.questionId)
  if (!question) return res.status(404).json({ message: 'Question not found' })
  if (question.professor.toString() !== req.user.id) return res.status(403).json({ message: 'Only the addressed professor can answer this question' })
  if (!req.body.text?.trim()) return res.status(400).json({ message: 'An answer is required' })
  question.answer = { text: req.body.text.trim(), teacher: req.user.id, answeredAt: new Date() }
  await question.save()
  await notify(question.author, 'Your professor question was answered', 'A professor answered your question.')
  res.json({ question: presentQuestion(question) })
})

export const myProfessorQuestions = asyncHandler(async (req, res) => {
  const questions = await ProfessorQuestion.find({ professor: req.user.id })
    .populate('author', 'name')
    .populate('answer.teacher', 'name')
    .sort({ createdAt: -1 })
  res.json({ questions: questions.map(question => presentQuestion(question)) })
})
