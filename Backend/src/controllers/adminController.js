import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { normalizeDepartment } from '../utils/departments.js'

const teacherEmailPattern = /^u\d+@teacher\.cuet\.ac\.bd$/

export const listProfessors = asyncHandler(async (req, res) => {
  const query = { role: 'teacher', active: true }
  if (req.user.role === 'student') query.department = req.user.department
  const fields = req.user.role === 'admin' ? 'name email department active createdAt' : 'name department'
  const professors = await User.find(query).select(fields).sort({ name: 1 })
  res.json({ professors })
})

export const createProfessor = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body
  const normalizedDepartment = normalizeDepartment(department)
  if (!name?.trim() || !teacherEmailPattern.test(email?.toLowerCase() || '') || !normalizedDepartment || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Name, valid teacher email, department, and an 8-character password are required' })
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const professor = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'teacher', department: normalizedDepartment })
  res.status(201).json({ professor })
})
