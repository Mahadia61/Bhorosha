import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true, trim: true },
  credits: { type: Number, min: 0, max: 10, default: 3 },
  semester: { type: String, trim: true },
  department: { type: String, trim: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, trim: true }],
}, { timestamps: true })

export const Course = mongoose.model('Course', courseSchema)
