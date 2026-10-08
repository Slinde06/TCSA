import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import PageBackground from './components/PageBackground.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'

function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <>
      {!isLanding && <PageBackground />}
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
