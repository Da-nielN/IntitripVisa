import { COUNTRIES, ECUADOR_CITIES, NATIONALITIES, PROVINCES_EC } from './index'

export type OpcionFormulario = {
  value: string
  label: string
}

export const opcionesSiNo: OpcionFormulario[] = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

export const opcionesSexo: OpcionFormulario[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
]

export const opcionesEstadoCivil: OpcionFormulario[] = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]

export const opcionesDireccionConyuge: OpcionFormulario[] = [
  { value: 'Igual a la direccion de domicilio particular', label: 'Igual a la direcci\u00f3n de domicilio particular' },
  { value: 'Igual a la direccion para recibir correspondencia', label: 'Igual a la direcci\u00f3n para recibir correspondencia' },
  { value: 'Igual a la direccion de contacto en los EE.UU', label: 'Igual a la direcci\u00f3n de contacto en los EE.UU' },
  { value: 'No sabe', label: 'No sabe' },
  { value: 'Otro (Especificar direccion)', label: 'Otro (Especificar direcci\u00f3n)' },
]

export const opcionesPaises = COUNTRIES.map((pais) => ({ value: pais, label: pais }))
export const opcionesNacionalidades = NATIONALITIES.map((nacionalidad) => ({ value: nacionalidad, label: nacionalidad }))
export const opcionesProvincias = PROVINCES_EC.map((provincia) => ({ value: provincia, label: provincia }))
export const opcionesCiudadesEcuador = ECUADOR_CITIES.map((ciudad) => ({ value: ciudad, label: ciudad }))
export const opcionesOcupaciones = [
  'Agricultura',
  'Artistas varios',
  'Negocios',
  'Comunicaciones',
  'Ciencias en informatica/Computacion',
  'Gastronomia/Servicios alimenticios',
  'Educación',
  'Ingeniería',
  'Gobierno',
  'Ama de casa',
  'Abogacía',
  'Empleo medico/Salud',
  'Militar',
  'Ciencias Naturales',
  'Desempleado',
  'Ciencias en Fisica',
  'Vocación religiosa',
  'Investigación',
  'Jubilado/Retirado',
  'Ciencias Sociales',
  'Estudiante',
  'Otros',
].map((opcion) => ({ value: opcion, label: opcion }))
export const opcionesEstadosUnidos = [
  'ALABAMA',
  'ALASKA',
  'AMERICAN SAMOA',
  'ARIZONA',
  'ARKANSAS',
  'CALIFORNIA',
  'COLORADO',
  'CONNECTICUT',
  'DELAWARE',
  'DISTRICT OF COLUMBIA',
  'FLORIDA',
  'GEORGIA',
  'GUAM',
  'HAWAII',
  'IDAHO',
  'ILLINOIS',
  'INDIANA',
  'IOWA',
  'KANSAS',
  'KENTUCKY',
  'LOUISIANA',
  'MAINE',
  'MARYLAND',
  'MASSACHUSETTS',
  'MICHIGAN',
  'MINNESOTA',
  'MISSISSIPPI',
  'MISSOURI',
  'MONTANA',
  'NEBRASKA',
  'NEVADA',
  'NEW HAMPSHIRE',
  'NEW JERSEY',
  'NEW MEXICO',
  'NEW YORK',
  'NORTH CAROLINA',
  'NORTH DAKOTA',
  'NORTHERN MARIANA ISLANDS',
  'OHIO',
  'OKLAHOMA',
  'OREGON',
  'PENNSYLVANIA',
  'PUERTO RICO',
  'RHODE ISLAND',
  'SOUTH CAROLINA',
  'SOUTH DAKOTA',
  'TENNESSEE',
  'TEXAS',
  'UTAH',
  'VERMONT',
  'VIRGIN ISLANDS',
  'VIRGINIA',
  'WASHINGTON',
  'WEST VIRGINIA',
  'WISCONSIN',
  'WYOMING',
].map((estado) => ({ value: estado, label: estado }))

export const opcionesDuracion: OpcionFormulario[] = [
  { value: 'dias', label: 'Días' },
  { value: 'semanas', label: 'Semanas' },
  { value: 'meses', label: 'Meses' },
  { value: 'anios', label: 'Años' },
]

export const opcionesRelacionAcompanante: OpcionFormulario[] = [
  { value: 'Padre o Madre', label: 'Padre o Madre' },
  { value: 'Hijo(a)', label: 'Hijo(a)' },
  { value: 'Amigo(a)', label: 'Amigo(a)' },
  { value: 'Socio empresarial', label: 'Socio empresarial' },
  { value: 'Otros', label: 'Otros' },
  { value: 'Otro pariente', label: 'Otro pariente' },
  { value: 'Cónyuge', label: 'Cónyuge' },
]

export const opcionesEstatusFamiliarEEUU: OpcionFormulario[] = [
  { value: 'CIUDADANO ESTADOUNIDENSE', label: 'CIUDADANO ESTADOUNIDENSE' },
  { value: 'RESIDENTE PERMANENTE LEGAL DE EE. UU. (LPR)', label: 'RESIDENTE PERMANENTE LEGAL DE EE. UU. (LPR)' },
  { value: 'NO INMIGRANTE', label: 'NO INMIGRANTE' },
  { value: 'OTRO/NO LO SÉ', label: 'OTRO/NO LO SÉ' },
]

export const opcionesRelacionFamiliarInmediato: OpcionFormulario[] = [
  { value: 'Cónyuge', label: 'Cónyuge' },
  { value: 'Prometido(a)', label: 'Prometido(a)' },
  { value: 'Hijo(a)', label: 'Hijo(a)' },
  { value: 'Hermano(a)', label: 'Hermano(a)' },
]

export const opcionesEstatusFamiliarInmediatoEEUU: OpcionFormulario[] = [
  { value: 'Ciudadano de los Estados Unidos de Norteamerica', label: 'Ciudadano de los Estados Unidos de Norteamerica' },
  { value: 'Residente Legal Permanente de los Estados Unidos de Norteamerica (LPR)', label: 'Residente Legal Permanente de los Estados Unidos de Norteamerica (LPR)' },
  { value: 'No inmigrante', label: 'No inmigrante' },
  { value: 'Otro/No lo se', label: 'Otro/No lo se' },
]

export const opcionesPagador: OpcionFormulario[] = [
  { value: 'YO', label: 'YO' },
  { value: 'OTRA PERSONA', label: 'OTRA PERSONA' },
  { value: 'EMPLEADOR ACTUAL', label: 'EMPLEADOR ACTUAL' },
  { value: 'EMPLEADOR EN EE. UU', label: 'EMPLEADOR EN EE. UU' },
  { value: 'OTRA EMPRESA/ORGANIZACIÓN', label: 'OTRA EMPRESA/ORGANIZACIÓN' },
]

export const razonesViaje = [
  'FUNCIONARIO DE GOBIERNO FORANEO (A)',
  'VISITA TEMPORAL DE NEGOCIOS Y PLACER (B)',
  'EXTRANJERO EN TRANSITO (C)',
  'EMPLEADO CNMI O INVERSIONISTA (CW/E2C)',
  'TRIPULANTE (D)',
  'COMERCIANTE/MERCANTIL O INVERSIONISTA (E)',
  'ESTUDIANTE DE IDIOMAS O ACADEMICO (F)',
  'REPRESENTANTE O EMPLEADO DE ALGUNA ORGANIZACION INTERNACIONAL (G)',
  'TRABAJADOR TEMPORAL (H)',
  'REPRESENTANTE DE MEDIOS DE COMUNICACION EXTRANJEROS (I)',
  'VISA DE INTERCAMBIO ESTUDIANTIL (J)',
  'PROMETIDO O CONYUGE DE CIUDADANO ESTADOUNIDENSE (K)',
  'TRANSFERENCIA DE EMPRESA (L)',
  'ESTUDIANTE VOCACIONAL O NO-ACADEMICO (M)',
  'OTRO (N)',
  'PERSONAL DE LA OTAN (NATO)',
  'EXTRANJERO CON ALGUNA HABILIDAD EXTRAORDINARIA (O)',
  'EXTRANJERO INTERNACIONALMENTE RECONOCIDO/ARTISTICO (P)',
  'VISITANTE DE INTERCAMBIO CULTURAL (Q)',
  'EMPLEADO RELIGIOSO (R)',
  'INFORMANTE O TESTIGO (S)',
  'VICTIMA DE TRAFICO DE PERSONAS (T)',
  'VISA DEL TLCAN (TD/TN)',
  'VICTIMA DE ACTIVIDAD CRIMINAL (U)',
].map((opcion) => ({ value: opcion, label: opcion }))

export const razonesViajeEspecifico = [
  'MINISTRO PUBLICO O EMBAJADOR (A1)', 'FUNCIONARIO DIPLOMATICO CONSULAR O DE CARRERA (A1)', 'CONYUGE DEL TITULAR DE VISA A1 (A1)', 'HIJOS DEL TITULAR DE VISA A1 (A1)', 'FUNCIONARIO O EMPLEADO EXTRANJERO (A2)', 'CONYUGE DEL TITULAR DE VISA A2 (A2)', 'HIJOS DEL TITULAR DE VISA A2 (A2)', 'EMPLEADO PERSONAL DEL TITULAR DE VISA A1 O A2 (A3)', 'CONYUGE DEL TITULAR DE VISA A3 (A3)', 'HIJOS DEL TITULAR DE VISA A3 (A3)', 'NEGOCIOS/CONFERENCIA (B1)', 'TURISTICO O TRATAMIENTO MEDICO (B2)', 'PERSONAL O NEGOCIOS (B1/B2)', 'TARJETA DE CRUCE FRONTERIZO O VISA LASER (BCC)', 'EN TRANSITO (C1)', 'TRIPULANTE EN TRANSITO (C1/D)', 'TRANSITO HACIA EL CUARTEL DE LAS NACIONES UNIDAS (C2)', 'FUNCIONARIO EXTRANJERO EN TRANSITO (C3)', 'EMPLEADO PERSONAL DEL TITULAR DE VISA C3 (C3)', 'CONYUGE DEL TITULAR DE VISA C3 (C3)', 'HIJOS DEL TITULAR DE VISA C3 (C3)', 'INVERSIONISTA CNMI A LARGO PLAZO (E2C)', 'EMPLEADO TEMPORAL CNMI (CW1)', 'CONYUGE DEL TITULAR DE VISA CW1 (CW2)', 'HIJOS DEL TITULAR DE VISA CW1 (CW2)', 'TRIPULANTE (D)', 'INVERSIONISTA (E1)', 'CONYUGE DEL TITULAR DE VISA E1 (E1)', 'HIJOS DEL TITULAR DE VISA E1 (E1)', 'EMPLEADO EJECUTIVO/GERENCIAL/ESENCIAL DEL TITULAR DE VISA E1 (E1)', 'EMPLEADO EJECUTIVO/GERENCIAL/ESENCIAL DEL TITULAR DE VISA E1 (E2)', 'INVERSIONISTA DEL TRATADO (E2)', 'CONYUGE DEL TITULAR DE VISA E2 (E2)', 'HIJOS DEL TITULAR DE VISA E2 (E2)', 'AUSTRALIANO EN UNA OCUPACION ESPECIALIZADA (E3)', 'CONYUGE DEL TITULAR DE VISA E3 (E3D)', 'HIJOS DEL TITULAR DE VISA E3 (E3D)', 'RENOVACION VISA E3 (E3R)', 'ESTUDIANTE (F1)', 'CONYUGE DEL TITULAR DE VISA F1 (F2)', 'HIJOS DEL TITULAR DE VISA F1 (F2)', 'REPRESENTANTE PRINCIPAL (G1)', 'PERSONAL DEL REPRESENTANTE PRINCIPAL (G1)', 'CONYUGE DEL TITULAR DE VISA G1 (G1)', 'HIJOS DEL TITULAR DE VISA G1 (G1)', 'REPRESENTANTE (G2)', 'CONYUGE DEL TITULAR DE VISA G2 (G2)', 'HIJOS DEL TITULAR DE VISA G2 (G2)', 'REPRESENTANTE DE UN PAIS NO RECONOCIDO (G3)', 'CONYUGE DEL TITULAR DE VISA G3 (G3)', 'HIJOS DEL TITULAR DE VISA G3 (G3)', 'EMPLEADO DE UN ORGANISMO INTERNACIONAL (G4)', 'CONYUGE DEL TITULAR DE VISA G4 (G4)', 'HIJOS DEL TITULAR DE VISA G4 (G4)', 'EMPLEADO PERSONAL DEL TITULAR DE VISAS G1, G2, G3 O G4 (G5)', 'CONYUGE DEL TITULAR DE VISA G5 (G5)', 'HIJOS DEL TITULAR DE VISA G5 (G5)', 'OCUPACION/PUESTO DE ESPECIALIZACION (H1B)', 'CIUDADANO CHILENO EN PUESTO DE ESPECIALIZACION (H1B1)', 'CIUDADANO DE SINGAPUR EN PUESTO DE ESPECIALIZACION (H1B1)', 'ENFERMERA EN AREA DE ESCASEZ (H1C)', 'EMPLEADO DE AGRICULTURA (H2A)', 'EMPLEADO TEMPORAL - AREA NO RELACIONADA A LA AGRICULTURA (H2B)', 'APRENDIZ (H3)', 'CONYUGE DEL TITULAR DE VISA H (H4)', 'HIJOS DEL TITULAR DE VISA H (H4)', 'REPRESENTANTE DE MEDIOS DE COMUNICACION EXTRANJEROS (I)', 'HIJOS DEL TITULAR DE VISA I (I)', 'CONYUGE DEL TITULAR DE VISA I (I)', 'VISITANTE DE INTERCAMBIO ACADEMICO (J1)', 'HIJOS DEL TITULAR DE VISA J1 (J2)', 'CONYUGE DEL TITULAR DE VISA J1 (J2)', 'PROMETIDO(A) DE CIUDADANO AMERICANO (K1)', 'HIJOS DEL TITULAR DE VISA K1 (K2)', 'CONYUGE DE CIUDADANO AMERICANO (K3)', 'HIJOS DEL TITULAR DE VISA K3 (K4)', 'TRANSFERENCIA DE EMPRESA (L1)', 'HIJOS DEL TITULAR DE VISA L1 (L2)', 'CONYUGE DEL TITULAR DE VISA L1 (L2)', 'ESTUDIANTE (M1)', 'CONYUGE DEL TITULAR DE VISA M1 (M2)', 'HIJOS DEL TITULAR DE VISA M1 (M2)', 'ESTUDIANTE VIAJERO (M3)', 'PADRE/MADRE DE CIERTO INMIGRANTE ESPECIAL (N8)', 'HIJOS DEL TITULAR DE VISA N8 (N9)', 'REPRESENTANTE PRINCIPAL (NATO1)', 'CONYUGE DEL TITULAR DE VISA NATO1 (NATO1)', 'HIJOS DEL TITULAR DE VISA NATO1 (NATO1)', 'REPRESENTANTE (NATO2)', 'CONYUGE DEL TITULAR DE VISA NATO2 (NATO2)', 'HIJOS DEL TITULAR DE VISA NATO2 (NATO2)', 'PERSONAL SECRETARIAL (NATO3)', 'CONYUGE DEL TITULAR DE VISA NATO3 (NATO3)', 'HIJOS DEL TITULAR DE VISA NATO3 (NATO3)', 'FUNCIONARIO (NATO4)', 'CONYUGE DEL TITULAR DE VISA NATO4 (NATO4)', 'HIJOS DEL TITULAR DE VISA NATO4 (NATO4)', 'EXPERTOS (NATO5)', 'CONYUGE DEL TITULAR DE VISA NATO5 (NATO5)', 'HIJOS DEL TITULAR DE VISA NATO5 (NATO5)', 'PERSONAL CIVIL (NATO6)', 'CONYUGE DEL TITULAR DE VISA NATO6 (NATO6)', 'HIJOS DEL TITULAR DE VISA NATO6 (NATO6)', 'EMPLEADO PERSONAL DEL TITULAR DE VISA NATO1-NATO6 (NATO7)', 'CONYUGE DEL TITULAR DE VISA NATO7 (NATO7)', 'HIJOS DEL TITULAR DE VISA NATO7 (NATO7)', 'ABILIDAD EXTRAORDINARIA (O1)', 'ACOMPAÑANTE O ASISTENTE DEL TITULAR DE VISA O1 (O2)', 'CONYUGE DEL TITULAR DE VISA O1 U O2 (O3)', 'HIJOS DEL TITULAR DE VISA O1 U O2 (O3)', 'EXTRANJERO INTERNACIONALMENTE RECONOCIDO/ARTISTA (P1)', 'ARTISTA/ANIMADOR INTERCAMBIO RECIPROCO (P2)', 'ARTISTA/ANIMADOR EN INTERCAMBIO CULTURAL (P3)', 'CONYUGE DEL TITULAR DE VISA P1, P2 O P3 (P4)', 'HIJOS DEL TITULAR DE VISA P1, P2 O P3 (P4)', 'VISITANTE DE INTERCAMBIO CULTURAL (Q1)', 'EMPLEADO RELIGIOSO (R1)', 'HIJOS DEL TITULAR DE VISA R1 (R2)', 'CONYUGE DEL TITULAR DE VISA R1 (R2)', 'FAMILIAR DE UN INFORMANTE (S7)', 'VICTIMA DE TRAFICO DE PERSONAS (T1)', 'CONYUGE DEL TITULAR DE VISA T1 (T2)', 'HIJOS DEL TITULAR DE VISA T1 (T3)', 'PADRE/MADRE DEL TITULAR DE VISA T1 (T4)', 'HERMANO(A) DEL TITULAR DE VISA T1 (T5)', 'VISA TLCAN (TN)', 'CONYUGE DEL TITULAR DE VISA TN (TD)', 'HIJOS DEL TITULAR DE VISA TN (TD)', 'VICTIMA DE UN DELITO (U1)', 'CONYUGE DEL TITULAR DE VISA U1 (U2)', 'HIJOS DEL TITULAR DE VISA U1 (U3)', 'PADRE/MADRE DEL TITULAR DE VISA U1 (U4)', 'HERMANO(A) DEL TITULAR DE VISA U1 (U5)',
]
