import shellPattern from '../assets/shell-pattern.png'
import '../css/auth.css'

// used by login and forgot password
function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-left-side">
          <h1 className="shared-display login-title">{title}</h1>
          <p className="login-subtitle">{subtitle}</p>
          {children}
        </div>
        <div className="login-shell-art" style={{ backgroundImage: `url(${shellPattern})` }} aria-hidden="true" />
      </div>
    </section>
  )
}

export default AuthLayout
