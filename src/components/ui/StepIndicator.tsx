import React from 'react'
import { Check } from 'lucide-react'

interface Step { label: string; icon: string }

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => (
  <div className="w-full overflow-x-auto pb-2">
    <div className="flex items-start min-w-max mx-auto px-4" style={{ gap: '0' }}>
      {steps.map((step, idx) => {
        const done = idx < currentStep
        const active = idx === currentStep
        return (
          <div key={idx} className="flex flex-col items-center" style={{ minWidth: '80px' }}>
            <div className="flex items-center w-full">
              {idx > 0 && (
                <div className={`h-0.5 flex-1 transition-all duration-500 ${done ? 'bg-brand-green' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-all duration-300
                ${done ? 'bg-brand-green border-brand-green text-white' : active ? 'bg-white border-brand-green text-brand-green dark:bg-slate-950 dark:text-emerald-300' : 'bg-white border-slate-200 text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500'}`}>
                {done ? <Check className="w-4 h-4" /> : <span>{step.icon}</span>}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 transition-all duration-500 ${done ? 'bg-brand-green' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
            <span className={`text-[10px] font-semibold mt-1.5 text-center leading-tight max-w-[72px]
              ${active ? 'text-brand-teal dark:text-emerald-300' : done ? 'text-brand-green' : 'text-slate-400 dark:text-slate-500'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  </div>
)
