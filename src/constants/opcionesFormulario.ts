import { ECUADOR_CITIES, PROVINCES_EC } from './index'
import {
  estadoCivil as catEstadoCivil,
  estadosEEUU as catEstadosEEUU,
  estatusEEUU as catEstatusEEUU,
  ocupacionActual as catOcupacionActual,
  paisesAutoridadPasaporte as catPaisesAutoridadPasaporte,
  paisesLugarNacimiento as catPaisesLugarNacimiento,
  paisesNacionalidad as catPaisesNacionalidad,
  paisesNacionalidadConyuge as catPaisesNacionalidadConyuge,
  paisesResidenciaPermanente as catPaisesResidenciaPermanente,
  parentescoFamiliarEEUU as catParentescoFamiliarEEUU,
  propositoViaje as catPropositoViaje,
  propositoViajeEspecifico as catPropositoViajeEspecifico,
  quienPaga as catQuienPaga,
  relacionAcompanante as catRelacionAcompanante,
  sexo as catSexo,
  unidadDuracion as catUnidadDuracion,
  type OpcionCatalogo,
} from './catalogos'

export type OpcionFormulario = {
  value: string
  label: string
}

// Convencion de nombres: las constantes respaldadas por un catalogo del DS-160
// llevan el nombre del catalogo (sexo, estadoCivil, quienPaga...). Las que no
// tienen catalogo — texto libre o listas propias del Ecuador — conservan el
// prefijo `opciones`, y ese prefijo es justamente la senal de que su `value` no
// es un value del DS-160.

// Helper para convertir catálogos a opciones de formulario
const aOpciones = (c: readonly OpcionCatalogo[]): OpcionFormulario[] =>
  c.map(({ valor, texto }) => ({ value: valor, label: texto }))

export const opcionesSiNo: OpcionFormulario[] = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

export const sexo = aOpciones(catSexo)

export const estadoCivil = aOpciones(catEstadoCivil)

export const paisesLugarNacimiento = aOpciones(catPaisesLugarNacimiento)
export const paisesNacionalidad = aOpciones(catPaisesNacionalidad)
export const paisesNacionalidadConyuge = aOpciones(catPaisesNacionalidadConyuge)
export const paisesResidenciaPermanente = aOpciones(catPaisesResidenciaPermanente)
export const paisesAutoridadPasaporte = aOpciones(catPaisesAutoridadPasaporte)

export const opcionesProvincias = PROVINCES_EC.map((provincia) => ({ value: provincia, label: provincia }))
export const opcionesCiudadesEcuador = ECUADOR_CITIES.map((ciudad) => ({ value: ciudad, label: ciudad }))

export const ocupacionActual = aOpciones(catOcupacionActual)

export const estadosEEUU = aOpciones(catEstadosEEUU)

export const unidadDuracion = aOpciones(catUnidadDuracion)

export const relacionAcompanante = aOpciones(catRelacionAcompanante)

export const estatusEEUU = aOpciones(catEstatusEEUU)

export const parentescoFamiliarEEUU = aOpciones(catParentescoFamiliarEEUU)

export const quienPaga = aOpciones(catQuienPaga)

export const propositoViaje = aOpciones(catPropositoViaje)

export const propositoViajeEspecifico: Record<string, OpcionFormulario[]> = Object.entries(
  catPropositoViajeEspecifico
).reduce((acc, [key, opciones]) => {
  acc[key] = aOpciones(opciones)
  return acc
}, {} as Record<string, OpcionFormulario[]>)
