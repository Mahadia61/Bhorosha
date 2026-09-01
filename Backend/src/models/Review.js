import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: {
    teachingQuality: { type: Number, min: 1, max: 5, required: true },
    workload: { type: Number, min: 1, max: 5, required: true },
    gradingFairness: { type: Number, min: 1, max: 5, required: true },
    courseStructure: { type: Number, min: 1, max: 5, required: true },
    availability: { type: Number, min: 1, max: 5, required: true },
  },
  text: { type: String, required: true, trim: true, maxlength: 3000 },
  tags: [{ type: String, trim: true, maxlength: 50 }],
  anonymous: { type: Boolean, default: true },
  status: { type: String, enum: ['approved'], default: 'approved', immutable: true },
  helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

reviewSchema.index({ course: 1, status: 1, createdAt: -1 })
reviewSchema.index({ author: 1, createdAt: -1 })

export const Review = mongoose.model('Review', reviewSchema)
