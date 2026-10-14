import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Field from '../components/Field.jsx'
import Modal from '../components/Modal.jsx'
import { AnimalIdentity, AnimalPhoto } from '../components/AnimalBits.jsx'
import { ArrowLeftIcon, CameraIcon, CheckIcon, PencilIcon, PlusIcon, TrashIcon } from '../components/Icons.jsx'
import { useDashboard } from '../context/dashboardContext.js'
import { formatDate, sa, toISODate, uid } from '../data/helpers.js'
import { photoFromFile, photosFromFiles } from '../data/photos.js'

const TABS = ['Measurements', 'Medication', 'Diet', 'Tests', 'Photos']

function AnimalProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAnimal, updateAnimal, deleteAnimal } = useDashboard()
  const [tab, setTab] = useState('Measurements')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const animal = getAnimal(id)

  if (!animal) {
    return (
      <div className="dashboard-page">
        <h2 className="shared-display dashboard-title">Animal not found</h2>
        <p>
          There is no animal with the ID “{id}”. <Link to="/animals">Back to all animals</Link>
        </p>
      </div>
    )
  }

  const update = (updater) => updateAnimal(animal.id, updater)

  return (
    <div className="dashboard-page">
      <section className="profile-banner">
        <button type="button" className="shared-iconbtn profile-banner-back" onClick={() => navigate('/animals')} aria-label="Back to animals">
          <ArrowLeftIcon size={30} strokeWidth="1.4" />
        </button>
        <AnimalPhoto animal={animal} className="profile-banner-photo" />
        <AnimalIdentity animal={animal} linked={false} />
        <div className="profile-banner-actions">
          <button type="button" className="shared-iconbtn" onClick={() => setConfirmDelete(true)} aria-label={`Delete ${animal.id}`}>
            <TrashIcon size={22} strokeWidth="1.5" />
          </button>
          <Link to={`/reports?animal=${animal.id}`} className="shared-button shared-button-secondary">
            Print report
          </Link>
        </div>
      </section>

      <div className="profile-tabs" role="tablist" aria-label="Animal records">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`shared-button ${tab === t ? 'shared-button-dark' : 'shared-button-secondary'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="profile-panel">
        {tab === 'Measurements' && <MeasurementsTab key={animal.id} animal={animal} update={update} />}
        {tab === 'Medication' && <MedicationTab key={animal.id} animal={animal} update={update} />}
        {tab === 'Diet' && <DietTab key={animal.id} animal={animal} update={update} />}
        {tab === 'Tests' && <TestsTab key={animal.id} animal={animal} update={update} />}
        {tab === 'Photos' && <PhotosTab key={animal.id} animal={animal} update={update} />}
      </div>

      {confirmDelete && (
        <ConfirmDelete
          title="Are you sure you want to delete this profile?"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await deleteAnimal(animal.id).catch(() => setConfirmDelete(false))
            navigate('/animals')
          }}
        />
      )}
    </div>
  )
}

function ConfirmDelete({ title, text = 'This action cannot be reversed', onCancel, onConfirm }) {
  return (
    <Modal title={title} tone="olive" size="sm" titleClassName="shared-confirm-title" onClose={onCancel}>
      <p className="shared-confirm-text">{text}</p>
      <div className="shared-buttons-form shared-confirm-buttons">
        <Button variant="dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          <TrashIcon /> Delete
        </Button>
      </div>
    </Modal>
  )
}

function SectionHead({ title, addLabel, onAdd, children }) {
  return (
    <div className="dashboard-section-head">
      <h2 className="shared-display dashboard-title">{title}</h2>
      <div className="profile-buttons">
        {children}
        {onAdd && (
          <Button variant="secondary" onClick={onAdd}>
            <PlusIcon /> {addLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

function RowActions({ label, onEdit, onDelete }) {
  return (
    <td className="profile-actions">
      <button type="button" className="shared-iconbtn profile-action-edit" onClick={onEdit} aria-label={`Edit ${label}`} title="Edit">
        <PencilIcon size={18} strokeWidth="1.6" />
      </button>
      <button type="button" className="shared-iconbtn profile-action-delete" onClick={onDelete} aria-label={`Delete ${label}`} title="Delete">
        <TrashIcon size={18} strokeWidth="1.6" />
      </button>
    </td>
  )
}

function FormCard({ title, onSubmit, onCancel, columns = 2, submitLabel = 'Save Changes', children }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    ref.current?.querySelector('input, select, textarea')?.focus({ preventScroll: true })
  }, [])

  return (
    <form ref={ref} className="profile-form" onSubmit={onSubmit}>
      <h3 className="shared-display dashboard-title-small">{title}</h3>
      <div className={`shared-form-grid shared-form-cols-${columns}`}>{children}</div>
      <div className="shared-buttons-form">
        <Button type="submit">{submitLabel}</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

const formData = (e) => Object.fromEntries(new FormData(e.currentTarget))
const byDate = (list) => [...list].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

function useRecordEditor(listName, update) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const save = (record) => {
    const isNew = editing === 'new'
    update((a) => {
      const list = a[listName] || []
      return {
        ...a,
        [listName]: isNew ? [...list, { id: uid(), ...record }] : list.map((r) => (r.id === editing.id ? { ...r, ...record } : r)),
      }
    })
    setEditing(null)
    return isNew
  }

  const remove = () => {
    update((a) => ({ ...a, [listName]: (a[listName] || []).filter((r) => r.id !== deleting.id) }))
    if (editing && editing !== 'new' && editing.id === deleting.id) setEditing(null)
    setDeleting(null)
  }

  const current = editing && editing !== 'new' ? editing : {}
  return { editing, setEditing, deleting, setDeleting, save, remove, current, isNew: editing === 'new' }
}

function MeasurementsTab({ animal, update }) {
  const { addTask } = useDashboard()
  const ed = useRecordEditor('measurements', update)
  const rows = byDate(animal.measurements)

  function submit(e) {
    e.preventDefault()
    const f = formData(e)
    const isNew = ed.save({ date: f.date, weight: f.weight, length: f.length, width: f.width, note: f.note })
    if (isNew && f.nextDate) {
      addTask({ animalId: animal.id, type: 'Measurement', description: 'Weight & shell measure', date: f.nextDate, time: f.time || '09:00' })
    }
  }

  return (
    <>
      <SectionHead title="Measurement History" addLabel="Add measurement" onAdd={() => ed.setEditing('new')} />
      <div className="profile-table-wrap">
        <table className="profile-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Shell length</th>
              <th>Shell width</th>
              <th>Note</th>
              <th className="profile-head-actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className={ed.current.id === m.id ? 'is-editing' : ''}>
                <th scope="row">{formatDate(m.date)}</th>
                <td>{m.weight ? `${sa(m.weight)}kg` : '—'}</td>
                <td>{m.length ? `${m.length}mm` : '—'}</td>
                <td>{m.width ? `${m.width}mm` : '—'}</td>
                <td>{m.note || '—'}</td>
                <RowActions label={`measurement from ${formatDate(m.date)}`} onEdit={() => ed.setEditing(m)} onDelete={() => ed.setDeleting(m)} />
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="profile-empty-row">
                  No measurements yet. Use “Add measurement” to record one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ed.editing && (
        <FormCard
          key={ed.current.id || 'new'}
          title={ed.isNew ? 'Add a Measurement' : 'Edit Measurement'}
          submitLabel={ed.isNew ? 'Add Measurement' : 'Save Changes'}
          onSubmit={submit}
          onCancel={() => ed.setEditing(null)}
        >
          <Field label="Date" type="date" name="date" defaultValue={ed.current.date || toISODate()} required />
          <Field label="Weight" type="number" step="0.01" min="0" name="weight" suffix="kg" defaultValue={ed.current.weight} required />
          <Field label="Shell Length" type="number" min="0" name="length" suffix="mm" defaultValue={ed.current.length} required />
          <Field label="Shell Width" type="number" min="0" name="width" suffix="mm" defaultValue={ed.current.width} required />
          {ed.isNew && (
            <>
              <Field label="Next Measurement date" type="date" name="nextDate" />
              <Field label="Time" type="time" name="time" defaultValue="09:00" />
            </>
          )}
          <Field label="Note" name="note" placeholder="e.g. Check up" className="shared-form-span-2" defaultValue={ed.current.note} />
        </FormCard>
      )}

      {ed.deleting && (
        <ConfirmDelete
          title="Delete this measurement?"
          text={`${formatDate(ed.deleting.date)} · ${sa(ed.deleting.weight)}kg. This cannot be undone.`}
          onCancel={() => ed.setDeleting(null)}
          onConfirm={ed.remove}
        />
      )}
    </>
  )
}

function MedicationTab({ animal, update }) {
  const { addTask } = useDashboard()
  const ed = useRecordEditor('medications', update)

  function submit(e) {
    e.preventDefault()
    const f = formData(e)
    const isNew = ed.save({
      ...(ed.isNew ? { done: false } : {}),
      name: f.name,
      dosage: f.dosage,
      frequency: f.frequency,
      time: f.time,
      startDate: f.startDate,
      nextDate: f.nextDate,
      endDate: f.endDate,
    })
    if (isNew && f.nextDate) {
      addTask({ animalId: animal.id, type: 'Medication', description: `${sa(f.dosage)}ml ${f.name}`, date: f.nextDate, time: f.time || '09:00' })
    }
  }

  const toggle = (id) =>
    update((a) => ({ ...a, medications: a.medications.map((m) => (m.id === id ? { ...m, done: !m.done } : m)) }))

  return (
    <>
      <SectionHead title="Medication" addLabel="Add medication" onAdd={() => ed.setEditing('new')} />
      <div className="profile-table-wrap">
        <table className="profile-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Start date</th>
              <th>Next date</th>
              <th>End date</th>
              <th className="shared-center">Finished</th>
              <th className="profile-head-actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {animal.medications.map((m) => (
              <tr key={m.id} className={`${m.done ? 'is-done' : ''} ${ed.current.id === m.id ? 'is-editing' : ''}`}>
                <th scope="row">{m.name}</th>
                <td>{m.dosage ? `${sa(m.dosage)}ml` : '—'}</td>
                <td>{m.frequency || '—'}</td>
                <td>{formatDate(m.startDate)}</td>
                <td>{formatDate(m.nextDate)}</td>
                <td>{formatDate(m.endDate)}</td>
                <td className="shared-center">
                  <button
                    type="button"
                    className={`shared-checkbox ${m.done ? 'is-checked' : ''}`}
                    onClick={() => toggle(m.id)}
                    aria-pressed={m.done}
                    aria-label={`${m.name} course finished`}
                  >
                    {m.done && <CheckIcon size={18} />}
                  </button>
                </td>
                <RowActions label={m.name} onEdit={() => ed.setEditing(m)} onDelete={() => ed.setDeleting(m)} />
              </tr>
            ))}
            {!animal.medications.length && (
              <tr>
                <td colSpan={8} className="profile-empty-row">
                  No medication yet. Use “Add medication” to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ed.editing && (
        <FormCard
          key={ed.current.id || 'new'}
          title={ed.isNew ? 'Add Medication' : 'Edit Medication'}
          submitLabel={ed.isNew ? 'Add Medication' : 'Save Changes'}
          columns={3}
          onSubmit={submit}
          onCancel={() => ed.setEditing(null)}
        >
          <Field label="Type of Medication" name="name" defaultValue={ed.current.name} required />
          <Field label="Dosage" type="number" step="0.1" min="0" name="dosage" suffix="ml" defaultValue={ed.current.dosage} required />
          <Field label="Frequency" name="frequency" defaultValue={ed.current.frequency || 'Every 24 hours'} />
          <Field label="Time" type="time" name="time" defaultValue={ed.current.time || '12:00'} />
          <Field label="Start Date" type="date" name="startDate" defaultValue={ed.current.startDate || toISODate()} />
          <Field label="Next Date" type="date" name="nextDate" defaultValue={ed.current.nextDate || toISODate()} />
          <Field label="End Date" type="date" name="endDate" defaultValue={ed.current.endDate} />
        </FormCard>
      )}

      {ed.deleting && (
        <ConfirmDelete
          title={`Delete ${ed.deleting.name}?`}
          text="This medication will be removed from the profile and report."
          onCancel={() => ed.setDeleting(null)}
          onConfirm={ed.remove}
        />
      )}
    </>
  )
}

function DietTab({ animal, update }) {
  const [editingPlan, setEditingPlan] = useState(false)
  const [clearing, setClearing] = useState(false)
  const ed = useRecordEditor('dietLog', update)
  const d = animal.diet
  const log = byDate(animal.dietLog || [])
  const hasPlan = d.current || d.instructions || d.frequency || d.reviewDate

  function savePlan(e) {
    e.preventDefault()
    const f = formData(e)
    update((a) => ({ ...a, diet: { ...a.diet, ...f } }))
    setEditingPlan(false)
  }

  function submitChange(e) {
    e.preventDefault()
    const f = formData(e)
    ed.save({ date: f.date, change: f.change })
  }

  return (
    <>
      <SectionHead title="Diet Management">
        {!editingPlan && (
          <>
            {hasPlan && (
              <Button variant="outline" onClick={() => setClearing(true)}>
                <TrashIcon /> Clear plan
              </Button>
            )}
            <Button variant="secondary" onClick={() => setEditingPlan(true)}>
              <PencilIcon /> {hasPlan ? 'Edit plan' : 'Add plan'}
            </Button>
          </>
        )}
      </SectionHead>

      {editingPlan ? (
        <FormCard title={hasPlan ? 'Edit Diet Plan' : 'Add Diet Plan'} columns={2} onSubmit={savePlan} onCancel={() => setEditingPlan(false)}>
          <Field label="Current Diet" name="current" defaultValue={d.current} placeholder="e.g. Grass and hay" />
          <Field label="Feeding Instructions" name="instructions" defaultValue={d.instructions} placeholder="e.g. Monitor morning feeding" />
          <Field label="Feeding Frequency" name="frequency" defaultValue={d.frequency} placeholder="e.g. Twice a day" />
          <Field label="Diet Review Date" type="date" name="reviewDate" defaultValue={d.reviewDate} />
        </FormCard>
      ) : (
        <dl className="profile-readonly-grid">
          <ReadOnly label="Current Diet" value={d.current} />
          <ReadOnly label="Feeding Instructions" value={d.instructions} />
          <ReadOnly label="Feeding Frequency" value={d.frequency} />
          <ReadOnly label="Diet Review Date" value={d.reviewDate && formatDate(d.reviewDate)} />
        </dl>
      )}

      <SectionHead title="Diet Changes" addLabel="Add diet change" onAdd={() => ed.setEditing('new')} />
      <div className="profile-table-wrap">
        <table className="profile-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Change</th>
              <th className="profile-head-actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {log.map((c) => (
              <tr key={c.id} className={ed.current.id === c.id ? 'is-editing' : ''}>
                <th scope="row">{formatDate(c.date)}</th>
                <td>{c.change}</td>
                <RowActions label={`diet change from ${formatDate(c.date)}`} onEdit={() => ed.setEditing(c)} onDelete={() => ed.setDeleting(c)} />
              </tr>
            ))}
            {!log.length && (
              <tr>
                <td colSpan={3} className="profile-empty-row">
                  No diet changes recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ed.editing && (
        <FormCard
          key={ed.current.id || 'new'}
          title={ed.isNew ? 'Add a Diet Change' : 'Edit Diet Change'}
          submitLabel={ed.isNew ? 'Add Change' : 'Save Changes'}
          onSubmit={submitChange}
          onCancel={() => ed.setEditing(null)}
        >
          <Field label="Date" type="date" name="date" defaultValue={ed.current.date || toISODate()} required />
          <Field label="What changed" name="change" defaultValue={ed.current.change} placeholder="e.g. Introduced hay" required />
        </FormCard>
      )}

      {ed.deleting && (
        <ConfirmDelete title="Delete this diet change?" onCancel={() => ed.setDeleting(null)} onConfirm={ed.remove} />
      )}

      {clearing && (
        <ConfirmDelete
          title="Clear the diet plan?"
          text="Current diet, instructions, frequency and review date will be emptied."
          onCancel={() => setClearing(false)}
          onConfirm={() => {
            update((a) => ({ ...a, diet: { current: '', instructions: '', frequency: '', reviewDate: '' } }))
            setClearing(false)
          }}
        />
      )}
    </>
  )
}

function ReadOnly({ label, value }) {
  return (
    <div className="shared-field">
      <dt className="shared-field-label">{label}</dt>
      <dd className="profile-readonly-box">{value || '—'}</dd>
    </div>
  )
}

function TestsTab({ animal, update }) {
  const { addTask } = useDashboard()
  const ed = useRecordEditor('tests', update)
  const rows = byDate(animal.tests)

  function submit(e) {
    e.preventDefault()
    const f = formData(e)
    const isNew = ed.save({ name: f.name, date: f.date, result: f.result, followUp: f.followUp, nextTest: f.nextTest })
    if (isNew && f.nextTest) {
      addTask({ animalId: animal.id, type: 'Test', description: `${f.name} test`, date: f.nextTest, time: f.time || '09:00' })
    }
  }

  return (
    <>
      <SectionHead title="Test History" addLabel="Add test" onAdd={() => ed.setEditing('new')} />
      <div className="profile-table-wrap">
        <table className="profile-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Date</th>
              <th>Result</th>
              <th>Follow up</th>
              <th>Next test</th>
              <th className="profile-head-actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className={ed.current.id === t.id ? 'is-editing' : ''}>
                <th scope="row">{t.name}</th>
                <td>{formatDate(t.date)}</td>
                <td>{t.result || '—'}</td>
                <td>{t.followUp || '—'}</td>
                <td>{t.nextTest ? formatDate(t.nextTest) : 'N/A'}</td>
                <RowActions label={`${t.name} on ${formatDate(t.date)}`} onEdit={() => ed.setEditing(t)} onDelete={() => ed.setDeleting(t)} />
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="profile-empty-row">
                  No tests recorded yet. Use “Add test” to record one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ed.editing && (
        <FormCard
          key={ed.current.id || 'new'}
          title={ed.isNew ? 'Add a Test' : 'Edit Test'}
          submitLabel={ed.isNew ? 'Add Test' : 'Save Changes'}
          onSubmit={submit}
          onCancel={() => ed.setEditing(null)}
        >
          <Field label="Test Name" name="name" placeholder="e.g. Mouth Swab" defaultValue={ed.current.name} required />
          <Field label="Date of Test" type="date" name="date" defaultValue={ed.current.date || toISODate()} required />
          <Field label="Result" name="result" placeholder="e.g. Positive" defaultValue={ed.current.result} required />
          <Field label="Follow Up" as="select" name="followUp" options={['Yes', 'No']} defaultValue={ed.current.followUp || 'No'} />
          <Field label="Next Test due" type="date" name="nextTest" defaultValue={ed.current.nextTest} />
          {ed.isNew && <Field label="Time" type="time" name="time" defaultValue="09:45" />}
        </FormCard>
      )}

      {ed.deleting && (
        <ConfirmDelete
          title={`Delete ${ed.deleting.name}?`}
          text={`Test from ${formatDate(ed.deleting.date)}. This cannot be undone.`}
          onCancel={() => ed.setDeleting(null)}
          onConfirm={ed.remove}
        />
      )}
    </>
  )
}

function PhotosTab({ animal, update }) {
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [photoError, setPhotoError] = useState('')

  async function upload(e) {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    setPhotoError('')
    try {
      const added = (await photosFromFiles(files)).filter((src) => !animal.photos.includes(src))
      if (added.length) update((a) => ({ ...a, photo: a.photo || added[0], photos: [...a.photos, ...added] }))
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function replace(oldSrc, e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setPhotoError('')
    try {
      const src = await photoFromFile(file)
      update((a) => ({
        ...a,
        photo: a.photo === oldSrc ? src : a.photo,
        photos: a.photos.map((p) => (p === oldSrc ? src : p)),
      }))
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function remove() {
    update((a) => {
      const photos = a.photos.filter((p) => p !== deleting)
      return { ...a, photos, photo: a.photo === deleting ? photos[0] || null : a.photo }
    })
    setDeleting(null)
  }

  return (
    <>
      <SectionHead title="Photos">
        <label className="shared-button shared-button-secondary profile-upload">
          <PlusIcon /> {busy ? 'Adding…' : 'Add photos'}
          <input type="file" accept="image/*" multiple onChange={upload} className="sr-only" disabled={busy} />
        </label>
      </SectionHead>

      {photoError && <p className="login-error" role="alert">{photoError}</p>}

      {animal.photos.length ? (
        <div className="profile-photo-grid">
          {animal.photos.map((src, i) => {
            const isMain = animal.photo === src
            return (
              <figure key={src} className="profile-photo-tile">
                <img src={src} alt={`${animal.id} photo ${i + 1}`} loading="lazy" />
                {isMain && <span className="profile-photo-badge">Profile photo</span>}
                <figcaption className="profile-tools-photo">
                  {!isMain && (
                    <button type="button" className="profile-phototool" onClick={() => update((a) => ({ ...a, photo: src }))}>
                      Set as profile
                    </button>
                  )}
                  <label className="profile-phototool">
                    <CameraIcon size={16} /> Replace
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => replace(src, e)} />
                  </label>
                  <button type="button" className="profile-phototool is-danger" onClick={() => setDeleting(src)} aria-label={`Delete photo ${i + 1}`}>
                    <TrashIcon size={16} /> Delete
                  </button>
                </figcaption>
              </figure>
            )
          })}
        </div>
      ) : (
        <p className="shared-empty-note">No photos yet. Use “Add photos” to upload the first one.</p>
      )}

      {deleting && <ConfirmDelete title="Delete this photo?" onCancel={() => setDeleting(null)} onConfirm={remove} />}
    </>
  )
}

export default AnimalProfilePage
