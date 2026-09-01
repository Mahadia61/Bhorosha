import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { courseRouter } from './routes/courseRoutes.js'
import { questionRouter } from './routes/questionRoutes.js'
import { reportRouter } from './routes/reportRoutes.js'
import { reviewRouter } from './routes/reviewRoutes.js'
import { adminRouter } from './routes/adminRoutes.js'
import { professorRouter } from './routes/professorRoutes.js'
import { notificationRouter } from './routes/notificationRoutes.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/courses', courseRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/questions', questionRouter)
app.use('/api/reports', reportRouter)
app.use('/api/admin', adminRouter)
app.use('/api/professors', professorRouter)
app.use('/api/notifications', notificationRouter)

app.use(notFound)
app.use(errorHandler)
