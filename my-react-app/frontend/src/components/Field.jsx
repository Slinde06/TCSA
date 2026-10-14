import { useId } from 'react'

function Field({ label, as = 'input', options = [], className = '', suffix, required, ...props }) {
  const id = useId()
  let control

  if (as === 'select') {
    control = (
      <div className="shared-field-select">
        <select id={id} required={required} {...props}>
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value
            const text = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={value} value={value}>
                {text}
              </option>
            )
          })}
        </select>
      </div>
    )
  } else if (as === 'textarea') {
    control = <textarea id={id} rows={4} required={required} {...props} />
  } else if (suffix) {
    control = (
      <div className="shared-unit-field">
        <input id={id} required={required} {...props} />
        <span aria-hidden="true">{suffix}</span>
      </div>
    )
  } else {
    control = <input id={id} required={required} {...props} />
  }

  return (
    <div className={`shared-field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required && <span className="shared-field-required"> *</span>}
      </label>
      {control}
    </div>
  )
}

export default Field
