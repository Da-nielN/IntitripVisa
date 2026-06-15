import React from 'react'
import { cn } from '../../utils/cn'

interface PropsEntrada extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

export const Entrada = React.forwardRef<HTMLInputElement, PropsEntrada>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const idEntrada = id ?? label.toLowerCase().replace(/\s+/g, '-')
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
          aria-describedby={error ? `${idEntrada}-error` : undefined}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{hint}</p>}
        {error && (
          <p id={`${idEntrada}-error`} className="field-error">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Entrada.displayName = 'Entrada'

