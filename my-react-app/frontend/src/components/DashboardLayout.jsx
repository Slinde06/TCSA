import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import DashFooter from './DashFooter.jsx'
import { PlusIcon } from './Icons.jsx'
import '../css/dashboard.css'

// TODO get name + pic from login
const USER = { name: 'Username', photo: null }

function DashboardLayout() {
  const { pathname } = useLocation()
  const addingAnimal = pathname === '/animals/new'

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <Link to="/today" className="dashboard-title-header shared-display">
            TCSA <span className="dashboard-title-rest">Rehabilitation Dashboard</span>
          </Link>
          <span className="dashboard-user">
            {USER.photo ? (
              <img className="dashboard-profile-pic" src={USER.photo} alt="" />
            ) : (
              <span className="dashboard-profile-pic" aria-hidden="true">
                P
              </span>
            )}
            <span className="dashboard-username">{USER.name}</span>
          </span>
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
        <Outlet />
      </main>

      <DashFooter />
    </div>
  )
}

export default DashboardLayout
