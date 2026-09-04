// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_relacion_acompanante.md

import type { OpcionCatalogo } from './tipos'

export const relacionAcompanante = [
  { valor: 'P', texto: 'Padre/Madre' },
  { valor: 'S', texto: 'Cónyuge' },
  { valor: 'C', texto: 'Hijo/Hija' },
  { valor: 'R', texto: 'Otro familiar' },
  { valor: 'F', texto: 'Amigo/Amiga' },
  { valor: 'B', texto: 'Socio/Asociado de negocios' },
  { valor: 'O', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
