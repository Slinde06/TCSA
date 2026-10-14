import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import DashboardLayout from './components/DashboardLayout.jsx'
import PageBackground from './components/PageBackground.jsx'
import { DashboardProvider } from './context/DashboardData.jsx'
import { SHOW_FORGOT_PASSWORD } from './data/site.js'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import TodayPage from './pages/TodayPage.jsx'
import AnimalPage from './pages/AnimalPage.jsx'
import AnimalProfilePage from './pages/AnimalProfilePage.jsx'
import AddAnimalPage from './pages/AddAnimalPage.jsx'
import ReportPage from './pages/ReportPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <>
      <ScrollToTop />
      {!isLanding && <PageBackground />}
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            {SHOW_FORGOT_PASSWORD && <Route path="/forgot-password" element={<ForgotPasswordPage />} />}

            <Route
              element={
                <DashboardProvider>
                  <DashboardLayout />
                </DashboardProvider>
              }
            >
              <Route path="/today" element={<TodayPage />} />
              <Route path="/animals" element={<AnimalPage />} />
              <Route path="/animals/new" element={<AddAnimalPage />} />
              <Route path="/animals/:id" element={<AnimalProfilePage />} />
              <Route path="/reports" element={<ReportPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
