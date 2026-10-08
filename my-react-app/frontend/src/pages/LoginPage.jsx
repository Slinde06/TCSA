import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import { TortoiseIcon } from '../components/Icons.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (!form.get('username') || !form.get('password')) {
      setError('Please enter your username and password.')
      return
    }
    // TODO check login on server
    navigate('/today')
  }

  return (
    <AuthLayout title="Welcome!" subtitle="Log into the Owner’s Dashboard">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />

        <Link to="/forgot-password" className="login-forgot">
          Forgot password?
        </Link>

        <div className="login-submit">
          <TortoiseIcon size={46} className="login-tortoise" />
          {error && <p className="login-error" role="alert">{error}</p>}
          <Button type="submit" className="shared-button-pill">
            Continue to Owner dashboard
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
