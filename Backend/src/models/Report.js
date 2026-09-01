import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
}, { timestamps: true })

reportSchema.index({ review: 1, reporter: 1 }, { unique: true })
reportSchema.index({ status: 1, createdAt: -1 })

export const Report = mongoose.model('Report', reportSchema)
