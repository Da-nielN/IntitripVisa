// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_quien_paga.md

import type { OpcionCatalogo } from './tipos'

export const quienPaga = [
  { valor: 'S', texto: 'Yo mismo (el solicitante)' },
  { valor: 'O', texto: 'Otra persona' },
  { valor: 'P', texto: 'Empleador actual' },
  { valor: 'U', texto: 'Empleador en EE. UU.' },
  { valor: 'C', texto: 'Otra empresa u organización' },
] as const satisfies readonly OpcionCatalogo[]
