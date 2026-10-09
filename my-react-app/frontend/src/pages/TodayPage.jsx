import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Field from '../components/Field.jsx'
import Modal from '../components/Modal.jsx'
import { StatCard } from '../components/AnimalBits.jsx'
import { CheckIcon, PlusIcon } from '../components/Icons.jsx'
import { useDashboard } from '../context/dashboardContext.js'
import { formatDate, taskStatus, toISODate } from '../data/helpers.js'

const TASK_TYPES = ['Feeding', 'Medication', 'Measurement', 'Test', 'Photo', 'Cleaning', 'Other']
const REPEAT_OPTIONS = [
  { value: 'none', label: 'Do not repeat' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
]
const STATUS_ORDER = { Overdue: 0, 'Due Soon': 1, 'Due Today': 2, Upcoming: 3, Completed: 4 }

// update every minute for overdue / due soon
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}

function TodayPage() {
  const { tasks, toggleTask } = useDashboard()
  const [adding, setAdding] = useState(false)
  const now = useNow()
  const today = toISODate(now)

  // today + old ones not done
  const rows = useMemo(
    () =>
      tasks
        .filter((t) => t.date === today || (t.date < today && !t.completed))
        .map((t) => ({ ...t, status: taskStatus(t, now) }))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [tasks, today, now],
  )

  const overdue = rows.filter((r) => r.status === 'Overdue').length
  const completed = rows.filter((r) => r.completed).length
  const upcoming = rows.length - overdue - completed
  const pct = rows.length ? Math.round((completed / rows.length) * 100) : 0

  return (
    <div className="dashboard-page">
      <div className="today-header">
        <h2 className="dashboard-heading">Today’s Tasks</h2>
        <p className="today-progress-label">
          <strong>{completed}</strong> of {rows.length} tasks completed · {pct}%
        </p>
      </div>

      <div
        className="today-progress"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={rows.length}
        aria-label="Tasks completed today"
      >
        <span className="today-progress-fill" style={{ width: `${Math.max(pct, rows.length ? 2 : 0)}%` }} />
      </div>

      <div className="dashboard-stat-grid dashboard-stat-grid-4">
        <StatCard label="Overdue" value={overdue} tone={overdue ? 'alert' : undefined} />
        <StatCard label="Completed today" value={completed} />
        <StatCard label="Upcoming" value={upcoming} />
        <StatCard label="Total" value={rows.length} />
      </div>

      <h2 className="dashboard-heading today-timeline-title">Priority Task Timeline</h2>

      {rows.length === 0 ? (
        <p className="shared-empty-note">No tasks for today yet. Use “Add Task” below to schedule one.</p>
      ) : (
        <ul className="today-timeline">
          {rows.map((task) => (
            <li key={task.id} className={`today-timeline-row ${task.completed ? 'is-done' : ''}`}>
              <button
                type="button"
                className={`shared-checkbox ${task.completed ? 'is-checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? `Undo ${task.description}` : `Mark ${task.description} complete`}
                aria-pressed={task.completed}
              >
                {task.completed && <CheckIcon size={18} />}
              </button>
              <span className={`today-timeline-status today-status-${task.status.replace(' ', '-').toLowerCase()}`}>{task.status}</span>
              <span className="today-timeline-time">
                {task.time}
                {task.date !== today && <small> · {formatDate(task.date)}</small>}
              </span>
              <Link to={`/animals/${task.animalId}`} className="today-animal-link">
                {task.animalId}
              </Link>
              <span className="today-task-desc">{task.description}</span>
              <Button
                variant={task.completed ? 'dark' : 'secondary'}
                className="today-complete-btn"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? 'Undo' : 'Mark Complete'}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button className="today-addtask" onClick={() => setAdding(true)}>
        <PlusIcon /> Add Task
      </Button>

      {adding && <AddTaskModal onClose={() => setAdding(false)} />}
    </div>
  )
}

function AddTaskModal({ onClose }) {
  const { animals, addTask } = useDashboard()
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    if (!f.description.trim()) {
      setError('Please add a task description.')
      return
    }
    addTask({
      animalId: f.animalId,
      type: f.type,
      description: f.description.trim(),
      date: f.date,
      time: f.time,
      repeat: f.repeat,
    })
    onClose()
  }

  return (
    <Modal title="Add Task" onClose={onClose}>
      {animals.length === 0 ? (
        <p className="shared-modal-empty">
          Add an animal first, then you can schedule tasks for it.{' '}
          <Link to="/animals/new" onClick={onClose}>
            Add new animal
          </Link>
        </p>
      ) : (
      <form className="shared-form-stack" onSubmit={handleSubmit}>
        <Field label="Name" as="select" name="animalId" options={animals.map((a) => ({ value: a.id, label: `${a.id} – ${a.species}` }))} />
        <Field label="Task Type" as="select" name="type" options={TASK_TYPES} />
        <Field label="Task Description" name="description" placeholder="e.g. Feed protein food at lunch" />
        <Field label="Due Date" type="date" name="date" defaultValue={toISODate()} required />
        <Field label="Time" type="time" name="time" defaultValue="12:00" required />
        <Field label="Repeat" as="select" name="repeat" options={REPEAT_OPTIONS} />
        {error && <p className="shared-form-error" role="alert">{error}</p>}
        <div className="shared-buttons-form">
          <Button type="submit">
            <PlusIcon /> Add Task
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
      )}
    </Modal>
  )
}

export default TodayPage
