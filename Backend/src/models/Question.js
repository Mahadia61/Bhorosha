import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 1500 },
  anonymous: { type: Boolean, default: true },
  answer: {
    text: { type: String, trim: true, maxlength: 1500 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: Date,
  },
}, { timestamps: true })

questionSchema.index({ course: 1, createdAt: -1 })

export const Question = mongoose.model('Question', questionSchema)
