import { Router } from 'express'
import crypto from 'node:crypto'
import Task from '../models/Task.js'

const router = Router()

const newId = () => crypto.randomUUID().slice(0, 8)

function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return next.toISOString().slice(0, 10)
}

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ date: 1, time: 1 })
  res.json(tasks)
})

router.post('/', async (req, res) => {
  const { animalId, type, description, date, time, repeat } = req.body || {}
  const task = await Task.create({ id: newId(), animalId, type, description, date, time, repeat })
  res.status(201).json(task)
})

router.post('/:id/toggle', async (req, res) => {
  const task = await Task.findOne({ id: req.params.id })
  if (!task) return res.status(404).json({ error: 'Task not found.' })

  task.completed = !task.completed
  await task.save()

  let created = null
  if (task.completed && task.repeat !== 'none') {
    const nextDate = addDays(task.date, task.repeat === 'weekly' ? 7 : 1)
    const already = await Task.exists({ animalId: task.animalId, description: task.description, date: nextDate })
    if (!already) {
      created = await Task.create({
        id: newId(),
        animalId: task.animalId,
        type: task.type,
        description: task.description,
        date: nextDate,
        time: task.time,
        repeat: task.repeat,
      })
    }
  }

  res.json({ task, created })
})

router.delete('/:id', async (req, res) => {
  await Task.deleteOne({ id: req.params.id })
  res.json({ ok: true })
})

export default router
