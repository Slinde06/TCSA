import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Field from '../components/Field.jsx'
import { CameraIcon, CheckIcon, ChevronLeftIcon, TortoiseIcon } from '../components/Icons.jsx'
import { useDashboard } from '../context/dashboardContext.js'
import { nextAnimalId, toISODate, uid } from '../data/helpers.js'

const SPECIES = [
  'Leopard Tortoise',
  'Angulate Tortoise',
  'Geometric Tortoise',
  'Tent Tortoise',
  'Parrot-beaked Padloper',
  'Speckled Padloper',
  'Hinged Tortoise',
  'Cape Dwarf Chameleon',
  'Flap-necked Chameleon',
  'Mole Snake',
  'Brown House Snake',
]
const CONDITIONS = ['Good', 'Fair', 'Poor', 'Critical']

function CardHead({ step, title, text }) {
  return (
    <legend className="addanimal-card-head">
      <span className="addanimal-number" aria-hidden="true">
        {step}
      </span>
      <span>
        <span className="addanimal-card-title">{title}</span>
        <span className="addanimal-card-text">{text}</span>
      </span>
    </legend>
  )
}

function AddAnimalPage() {
  const navigate = useNavigate()
  const { animals, addAnimal } = useDashboard()
  const [photo, setPhoto] = useState(null)
  const [species, setSpecies] = useState('')
  const [generatedId, setGeneratedId] = useState('')
  const [error, setError] = useState('')

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    // preview only, not saved anywhere yet
    if (file) setPhoto(URL.createObjectURL(file))
  }

  function generateId() {
    if (!species.trim()) {
      setError('Enter the species first so an ID can be generated.')
      return
    }
    setError('')
    setGeneratedId(nextAnimalId(species, animals))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    if (!f.species.trim() || !f.enclosure.trim()) {
      setError('Species and enclosure are required.')
      return
    }
    let id = generatedId || nextAnimalId(f.species, animals)
    if (animals.some((a) => a.id === id)) id = nextAnimalId(f.species, animals)

    const listFrom = (text) =>
      text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

    addAnimal({
      id,
      species: f.species.trim(),
      enclosure: f.enclosure.trim(),
      intakeDate: f.intakeDate,
      condition: f.condition,
      photo,
      photos: photo ? [photo] : [],
      measurements: f.weight
        ? [{ id: uid(), date: f.intakeDate, weight: f.weight, length: f.length, width: f.width, note: 'Intake' }]
        : [],
      medications: listFrom(f.medication).map((name) => ({
        id: uid(),
        name: name[0].toUpperCase() + name.slice(1),
        dosage: '',
        frequency: '',
        time: '',
        startDate: f.intakeDate,
        nextDate: '',
        endDate: '',
        done: false,
      })),
      diet: { current: f.diet, instructions: f.instructions, frequency: '', reviewDate: '' },
      dietLog: [],
      tests: listFrom(f.completedTests).map((name) => ({
        id: uid(),
        name: name[0].toUpperCase() + name.slice(1),
        date: f.intakeDate,
        result: 'Done',
        followUp: 'No',
        nextTest: '',
      })),
      requiredTests: f.requiredTests,
      notes: f.notes,
    })
    navigate(`/animals/${id}`)
  }

  return (
    <div className="dashboard-page addanimal-page">
      <div className="addanimal-header">
        <div>
          <Link to="/animals" className="dashboard-back-link">
            <ChevronLeftIcon size={18} /> Back to animals
          </Link>
          <h2 className="shared-display dashboard-title addanimal-title">Add New Animal</h2>
          <p className="addanimal-intro">
            Record a new intake. Fields marked <span className="shared-field-required">*</span> are required; everything else
            can be filled in later from the animal’s profile.
          </p>
        </div>
        <div className={`addanimal-idchip ${generatedId ? 'is-set' : ''}`} role="status">
          <span>Animal ID</span>
          <strong>{generatedId || 'Not generated yet'}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="addanimal-grid">
          <fieldset className="addanimal-card">
            <CardHead step="1" title="Identity" text="Photo, species and where the animal is housed." />

            <label className={`addanimal-photo ${photo ? 'has-photo' : ''}`}>
              {photo ? (
                <img src={photo} alt="New animal" />
              ) : (
                <span className="addanimal-photo-empty">
                  <TortoiseIcon size={70} />
                  <span className="addanimal-photo-text">
                    <CameraIcon size={18} /> Click to upload a photo
                  </span>
                  <small>JPG or PNG</small>
                </span>
              )}
              {photo && (
                <span className="addanimal-photo-change">
                  <CameraIcon size={16} /> Change photo
                </span>
              )}
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
            </label>

            <Field
              label="Species"
              name="species"
              list="species-list"
              value={species}
              onChange={(e) => {
                setSpecies(e.target.value)
                setGeneratedId('')
              }}
              placeholder="e.g. Leopard Tortoise"
              required
            />
            <datalist id="species-list">
              {SPECIES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>

            <div className="shared-form-grid shared-form-cols-2">
              <Field label="Enclosure" name="enclosure" placeholder="e.g. E-04" required />
              <Field label="Intake Date" type="date" name="intakeDate" defaultValue={toISODate()} />
            </div>

            <div className="addanimal-id-row">
              <div className="shared-field">
                <span className="shared-field-label">Animal ID</span>
                <p className="profile-readonly-box">{generatedId || <span className="shared-muted">Not set</span>}</p>
              </div>
              <Button variant="secondary" onClick={generateId}>
                Generate ID
              </Button>
            </div>
          </fieldset>

          <fieldset className="addanimal-card">
            <CardHead step="2" title="Condition & measurements" text="How the animal arrived and its intake size." />

            <div className="shared-field">
              <span className="shared-field-label" id="condition-label">
                Initial Condition
              </span>
              <div className="addanimal-conditions" role="radiogroup" aria-labelledby="condition-label">
                {CONDITIONS.map((c, i) => (
                  <label key={c} className={`addanimal-condition-button addanimal-condition-${c.toLowerCase()}`}>
                    <input type="radio" name="condition" value={c} defaultChecked={i === 0} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="shared-form-grid shared-form-cols-3 addanimal-measurements">
              <Field label="Weight" type="number" step="0.01" min="0" name="weight" suffix="kg" placeholder="0.00" />
              <Field label="Shell Length" type="number" min="0" name="length" suffix="mm" placeholder="0" />
              <Field label="Shell Width" type="number" min="0" name="width" suffix="mm" placeholder="0" />
            </div>

            <div className="addanimal-divider" />

            <Field label="Completed Tests" name="completedTests" placeholder="e.g. Mouth swab, faecal float" />
            <Field label="Required Tests" name="requiredTests" placeholder="e.g. Follow-up swab in 2 weeks" />
            <p className="shared-field-hint">Separate several tests with a comma.</p>
          </fieldset>

          <fieldset className="addanimal-card">
            <CardHead step="3" title="Care plan" text="Medication, diet and anything worth remembering." />
            <Field label="Medication" name="medication" placeholder="e.g. Antibiotic, dewormer" />
            <div className="shared-form-grid shared-form-cols-2">
              <Field label="Diet" name="diet" placeholder="e.g. Grass, hay" />
              <Field label="Feeding Instructions" name="instructions" placeholder="e.g. Twice daily" />
            </div>
            <Field label="Notes" as="textarea" name="notes" rows={6} placeholder="Where it was found, behaviour, injuries…" />
          </fieldset>
        </div>

        <div className="addanimal-bottom-bar">
          {error ? (
            <p className="shared-form-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="addanimal-savehint">
              <CheckIcon size={16} /> The animal’s profile opens after saving.
            </p>
          )}
          <div className="addanimal-save-buttons">
            <Button variant="outline" onClick={() => navigate('/animals')}>
              Cancel
            </Button>
            <Button type="submit">Save Animal</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddAnimalPage
