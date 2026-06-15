import React from 'react'
import { Check } from 'lucide-react'

interface Paso { label: string; icon: string }

interface PropsIndicadorPasos {
  pasos: Paso[]
  pasoActual: number
}

export const IndicadorPasos: React.FC<PropsIndicadorPasos> = ({ pasos, pasoActual }) => (
  <div className="w-full overflow-x-auto pb-2">
    <div className="flex items-start min-w-max mx-auto px-4" style={{ gap: '0' }}>
      {pasos.map((paso, indice) => {
        const completado = indice < pasoActual
        const activo = indice === pasoActual
        return (
          <div key={indice} className="flex flex-col items-center" style={{ minWidth: '80px' }}>
            <div className="flex items-center w-full">
              {indice > 0 && (
                <div className={`h-0.5 flex-1 transition-all duration-500 ${completado ? 'bg-brand-green' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-all duration-300
                ${completado ? 'bg-brand-green border-brand-green text-white' : activo ? 'bg-white border-brand-green text-brand-green dark:bg-slate-950 dark:text-emerald-300' : 'bg-white border-slate-200 text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500'}`}>
                {completado ? <Check className="w-4 h-4" /> : <span>{paso.icon}</span>}
              </div>
              {indice < pasos.length - 1 && (
                <div className={`h-0.5 flex-1 transition-all duration-500 ${completado ? 'bg-brand-green' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
            <span className={`text-[10px] font-semibold mt-1.5 text-center leading-tight max-w-[72px]
              ${activo ? 'text-brand-teal dark:text-emerald-300' : completado ? 'text-brand-green' : 'text-slate-400 dark:text-slate-500'}`}>
              {paso.label}
            </span>
          </div>
        )
      })}
    </div>
  </div>
)

