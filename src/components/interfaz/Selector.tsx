import React from 'react'
import { cn } from '../../utils/cn'

interface Opcion { value: string; label: string }
interface PropsSelector extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Opcion[]
  error?: string
  required?: boolean
}

export const Selector = React.forwardRef<HTMLSelectElement, PropsSelector>(
  ({ label, options, error, required, className, id, ...props }, ref) => {
    const idEntrada = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        <label htmlFor={idEntrada} className="field-label">
          {label}
          {required && <span className="text-brand-brown ml-1">*</span>}
        </label>
        <select
          id={idEntrada}
          ref={ref}
          className={cn(
            'field-input appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-[right_12px_center] bg-no-repeat pr-10',
            error && 'border-red-400',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        >
          <option value="">Seleccionar...</option>
          {options.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
          ))}
        </select>
        {error && (
          <p className="field-error">
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
Selector.displayName = 'Selector'

