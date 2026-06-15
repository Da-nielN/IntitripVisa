import React from 'react'
import { cn } from '../../utils/cn'

interface PropsAreaTexto extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export const AreaTexto = React.forwardRef<HTMLTextAreaElement, PropsAreaTexto>(
  ({ label, error, required, className, id, ...props }, ref) => {
    const idEntrada = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        <label htmlFor={idEntrada} className="field-label">
          {label}
          {required && <span className="text-brand-brown ml-1">*</span>}
        </label>
        <textarea
          id={idEntrada}
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
AreaTexto.displayName = 'AreaTexto'

