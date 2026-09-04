// Genera src/constants/catalogos/*.ts a partir de docs/catalogo_*.md
//
// Herramienta de desarrollo: no forma parte de la aplicacion ni se empaqueta.
// Se corre a mano cuando se vuelca o corrige un catalogo:
//
//   node scripts/generarCatalogos.mjs
//
// La fuente de verdad son los .md de docs/. Los .ts generados se comitean para
// que la app no dependa de este script en tiempo de build.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const directorioDocumentos = join(raiz, 'docs')
const directorioSalida = join(raiz, 'src', 'constants', 'catalogos')

// El catalogo anidado depende del padre (ddlPurposeOfTrip -> ddlOtherPurpose):
// se emite como un mapa valorPadre -> opciones, no como una lista plana.
const CATALOGO_ANIDADO = 'catalogo_proposito_viaje_especifico.md'

// Las lineas cuya primera columna esta vacia son el placeholder del select
// ("- Select One -"). El <select> de la web pone el suyo, asi que se descartan.
const esPlaceholder = (linea) => linea.split('|')[0].trim() === ''

/** Nombre del archivo .md -> nombre de la constante exportada. */
function nombreConstante(archivo) {
  return archivo
    .replace(/^catalogo_/, '')
    .replace(/\.md$/, '')
    .replace(/_([a-z])/g, (_, letra) => letra.toUpperCase())
    .replace(/Eeuu/g, 'EEUU')
}

/** Bloques ``` de un documento, ya partidos en lineas no vacias. */
function extraerBloques(contenido) {
  return [...contenido.matchAll(/```\n([\s\S]*?)```/g)].map((coincidencia) =>
    coincidencia[1].trim().split('\n').filter(Boolean)
  )
}

/** `value|texto en ingles|traduccion` -> { valor, texto }. */
function interpretarLinea(linea, archivo) {
  const columnas = linea.split('|')
  if (columnas.length !== 3) {
    throw new Error(`${archivo}: se esperaban 3 columnas y hay ${columnas.length}: "${linea}"`)
  }

  const valor = columnas[0].trim()
  const texto = columnas[2].trim()
  if (!texto) throw new Error(`${archivo}: falta la traduccion al espanol en "${linea}"`)

  return { valor, texto }
}

/**
 * Compara la cantidad de opciones que el encabezado declara ("217 opciones")
 * contra las que realmente hay en los bloques. Los .md se transcriben a mano
 * desde el DS-160, asi que una linea perdida es un error plausible y silencioso.
 */
function verificarConteo(archivo, contenido, opcionesConPlaceholder) {
  const declarado = contenido.match(/(\d+)\s+opciones/)
  if (!declarado) return null

  const esperado = Number(declarado[1])
  if (esperado !== opcionesConPlaceholder) {
    throw new Error(
      `${archivo}: el encabezado declara ${esperado} opciones y se leyeron ${opcionesConPlaceholder}`
    )
  }
  return esperado
}

function encabezado(archivo) {
  return [
    '// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.',
    `// Fuente: docs/${archivo}`,
    '',
    "import type { OpcionCatalogo } from './tipos'",
    '',
  ].join('\n')
}

const citar = (texto) => JSON.stringify(texto)

const serializar = (opcion) => `  { valor: ${citar(opcion.valor)}, texto: ${citar(opcion.texto)} },`

/**
 * Deja el codigo generado con el formato del repo (.prettierrc), para que
 * `npm run format` no lo reescriba y regenerar produzca siempre lo mismo.
 */
async function formatear(codigo, rutaArchivo) {
  const configuracion = await prettier.resolveConfig(rutaArchivo)
  return prettier.format(codigo, { ...configuracion, filepath: rutaArchivo })
}

function generarPlano(archivo, contenido) {
  const lineas = extraerBloques(contenido).flat()
  verificarConteo(archivo, contenido, lineas.length)

  const opciones = lineas
    .filter((linea) => !esPlaceholder(linea))
    .map((linea) => interpretarLinea(linea, archivo))

  const constante = nombreConstante(archivo)
  const cuerpo = [
    encabezado(archivo),
    `export const ${constante} = [`,
    ...opciones.map(serializar),
    '] as const satisfies readonly OpcionCatalogo[]',
    '',
  ].join('\n')

  return { constante, cuerpo, cantidad: opciones.length }
}

function generarAnidado(archivo, contenido) {
  // Cada padre es un "## <valor> — <texto>" seguido de su bloque de hijos.
  const titulos = [...contenido.matchAll(/^## (.+)$/gm)].map((m) => m[1])
  const bloques = extraerBloques(contenido)

  if (titulos.length < bloques.length) {
    throw new Error(`${archivo}: hay ${bloques.length} bloques y solo ${titulos.length} titulos`)
  }

  const grupos = bloques.map((bloque, indice) => {
    const valorPadre = titulos[indice].split('—')[0].trim()
    if (!valorPadre) throw new Error(`${archivo}: no se pudo leer el valor padre de "${titulos[indice]}"`)

    const hijos = bloque
      .filter((linea) => !esPlaceholder(linea))
      .map((linea) => interpretarLinea(linea, archivo))

    return { valorPadre, hijos }
  })

  const constante = nombreConstante(archivo)
  const cuerpo = [
    encabezado(archivo),
    '// Mapa valor de propositoViaje -> opciones de proposito especifico.',
    '// El DS-160 recarga el select hijo cuando cambia el padre; aca es un lookup.',
    `export const ${constante}: Record<string, OpcionCatalogo[]> = {`,
    ...grupos.flatMap(({ valorPadre, hijos }) => [
      `  ${citar(valorPadre)}: [`,
      ...hijos.map((opcion) => '  ' + serializar(opcion)),
      '  ],',
    ]),
    '}',
    '',
  ].join('\n')

  return { constante, cuerpo, cantidad: grupos.reduce((total, g) => total + g.hijos.length, 0) }
}

async function escribir(nombreArchivo, codigo) {
  const ruta = join(directorioSalida, nombreArchivo)
  writeFileSync(ruta, await formatear(codigo, ruta), 'utf8')
}

async function generar() {
  const archivos = readdirSync(directorioDocumentos)
    .filter((archivo) => archivo.startsWith('catalogo_') && archivo.endsWith('.md'))
    .sort()

  mkdirSync(directorioSalida, { recursive: true })

  const generados = []
  for (const archivo of archivos) {
    const contenido = readFileSync(join(directorioDocumentos, archivo), 'utf8')
    const resultado =
      archivo === CATALOGO_ANIDADO
        ? generarAnidado(archivo, contenido)
        : generarPlano(archivo, contenido)

    await escribir(`${resultado.constante}.ts`, resultado.cuerpo)
    console.log(`  ${resultado.constante.padEnd(28)} ${String(resultado.cantidad).padStart(4)} opciones`)
    generados.push(resultado.constante)
  }

  const indice = [
    '// Archivo generado por scripts/generarCatalogos.mjs — no editar a mano.',
    '',
    "export type { OpcionCatalogo } from './tipos'",
    "export { valoresDe } from './tipos'",
    ...generados.map((constante) => `export { ${constante} } from './${constante}'`),
    '',
  ].join('\n')

  await escribir('index.ts', indice)
  console.log(`\n${generados.length} catalogos escritos en src/constants/catalogos/`)
}

await generar()
