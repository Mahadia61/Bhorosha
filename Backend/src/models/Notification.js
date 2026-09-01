import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  detail: { type: String, required: true, trim: true, maxlength: 300 },
  read: { type: Boolean, default: false },
}, { timestamps: true })

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
