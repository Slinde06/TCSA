import { NavLink } from 'react-router-dom'
import './DashFooter.css'

const PAGES = [
  { to: '/today', label: 'Today' },
  { to: '/animals', label: 'Animals' },
  { to: '/reports', label: 'Reports' },
]

// footer links for the 3 dashboard pages
function DashFooter() {
  return (
    <footer className="dashboard-footer">
      <nav className="dashboard-footer-nav" aria-label="Dashboard pages">
        {PAGES.map((page) => (
          <NavLink key={page.to} to={page.to} className="dashboard-footer-link">
            {page.label}
          </NavLink>
        ))}
      </nav>
    </footer>
  )
}

export default DashFooter
