import mongoose from 'mongoose'

const { Schema } = mongoose

const measurement = new Schema(
  { id: String, date: String, weight: String, length: String, width: String, note: String },
  { _id: false },
)

const medication = new Schema(
  {
    id: String,
    name: String,
    dosage: String,
    frequency: String,
    time: String,
    startDate: String,
    nextDate: String,
    endDate: String,
    done: { type: Boolean, default: false },
  },
  { _id: false },
)

const test = new Schema(
  { id: String, name: String, date: String, result: String, followUp: String, nextTest: String },
  { _id: false },
)

const dietChange = new Schema({ id: String, date: String, change: String }, { _id: false })

const animalSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    species: { type: String, required: true, trim: true },
    enclosure: { type: String, required: true, trim: true },
    category: { type: String, default: 'other' },
    intakeDate: String,
    condition: { type: String, default: 'Good' },
    photo: { type: String, default: null },
    photos: { type: [String], default: [] },
    measurements: { type: [measurement], default: [] },
    medications: { type: [medication], default: [] },
    diet: {
      current: { type: String, default: '' },
      instructions: { type: String, default: '' },
      frequency: { type: String, default: '' },
      reviewDate: { type: String, default: '' },
    },
    dietLog: { type: [dietChange], default: [] },
    tests: { type: [test], default: [] },
    requiredTests: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

export default mongoose.model('Animal', animalSchema)
