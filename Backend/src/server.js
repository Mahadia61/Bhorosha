import 'dotenv/config'
import { app } from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT) || 5000

for (const variable of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[variable]) throw new Error(`${variable} is required; copy .env.example to .env and configure it`)
}

connectDatabase()
  .then(() => app.listen(port, () => console.log(`Bhorosha API listening on port ${port}`)))
  .catch(error => {
    console.error('Failed to start API:', error.message)
    process.exit(1)
  })
