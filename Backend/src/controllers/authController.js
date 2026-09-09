import { randomBytes, createHash } from 'node:crypto'
import { TeacherClaim } from '../models/TeacherClaim.js'
import { sendTeacherVerification } from '../utils/email.js'
import { normalizeEmail, teacherEmailPattern } from '../utils/teacherIdentity.js'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createToken } from '../utils/token.js'
import { departmentFromStudentEmail, normalizeDepartment } from '../utils/departments.js'

const emailPatterns = {
  student: /^u\d+@student\.cuet\.ac\.bd$/,
  teacher: teacherEmailPattern,
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
  const normalizedEmail = normalizeEmail(email)
  if (!['student', 'teacher'].includes(role) || !emailPatterns[role].test(normalizedEmail || '')) {
    return res.status(400).json({ message: 'Use a valid CUET email address for the selected role. Admin accounts are pre-provisioned.' })
  }
  if (typeof name !== 'string' || !name.trim() || typeof password !== 'string' || !hasStrongPassword(password)) {
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
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing && (role !== 'teacher' || existing.role !== 'teacher' || existing.accountStatus !== 'unclaimed')) {
    return res.status(409).json({ message: 'An account already uses this email. Please sign in.' })
  }
  if (existing && !existing.active) return res.status(403).json({ message: 'This profile has been disabled' })
  const passwordHash = await bcrypt.hash(password, 12)
  if (role === 'teacher') {
    const code = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(code).digest('hex')
    try {
      await TeacherClaim.findOneAndUpdate(
        { email: normalizedEmail, sentAt: { $lte: new Date(Date.now() - 60000) } },
        { $set: { tokenHash, passwordHash, name: name.trim(), department: derivedDepartment, sentAt: new Date(), expiresAt: new Date(Date.now() + 15 * 60000) } },
        { upsert: true, runValidators: true },
      )
    } catch (error) {
      if (error.code === 11000) return res.status(429).json({ message: 'Wait one minute before requesting another verification email.' })
      throw error
    }
    try { await sendTeacherVerification(normalizedEmail, code) }
    catch (error) { await TeacherClaim.deleteOne({ email: normalizedEmail, tokenHash }); throw error }
    return res.status(202).json({ verificationRequired: true, email: normalizedEmail })
  }
  const user = await User.create({ name, email: normalizedEmail, passwordHash, role, department: derivedDepartment })
  res.status(201).json(userResponse(user))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash')
  if (!user || user.accountStatus === 'unclaimed' || !user.passwordHash || !await bcrypt.compare(password || '', user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  if (!user.active) return res.status(403).json({ message: 'This account has been disabled' })
  res.json(userResponse(user))
})

export const me = asyncHandler(async (req, res) => res.json({ user: req.user }))

export const verifyTeacher = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const code = typeof req.body.code === 'string' ? req.body.code.trim() : ''
  if (!/^[a-f0-9]{64}$/.test(code)) return res.status(400).json({ message: 'Invalid verification code' })
  const tokenHash = createHash('sha256').update(code).digest('hex')
  const claim = await TeacherClaim.findOne({ email, tokenHash, expiresAt: { $gt: new Date() } }).select('+passwordHash')
  if (!claim) return res.status(400).json({ message: 'Verification code is invalid or expired. Register again to request another.' })
  let user = await User.findOne({ email })
  if (user) {
    user = await User.findOneAndUpdate({ _id: user.id, role: 'teacher', active: true, accountStatus: 'unclaimed' },
      { $set: { passwordHash: claim.passwordHash, accountStatus: 'claimed', emailVerifiedAt: new Date() } }, { new: true, runValidators: true })
    if (!user) return res.status(409).json({ message: 'This profile is already claimed or unavailable.' })
  } else {
    user = await User.create({ name: claim.name, email, department: claim.department, passwordHash: claim.passwordHash,
      role: 'teacher', accountStatus: 'claimed', emailVerifiedAt: new Date() })
  }
  await TeacherClaim.deleteOne({ _id: claim.id, tokenHash })
  res.json(userResponse(user))
})
