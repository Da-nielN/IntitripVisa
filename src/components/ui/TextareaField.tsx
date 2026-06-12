import React from 'react'
import { cn } from '../../utils/cn'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="field-label">
          {label}
          {required && <span className="text-brand-brown ml-1">*</span>}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          rows={3}
          className={cn('field-input resize-none', error && 'border-red-400', className)}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{hint}</p>}
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  }
)
TextareaField.displayName = 'TextareaField'
