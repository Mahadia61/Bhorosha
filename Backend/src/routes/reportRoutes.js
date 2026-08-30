import { Router } from 'express'
import { listReports, resolveReport } from '../controllers/reportController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'

export const reportRouter = Router()
reportRouter.get('/', requireAuth, allowRoles('admin'), listReports)
reportRouter.patch('/:reportId', requireAuth, allowRoles('admin'), resolveReport)
