import React from 'react'
import { cn } from '../../utils/cn'

interface PropsCampoAreaTexto extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

export const CampoAreaTexto = React.forwardRef<HTMLTextAreaElement, PropsCampoAreaTexto>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const idEntrada = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
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
        {hint && !error && <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{hint}</p>}
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  }
)
CampoAreaTexto.displayName = 'CampoAreaTexto'

