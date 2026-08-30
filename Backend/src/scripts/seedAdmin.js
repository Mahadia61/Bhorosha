import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDatabase } from '../config/db.js'
import { User } from '../models/User.js'

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env')
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'admin', active: true },
    { upsert: true, new: true, runValidators: true }
  )
  console.log(`Admin ready: ${ADMIN_EMAIL}`)
}

connectDatabase()
  .then(seedAdmin)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unable to seed admin:', error.message)
    process.exit(1)
  })
