import React from 'react'

interface Option { value: string; label: string }

export const YES_NO: Option[] = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

interface RadioGroupProps {
  label: string
  name: string
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label, name, options, value, onChange, error, required
}) => (
  <div className="w-full">
    <p className="field-label">
      {label}
      {required && <span className="text-brand-brown ml-1">*</span>}
    </p>
    <div className="flex flex-wrap gap-3 mt-1">
      {options.map((opt) => (
        <label key={opt.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium
          ${value === opt.value
            ? 'border-brand-green bg-brand-green/10 text-brand-green dark:bg-brand-green/15 dark:text-emerald-300'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600'
          }`}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            className="sr-only"
            aria-label={opt.label}
          />
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
            ${value === opt.value ? 'border-brand-green' : 'border-slate-300 dark:border-slate-600'}`}>
            {value === opt.value && <span className="w-2 h-2 rounded-full bg-brand-green" />}
          </span>
          {opt.label}
        </label>
      ))}
    </div>
    {error && <p className="field-error mt-1">{error}</p>}
  </div>
)
