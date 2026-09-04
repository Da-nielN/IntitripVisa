// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_estado_civil.md

import type { OpcionCatalogo } from './tipos'

export const estadoCivil = [
  { valor: 'M', texto: 'Casado/a' },
  { valor: 'C', texto: 'Unión de hecho' },
  { valor: 'P', texto: 'Unión civil / pareja de hecho' },
  { valor: 'S', texto: 'Soltero/a' },
  { valor: 'W', texto: 'Viudo/a' },
  { valor: 'D', texto: 'Divorciado/a' },
  { valor: 'L', texto: 'Separado/a legalmente' },
  { valor: 'O', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
