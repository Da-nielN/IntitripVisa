// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.
// Fuente: docs/catalogo_ocupacion_actual.md

import type { OpcionCatalogo } from './tipos'

export const ocupacionActual = [
  { valor: 'A', texto: 'Agricultura' },
  { valor: 'AP', texto: 'Artista/Intérprete' },
  { valor: 'B', texto: 'Negocios' },
  { valor: 'CM', texto: 'Comunicaciones' },
  { valor: 'CS', texto: 'Informática' },
  { valor: 'C', texto: 'Gastronomía/Servicios de alimentación' },
  { valor: 'ED', texto: 'Educación' },
  { valor: 'EN', texto: 'Ingeniería' },
  { valor: 'G', texto: 'Gobierno' },
  { valor: 'H', texto: 'Labores del hogar' },
  { valor: 'LP', texto: 'Profesión jurídica' },
  { valor: 'MH', texto: 'Medicina/Salud' },
  { valor: 'M', texto: 'Militar' },
  { valor: 'NS', texto: 'Ciencias naturales' },
  { valor: 'N', texto: 'Sin empleo' },
  { valor: 'PS', texto: 'Ciencias físicas' },
  { valor: 'RV', texto: 'Vocación religiosa' },
  { valor: 'R', texto: 'Investigación' },
  { valor: 'RT', texto: 'Jubilado/a' },
  { valor: 'SS', texto: 'Ciencias sociales' },
  { valor: 'S', texto: 'Estudiante' },
  { valor: 'O', texto: 'Otro' },
] as const satisfies readonly OpcionCatalogo[]
