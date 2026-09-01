import mongoose from 'mongoose'

const professorQuestionSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 1500 },
  anonymous: { type: Boolean, default: true },
  answer: {
    text: { type: String, trim: true, maxlength: 1500 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: Date,
  },
}, { timestamps: true })

professorQuestionSchema.index({ professor: 1, createdAt: -1 })
professorQuestionSchema.index({ author: 1, createdAt: -1 })

export const ProfessorQuestion = mongoose.model('ProfessorQuestion', professorQuestionSchema)
