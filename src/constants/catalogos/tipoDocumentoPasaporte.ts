// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_tipo_documento_pasaporte.md

import type { OpcionCatalogo } from './tipos'

export const tipoDocumentoPasaporte = [
  { valor: 'R', texto: 'Regular (ordinario)' },
  { valor: 'O', texto: 'Oficial' },
  { valor: 'D', texto: 'Diplomático' },
  { valor: 'L', texto: 'Salvoconducto (laissez-passer)' },
  { valor: 'T', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
