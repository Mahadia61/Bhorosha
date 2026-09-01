import { Router } from 'express'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../controllers/notificationController.js'
import { requireAuth } from '../middleware/auth.js'

export const notificationRouter = Router()
notificationRouter.get('/', requireAuth, listNotifications)
notificationRouter.patch('/read-all', requireAuth, markAllNotificationsRead)
notificationRouter.patch('/:notificationId/read', requireAuth, markNotificationRead)
