import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import DashFooter from './DashFooter.jsx'
import Button from './Button.jsx'
import { PlusIcon } from './Icons.jsx'
import { useDashboard } from '../context/dashboardContext.js'
import '../css/dashboard.css'

const PROFILE_PIC = null

function DashboardLayout() {
  const { pathname } = useLocation()
  const addingAnimal = pathname === '/animals/new'
  const { owner, status, saveError, clearSaveError, reload, logout } = useDashboard()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <Link to="/today" className="dashboard-title-header shared-display">
            TCSA <span className="dashboard-title-rest">Rehabilitation Dashboard</span>
          </Link>
          <div className="dashboard-user-area">
            <span className="dashboard-user">
              {PROFILE_PIC ? (
                <img className="dashboard-profile-pic" src={PROFILE_PIC} alt="" />
              ) : (
                <span className="dashboard-profile-pic" aria-hidden="true">
                  P
                </span>
              )}
              <span className="dashboard-username">{owner || 'Username'}</span>
            </span>
            <button type="button" className="dashboard-logout" onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        <div className="dashboard-nav-header">
          <nav className="dashboard-tabs" aria-label="Dashboard">
            <NavLink to="/today" className="dashboard-tab">
              Today
            </NavLink>
            <NavLink to="/animals" className="dashboard-tab">
              Animals
            </NavLink>
            <NavLink to="/reports" className="dashboard-tab">
              Reports
            </NavLink>
          </nav>

          {!addingAnimal && (
            <Link to="/animals/new" className="shared-button shared-button-primary dashboard-add-btn">
              <PlusIcon /> Add new animal
            </Link>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        {saveError && status === 'ready' && (
          <div className="dashboard-save-error" role="alert">
            <span>{saveError} Your last change may not have been saved.</span>
            <button type="button" onClick={clearSaveError}>
              OK
            </button>
          </div>
        )}

        {status === 'loading' && <p className="dashboard-status">Loading…</p>}

        {status === 'failed' && (
          <div className="dashboard-status">
            <p>{saveError || 'Could not load the dashboard.'}</p>
            <Button variant="secondary" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {status === 'ready' && <Outlet />}
      </main>

      <DashFooter />
    </div>
  )
}

export default DashboardLayout
