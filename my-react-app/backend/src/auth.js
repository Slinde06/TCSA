import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'

const COOKIE = 'tcsa_session'
const WEEK = 7 * 24 * 60 * 60 * 1000

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: WEEK,
    path: '/',
  }
}

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
})

const router = Router()

router.post('/login', loginLimit, async (req, res) => {
  const { username = '', password = '' } = req.body || {}
  const okName = username.trim().toLowerCase() === process.env.OWNER_USERNAME.toLowerCase()
  const okPass = await bcrypt.compare(password, process.env.OWNER_PASSWORD_HASH)

  if (!okName || !okPass) {
    return res.status(401).json({ error: 'Wrong username or password.' })
  }

  const token = jwt.sign({ sub: process.env.OWNER_USERNAME }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie(COOKIE, token, cookieOptions())
  res.json({ username: process.env.OWNER_USERNAME })
})

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })
  res.json({ ok: true })
})

router.get('/me', requireOwner, (req, res) => {
  res.json({ username: req.owner })
})

export function requireOwner(req, res, next) {
  const token = req.cookies?.[COOKIE]
  if (!token) return res.status(401).json({ error: 'Please log in.' })
  try {
    req.owner = jwt.verify(token, process.env.JWT_SECRET).sub
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please log in again.' })
  }
}

export default router
