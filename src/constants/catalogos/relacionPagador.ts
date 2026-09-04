// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_relacion_pagador.md

import type { OpcionCatalogo } from './tipos'

export const relacionPagador = [
  { valor: 'C', texto: 'Hijo/Hija' },
  { valor: 'P', texto: 'Padre/Madre' },
  { valor: 'S', texto: 'Cónyuge' },
  { valor: 'R', texto: 'Otro familiar' },
  { valor: 'F', texto: 'Amigo/Amiga' },
  { valor: 'O', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
