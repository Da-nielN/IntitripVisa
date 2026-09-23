// Verifica la ruta JSON de punta a punta, sin desplegar nada:
//
//   1. arma un payload de ejemplo con la misma forma que manda el navegador,
//   2. lo pasa por las funciones reales de apps-script/Code.gs,
//   3. contrasta cada clave emitida contra docs/mapeo_ds160.json,
//   4. revisa que se cumplan las reglas de formato del plan v5, seccion 4.
//
// Uso: npm run verificar:json

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const leer = (relativo) => fs.readFileSync(path.join(raiz, relativo), 'utf8')

// --- 1. cargar Code.gs en un sandbox, sin las APIs de Drive ---------------

const fuente = leer('apps-script/Code.gs')
const sandbox = new Function(
  `${fuente}
  return {
    construirDatosDs160: construirDatosDs160,
    construirNombreArchivoJson: construirNombreArchivoJson,
    CLAVES_CAMPOS: CLAVES_CAMPOS,
    CLAVES_DISPARADORAS: CLAVES_DISPARADORAS,
    REPETIDORES_DE_FILA: REPETIDORES_DE_FILA,
    REPETIDORES_SIMPLES: REPETIDORES_SIMPLES,
    CANTIDAD_MAXIMA_REPETIBLES: CANTIDAD_MAXIMA_REPETIBLES,
  }`,
)()

// --- 2. payload de ejemplo, con la forma que produce construirPayloadDs160 -

const seleccion = (texto, valor) => ({ texto, valor })

const payload = {}
sandbox.CLAVES_CAMPOS.forEach((clave) => {
  payload[clave] = clave.startsWith('fecha') ? '2020-03-05' : `texto ${clave}`
})

Object.assign(payload, {
  primerNombre: 'José',
  primerApellido: 'Muñoz',
  cedula: '1722520284',
  fechaNacimiento: '1990-05-14',
  nacionalidad: seleccion('Ecuador', 'ECUA'),
  sexo: seleccion('Masculino', 'M'),
  tipoVisa: seleccion('Negocios o turismo (visitante temporal) (B1/B2)', 'B1-B2'),
  descripcionTrabajoActual: 'Diseño de señalética en Ñuñoa',
  tieneOtraNacionalidad: 'si',
  visaNegada: 'no',
  // vacios de distinta forma: ninguno debe aparecer en la salida
  numeroVisa: '',
  detallesVisaNegada: '   ',
  otraNacionalidad: undefined,
  razonPeticionInmigracion: null,
  estadoHospedajeEEUU: seleccion('Florida', ''),
  // esta no se emite nunca
  tieneIdentificacionFiscalEEUU: 'si',
  acompanantesViaje: [
    { apellidos: 'Peña', nombres: 'Ana', relacion: seleccion('Cónyuge', 'S') },
    { apellidos: '', nombres: '', relacion: '' },
  ],
  visitasAnterioresEEUU: [
    { fechaLlegada: '2023-01-10', valorDuracion: '15', unidadDuracion: seleccion('Días', 'D') },
  ],
  familiaresInmediatosDetalle: [
    {
      apellidos: 'Muñoz',
      nombres: 'Luis',
      relacion: seleccion('Hermano/Hermana', 'S'),
      estatus: seleccion('Ciudadano estadounidense', 'U'),
    },
  ],
})

const salida = sandbox.construirDatosDs160(payload)
const nombreArchivo = sandbox.construirNombreArchivoJson(payload)

// --- 3. contrastar contra el mapeo ---------------------------------------

const mapeo = JSON.parse(leer('docs/mapeo_ds160.json'))
const variablesDelMapeo = new Set()
mapeo.pantallas.forEach((pantalla) =>
  (pantalla.campos || []).forEach((campo) => {
    if (campo.variable) variablesDelMapeo.add(campo.variable)
    ;(campo.variables || []).forEach((variable) => variablesDelMapeo.add(variable))
  }),
)
mapeo.pantallas.forEach((pantalla) =>
  (pantalla.pendientes || []).forEach((pendiente) => variablesDelMapeo.add(pendiente.variable)),
)

const fallas = []
const anotar = (mensaje) => fallas.push(mensaje)

const sinDeclarar = Object.keys(salida).filter((clave) => !variablesDelMapeo.has(clave))
if (sinDeclarar.length) {
  anotar(`claves emitidas que no existen en mapeo_ds160.json: ${sinDeclarar.join(', ')}`)
}

// --- 4. reglas de formato del plan ---------------------------------------

const ES_FECHA = /^\d{4}-\d{2}-\d{2}$/
const TIENE_TILDE = /[À-ſ]/

const esDisparadora = new Set(sandbox.CLAVES_DISPARADORAS)

for (const [clave, valor] of Object.entries(salida)) {
  if (valor === '' || valor === null || valor === undefined) {
    // Una disparadora vacia se emite a proposito (ver garantizarDisparadoras),
    // pero sigue siendo sintoma de que el formulario no capturo la respuesta.
    if (!esDisparadora.has(clave)) anotar(`${clave}: se emitio vacio, deberia omitirse`)
    continue
  }

  if (typeof valor === 'object') {
    if (!valor.valor) anotar(`${clave}: select sin "valor"`)
    if (!('texto' in valor)) anotar(`${clave}: select sin "texto"`)
    if (Object.keys(valor).length !== 2) {
      anotar(`${clave}: el select deberia tener solo texto y valor`)
    }
    continue
  }

  if (typeof valor !== 'string') {
    anotar(`${clave}: tipo inesperado ${typeof valor}`)
    continue
  }

  if (valor === 'si' || valor === 'no') anotar(`${clave}: radio sin traducir a Y/N`)
  if (TIENE_TILDE.test(valor)) anotar(`${clave}: texto libre con tildes sin normalizar (${valor})`)
  if (clave.startsWith('fecha') && !ES_FECHA.test(valor)) {
    anotar(`${clave}: fecha fuera del formato AAAA-MM-DD (${valor})`)
  }
}

// comprobaciones puntuales de la conversion
const esperado = [
  ['tieneOtraNacionalidad', 'Y'],
  ['visaNegada', 'N'],
  ['descripcionTrabajoActual', 'Diseno de senaletica en Nunoa'],
  ['primerApellido', 'Munoz'],
  ['acompananteViaje1Apellidos', 'Pena'],
]
esperado.forEach(([clave, valorEsperado]) => {
  if (salida[clave] !== valorEsperado) {
    anotar(`${clave}: se esperaba ${JSON.stringify(valorEsperado)} y llego ${JSON.stringify(salida[clave])}`)
  }
})

// el valor de un select nunca se normaliza
if (salida.nacionalidad.valor !== 'ECUA') anotar('nacionalidad: el valor del select se altero')
if (salida.tipoVisa.valor !== 'B1-B2') anotar('tipoVisa: el valor del select se altero')

const omitidasEsperadas = [
  'numeroVisa',
  'detallesVisaNegada',
  'otraNacionalidad',
  'razonPeticionInmigracion',
  'estadoHospedajeEEUU',
  'tieneIdentificacionFiscalEEUU',
  'acompananteViaje2Apellidos',
  'acompananteViaje3Apellidos',
  'familiarInmediato2Nombres',
]
omitidasEsperadas.forEach((clave) => {
  if (clave in salida) anotar(`${clave}: deberia haberse omitido y se emitio`)
})

if (nombreArchivo !== 'Jose_Munoz_1722520284.json') {
  anotar(`nombre de archivo inesperado: ${nombreArchivo}`)
}

// --- 4.bis. las 24 disparadoras del mapeo v2.6 salen siempre --------------

// La lista de Code.gs tiene que ser exactamente el conjunto de variables que el
// mapeo usa en "condicion": si el mapeo agrega una rama nueva, esto falla.
const disparadorasDelMapeo = new Set()
mapeo.pantallas.forEach((pantalla) =>
  (pantalla.campos || []).forEach((campo) => {
    if (campo.condicion) disparadorasDelMapeo.add(campo.condicion.variable)
  }),
)

const declaradas = new Set(sandbox.CLAVES_DISPARADORAS)
const sinDeclarar2 = [...disparadorasDelMapeo].filter((v) => !declaradas.has(v))
const deMas = [...declaradas].filter((v) => !disparadorasDelMapeo.has(v))
if (sinDeclarar2.length) {
  anotar(`el mapeo condiciona campos con variables que Code.gs no emite siempre: ${sinDeclarar2.join(', ')}`)
}
if (deMas.length) {
  anotar(`CLAVES_DISPARADORAS declara variables que el mapeo ya no condiciona: ${deMas.join(', ')}`)
}

// El caso que rompia el llenado: un cliente que contesta "no" a todo y ademas
// deja disparadoras sin valor. Ninguna de las 24 puede faltar en la salida.
const payloadMinimo = {}
sandbox.CLAVES_DISPARADORAS.forEach((clave) => {
  payloadMinimo[clave] = 'no'
})
Object.assign(payloadMinimo, {
  pagadorViaje: seleccion('Yo mismo', 'S'),
  categoriaOcupacionActual: seleccion('Jubilado', 'RT'),
  // sin contestar, de las cuatro formas en que la web puede dejarlas vacias
  haVisitadoEEUU: '',
  visaNegada: undefined,
  tienePeticionInmigracion: null,
  tuvoCorreosAnteriores: '   ',
})

const salidaMinima = sandbox.construirDatosDs160(payloadMinimo)
const disparadorasFaltantes = sandbox.CLAVES_DISPARADORAS.filter((clave) => !(clave in salidaMinima))
if (disparadorasFaltantes.length) {
  anotar(`cliente minimo: disparadoras omitidas del JSON: ${disparadorasFaltantes.join(', ')}`)
}

// El formato no cambia: los radio siguen siendo string plano y los select objeto.
sandbox.CLAVES_DISPARADORAS.forEach((clave) => {
  const valor = salidaMinima[clave]
  const esSelect = ['pagadorViaje', 'categoriaOcupacionActual'].includes(clave)
  if (esSelect && typeof valor !== 'object') {
    anotar(`${clave}: es select y salio como ${typeof valor}`)
  }
  if (!esSelect && typeof valor !== 'string') {
    anotar(`${clave}: es radio y salio como ${typeof valor}`)
  }
})

if (salidaMinima.tieneHistorialViajes !== 'N') {
  anotar(`cliente minimo: el "no" no viajo como "N" (llego ${JSON.stringify(salidaMinima.tieneHistorialViajes)})`)
}

console.log(`disparadoras: ${declaradas.size} declaradas, ${disparadorasDelMapeo.size} en el mapeo, ${sandbox.CLAVES_DISPARADORAS.length - disparadorasFaltantes.length} emitidas en el cliente minimo`)

// --- 4.ter. los repetidores salen compactados a 1..N ----------------------

// Illari agrega filas hasta el numero mas alto con dato: un hueco intermedio
// deja una fila vacia en el DS-160. Este payload trae huecos en los seis.
const salidaConHuecos = sandbox.construirDatosDs160({
  idioma1: 'Espanol', idioma2: '', idioma3: 'Ingles', idioma4: '   ', idioma5: 'Frances',
  lugarPlaneadoEEUU1: '', lugarPlaneadoEEUU2: 'Miami', lugarPlaneadoEEUU3: '', lugarPlaneadoEEUU4: 'Orlando',
  paisVisitado1: null, paisVisitado5: seleccion('Peru', 'PERU'),
  acompanantesViaje: [
    { apellidos: '', nombres: '', relacion: '' },
    { apellidos: 'Peña', nombres: 'Luis', relacion: seleccion('Amigo', 'F') },
    { apellidos: '', nombres: '', relacion: '' },
    { apellidos: 'Ortiz', nombres: 'Sara', relacion: seleccion('Conyuge', 'S') },
  ],
  visitasAnterioresEEUU: [
    {},
    {},
    { fechaLlegada: '2023-01-10', valorDuracion: '15', unidadDuracion: seleccion('Dias', 'D') },
  ],
  // fila parcial: cuenta como fila y se renumera entera, aunque solo traiga un campo
  familiaresInmediatosDetalle: [{}, { nombres: 'Ana', apellidos: '', relacion: '', estatus: '' }],
})

const compactadoEsperado = {
  idioma: ['idioma1', 'idioma2', 'idioma3'],
  lugarPlaneadoEEUU: ['lugarPlaneadoEEUU1', 'lugarPlaneadoEEUU2'],
  paisVisitado: ['paisVisitado1'],
  acompananteViaje: [
    'acompananteViaje1Apellidos', 'acompananteViaje1Nombres', 'acompananteViaje1Relacion',
    'acompananteViaje2Apellidos', 'acompananteViaje2Nombres', 'acompananteViaje2Relacion',
  ],
  visitaAnteriorEEUU: [
    'visitaAnteriorEEUU1FechaLlegada', 'visitaAnteriorEEUU1ValorDuracion', 'visitaAnteriorEEUU1UnidadDuracion',
  ],
  familiarInmediato: ['familiarInmediato1Nombres'],
}

for (const [prefijo, esperadas] of Object.entries(compactadoEsperado)) {
  const emitidas = Object.keys(salidaConHuecos).filter((clave) => clave.startsWith(prefijo))
  if (emitidas.join(',') !== esperadas.join(',')) {
    anotar(`${prefijo}: sin compactar. esperado [${esperadas}] y llego [${emitidas}]`)
  }
}

// El techo de 5 lo pone el mapeo: una sexta fila no puede colarse.
const salidaDesbordada = sandbox.construirDatosDs160({
  visitasAnterioresEEUU: Array.from({ length: 8 }, (_, i) => ({ fechaLlegada: `2020-01-0${(i % 9) + 1}` })),
})
const visitasEmitidas = Object.keys(salidaDesbordada).filter((c) => c.endsWith('FechaLlegada')).length
if (visitasEmitidas !== sandbox.CANTIDAD_MAXIMA_REPETIBLES) {
  anotar(`el repetidor desbordo el techo de ${sandbox.CANTIDAD_MAXIMA_REPETIBLES}: emitio ${visitasEmitidas} filas`)
}

// --- 4.quater. los tres fixtures del mapeo -------------------------------

// Los fixtures son la salida esperada; el navegador manda otra forma. Se
// convierten de vuelta a entrada: "Y"/"N" -> "si"/"no" y los slots numerados de
// los repetidores de fila -> el arreglo que arma la web.
// Con `dispersar`, ademas, los slots contiguos del fixture se reparten a 1, 3 y
// 5: asi la entrada trae huecos y la salida tiene que volver a quedar 1..N.
const aEntradaDelNavegador = (fixture, dispersar) => {
  const posicion = (indiceCero) => (dispersar ? indiceCero * 2 : indiceCero)
  const entrada = {}
  const filas = {}
  sandbox.REPETIDORES_DE_FILA.forEach((definicion) => {
    filas[definicion.prefijo] = []
  })

  for (const [clave, valor] of Object.entries(fixture)) {
    const definicion = sandbox.REPETIDORES_DE_FILA.find((d) => clave.startsWith(d.prefijo))
    const slot = definicion ? /^([0-9]+)([A-Za-z]+)$/.exec(clave.slice(definicion.prefijo.length)) : null

    if (slot) {
      const indice = posicion(Number(slot[1]) - 1)
      const campo = definicion.campos.find(([sufijo]) => sufijo === slot[2])
      filas[definicion.prefijo][indice] = filas[definicion.prefijo][indice] || {}
      if (campo) filas[definicion.prefijo][indice][campo[1]] = valor
      continue
    }

    const simple = sandbox.REPETIDORES_SIMPLES.find(
      (prefijo) => clave.startsWith(prefijo) && /^[0-9]+$/.test(clave.slice(prefijo.length)),
    )
    if (simple) {
      entrada[simple + (posicion(Number(clave.slice(simple.length)) - 1) + 1)] = valor
      continue
    }

    entrada[clave] = valor === 'Y' ? 'si' : valor === 'N' ? 'no' : valor
  }

  sandbox.REPETIDORES_DE_FILA.forEach((definicion) => {
    entrada[definicion.origen] = Array.from(filas[definicion.prefijo], (fila) => fila || {})
  })
  return entrada
}

const fixtures = [
  { nombre: 'ejemplo_cliente_minimo', dispersar: false },
  { nombre: 'ejemplo_cliente_jubilado', dispersar: true },
  { nombre: 'ejemplo_datos_cliente', dispersar: false },
]
fixtures.forEach(({ nombre, dispersar }) => {
  const fixture = JSON.parse(leer(`docs/${nombre}.json`))
  const generado = sandbox.construirDatosDs160(aEntradaDelNavegador(fixture, dispersar))
  const emitidas = new Set(Object.keys(generado))

  const faltan = Object.keys(fixture).filter((c) => !emitidas.has(c))
  const sobran = [...emitidas].filter((c) => !(c in fixture))
  const disparadorasAusentes = sandbox.CLAVES_DISPARADORAS.filter((c) => !emitidas.has(c))

  if (faltan.length) anotar(`${nombre}: el generador omite ${faltan.join(', ')}`)
  if (sobran.length) anotar(`${nombre}: el generador emite de mas ${sobran.join(', ')}`)
  if (disparadorasAusentes.length) {
    anotar(`${nombre}: faltan disparadoras ${disparadorasAusentes.join(', ')}`)
  }

  const nota = dispersar ? ' (entrada con huecos, salida compactada)' : ''
  console.log(`${nombre}: ${emitidas.size}/${Object.keys(fixture).length} variables, 24/24 disparadoras${nota}`)
})

// --- 5. ningun select del DS-160 se queda sin catalogo en la web ----------

const fuentePayload = leer('src/lib/payloadDs160.ts')
const bloque = (nombre) => {
  const desde = fuentePayload.indexOf(nombre)
  if (desde === -1) throw new Error(`no se encontro ${nombre} en payloadDs160.ts`)
  return fuentePayload.slice(desde, fuentePayload.indexOf('\n}', desde))
}

const camposConCatalogo = new Set(
  [...bloque('CATALOGO_POR_CAMPO:').matchAll(/^ {2}(\w+)[,:]/gm)].map((m) => m[1]),
)
const camposDeFilaConCatalogo = new Set(
  [...bloque('CATALOGO_POR_CAMPO_DE_FILA:').matchAll(/[{,]\s*(\w+)\s*[,:}]/g)].map((m) => m[1]),
)

// slot del mapeo -> campo dentro de la fila del repetidor
const CAMPO_DE_FILA = [
  [/^acompananteViaje\d(\w+)$/, (sufijo) => sufijo.toLowerCase()],
  [/^familiarInmediato\d(\w+)$/, (sufijo) => sufijo.toLowerCase()],
  [/^visitaAnteriorEEUU\d(\w+)$/, () => 'unidadDuracion'],
]

mapeo.pantallas.forEach((pantalla) =>
  (pantalla.campos || []).forEach((campo) => {
    if (campo.tipo !== 'select' || !campo.variable) return

    const enFila = CAMPO_DE_FILA.map(([patron, aCampo]) => {
      const coincidencia = patron.exec(campo.variable)
      return coincidencia ? aCampo(coincidencia[1]) : null
    }).find(Boolean)

    if (enFila) {
      if (!camposDeFilaConCatalogo.has(enFila)) {
        anotar(`${campo.variable}: el repetidor no tiene catalogo para "${enFila}"`)
      }
      return
    }

    if (!camposConCatalogo.has(campo.variable)) {
      anotar(`${campo.variable}: es un select del DS-160 y no esta en CATALOGO_POR_CAMPO`)
    }
  }),
)

console.log(`selects cubiertos por la web: ${camposConCatalogo.size} campos + ${camposDeFilaConCatalogo.size} de repetidor`)

// --- informe -------------------------------------------------------------

console.log(`claves emitidas: ${Object.keys(salida).length}`)
console.log(`archivo JSON:    ${nombreArchivo}`)

if (fallas.length) {
  console.error(`\n${fallas.length} problema(s):`)
  fallas.forEach((falla) => console.error('  - ' + falla))
  process.exit(1)
}

console.log('\nTodo en orden.')
