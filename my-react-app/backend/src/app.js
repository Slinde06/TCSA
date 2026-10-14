import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import authRoutes, { requireOwner } from './auth.js'
import animalRoutes from './routes/animals.js'
import taskRoutes from './routes/tasks.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.resolve(here, '../../frontend/dist')

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(express.json({ limit: '12mb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api', authRoutes)
app.use('/api/animals', requireOwner, animalRoutes)
app.use('/api/tasks', requireOwner, taskRoutes)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

if (fs.existsSync(siteDir)) {
  app.use(express.static(siteDir))
  app.get('/{*page}', (req, res) => res.sendFile(path.join(siteDir, 'index.html')))
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'That is too much to save at once. Try fewer or smaller photos.' })
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: Object.values(err.errors)[0].message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'That ID is already used.' })
  }
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

export default app
