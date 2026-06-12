import React from 'react'
import { cn } from '../../utils/cn'

interface Option { value: string; label: string }
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string
  required?: boolean
  placeholder?: string
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, required, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="field-label">
          {label}
          {required && <span className="text-brand-brown ml-1">*</span>}
        </label>
        <select
          id={inputId}
          ref={ref}
          className={cn(
            'field-input appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-[right_12px_center] bg-no-repeat pr-10',
            error && 'border-red-400',
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  }
)
SelectField.displayName = 'SelectField'
