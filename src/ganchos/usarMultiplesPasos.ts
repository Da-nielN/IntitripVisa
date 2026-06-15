import { useState } from 'react'

export function usarMultiplesPasos(totalPasos: number) {
  const [pasoActual, setPasoActual] = useState(0)

  const siguiente = () => setPasoActual((paso) => Math.min(paso + 1, totalPasos - 1))
  const anterior = () => setPasoActual((paso) => Math.max(paso - 1, 0))
  const irAlPaso = (paso: number) => setPasoActual(paso)

  return {
    pasoActual,
    esPrimero: pasoActual === 0,
    esUltimo: pasoActual === totalPasos - 1,
    siguiente,
    anterior,
    irAlPaso,
  }
}

