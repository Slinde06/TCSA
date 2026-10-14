import { Router } from 'express'
import Animal from '../models/Animal.js'
import Task from '../models/Task.js'

const router = Router()

router.get('/', async (req, res) => {
  const animals = await Animal.find().sort({ createdAt: -1 })
  res.json(animals)
})

router.get('/:id', async (req, res) => {
  const animal = await Animal.findOne({ id: req.params.id })
  if (!animal) return res.status(404).json({ error: 'Animal not found.' })
  res.json(animal)
})

router.post('/', async (req, res) => {
  const body = clean(req.body)
  if (await Animal.exists({ id: body.id })) {
    return res.status(409).json({ error: `There is already an animal with the ID ${body.id}.` })
  }
  const animal = await Animal.create(body)
  res.status(201).json(animal)
})

router.put('/:id', async (req, res) => {
  const body = { ...clean(req.body), id: req.params.id }
  const animal = await Animal.findOneAndReplace({ id: req.params.id }, body, {
    new: true,
    runValidators: true,
  })
  if (!animal) return res.status(404).json({ error: 'Animal not found.' })
  res.json(animal)
})

router.delete('/:id', async (req, res) => {
  const result = await Animal.deleteOne({ id: req.params.id })
  if (!result.deletedCount) return res.status(404).json({ error: 'Animal not found.' })
  await Task.deleteMany({ animalId: req.params.id })
  res.json({ ok: true })
})

function clean(body = {}) {
  const { _id, __v, createdAt, updatedAt, ...rest } = body
  return rest
}

export default router
