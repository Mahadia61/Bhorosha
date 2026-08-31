import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createToken } from '../utils/token.js'
import { departmentFromStudentEmail } from '../utils/departments.js'

const emailPatterns = {
  student: /^u\d+@student\.cuet\.ac\.bd$/,
  teacher: /^u\d+@teacher\.cuet\.ac\.bd$/,
}

function userResponse(user) {
  return { token: createToken(user), user }
}

function hasStrongPassword(password) {
  return password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password)
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body
  const normalizedEmail = email?.toLowerCase()
  if (role !== 'student' || !emailPatterns.student.test(normalizedEmail || '')) {
    return res.status(400).json({ message: 'Only student accounts can self-register. Teacher and admin accounts are created by an administrator.' })
  }
  if (!name?.trim() || typeof password !== 'string' || !hasStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be 8+ characters and include upper-case, lower-case, number, and symbol' })
  }
  const derivedDepartment = departmentFromStudentEmail(normalizedEmail)
  if (!derivedDepartment) {
    return res.status(400).json({ message: 'Your student ID does not contain a recognized department code' })
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email: normalizedEmail, passwordHash, role, department: derivedDepartment })
  res.status(201).json(userResponse(user))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+passwordHash')
  if (!user || !await bcrypt.compare(password || '', user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  if (!user.active) return res.status(403).json({ message: 'This account has been disabled' })
  res.json(userResponse(user))
})

export const me = asyncHandler(async (req, res) => res.json({ user: req.user }))
