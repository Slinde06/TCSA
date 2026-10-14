import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import { TortoiseIcon } from '../components/Icons.jsx'
import { SHOW_FORGOT_PASSWORD } from '../data/site.js'
import { api } from '../data/api.js'

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = form.get('username').trim()
    const password = form.get('password')
    if (!username || !password) {
      setError('Please enter your username and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await api('/login', { method: 'POST', body: { username, password } })
      navigate('/today')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Welcome!" subtitle="Log into the Owner’s Dashboard">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />

        {SHOW_FORGOT_PASSWORD && (
          <Link to="/forgot-password" className="login-forgot">
            Forgot password?
          </Link>
        )}

        <div className="login-submit">
          <TortoiseIcon size={46} className="login-tortoise" />
          {error && <p className="login-error" role="alert">{error}</p>}
          <Button type="submit" className="shared-button-pill" disabled={busy}>
            {busy ? 'Checking…' : 'Continue to Owner dashboard'}
          </Button>
        </div>

        <p className="login-note">
          *This dashboard is exclusively for the owner of TCSA.
          <br />
          If you are not the owner, please return to <Link to="/">home page</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
