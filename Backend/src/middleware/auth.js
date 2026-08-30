import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null
  if (!token) return res.status(401).json({ message: 'Authentication is required' })

  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(payload.sub)
  if (!user || !user.active) return res.status(401).json({ message: 'Account is unavailable' })
  req.user = user
  next()
})

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission for this action' })
    next()
  }
}
