import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button.jsx'
import {
  AnimalIdentity,
  AnimalList,
  AnimalPhoto,
  AnimalSearch,
  StatsPanel,
} from '../components/AnimalBits.jsx'
import { ChevronLeftIcon, GmailIcon, WhatsAppIcon } from '../components/Icons.jsx'
import { useDashboard } from '../context/dashboardContext.js'
import { CONTACT } from '../data/site.js'
import { filterAnimals, formatDate, sa } from '../data/helpers.js'
import logo from '../assets/logo-badge-light.png'

// animal id is in the url so the profile's print button can link here
function ReportPage() {
  const { animals, getAnimal } = useDashboard()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const selected = params.get('animal') ? getAnimal(params.get('animal')) : null

  const select = (id) => {
    setQuery('')
    setParams(id ? { animal: id } : {})
  }

  return (
    <div className="dashboard-page">
      <h2 className="shared-display dashboard-title">Reports</h2>

      <section className="reports-banner">
        <AnimalSearch
          dark
          value={query}
          onChange={(v) => {
            setQuery(v)
            if (selected) setParams({})
          }}
          placeholder="Search Animal by ID..."
        />

        {!selected && <p className="reports-banner-hint">Pick an animal from the list below to preview and print its report.</p>}

        {selected && (
          <div className="reports-banner-animal">
            <AnimalPhoto animal={selected} />
            <div>
              <AnimalIdentity animal={selected} />
              <Button variant="secondary" onClick={() => window.print()}>
                Print Report
              </Button>
            </div>
          </div>
        )}
      </section>

      {selected ? (
        <>
          <div className="dashboard-section-head">
            <h2 className="dashboard-heading">Report Preview</h2>
            <button type="button" className="dashboard-linkbtn dashboard-back-link" onClick={() => select(null)}>
              <ChevronLeftIcon size={18} /> Choose another animal
            </button>
          </div>
          <AnimalReport key={selected.id} animal={selected} />
        </>
      ) : (
        <div className="dashboard-split">
          <div className="dashboard-list-box">
            <AnimalList animals={filterAnimals(animals, query)} onSelect={select} />
          </div>
          <StatsPanel animals={animals} />
        </div>
      )}
    </div>
  )
}

function AnimalReport({ animal }) {
  const [notes, setNotes] = useState(animal.notes || '')

  // same test done more than once goes in one row
  const tests = Object.values(
    animal.tests.reduce((groups, t) => {
      ;(groups[t.name] ||= { name: t.name, entries: [] }).entries.push(t)
      return groups
    }, {}),
  )

  return (
    <article className="reports-document" aria-label={`Report for ${animal.id}`}>
      <header className="reports-doc-head">
        <img src={logo} alt="TCSA logo" className="reports-document-logo" />
        <div>
          <h1 className="shared-display reports-document-title">Animal Report</h1>
          <p className="reports-contact-heading">Contact {CONTACT.name}</p>
          <p className="reports-document-contact">
            <WhatsAppIcon size={20} /> {CONTACT.whatsappDisplay}
          </p>
          <p className="reports-document-contact">
            <GmailIcon size={20} /> {CONTACT.email}
          </p>
        </div>
      </header>

      <section className="reports-document-animal">
        <AnimalPhoto animal={animal} className="reports-photo-animal" />
        <div>
          <h2 className="shared-display reports-animal-id">{animal.id}</h2>
          <p className="reports-species">{animal.species}</p>
          <p>Enclosure: {animal.enclosure}</p>
          <p>Intake date: {formatDate(animal.intakeDate)}</p>
          <p>Initial condition: {animal.condition}</p>
        </div>
      </section>

      <section className="reports-document-section is-shaded">
        <h3>Medication history</h3>
        {animal.medications.length ? (
          <table className="reports-document-table">
            <thead>
              <tr>
                <th>Active Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Start date</th>
                <th>End date</th>
              </tr>
            </thead>
            <tbody>
              {animal.medications.map((m) => (
                <tr key={m.id}>
                  <th scope="row">{m.name}</th>
                  <td>{m.dosage ? `${sa(m.dosage)}ml` : '—'}</td>
                  <td>{m.frequency || '—'}</td>
                  <td>{formatDate(m.startDate)}</td>
                  <td>{formatDate(m.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No medication recorded.</p>
        )}
      </section>

      <section className="reports-document-section">
        <h3>Weight and shell measurements</h3>
        {animal.measurements.length ? (
          <table className="reports-document-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Shell length</th>
                <th>Shell width</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {[...animal.measurements]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{formatDate(m.date)}</th>
                    <td>{sa(m.weight)}kg</td>
                    <td>{m.length}mm</td>
                    <td>{m.width}mm</td>
                    <td>{m.note || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No measurements recorded.</p>
        )}
      </section>

      <section className="reports-document-section is-shaded">
        <h3>Diet and feeding</h3>
        <dl className="reports-document-details">
          <dt>Diet</dt>
          <dd>{animal.diet.current || '—'}</dd>
          <dt>Instructions</dt>
          <dd>{animal.diet.instructions || '—'}</dd>
          <dt>Frequency</dt>
          <dd>{animal.diet.frequency || '—'}</dd>
          <dt>Review date</dt>
          <dd>{formatDate(animal.diet.reviewDate)}</dd>
        </dl>
        {(animal.dietLog || []).length > 0 && (
          <table className="reports-document-table reports-diet-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Diet change</th>
              </tr>
            </thead>
            <tbody>
              {[...animal.dietLog]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((c) => (
                  <tr key={c.id}>
                    <th scope="row">{formatDate(c.date)}</th>
                    <td>{c.change}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="reports-document-section">
        <h3>Test History</h3>
        {tests.length ? (
          <table className="reports-document-table reports-test-table">
            <thead>
              <tr>
                <td />
                <th>Date</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((group) => (
                <tr key={group.name}>
                  <th scope="row">{group.name}</th>
                  <td>
                    {group.entries.map((t) => (
                      <div key={t.id}>{formatDate(t.date)}</div>
                    ))}
                  </td>
                  <td>
                    {group.entries.map((t) => (
                      <div key={t.id}>{t.result}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tests recorded.</p>
        )}
      </section>

      {animal.photos.length > 0 && (
        <section className="reports-document-section is-shaded">
          <h3>Photos</h3>
          <div className="reports-document-photos">
            {animal.photos.map((src, i) => (
              <img key={src} src={src} alt={`${animal.id} photo ${i + 1}`} />
            ))}
          </div>
        </section>
      )}

      <section className="reports-document-section">
        <h3>
          <label htmlFor="report-notes">Additional notes</label>
        </h3>
        <textarea
          id="report-notes"
          className="reports-document-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Type any extra notes for this report…"
        />
        {/* textarea gets cut off when printing so print this instead */}
        <div className="reports-printed-notes">{notes || '—'}</div>
      </section>
    </article>
  )
}

export default ReportPage
