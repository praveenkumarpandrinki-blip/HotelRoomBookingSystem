import React from 'react';

export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  min,
  max,
  rows,
  as = 'input',
  children,
  className = ''
}) {
  const inputId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-red-500" style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}

      <div className={Icon ? 'input-with-icon' : ''}>
        {Icon && <Icon className="input-icon w-4 h-4" />}

        {as === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows || 4}
            className={`form-control ${error ? 'has-error' : ''}`}
          />
        ) : as === 'select' ? (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`form-control ${error ? 'has-error' : ''}`}
          >
            {children}
          </select>
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            className={`form-control ${error ? 'has-error' : ''}`}
          />
        )}
      </div>

      {helperText && !error && (
        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
          {helperText}
        </small>
      )}

      {error && (
        <div className="form-error" role="alert">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
