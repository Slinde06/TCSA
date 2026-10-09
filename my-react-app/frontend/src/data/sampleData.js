// only LEO-03 for now so the profile page can be shown
// resets on refresh

import { categoryFor } from './helpers.js'
import leo3 from '../assets/photos/leo-3.jpg'
import leo3a from '../assets/photos/leo-3-1.jpg'
import leo3b from '../assets/photos/leo-3-2.jpg'
import leo3c from '../assets/photos/leo-3-3.jpg'
import leo3d from '../assets/photos/leo-3-4.jpg'

function animal(fields) {
  return {
    photo: null,
    photos: [],
    measurements: [],
    medications: [],
    diet: { current: '', instructions: '', frequency: '', reviewDate: '' },
    dietLog: [], // dated diet changes: { id, date, change }
    tests: [],
    notes: '',
    condition: 'Good',
    ...fields,
    category: categoryFor(fields.species),
  }
}

export const sampleAnimals = [
  animal({
    id: 'LEO-03',
    species: 'Leopard Tortoise',
    enclosure: 'E-04',
    intakeDate: '2026-03-12',
    condition: 'Fair',
    photo: leo3,
    photos: [leo3a, leo3b, leo3c, leo3d],
    measurements: [
      { id: 'm1', date: '2026-08-12', weight: '4.4', length: '205', width: '158', note: 'Intake' },
      { id: 'm2', date: '2026-08-24', weight: '4.6', length: '208', width: '158', note: 'Check up' },
    ],
    medications: [
      { id: 'md1', name: 'Antibiotic', dosage: '2', frequency: 'Every 24 hours', time: '12:00', startDate: '2026-04-17', nextDate: '2026-08-10', endDate: '2026-09-10', done: false },
      { id: 'md2', name: 'Dewormer', dosage: '1.5', frequency: 'Every 7 days', time: '15:00', startDate: '2026-05-12', nextDate: '2026-08-14', endDate: '2026-10-14', done: false },
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
  }),
]

// tasks get added from the Today page
export const sampleTasks = []
