import { Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './pages/LandingPage.jsx'

function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
