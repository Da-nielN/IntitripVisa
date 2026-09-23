import {
  estadoCivil,
  estadosEEUU,
  estatusEEUU,
  ocupacionActual,
  paisesAutoridadPasaporte,
  paisesLugarNacimiento,
  paisesNacionalidad,
  paisesNacionalidadConyuge,
  paisesResidenciaPermanente,
  parentescoFamiliarEEUU,
  propositoViaje,
  propositoViajeEspecifico,
  quienPaga,
  relacionAcompanante,
  relacionContactoEEUU,
  relacionPagador,
  sexo,
  tipoDocumentoPasaporte,
  unidadDuracion,
  type OpcionCatalogo,
} from '../constants/catalogos'
import type { VisaFormSchema } from './schema'

export type OpcionSeleccionada = { texto: string; valor: string }

type Catalogo = readonly OpcionCatalogo[]

// El DS-160 recarga el select hijo segun el padre, pero ningun value se repite
// entre grupos, asi que para resolver el texto basta un lookup plano.
const propositoViajeEspecificoPlano: Catalogo = Object.values(propositoViajeEspecifico).flat()

// Campos cuyo control en el DS-160 es un <select>: viajan como par
// { texto, valor }. Los demas selects de la web (provincias y ciudades del
// Ecuador) corresponden a campos de texto del DS-160 y van como string plano.
const CATALOGO_POR_CAMPO: Partial<Record<keyof VisaFormSchema, Catalogo>> = {
  sexo,
  estadoCivil,
  paisNacimiento: paisesLugarNacimiento,
  nacionalidad: paisesNacionalidad,
  otraNacionalidad: paisesNacionalidad,
  nacionalidadConyuge: paisesNacionalidadConyuge,
  paisNacimientoConyuge: paisesLugarNacimiento,
  paisResidenciaPermanente: paisesResidenciaPermanente,
  paisDomicilio: paisesResidenciaPermanente,
  tipoDocumentoPasaporte,
  autoridadEmisoraPasaporte: paisesAutoridadPasaporte,
  paisEmisionPasaporte: paisesResidenciaPermanente,
  paisAutoridadPasaportePerdidoORobado: paisesAutoridadPasaporte,
  estadoLicenciaConducirEEUU: estadosEEUU,
  categoriaOcupacionActual: ocupacionActual,
  estatusPadreEEUU: estatusEEUU,
  estatusMadreEEUU: estatusEEUU,
  categoriaMotivoViaje: propositoViaje,
  tipoVisa: propositoViajeEspecificoPlano,
  unidadDuracionEstadiaPrevista: unidadDuracion,
  estadoHospedajeEEUU: estadosEEUU,
  estadoContactoEEUU: estadosEEUU,
  relacionContactoEEUU,
  pagadorViaje: quienPaga,
  relacionPagador,
  paisVisitado1: paisesResidenciaPermanente,
  paisVisitado2: paisesResidenciaPermanente,
  paisVisitado3: paisesResidenciaPermanente,
  paisVisitado4: paisesResidenciaPermanente,
  paisVisitado5: paisesResidenciaPermanente,
}

// Los repetidores llevan sus propios selects dentro de cada fila.
const CATALOGO_POR_CAMPO_DE_FILA: Record<string, Record<string, Catalogo>> = {
  acompanantesViaje: { relacion: relacionAcompanante },
  familiaresInmediatosDetalle: { relacion: parentescoFamiliarEEUU, estatus: estatusEEUU },
  visitasAnterioresEEUU: { unidadDuracion },
}

// El DS-160 no tiene un radio para esto: solo decide si la web muestra el campo
// de texto de la identificacion fiscal.
const CLAVES_NO_EMITIDAS = new Set<string>(['tieneIdentificacionFiscalEEUU'])

const resolver = (catalogo: Catalogo, valor: string): OpcionSeleccionada => {
  const opcion = catalogo.find((candidata) => candidata.valor === valor)
  // Un value fuera del catalogo seria un error nuestro; se manda igual para no
  // perder el dato en silencio.
  return { texto: opcion ? opcion.texto : valor, valor }
}

const convertirFila = (nombreDelRepetidor: string, fila: Record<string, unknown>) => {
  const catalogos = CATALOGO_POR_CAMPO_DE_FILA[nombreDelRepetidor] ?? {}
  const convertida: Record<string, unknown> = {}

  for (const [campo, valor] of Object.entries(fila)) {
    const catalogo = catalogos[campo]
    convertida[campo] =
      catalogo && typeof valor === 'string' && valor ? resolver(catalogo, valor) : valor
  }

  return convertida
}

// Deja los datos listos para que Code.gs solo tenga que serializarlos: los
// catalogos viven aca, nunca en el Apps Script.
export const construirPayloadDs160 = (datos: VisaFormSchema): Record<string, unknown> => {
  const payload: Record<string, unknown> = {}

  for (const [clave, valor] of Object.entries(datos)) {
    if (CLAVES_NO_EMITIDAS.has(clave)) continue

    if (Array.isArray(valor)) {
      payload[clave] = valor.map((fila) => convertirFila(clave, fila as Record<string, unknown>))
      continue
    }

    const catalogo = CATALOGO_POR_CAMPO[clave as keyof VisaFormSchema]
    payload[clave] =
      catalogo && typeof valor === 'string' && valor ? resolver(catalogo, valor) : valor
  }

  return payload
}
