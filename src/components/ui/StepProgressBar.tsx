import { Check } from 'lucide-react'
import { FORM_STEPS } from '@/constants'
import clsx from 'clsx'

interface StepProgressBarProps {
  currentStep: number
  onGoTo: (step: number) => void
}

export function StepProgressBar({ currentStep, onGoTo }: StepProgressBarProps) {
  return (
    <nav aria-label="Progreso del formulario" className="w-full">
      {/* Desktop */}
      <ol className="hidden md:flex items-center justify-between gap-1">
        {FORM_STEPS.map((step, idx) => {
          const done    = step.id < currentStep
          const active  = step.id === currentStep
          const isLast  = idx === FORM_STEPS.length - 1
          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => onGoTo(step.id)}
                disabled={step.id > currentStep}
                title={step.title}
                aria-current={active ? 'step' : undefined}
                className="flex flex-col items-center gap-1 group disabled:cursor-not-allowed"
              >
                <span
                  className={clsx(
                    'step-indicator',
                    done   && 'bg-brand-green text-white',
                    active && 'bg-brand-dark text-white ring-2 ring-brand-green ring-offset-2',
                    !done && !active && 'bg-gray-100 text-gray-400 group-hover:bg-brand-light'
                  )}
                >
                  {done ? <Check size={14} /> : step.id}
                </span>
                <span className={clsx(
                  'text-[10px] font-medium text-center leading-tight max-w-[64px]',
                  active ? 'text-brand-dark' : 'text-gray-400'
                )}>
                  {step.title}
                </span>
              </button>
              {!isLast && (
                <div className={clsx(
                  'flex-1 h-0.5 mx-1 rounded-full transition-colors',
                  done ? 'bg-brand-green' : 'bg-gray-200'
                )} />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Paso {currentStep} de {FORM_STEPS.length}</span>
          <span className="font-semibold text-brand-dark">
            {FORM_STEPS[currentStep - 1].title}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-green rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / FORM_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
