import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  tokenHash: { type: String, required: true },
  name: String, department: String,
  passwordHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  sentAt: { type: Date, required: true },
})
export const TeacherClaim = mongoose.model('TeacherClaim', schema)
