// date, id and category helpers

// yyyy-mm-dd to dd/mm/yyyy
export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

// local date as yyyy-mm-dd
export function toISODate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  return toISODate(new Date(y, m - 1, d + days))
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// tortoise / chameleon / snake etc from the species name
export function categoryFor(species = '') {
  const s = species.toLowerCase()
  if (s.includes('tortoise') || s.includes('padloper') || s.includes('terrapin') || s.includes('turtle')) return 'tortoise'
  if (s.includes('chameleon')) return 'chameleon'
  if (s.includes('snake') || s.includes('adder') || s.includes('cobra') || s.includes('python') || s.includes('boomslang')) return 'snake'
  if (s.includes('lizard') || s.includes('gecko') || s.includes('agama') || s.includes('skink') || s.includes('monitor')) return 'lizard'
  return 'other'
}

// first 3 letters of the species
export function idPrefixFor(species = '') {
  const letters = species.replace(/[^a-zA-Z]/g, '').toUpperCase()
  return (letters.slice(0, 3) || 'ANI').padEnd(3, 'X')
}

// next free number for that species prefix
export function nextAnimalId(species, animals) {
  const prefix = idPrefixFor(species)
  const used = animals
    .filter((a) => a.id.startsWith(prefix + '-'))
    .map((a) => Number(a.id.split('-')[1]) || 0)
  const next = (used.length ? Math.max(...used) : 0) + 1
  return `${prefix}-${String(next).padStart(2, '0')}`
}

export function taskStatus(task, now = new Date()) {
  if (task.completed) return 'Completed'
  const due = new Date(`${task.date}T${task.time || '00:00'}`)
  const today = toISODate(now)
  if (due < now) return 'Overdue'
  if (due - now <= 60 * 60 * 1000) return 'Due Soon'
  if (task.date === today) return 'Due Today'
  return 'Upcoming'
}

// numbers for the stat cards
export function animalStats(animals) {
  const count = (cat) => animals.filter((a) => a.category === cat).length
  const leopard = animals.filter((a) => a.species.toLowerCase().includes('leopard')).length
  return {
    tortoises: count('tortoise'),
    chameleons: count('chameleon'),
    snakes: count('snake'),
    other: animals.length - count('tortoise') - count('chameleon') - count('snake'),
    bars: [
      { label: 'Leopard Tortoise', value: leopard },
      { label: 'Other Tortoises', value: count('tortoise') - leopard },
      { label: 'Lizards', value: count('lizard') + count('chameleon') },
      { label: 'Snakes', value: count('snake') },
    ],
  }
}

// comma decimals
export function sa(n) {
  return n === '' || n == null ? '—' : String(n).replace('.', ',')
}

export function filterAnimals(animals, query) {
  const q = query.trim().toLowerCase()
  if (!q) return animals
  return animals.filter((a) => a.id.toLowerCase().includes(q) || a.species.toLowerCase().includes(q))
}
