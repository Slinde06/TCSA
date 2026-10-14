import './Button.css'

function Button({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button type={type} className={`shared-button shared-button-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default Button
