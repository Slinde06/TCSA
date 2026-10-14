import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import Animal from '../src/models/Animal.js'

const photosDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/src/assets/photos')
const photo = (name) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(photosDir, name)).toString('base64')

await mongoose.connect(process.env.MONGODB_URI)

if (await Animal.exists({ id: 'LEO-03' })) {
  console.log('LEO-03 is already in the database')
} else {
  await Animal.create({
    id: 'LEO-03',
    species: 'Leopard Tortoise',
    category: 'tortoise',
    enclosure: 'E-04',
    intakeDate: '2026-03-12',
    condition: 'Fair',
    photo: photo('leo-3.jpg'),
    photos: ['leo-3-1.jpg', 'leo-3-2.jpg', 'leo-3-3.jpg', 'leo-3-4.jpg'].map(photo),
    measurements: [
      { id: 'm1', date: '2026-08-12', weight: '4.4', length: '205', width: '158', note: 'Intake' },
      { id: 'm2', date: '2026-08-24', weight: '4.6', length: '208', width: '158', note: 'Check up' },
    ],
    medications: [
      { id: 'md1', name: 'Antibiotic', dosage: '2', frequency: 'Every 24 hours', time: '12:00', startDate: '2026-04-17', nextDate: '2026-08-10', endDate: '2026-09-10' },
      { id: 'md2', name: 'Dewormer', dosage: '1.5', frequency: 'Every 7 days', time: '15:00', startDate: '2026-05-12', nextDate: '2026-08-14', endDate: '2026-10-14' },
    ],
    diet: {
      current: 'Grass and hay',
      instructions: 'Monitor morning feeding',
      frequency: 'Twice a day, morning and afternoon',
      reviewDate: '2026-08-22',
    },
    dietLog: [
      { id: 'd1', date: '2026-03-12', change: 'Began with a lettuce and water diet.' },
      { id: 'd2', date: '2026-04-02', change: 'Slowly introduced grass and hay diet.' },
    ],
    tests: [
      { id: 't1', name: 'Mouth Swab', date: '2026-07-12', result: 'Positive', followUp: 'Yes', nextTest: '2026-07-24' },
      { id: 't2', name: 'Mouth Swab', date: '2026-07-24', result: 'Negative', followUp: 'No', nextTest: '' },
      { id: 't3', name: 'Faecal float', date: '2026-07-15', result: 'Clear', followUp: 'No', nextTest: '' },
    ],
  })
  console.log('added LEO-03')
}

await mongoose.disconnect()
