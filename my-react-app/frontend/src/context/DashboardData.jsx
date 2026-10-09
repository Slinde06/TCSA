import { useMemo, useState } from 'react'
import { DashboardContext } from './dashboardContext.js'
import { sampleAnimals, sampleTasks } from '../data/sampleData.js'
import { addDays, categoryFor, uid } from '../data/helpers.js'

// animals + tasks shared by all the dashboard pages
// TODO save to database

export function DashboardProvider({ children }) {
  const [animals, setAnimals] = useState(sampleAnimals)
  const [tasks, setTasks] = useState(sampleTasks)

  const api = useMemo(
    () => ({
      animals,
      tasks,

      getAnimal: (id) => animals.find((a) => a.id === id),

      addAnimal(newAnimal) {
        setAnimals((list) => [{ ...newAnimal, category: categoryFor(newAnimal.species) }, ...list])
      },

      updateAnimal(id, updater) {
        setAnimals((list) =>
          list.map((a) => {
            if (a.id !== id) return a
            const next = updater(a)
            return { ...next, category: categoryFor(next.species) }
          }),
        )
      },

      deleteAnimal(id) {
        setAnimals((list) => list.filter((a) => a.id !== id))
        setTasks((list) => list.filter((t) => t.animalId !== id))
      },

      addTask(task) {
        setTasks((list) => [...list, { id: uid(), completed: false, repeat: 'none', ...task }])
      },

      // repeating tasks add the next one when ticked
      toggleTask(id) {
        setTasks((list) => {
          const task = list.find((t) => t.id === id)
          if (!task) return list
          const updated = list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
          if (!task.completed && task.repeat !== 'none') {
            const step = task.repeat === 'weekly' ? 7 : 1
            const nextDate = addDays(task.date, step)
            const exists = list.some(
              (t) => t.animalId === task.animalId && t.description === task.description && t.date === nextDate,
            )
            if (!exists) updated.push({ ...task, id: uid(), date: nextDate, completed: false })
          }
          return updated
        })
      },
    }),
    [animals, tasks],
  )

  return <DashboardContext.Provider value={api}>{children}</DashboardContext.Provider>
}
