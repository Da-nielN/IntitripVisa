import React from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
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
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
