import React from 'react'
import { Moon, Sun } from 'lucide-react'
import intitripLogo from '../../assets/intitrip-logo.svg'

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => (
  <header className="bg-brand-teal shadow-xl shadow-slate-950/20">
    <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <img src={intitripLogo} alt="INTITRIP" className="h-12 w-10 shrink-0 object-contain" />
        <div className="min-w-0">
          <h1 className="font-display font-black text-white text-xl md:text-2xl tracking-tight leading-none">INTITRIP</h1>
          <p className="text-brand-green text-xs font-medium mt-0.5 tracking-widest uppercase truncate">Formulario · Visa Americana</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className="group relative h-9 w-[72px] shrink-0 rounded-full border border-white/20 bg-slate-900/30 p-1 shadow-inner shadow-black/20 transition-all duration-500 hover:border-white/35 focus:outline-none focus:ring-2 focus:ring-brand-green/50 dark:bg-white/10"
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        aria-pressed={isDark}
        title={isDark ? 'Modo oscuro' : 'Modo claro'}
      >
        <span className="absolute inset-1 flex items-center justify-between px-1.5 text-white/70">
          <Moon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-12" />
          <Sun className="h-3.5 w-3.5 text-amber-200 transition-transform duration-500 group-hover:rotate-45" />
        </span>
        <span
          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-lg transition-all duration-500 ease-out ${
            isDark
              ? 'translate-x-0 bg-slate-800 text-cyan-100 shadow-cyan-950/40'
              : 'translate-x-[34px] bg-amber-300 text-amber-950 shadow-amber-900/30'
          }`}
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </span>
      </button>
    </div>
  </header>
)


