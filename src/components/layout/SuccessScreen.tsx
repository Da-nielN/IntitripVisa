import React from 'react'
import { CheckCircle, ExternalLink } from 'lucide-react'

interface Props {
  pdfUrl?: string
  onReset: () => void
}

export const SuccessScreen: React.FC<Props> = ({ pdfUrl, onReset }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-slide-up">
    <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
      <CheckCircle className="w-10 h-10 text-brand-green" />
    </div>
    <h2 className="font-display font-bold text-2xl text-brand-teal mb-3 dark:text-emerald-300">¡Formulario enviado!</h2>
    <p className="text-slate-500 max-w-md mb-8 dark:text-slate-400">
      Su información fue recibida exitosamente. Nuestro equipo generó su documento y lo guardó en Google Drive.
      Nos pondremos en contacto pronto.
    </p>
    <div className="flex flex-wrap gap-3 justify-center">
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <ExternalLink className="w-4 h-4" /> Ver PDF generado
        </a>
      )}
      <button onClick={onReset} className="btn-secondary">Nuevo formulario</button>
    </div>
    <div className="mt-12 flex items-center gap-2">
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" fill="#349A5E" />
        <circle cx="16" cy="12" r="6" fill="#2a7a4b" />
        <ellipse cx="16" cy="13" rx="4" ry="5" fill="#f5e6d0" />
        <circle cx="14" cy="11" r="0.8" fill="#2c1810" />
        <circle cx="18" cy="11" r="0.8" fill="#2c1810" />
        <ellipse cx="16" cy="14" rx="1.3" ry="0.8" fill="#c49a6c" />
      </svg>
      <span className="text-xs text-slate-400 font-medium dark:text-slate-500">IntiTrip · Agencia de Viajes</span>
    </div>
  </div>
)
