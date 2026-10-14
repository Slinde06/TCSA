import { Link } from 'react-router-dom'
import { animalStats } from '../data/helpers.js'
import { SearchIcon, TortoiseIcon, ChameleonIcon, SnakeIcon } from './Icons.jsx'

export function AnimalPhoto({ animal, className = '' }) {
  if (animal.photo) {
    return <img className={`dashboard-animal-photo ${className}`} src={animal.photo} alt={`${animal.id}, ${animal.species}`} />
  }
  const Icon = animal.category === 'chameleon' || animal.category === 'lizard' ? ChameleonIcon : animal.category === 'snake' ? SnakeIcon : TortoiseIcon
  return (
    <div className={`dashboard-animal-photo dashboard-animal-photo-empty ${className}`} role="img" aria-label={`No photo of ${animal.id} yet`}>
      <Icon size={70} />
    </div>
  )
}

export function AnimalIdentity({ animal, linked = true }) {
  return (
    <div className="dashboard-animal-identity">
      {linked ? (
        <Link to={`/animals/${animal.id}`} className="dashboard-animal-id">
          {animal.id}
        </Link>
      ) : (
        <span className="dashboard-animal-id">{animal.id}</span>
      )}
      <p className="dashboard-animal-species">{animal.species}</p>
      <p className="dashboard-animal-enclosure">Enclosure {animal.enclosure}</p>
    </div>
  )
}

export function StatsPanel({ animals }) {
  const stats = animalStats(animals)
  const total = Math.max(1, animals.length)

  return (
    <section className="dashboard-statspanel" aria-label="Animals in care">
      <div className="dashboard-stat-grid">
        <StatCard label="Total tortoises in care" value={stats.tortoises} />
        <StatCard label="Total chameleons in care" value={stats.chameleons} />
        <StatCard label="Total snakes in care" value={stats.snakes} />
        <StatCard label="Other animals in care" value={stats.other} />
      </div>

      <h3 className="shared-display dashboard-title-stats">Animal Management</h3>
      <ul className="dashboard-stats-bars">
        {stats.bars.map((bar) => (
          <li key={bar.label}>
            <span className="dashboard-stats-bar-label">{bar.label}</span>
            <span className="dashboard-stats-bar-value">{bar.value}</span>
            <span className="dashboard-stats-bar-track" aria-hidden="true">
              <span className="dashboard-stats-bar-fill" style={{ width: `${Math.max(3, (bar.value / total) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function StatCard({ label, value, tone }) {
  return (
    <div className={`dashboard-stat-card ${tone ? `dashboard-stat-${tone}` : ''}`}>
      <span className="dashboard-stat-label">{label}</span>
      <span className="dashboard-stat-value shared-display">{value}</span>
    </div>
  )
}

export function AnimalSearch({ value, onChange, label = 'Search Animal by ID', placeholder = 'Search for Animal :', dark = false }) {
  return (
    <div className={`dashboard-animal-search ${dark ? 'is-dark' : ''}`}>
      <label htmlFor="animal-search">{label}</label>
      <div className="dashboard-search-box">
        <input
          id="animal-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <SearchIcon size={20} />
      </div>
    </div>
  )
}

export function AnimalList({ animals, onSelect, selectedId }) {
  if (!animals.length) return <p className="shared-empty-note">No animals match your search.</p>
  return (
    <ul className="dashboard-animal-list">
      {animals.map((a) => (
        <li key={a.id}>
          <button type="button" className={a.id === selectedId ? 'is-selected' : ''} onClick={() => onSelect(a.id)}>
            <span>{a.id}</span>
            <span className="dashboard-animal-list-species">{a.species}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
