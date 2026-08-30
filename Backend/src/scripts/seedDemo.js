import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDatabase } from '../config/db.js'
import { Course } from '../models/Course.js'
import { User } from '../models/User.js'

async function upsertUser({ name, email, role, passwordHash }) {
  return User.findOneAndUpdate(
    { email },
    { name, email, role, passwordHash, active: true },
    { upsert: true, new: true, runValidators: true }
  )
}

async function seedDemo() {
  if (process.env.NODE_ENV === 'production') throw new Error('Demo data cannot be seeded in production')
  const password = process.env.DEMO_PASSWORD || 'Pass@1234'
  const passwordHash = await bcrypt.hash(password, 12)
  const teacher = await upsertUser({ name: 'Dr. Teacher', email: 'u1001@teacher.cuet.ac.bd', role: 'teacher', passwordHash })
  await upsertUser({ name: 'Student', email: 'u2204061@student.cuet.ac.bd', role: 'student', passwordHash })
  await Course.findOneAndUpdate(
    { code: 'CSE-XXX' },
    { code: 'CSE-XXX', title: 'Course Name', credits: 3, department: 'CSE', teacher: teacher.id, tags: ['Core'] },
    { upsert: true, new: true, runValidators: true }
  )
  console.log('Development demo users and course are ready')
}

connectDatabase()
  .then(seedDemo)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unable to seed demo data:', error.message)
    process.exit(1)
  })
