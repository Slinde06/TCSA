import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../context/dashboardContext.js'
import { filterAnimals } from '../data/helpers.js'
import {
  AnimalIdentity,
  AnimalList,
  AnimalPhoto,
  AnimalSearch,
  StatsPanel,
} from '../components/AnimalBits.jsx'
import { ChevronLeftIcon } from '../components/Icons.jsx'

// list (or preview) left, stats right
function AnimalPage() {
  const { animals, getAnimal } = useDashboard()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const selected = selectedId ? getAnimal(selectedId) : null

  return (
    <div className="dashboard-page">
      <h2 className="shared-display dashboard-title">Animal Management</h2>
      <div className="animals-search-row">
        <AnimalSearch
          value={query}
          onChange={(v) => {
            setQuery(v)
            setSelectedId(null)
          }}
        />
      </div>

      <div className="dashboard-split">
        {selected ? (
          <section className="animals-preview-card" aria-label="Selected animal preview">
            <button type="button" className="animals-back-preview" onClick={() => setSelectedId(null)}>
              <ChevronLeftIcon size={20} />
              <span className="shared-display">Selected Animal Preview</span>
            </button>
            <div className="animals-preview-body">
              <AnimalPhoto animal={selected} />
              <AnimalIdentity animal={selected} />
            </div>
            <Link to={`/animals/${selected.id}`} className="shared-button shared-button-primary animals-profile-btn">
              Full Profile
            </Link>
          </section>
        ) : (
          <div className="dashboard-list-box">
            <AnimalList animals={filterAnimals(animals, query)} onSelect={setSelectedId} />
          </div>
        )}

        <StatsPanel animals={animals} />
      </div>
    </div>
  )
}

export default AnimalPage
