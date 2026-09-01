import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createToken } from '../utils/token.js'
import { departmentFromStudentEmail, normalizeDepartment } from '../utils/departments.js'

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
  if (!['student', 'teacher'].includes(role) || !emailPatterns[role].test(normalizedEmail || '')) {
    return res.status(400).json({ message: 'Use a valid CUET email address for the selected role. Admin accounts are pre-provisioned.' })
  }
  if (!name?.trim() || typeof password !== 'string' || !hasStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be 8+ characters and include upper-case, lower-case, number, and symbol' })
  }
  const derivedDepartment = role === 'student'
    ? departmentFromStudentEmail(normalizedEmail)
    : normalizeDepartment(department)
  if (role === 'student' && !derivedDepartment) {
    return res.status(400).json({ message: 'Your student ID does not contain a recognized department code' })
  }
  if (role === 'teacher' && !derivedDepartment) {
    return res.status(400).json({ message: 'Select a supported CUET department' })
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
