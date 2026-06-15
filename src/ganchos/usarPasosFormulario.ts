import { useState, useCallback } from 'react'
import { FORM_STEPS } from '@/constants'

export function usarPasosFormulario() {
  const [pasoActual, setPasoActual] = useState(1)
  const totalPasos = FORM_STEPS.length

  const irSiguiente = useCallback(() => {
    setPasoActual((paso) => Math.min(paso + 1, totalPasos))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalPasos])

  const irAnterior = useCallback(() => {
    setPasoActual((paso) => Math.max(paso - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const irAlPaso = useCallback((paso: number) => {
    setPasoActual(Math.max(1, Math.min(paso, totalPasos)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalPasos])

  const esPrimero = pasoActual === 1
  const esUltimo = pasoActual === totalPasos

  return { pasoActual, totalPasos, irSiguiente, irAnterior, irAlPaso, esPrimero, esUltimo }
}

