import React from 'react'
import { cn } from '../../utils/cn'

interface PropsCampo extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

export const Campo = React.forwardRef<HTMLInputElement, PropsCampo>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const idEntrada = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return (
      <div className="w-full">
        <label htmlFor={idEntrada} className="field-label">
          {label}
          {required && <span className="text-brand-brown ml-1">*</span>}
        </label>
        <input
          id={idEntrada}
          ref={ref}
          className={cn('field-input', error && 'border-red-400 focus:ring-red-400/40 focus:border-red-400', className)}
          aria-invalid={!!error}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{hint}</p>}
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  }
)
Campo.displayName = 'Campo'

