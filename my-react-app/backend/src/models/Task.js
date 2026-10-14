import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    animalId: { type: String, required: true, index: true },
    type: { type: String, default: 'Other' },
    description: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true },
    time: { type: String, default: '09:00' },
    repeat: { type: String, enum: ['none', 'daily', 'weekly'], default: 'none' },
    completed: { type: Boolean, default: false },
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

export default mongoose.model('Task', taskSchema)
