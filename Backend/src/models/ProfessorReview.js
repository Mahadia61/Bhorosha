import mongoose from 'mongoose'

const professorReviewSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true, maxlength: 3000 },
  anonymous: { type: Boolean, default: true },
  status: { type: String, enum: ['approved'], default: 'approved', immutable: true },
}, { timestamps: true })

professorReviewSchema.index({ professor: 1, status: 1, createdAt: -1 })
professorReviewSchema.index({ author: 1, createdAt: -1 })

export const ProfessorReview = mongoose.model('ProfessorReview', professorReviewSchema)
