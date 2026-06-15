import { Check } from 'lucide-react'
import { FORM_STEPS } from '@/constants'
import clsx from 'clsx'

interface PropsBarraProgresoPasos {
  pasoActual: number
  alIrAlPaso: (paso: number) => void
}

export function BarraProgresoPasos({ pasoActual, alIrAlPaso }: PropsBarraProgresoPasos) {
  return (
    <nav aria-label="Progreso del formulario" className="w-full">
      <ol className="hidden md:flex items-center justify-between gap-1">
        {FORM_STEPS.map((paso, indice) => {
          const completado = paso.id < pasoActual
          const activo = paso.id === pasoActual
          const esUltimo = indice === FORM_STEPS.length - 1
          return (
            <li key={paso.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => alIrAlPaso(paso.id)}
                disabled={paso.id > pasoActual}
                title={paso.title}
                aria-current={activo ? 'step' : undefined}
                className="flex flex-col items-center gap-1 group disabled:cursor-not-allowed"
              >
                <span
                  className={clsx(
                    'step-indicator',
                    completado && 'bg-brand-green text-white',
                    activo && 'bg-brand-dark text-white ring-2 ring-brand-green ring-offset-2',
                    !completado && !activo && 'bg-gray-100 text-gray-400 group-hover:bg-brand-light',
                  )}
                >
                  {completado ? <Check size={14} /> : paso.id}
                </span>
                <span className={clsx(
                  'text-[10px] font-medium text-center leading-tight max-w-[64px]',
                  activo ? 'text-brand-dark' : 'text-gray-400',
                )}>
                  {paso.title}
                </span>
              </button>
              {!esUltimo && (
                <div className={clsx(
                  'flex-1 h-0.5 mx-1 rounded-full transition-colors',
                  completado ? 'bg-brand-green' : 'bg-gray-200',
                )} />
              )}
            </li>
          )
        })}
      </ol>

      <div className="md:hidden flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Paso {pasoActual} de {FORM_STEPS.length}</span>
          <span className="font-semibold text-brand-dark">
            {FORM_STEPS[pasoActual - 1].title}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-green rounded-full transition-all duration-500"
            style={{ width: `${(pasoActual / FORM_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  )
}

