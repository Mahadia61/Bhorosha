import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  department: { type: String, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (_doc, value) => {
    delete value.passwordHash
    return value
  },
})

export const User = mongoose.model('User', userSchema)
