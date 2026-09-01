import { Notification } from '../models/Notification.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(50)
  res.json({ notifications, unreadCount: notifications.filter(notification => !notification.read).length })
})

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.notificationId, recipient: req.user.id }, { read: true }, { new: true })
  if (!notification) return res.status(404).json({ message: 'Notification not found' })
  res.json({ notification })
})

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true })
  res.status(204).end()
})
