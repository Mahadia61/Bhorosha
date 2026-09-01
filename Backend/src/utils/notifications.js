import { User } from '../models/User.js'
import { Notification } from '../models/Notification.js'

export async function notify(recipient, title, detail) {
  if (!recipient) return
  await Notification.create({ recipient, title, detail })
}

export async function notifyAdmins(title, detail) {
  const admins = await User.find({ role: 'admin', active: true }).select('_id')
  if (admins.length) await Notification.insertMany(admins.map(admin => ({ recipient: admin._id, title, detail })))
}
