import React from 'react'

interface Opcion { value: string; label: string }

export const SI_NO: Opcion[] = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

interface PropsGrupoRadios {
  label: string
  name: string
  options: Opcion[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
}

export const GrupoRadios: React.FC<PropsGrupoRadios> = ({
  label, name, options, value, onChange, error, required,
}) => (
  <div className="w-full">
    <p className="field-label">
      {label}
      {required && <span className="text-brand-brown ml-1">*</span>}
    </p>
    <div className="flex flex-wrap gap-3 mt-1">
      {options.map((opcion) => (
        <label key={opcion.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium
          ${value === opcion.value
            ? 'border-brand-green bg-brand-green/10 text-brand-green dark:bg-brand-green/15 dark:text-emerald-300'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600'
          }`}>
          <input
            type="radio"
            name={name}
            value={opcion.value}
            checked={value === opcion.value}
            onChange={() => onChange?.(opcion.value)}
            className="sr-only"
            aria-label={opcion.label}
          />
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
            ${value === opcion.value ? 'border-brand-green' : 'border-slate-300 dark:border-slate-600'}`}>
            {value === opcion.value && <span className="w-2 h-2 rounded-full bg-brand-green" />}
          </span>
          {opcion.label}
        </label>
      ))}
    </div>
    {error && <p className="field-error mt-1">{error}</p>}
  </div>
)


