// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_parentesco_familiar_eeuu.md

import type { OpcionCatalogo } from './tipos'

export const parentescoFamiliarEEUU = [
  { valor: 'S', texto: 'Cónyuge' },
  { valor: 'F', texto: 'Prometido/Prometida' },
  { valor: 'C', texto: 'Hijo/Hija' },
  { valor: 'B', texto: 'Hermano/Hermana' },
] as const satisfies readonly OpcionCatalogo[]
