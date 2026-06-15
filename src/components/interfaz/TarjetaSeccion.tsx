import React from 'react'

interface PropsTarjetaSeccion {
  title: string
  icon?: string
  children: React.ReactNode
}

export const TarjetaSeccion: React.FC<PropsTarjetaSeccion> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
    <h3 className="text-base font-display font-bold text-brand-teal flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800 dark:text-emerald-300">
      {icon && <span>{icon}</span>}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {children}
    </div>
  </div>
)

export const FilaCompleta: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="md:col-span-2">{children}</div>
)

