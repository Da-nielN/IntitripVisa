// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_relacion_contacto_eeuu.md

import type { OpcionCatalogo } from './tipos'

export const relacionContactoEEUU = [
  { valor: 'R', texto: 'Familiar' },
  { valor: 'S', texto: 'Cónyuge' },
  { valor: 'C', texto: 'Amigo/Amiga' },
  { valor: 'B', texto: 'Socio/Asociado de negocios' },
  { valor: 'P', texto: 'Empleador' },
  { valor: 'H', texto: 'Autoridad o funcionario de la institución educativa' },
  { valor: 'O', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
