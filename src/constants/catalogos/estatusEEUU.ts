// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_estatus_eeuu.md

import type { OpcionCatalogo } from './tipos'

export const estatusEEUU = [
  { valor: 'S', texto: 'Ciudadano estadounidense' },
  { valor: 'C', texto: 'Residente permanente legal de EE. UU.' },
  { valor: 'P', texto: 'No inmigrante' },
  { valor: 'O', texto: 'Otro / No sé' },
] as const satisfies readonly OpcionCatalogo[]
