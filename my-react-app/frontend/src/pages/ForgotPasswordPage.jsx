import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import { TortoiseIcon } from '../components/Icons.jsx'

function ForgotPasswordPage() {
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (!form.get('username') || !form.get('password')) {
      setError('Please enter your username and a new password.')
      return
    }
    setError('')
    setDone(true)
  }

  return (
    <AuthLayout title="Forgot Password?" subtitle="Reset Password">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />

        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required />

        <div className="login-submit">
          <TortoiseIcon size={46} className="login-tortoise" />
          {error && <p className="login-error" role="alert">{error}</p>}
          <Button type="submit" className="shared-button-pill">
            Reset Password
          </Button>
        </div>

        {done && (
          <p className="login-success" role="status">
            Your password has been reset. <Link to="/login">Back to log in</Link>
          </p>
        )}

        <p className="login-note">
          Remembered it? <Link to="/login">Back to log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
