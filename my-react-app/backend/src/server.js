import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const needed = ['MONGODB_URI', 'JWT_SECRET', 'OWNER_USERNAME', 'OWNER_PASSWORD_HASH']
const missing = needed.filter((name) => !process.env[name])
if (missing.length) {
  console.error(`Missing settings in backend/.env: ${missing.join(', ')}`)
  process.exit(1)
}

const port = process.env.PORT || 8080

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('connected to mongodb')
} catch (err) {
  console.error('Could not connect to MongoDB. Check MONGODB_URI and Atlas network access.')
  console.error(err.message)
  process.exit(1)
}

app.listen(port, () => console.log(`api running on http://localhost:${port}`))
