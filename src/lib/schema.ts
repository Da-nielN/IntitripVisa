import { z } from 'zod'
import {
  estadoCivil as catEstadoCivil,
  quienPaga as catQuienPaga,
  sexo as catSexo,
  unidadDuracion as catUnidadDuracion,
  valoresDe,
} from '../constants/catalogos'

const requerido = (msg = 'Campo requerido') => z.string().trim().min(1, msg)
const siNo = z.enum(['si', 'no'])
const textoOpcional = z.string().optional().default('')
const textoOpcionalMax = (max: number) =>
  z.string().max(max, `Máximo ${max} caracteres`).optional().default('')
const soloDigitos = (msg: string) => z.string().regex(/^\d+$/, msg)
const campoNombre = (msg: string) => requerido(msg)
  .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/, 'Use solo letras y espacios')
const duracion = z.enum(valoresDe(catUnidadDuracion)).optional().default('D')
const acompanante = z.object({
  apellidos: textoOpcional,
  nombres: textoOpcional,
  relacion: textoOpcional,
})
const familiarInmediato = z.object({
  apellidos: textoOpcional,
  nombres: textoOpcional,
  relacion: textoOpcional,
  estatus: textoOpcional,
})
const visitaEstadosUnidos = z.object({
  fechaLlegada: textoOpcional,
  valorDuracion: textoOpcional,
  unidadDuracion: duracion,
})

export const visaFormSchema = z.object({
  cedula: soloDigitos('Cédula debe contener solo números').max(10, 'Cédula debe tener máximo 10 dígitos'),
  primerNombre: campoNombre('Primer nombre requerido'),
  segundoNombre: campoNombre('Segundo nombre requerido'),
  primerApellido: campoNombre('Primer apellido requerido'),
  segundoApellido: campoNombre('Segundo apellido requerido'),
  fechaNacimiento: requerido('Fecha de nacimiento requerida'),
  ciudadNacimiento: requerido('Ciudad de nacimiento requerida').max(20, 'Máximo 20 caracteres'),
  paisNacimiento: requerido('País de nacimiento requerido'),
  sexo: z.enum(valoresDe(catSexo), {
    required_error: 'Sexo requerido',
  }),
  estadoCivil: z.enum(valoresDe(catEstadoCivil), {
    required_error: 'Estado civil requerido',
  }),
  nombresConyuge: textoOpcional,
  apellidosConyuge: textoOpcional,
  fechaNacimientoConyuge: textoOpcional,
  nacionalidadConyuge: textoOpcional,
  paisNacimientoConyuge: textoOpcional,
  ciudadNacimientoConyuge: textoOpcional,
  nacionalidad: requerido('Nacionalidad requerida'),
  tieneOtraNacionalidad: siNo,
  otraNacionalidad: textoOpcional,
  esResidentePermanenteExtranjero: siNo,
  paisResidenciaPermanente: textoOpcional,
  ciudad: requerido('Ciudad requerida'),
  provincia: requerido('Provincia requerida'),
  celular: soloDigitos('Celular debe contener solo números').length(10, 'Celular debe tener 10 dígitos'),
  tuvoTelefonosAnteriores: siNo,
  telefonosAnteriores: z.string().regex(/^\d{10}$|^$/, 'Otros celulares debe tener 10 dígitos').optional().default(''),
  direccion: requerido('Dirección requerida'),
  codigoPostal: soloDigitos('Código postal debe contener solo números'),
  paisDomicilio: requerido('País del domicilio requerido'),
  correo: requerido('Email requerido').email('Email inválido'),
  tuvoCorreosAnteriores: siNo,
  correosAnteriores: textoOpcional,
  tipoDocumentoPasaporte: requerido('Tipo de documento de viaje requerido'),
  numeroPasaporte: requerido('Número de pasaporte requerido').max(20, 'Máximo 20 caracteres'),
  autoridadEmisoraPasaporte: requerido('País o autoridad emisora requerida'),
  ciudadPasaporte: requerido('Ciudad del pasaporte requerida'),
  provinciaEmisionPasaporte: requerido('Provincia de emisión del pasaporte requerida').max(25, 'Máximo 25 caracteres'),
  paisEmisionPasaporte: requerido('País de emisión del pasaporte requerido'),
  fechaEmisionPasaporte: requerido('Fecha de emisión del pasaporte requerida'),
  fechaExpiracionPasaporte: requerido('Fecha de expiración del pasaporte requerida'),
  pasaportePerdidoORobado: siNo,
  numeroPasaportePerdidoORobado: textoOpcional,
  paisAutoridadPasaportePerdidoORobado: textoOpcional,
  explicacionPasaportePerdidoORobado: textoOpcional,

  facebook: textoOpcional,
  instagram: textoOpcional,
  linkedin: textoOpcional,

  licenciaConducirEEUU: siNo,
  numeroLicenciaConducirEEUU: textoOpcional,
  estadoLicenciaConducirEEUU: textoOpcional,
  tieneIdentificacionFiscalEEUU: siNo,
  identificacionFiscalEEUU: textoOpcional,

  categoriaOcupacionActual: requerido('Ocupación requerida'),
  cargoActual: textoOpcional,
  empleadorActual: requerido('Nombre de empresa o escuela requerido'),
  descripcionTrabajoActual: requerido('Descripción de funciones requerida'),
  sueldoActual: soloDigitos('El sueldo debe contener solo números').min(1, 'Sueldo mensual requerido'),
  direccionTrabajoActual: requerido('Dirección requerida'),
  ciudadTrabajoActual: requerido('Ciudad requerida'),
  provinciaTrabajoActual: requerido('Provincia requerida'),
  telefonoTrabajoActual: textoOpcional,
  fechaInicioTrabajoActual: requerido('Fecha de inicio requerida'),

  tuvoTrabajoAnterior: siNo,
  empleadorAnterior: textoOpcional,
  cargoAnterior: textoOpcional,
  direccionTrabajoAnterior: textoOpcional,
  ciudadTrabajoAnterior: textoOpcional,
  provinciaTrabajoAnterior: textoOpcional,
  codigoPostalTrabajoAnterior: textoOpcional,
  telefonoTrabajoAnterior: textoOpcional,
  nombreSupervisorAnterior: textoOpcional,
  apellidosSupervisorAnterior: textoOpcional,
  descripcionTrabajoAnterior: textoOpcional,
  fechaInicioTrabajoAnterior: textoOpcional,
  fechaFinTrabajoAnterior: textoOpcional,

  asistioInstitucionEducativa: siNo,
  institucionUniversitaria: textoOpcional,
  nombreCarrera: textoOpcional,
  direccionEducacion: textoOpcional,
  ciudadEducacion: textoOpcional,
  provinciaEducacion: textoOpcional,
  codigoPostalEducacion: textoOpcional,
  fechaInicioEducacion: textoOpcional,
  fechaFinEducacion: textoOpcional,
  idioma1: textoOpcionalMax(66),
  idioma2: textoOpcionalMax(66),
  idioma3: textoOpcionalMax(66),
  idioma4: textoOpcionalMax(66),
  idioma5: textoOpcionalMax(66),
  tieneHistorialViajes: siNo,
  paisVisitado1: textoOpcional,
  paisVisitado2: textoOpcional,
  paisVisitado3: textoOpcional,
  paisVisitado4: textoOpcional,
  paisVisitado5: textoOpcional,

  nombresPadre: campoNombre('Nombres del padre requeridos'),
  apellidosPadre: campoNombre('Apellidos del padre requeridos'),
  fechaNacimientoPadre: requerido('Fecha de nacimiento del padre requerida'),
  padreEnEEUU: siNo,
  estatusPadreEEUU: textoOpcional,
  nombresMadre: campoNombre('Nombres de la madre requeridos'),
  apellidosMadre: campoNombre('Apellidos de la madre requeridos'),
  fechaNacimientoMadre: requerido('Fecha de nacimiento de la madre requerida'),
  madreEnEEUU: siNo,
  estatusMadreEEUU: textoOpcional,
  familiaresInmediatosEnEEUU: siNo,
  familiaresInmediatosDetalle: z.array(familiarInmediato).optional().default([]),
  otrosFamiliaresEnEEUU: siNo,

  visaNegada: siNo,
  detallesVisaNegada: textoOpcional,
  deportadoDePais: siNo,
  detallesDeportacion: textoOpcional,

  categoriaMotivoViaje: requerido('Razón de viaje requerida'),
  tipoVisa: requerido('Motivo Especifico requerido'),
  tienePlanesViajeConcretos: siNo,
  fechaLlegadaPrevista: textoOpcional,
  valorDuracionEstadiaPrevista: textoOpcional,
  unidadDuracionEstadiaPrevista: duracion,
  fechaLlegadaEEUU: textoOpcional,
  ciudadLlegadaEEUU: textoOpcional,
  fechaSalidaEEUU: textoOpcional,
  ciudadSalidaEEUU: textoOpcional,
  lugarPlaneadoEEUU1: textoOpcionalMax(40),
  lugarPlaneadoEEUU2: textoOpcionalMax(40),
  lugarPlaneadoEEUU3: textoOpcionalMax(40),
  lugarPlaneadoEEUU4: textoOpcionalMax(40),
  lugarPlaneadoEEUU5: textoOpcionalMax(40),
  direccionHospedajeEEUU: textoOpcional,
  ciudadHospedajeEEUU: textoOpcional,
  estadoHospedajeEEUU: textoOpcional,

  apellidosContactoEEUU: requerido('Apellidos del contacto requeridos').max(33, 'Máximo 33 caracteres'),
  nombresContactoEEUU: requerido('Nombres del contacto requeridos').max(33, 'Máximo 33 caracteres'),
  relacionContactoEEUU: requerido('Seleccione la relación con el contacto'),
  direccionContactoEEUU: requerido('Dirección del contacto requerida').max(40, 'Máximo 40 caracteres'),
  ciudadContactoEEUU: requerido('Ciudad del contacto requerida').max(20, 'Máximo 20 caracteres'),
  estadoContactoEEUU: requerido('Seleccione el estado del contacto'),
  telefonoContactoEEUU: requerido('Teléfono del contacto requerido').max(15, 'Máximo 15 caracteres'),
  pagadorViaje: z.enum(valoresDe(catQuienPaga)),
  apellidosPagador: textoOpcional,
  nombresPagador: textoOpcional,
  telefonoPagador: textoOpcional,
  correoPagador: textoOpcional,
  relacionPagador: textoOpcional,
  direccionPagadorIgualSolicitante: siNo,
  viajaConOtros: siNo,
  acompanantesViaje: z.array(acompanante).optional().default([]),
  haVisitadoEEUU: siNo,
  visitasAnterioresEEUU: z.array(visitaEstadosUnidos).optional().default([]),
  haTenidoVisaEEUU: siNo,
  fechaEmisionUltimaVisa: textoOpcional,
  numeroVisa: textoOpcional,
  mismoTipoVisa: siNo,
  mismoPaisResidenciaVisa: siNo,
  diezHuellasTomadas: siNo,
  visaEEUUPerdidaORobada: siNo,
  motivoVisaEEUUPerdidaORobada: textoOpcional,
  anioVisaEEUUPerdidaORobada: textoOpcional,
  visaEEUUCanceladaORevocada: siNo,
  razonVisaEEUUCanceladaORevocada: textoOpcional,
  tienePeticionInmigracion: siNo,
  razonPeticionInmigracion: textoOpcional,

  enfermedadContagiosa: siNo,
  detalleEnfermedadContagiosa: textoOpcional,
}).superRefine((data, ctx) => {
  if (data.tuvoCorreosAnteriores === 'si') {
    const validacionCorreo = z.string().email().safeParse(data.correosAnteriores)
    if (!validacionCorreo.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese un correo anterior válido',
        path: ['correosAnteriores'],
      })
    }
  }

  if (data.tieneOtraNacionalidad === 'si' && !data.otraNacionalidad) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione la otra nacionalidad',
      path: ['otraNacionalidad'],
    })
  }

  if (data.esResidentePermanenteExtranjero === 'si' && !data.paisResidenciaPermanente) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione el país de residencia permanente',
      path: ['paisResidenciaPermanente'],
    })
  }

  if (data.tieneIdentificacionFiscalEEUU === 'si') {
    if (!data.identificacionFiscalEEUU) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el número de identificación fiscal',
        path: ['identificacionFiscalEEUU'],
      })
    } else if (!/^\d+$/.test(data.identificacionFiscalEEUU)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La identificación fiscal debe contener solo números',
        path: ['identificacionFiscalEEUU'],
      })
    }
  }

  if (data.tuvoTelefonosAnteriores === 'si') {
    if (!data.telefonosAnteriores) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el otro celular',
        path: ['telefonosAnteriores'],
      })
    } else if (!/^\d{10}$/.test(data.telefonosAnteriores)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Otros celulares debe tener 10 dígitos',
        path: ['telefonosAnteriores'],
      })
    }
  }

  if (data.pasaportePerdidoORobado === 'si') {
    if (!data.numeroPasaportePerdidoORobado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el número de pasaporte/documento de viaje',
        path: ['numeroPasaportePerdidoORobado'],
      })
    } else if (!/^\d+$/.test(data.numeroPasaportePerdidoORobado)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número de pasaporte/documento de viaje debe contener solo números',
        path: ['numeroPasaportePerdidoORobado'],
      })
    }

    if (!data.paisAutoridadPasaportePerdidoORobado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Seleccione el país/autoridad que emitió el pasaporte/documento de viaje',
        path: ['paisAutoridadPasaportePerdidoORobado'],
      })
    }

    if (!data.explicacionPasaportePerdidoORobado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese una explicación',
        path: ['explicacionPasaportePerdidoORobado'],
      })
    }
  }

  if (data.licenciaConducirEEUU === 'si') {
    if (!data.numeroLicenciaConducirEEUU) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el número de licencia de conducir',
        path: ['numeroLicenciaConducirEEUU'],
      })
    }

    if (!data.estadoLicenciaConducirEEUU) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Seleccione el estado de emisión de la licencia',
        path: ['estadoLicenciaConducirEEUU'],
      })
    }
  }

  const camposNumericos = [
    { campo: 'telefonoTrabajoActual', valor: data.telefonoTrabajoActual, mensaje: 'El teléfono debe contener solo números' },
    { campo: 'telefonoTrabajoAnterior', valor: data.telefonoTrabajoAnterior, mensaje: 'El teléfono debe contener solo números' },
    { campo: 'codigoPostalTrabajoAnterior', valor: data.codigoPostalTrabajoAnterior, mensaje: 'El código postal debe contener solo números' },
    { campo: 'codigoPostalEducacion', valor: data.codigoPostalEducacion, mensaje: 'El código postal debe contener solo números' },
  ] as const

  camposNumericos.forEach(({ campo, valor, mensaje }) => {
    if (valor && !/^\d+$/.test(valor)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: mensaje,
        path: [campo],
      })
    }
  })

  if (data.tuvoTrabajoAnterior === 'si') {
    const camposTrabajoAnterior = [
      { campo: 'empleadorAnterior', valor: data.empleadorAnterior, mensaje: 'Ingrese el nombre del empleador anterior' },
      { campo: 'direccionTrabajoAnterior', valor: data.direccionTrabajoAnterior, mensaje: 'Ingrese la dirección exacta' },
      { campo: 'telefonoTrabajoAnterior', valor: data.telefonoTrabajoAnterior, mensaje: 'Ingrese el teléfono' },
      { campo: 'codigoPostalTrabajoAnterior', valor: data.codigoPostalTrabajoAnterior, mensaje: 'Ingrese el código postal' },
      { campo: 'ciudadTrabajoAnterior', valor: data.ciudadTrabajoAnterior, mensaje: 'Seleccione la ciudad' },
      { campo: 'provinciaTrabajoAnterior', valor: data.provinciaTrabajoAnterior, mensaje: 'Seleccione la provincia' },
      { campo: 'cargoAnterior', valor: data.cargoAnterior, mensaje: 'Ingrese el cargo desempeñado' },
      { campo: 'nombreSupervisorAnterior', valor: data.nombreSupervisorAnterior, mensaje: 'Ingrese los nombres del empleador anterior' },
      { campo: 'apellidosSupervisorAnterior', valor: data.apellidosSupervisorAnterior, mensaje: 'Ingrese los apellidos del empleador anterior' },
      { campo: 'fechaInicioTrabajoAnterior', valor: data.fechaInicioTrabajoAnterior, mensaje: 'Ingrese la fecha de inicio' },
      { campo: 'fechaFinTrabajoAnterior', valor: data.fechaFinTrabajoAnterior, mensaje: 'Ingrese la fecha de finalización' },
      { campo: 'descripcionTrabajoAnterior', valor: data.descripcionTrabajoAnterior, mensaje: 'Ingrese la descripción breve del cargo' },
    ] as const

    camposTrabajoAnterior.forEach(({ campo, valor, mensaje }) => {
      if (!valor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: mensaje,
          path: [campo],
        })
      }
    })
  }

  if (data.asistioInstitucionEducativa === 'si') {
    const camposEducacion = [
      { campo: 'institucionUniversitaria', valor: data.institucionUniversitaria, mensaje: 'Ingrese el nombre de la institución' },
      { campo: 'direccionEducacion', valor: data.direccionEducacion, mensaje: 'Ingrese la dirección' },
      { campo: 'ciudadEducacion', valor: data.ciudadEducacion, mensaje: 'Seleccione la ciudad' },
      { campo: 'provinciaEducacion', valor: data.provinciaEducacion, mensaje: 'Seleccione la provincia' },
      { campo: 'codigoPostalEducacion', valor: data.codigoPostalEducacion, mensaje: 'Ingrese el código postal' },
      { campo: 'fechaInicioEducacion', valor: data.fechaInicioEducacion, mensaje: 'Ingrese la fecha de inicio' },
      { campo: 'fechaFinEducacion', valor: data.fechaFinEducacion, mensaje: 'Ingrese la fecha de finalización' },
    ] as const

    camposEducacion.forEach(({ campo, valor, mensaje }) => {
      if (!valor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: mensaje,
          path: [campo],
        })
      }
    })
  }

  if (data.padreEnEEUU === 'si' && !data.estatusPadreEEUU) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione el estatus del padre',
      path: ['estatusPadreEEUU'],
    })
  }

  if (data.madreEnEEUU === 'si' && !data.estatusMadreEEUU) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione el estatus de la madre',
      path: ['estatusMadreEEUU'],
    })
  }

  if (data.familiaresInmediatosEnEEUU === 'si') {
    if (!data.familiaresInmediatosDetalle.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese al menos un pariente inmediato',
        path: ['familiaresInmediatosDetalle'],
      })
    }

    data.familiaresInmediatosDetalle.forEach((familiar, indice) => {
      if (!familiar.nombres) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ingrese los nombres',
          path: ['familiaresInmediatosDetalle', indice, 'nombres'],
        })
      }
      if (!familiar.apellidos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ingrese los apellidos',
          path: ['familiaresInmediatosDetalle', indice, 'apellidos'],
        })
      }
      if (!familiar.relacion) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seleccione la relación',
          path: ['familiaresInmediatosDetalle', indice, 'relacion'],
        })
      }
      if (!familiar.estatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seleccione el estado relativo',
          path: ['familiaresInmediatosDetalle', indice, 'estatus'],
        })
      }
    })
  }

  if (data.visaEEUUPerdidaORobada === 'si') {
    if (!data.motivoVisaEEUUPerdidaORobada) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Explique el motivo',
        path: ['motivoVisaEEUUPerdidaORobada'],
      })
    }

    if (!data.anioVisaEEUUPerdidaORobada) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el año en que ocurrió',
        path: ['anioVisaEEUUPerdidaORobada'],
      })
    } else if (!/^\d+$/.test(data.anioVisaEEUUPerdidaORobada)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El año debe contener solo números',
        path: ['anioVisaEEUUPerdidaORobada'],
      })
    }
  }

  if (data.visaEEUUCanceladaORevocada === 'si' && !data.razonVisaEEUUCanceladaORevocada) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Ingrese la razón',
      path: ['razonVisaEEUUCanceladaORevocada'],
    })
  }

  if (data.tienePlanesViajeConcretos === 'si' && !data.lugarPlaneadoEEUU1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Ingrese al menos un lugar que planea visitar',
      path: ['lugarPlaneadoEEUU1'],
    })
  }

  if (data.pagadorViaje === 'O') {
    const camposPagador = [
      { campo: 'apellidosPagador', valor: data.apellidosPagador, mensaje: 'Ingrese los apellidos de quien paga el viaje' },
      { campo: 'nombresPagador', valor: data.nombresPagador, mensaje: 'Ingrese los nombres de quien paga el viaje' },
      { campo: 'telefonoPagador', valor: data.telefonoPagador, mensaje: 'Ingrese el teléfono de quien paga el viaje' },
      { campo: 'correoPagador', valor: data.correoPagador, mensaje: 'Ingrese el correo de quien paga el viaje' },
      { campo: 'relacionPagador', valor: data.relacionPagador, mensaje: 'Seleccione el parentesco con quien paga el viaje' },
    ] as const

    camposPagador.forEach(({ campo, valor, mensaje }) => {
      if (!valor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: mensaje,
          path: [campo],
        })
      }
    })

    if (data.correoPagador && !z.string().email().safeParse(data.correoPagador).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese un correo válido',
        path: ['correoPagador'],
      })
    }
  }

  if (!data.idioma1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Ingrese al menos un idioma',
      path: ['idioma1'],
    })
  }

  if (data.tieneHistorialViajes === 'si' && !data.paisVisitado1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione al menos un país visitado',
      path: ['paisVisitado1'],
    })
  }

  if (data.deportadoDePais === 'si' && !data.detallesDeportacion) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Explique la deportación o expulsión',
      path: ['detallesDeportacion'],
    })
  }

  if (data.enfermedadContagiosa === 'si' && !data.detalleEnfermedadContagiosa) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Explique qué enfermedad contagiosa tiene o ha tenido',
      path: ['detalleEnfermedadContagiosa'],
    })
  }

})

export type VisaFormSchema = z.infer<typeof visaFormSchema>
