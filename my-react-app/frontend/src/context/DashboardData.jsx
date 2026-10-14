import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { DashboardContext } from './dashboardContext.js'
import { api } from '../data/api.js'
import { categoryFor } from '../data/helpers.js'

async function fetchDashboard() {
  try {
    const me = await api('/me')
    const [animals, tasks] = await Promise.all([api('/animals'), api('/tasks')])
    return { status: 'ready', owner: me.username, animals, tasks }
  } catch (err) {
    if (err.status === 401) return { status: 'logged-out' }
    return { status: 'failed', error: err.message }
  }
}

export function DashboardProvider({ children }) {
  const [owner, setOwner] = useState(null)
  const [status, setStatus] = useState('loading')
  const [animals, setAnimals] = useState([])
  const [tasks, setTasks] = useState([])
  const [saveError, setSaveError] = useState('')
  const animalsRef = useRef(animals)

  useEffect(() => {
    animalsRef.current = animals
  }, [animals])

  const apply = useCallback((result) => {
    setStatus(result.status)
    setSaveError(result.error || '')
    if (result.status === 'ready') {
      setOwner(result.owner)
      setAnimals(result.animals)
      setTasks(result.tasks)
    }
  }, [])

  useEffect(() => {
    let stale = false
    fetchDashboard().then((result) => {
      if (!stale) apply(result)
    })
    return () => {
      stale = true
    }
  }, [apply])

  const load = useCallback(() => {
    setStatus('loading')
    return fetchDashboard().then(apply)
  }, [apply])

  const save = useCallback(
    async (request) => {
      try {
        return await request()
      } catch (err) {
        if (err.status === 401) {
          setStatus('logged-out')
          return null
        }
        setSaveError(err.message)
        load()
        throw err
      }
    },
    [load],
  )

  const value = useMemo(
    () => ({
      owner,
      status,
      saveError,
      clearSaveError: () => setSaveError(''),
      reload: load,
      animals,
      tasks,

      getAnimal: (id) => animals.find((a) => a.id === id),

      async addAnimal(newAnimal) {
        const saved = await save(() =>
          api('/animals', { method: 'POST', body: { ...newAnimal, category: categoryFor(newAnimal.species) } }),
        )
        if (saved) setAnimals((list) => [saved, ...list])
        return saved
      },

      updateAnimal(id, updater) {
        const current = animalsRef.current.find((a) => a.id === id)
        if (!current) return
        const next = updater(current)
        const updated = { ...next, category: categoryFor(next.species) }
        animalsRef.current = animalsRef.current.map((a) => (a.id === id ? updated : a))
        setAnimals(animalsRef.current)
        save(() => api(`/animals/${encodeURIComponent(id)}`, { method: 'PUT', body: updated })).catch(() => {})
      },

      async deleteAnimal(id) {
        await save(() => api(`/animals/${encodeURIComponent(id)}`, { method: 'DELETE' }))
        setAnimals((list) => list.filter((a) => a.id !== id))
        setTasks((list) => list.filter((t) => t.animalId !== id))
      },

      async addTask(task) {
        const saved = await save(() => api('/tasks', { method: 'POST', body: task }))
        if (saved) setTasks((list) => [...list, saved])
        return saved
      },

      async toggleTask(id) {
        setTasks((list) => list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
        const result = await save(() => api(`/tasks/${id}/toggle`, { method: 'POST' })).catch(() => null)
        if (!result) return
        setTasks((list) => {
          const updated = list.map((t) => (t.id === id ? result.task : t))
          return result.created ? [...updated, result.created] : updated
        })
      },

      async logout() {
        await api('/logout', { method: 'POST' }).catch(() => {})
        setStatus('logged-out')
      },
    }),
    [owner, status, saveError, animals, tasks, load, save],
  )

  if (status === 'logged-out') return <Navigate to="/login" replace />

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
