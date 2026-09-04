// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_unidad_duracion.md

import type { OpcionCatalogo } from './tipos'

export const unidadDuracion = [
  { valor: 'Y', texto: 'Año(s)' },
  { valor: 'M', texto: 'Mes(es)' },
  { valor: 'W', texto: 'Semana(s)' },
  { valor: 'D', texto: 'Día(s)' },
  { valor: 'H', texto: 'Menos de 24 horas' },
] as const satisfies readonly OpcionCatalogo[]
