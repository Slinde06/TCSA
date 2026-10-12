import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import DashboardLayout from './components/DashboardLayout.jsx'
import PageBackground from './components/PageBackground.jsx'
import { DashboardProvider } from './context/DashboardData.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import TodayPage from './pages/TodayPage.jsx'
import AnimalPage from './pages/AnimalPage.jsx'
import AnimalProfilePage from './pages/AnimalProfilePage.jsx'

function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <DashboardProvider>
      {!isLanding && <PageBackground />}
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* dashboard */}
            <Route element={<DashboardLayout />}>
              <Route path="/today" element={<TodayPage />} />
              <Route path="/animals" element={<AnimalPage />} />
              <Route path="/animals/:id" element={<AnimalProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </DashboardProvider>
  )
}

export default App
