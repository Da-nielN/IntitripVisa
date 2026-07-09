import { z } from 'zod'

const requerido = (msg = 'Campo requerido') => z.string().trim().min(1, msg)
const siNo = z.enum(['si', 'no'])
const textoOpcional = z.string().optional().default('')
const soloDigitos = (msg: string) => z.string().regex(/^\d+$/, msg)
const campoNombre = (msg: string) => requerido(msg)
  .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/, 'No ingrese números ni espacios al inicio o al final')
const duracion = z.enum(['dias', 'semanas', 'meses', 'anios']).optional().default('dias')
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
  nombreCompleto: textoOpcional,
  fechaNacimiento: requerido('Fecha de nacimiento requerida'),
  sexo: z.enum(['masculino', 'femenino'], {
    required_error: 'Sexo requerido',
  }),
  estadoCivil: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'], {
    required_error: 'Estado civil requerido',
  }),
  nombresConyuge: textoOpcional,
  apellidosConyuge: textoOpcional,
  nombreConyuge: textoOpcional,
  fechaNacimientoConyuge: textoOpcional,
  nacionalidadConyuge: textoOpcional,
  paisNacimientoConyuge: textoOpcional,
  ciudadNacimientoConyuge: textoOpcional,
  direccionConyuge: textoOpcional,
  direccionConyugeOtro: textoOpcional,
  nacionalidad: requerido('Nacionalidad requerida'),
  tieneOtraNacionalidad: siNo,
  otraNacionalidad: textoOpcional,
  esResidentePermanenteExtranjero: siNo,
  paisResidenciaPermanente: textoOpcional,
  telefonoDomicilio: z.string().regex(/^\d{7}$|^$/, 'Teléfono domicilio debe tener 7 dígitos').optional().default(''),
  ciudad: requerido('Ciudad requerida'),
  provincia: requerido('Provincia requerida'),
  celular: soloDigitos('Celular debe contener solo números').length(10, 'Celular debe tener 10 dígitos'),
  tuvoTelefonosAnteriores: siNo,
  telefonosAnteriores: z.string().regex(/^\d{10}$|^$/, 'Otros celulares debe tener 10 dígitos').optional().default(''),
  direccion: requerido('Dirección requerida'),
  codigoPostal: soloDigitos('Código postal debe contener solo números'),
  correo: requerido('Email requerido').email('Email inválido'),
  tuvoCorreosAnteriores: siNo,
  correosAnteriores: textoOpcional,
  ciudadPasaporte: requerido('Ciudad del pasaporte requerida'),
  pasaportePerdidoORobado: siNo,
  numeroPasaportePerdidoORobado: textoOpcional,
  paisAutoridadPasaportePerdidoORobado: textoOpcional,
  explicacionPasaportePerdidoORobado: textoOpcional,

  facebook: textoOpcional,
  instagram: textoOpcional,
  linkedin: textoOpcional,
  otrasRedesSociales: textoOpcional,

  licenciaConducirEEUU: siNo,
  numeroLicenciaConducirEEUU: textoOpcional,
  estadoLicenciaConducirEEUU: textoOpcional,
  tieneIdentificacionFiscalEEUU: siNo,
  identificacionFiscalEEUU: textoOpcional,

  categoriaOcupacionActual: requerido('Ocupación requerida'),
  cargoActual: textoOpcional,
  empleadorActual: requerido('Nombre de empresa o escuela requerido'),
  descripcionTrabajoActual: requerido('Descripción de funciones requerida'),
  sueldoActual: textoOpcional,
  direccionTrabajoActual: requerido('Dirección requerida'),
  ciudadTrabajoActual: requerido('Ciudad requerida'),
  provinciaTrabajoActual: requerido('Provincia requerida'),
  codigoPostalTrabajoActual: textoOpcional,
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
  institucionBachillerato: textoOpcional,
  institucionUniversitaria: textoOpcional,
  nombreCarrera: textoOpcional,
  direccionEducacion: textoOpcional,
  ciudadEducacion: textoOpcional,
  provinciaEducacion: textoOpcional,
  codigoPostalEducacion: textoOpcional,
  fechaInicioEducacion: textoOpcional,
  fechaFinEducacion: textoOpcional,
  telefonoEducacion: textoOpcional,
  idiomas: textoOpcional,

  nombresPadre: requerido('Nombres del padre requeridos'),
  apellidosPadre: requerido('Apellidos del padre requeridos'),
  nombrePadre: textoOpcional,
  fechaNacimientoPadre: requerido('Fecha de nacimiento del padre requerida'),
  padreEnEEUU: siNo,
  estatusPadreEEUU: textoOpcional,
  nombresMadre: requerido('Nombres de la madre requeridos'),
  apellidosMadre: requerido('Apellidos de la madre requeridos'),
  nombreMadre: textoOpcional,
  fechaNacimientoMadre: requerido('Fecha de nacimiento de la madre requerida'),
  madreEnEEUU: siNo,
  estatusMadreEEUU: textoOpcional,
  familiaresInmediatosEnEEUU: siNo,
  familiaresInmediatosDetalle: z.array(familiarInmediato).optional().default([]),
  otrosFamiliaresEnEEUU: siNo,

  historialViajes: textoOpcional,
  tieneVisaActiva: siNo,
  paisVisa: textoOpcional,
  fechaEmisionVisa: textoOpcional,
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
  lugaresPlaneadosEEUU: textoOpcional,
  direccionHospedajeEEUU: textoOpcional,
  ciudadHospedajeEEUU: textoOpcional,
  estadoHospedajeEEUU: textoOpcional,
  cantidadViajeros: textoOpcional,
  relacionViaje: textoOpcional,
  pagadorViaje: z.enum(['YO', 'OTRA PERSONA', 'EMPLEADOR ACTUAL', 'EMPLEADOR EN EE. UU', 'OTRA EMPRESA/ORGANIZACIÓN']),
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
      { campo: 'idiomas', valor: data.idiomas, mensaje: 'Ingrese los idiomas que habla' },
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

  if (data.enfermedadContagiosa === 'si' && !data.detalleEnfermedadContagiosa) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Explique qué enfermedad contagiosa tiene o ha tenido',
      path: ['detalleEnfermedadContagiosa'],
    })
  }

})

export type VisaFormSchema = z.infer<typeof visaFormSchema>
