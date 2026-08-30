export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(error, _req, res, _next) {
  console.error(error)
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message })
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid resource ID' })
  if (error.code === 11000) return res.status(409).json({ message: 'That value already exists' })
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid authentication token' })
  res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' })
}
