// ============================================================
// IntiTrip - Google Apps Script Web App
// ============================================================
// CONFIGURAR antes de usar:
var CONFIGURACION = {
  TEMPLATE_DOC_ID: '1PsfmYfeFEMjy0FzMCus-JMWeX0VSl9lU2btbtzecRg0', // ID del Google Doc plantilla
  PARENT_FOLDER_ID: '1UedawxmFR_ndhZljWm0AzgpiihsRQXUn', // ID de la carpeta raiz en Drive
  VALOR_PREDETERMINADO: '',
}

// Valores predeterminados especificos por campo opcional.
// Si un campo no aparece aqui, queda vacio.
// Ejemplo:
// var VALORES_PREDETERMINADOS = {
//   telefonoDomicilio: 'No registra',
//   correosAnteriores: 'No ha tenido correos anteriores',
// }
var VALORES_PREDETERMINADOS = {}

// Campos actuales del formulario React, todos en espanol.
var CLAVES_CAMPOS = [
  'cedula',
  'primerNombre',
  'segundoNombre',
  'primerApellido',
  'segundoApellido',
  'fechaNacimiento',
  'sexo',
  'estadoCivil',
  'nombresConyuge',
  'apellidosConyuge',
  'fechaNacimientoConyuge',
  'nacionalidadConyuge',
  'paisNacimientoConyuge',
  'ciudadNacimientoConyuge',
  'nacionalidad',
  'tieneOtraNacionalidad',
  'otraNacionalidad',
  'esResidentePermanenteExtranjero',
  'paisResidenciaPermanente',
  'telefonoDomicilio',
  'ciudad',
  'provincia',
  'celular',
  'tuvoTelefonosAnteriores',
  'telefonosAnteriores',
  'direccion',
  'codigoPostal',
  'correo',
  'tuvoCorreosAnteriores',
  'correosAnteriores',
  'ciudadPasaporte',
  'pasaportePerdidoORobado',
  'numeroPasaportePerdidoORobado',
  'paisAutoridadPasaportePerdidoORobado',
  'explicacionPasaportePerdidoORobado',
  'facebook',
  'instagram',
  'linkedin',
  'otrasRedesSociales',
  'licenciaConducirEEUU',
  'numeroLicenciaConducirEEUU',
  'estadoLicenciaConducirEEUU',
  'tieneIdentificacionFiscalEEUU',
  'identificacionFiscalEEUU',
  'categoriaOcupacionActual',
  'cargoActual',
  'empleadorActual',
  'descripcionTrabajoActual',
  'sueldoActual',
  'direccionTrabajoActual',
  'ciudadTrabajoActual',
  'provinciaTrabajoActual',
  'codigoPostalTrabajoActual',
  'telefonoTrabajoActual',
  'fechaInicioTrabajoActual',
  'tuvoTrabajoAnterior',
  'empleadorAnterior',
  'cargoAnterior',
  'direccionTrabajoAnterior',
  'ciudadTrabajoAnterior',
  'provinciaTrabajoAnterior',
  'codigoPostalTrabajoAnterior',
  'telefonoTrabajoAnterior',
  'nombreSupervisorAnterior',
  'apellidosSupervisorAnterior',
  'descripcionTrabajoAnterior',
  'fechaInicioTrabajoAnterior',
  'fechaFinTrabajoAnterior',
  'asistioInstitucionEducativa',
  'institucionBachillerato',
  'institucionUniversitaria',
  'nombreCarrera',
  'direccionEducacion',
  'ciudadEducacion',
  'provinciaEducacion',
  'codigoPostalEducacion',
  'fechaInicioEducacion',
  'fechaFinEducacion',
  'telefonoEducacion',
  'idiomas',
  'nombresPadre',
  'apellidosPadre',
  'fechaNacimientoPadre',
  'padreEnEEUU',
  'estatusPadreEEUU',
  'nombresMadre',
  'apellidosMadre',
  'fechaNacimientoMadre',
  'madreEnEEUU',
  'estatusMadreEEUU',
  'familiaresInmediatosEnEEUU',
  'otrosFamiliaresEnEEUU',
  'historialViajes',
  'tieneVisaActiva',
  'paisVisa',
  'fechaEmisionVisa',
  'visaNegada',
  'detallesVisaNegada',
  'deportadoDePais',
  'detallesDeportacion',
  'categoriaMotivoViaje',
  'tipoVisa',
  'tienePlanesViajeConcretos',
  'fechaLlegadaPrevista',
  'valorDuracionEstadiaPrevista',
  'unidadDuracionEstadiaPrevista',
  'fechaLlegadaEEUU',
  'ciudadLlegadaEEUU',
  'fechaSalidaEEUU',
  'ciudadSalidaEEUU',
  'lugaresPlaneadosEEUU',
  'direccionHospedajeEEUU',
  'ciudadHospedajeEEUU',
  'estadoHospedajeEEUU',
  'cantidadViajeros',
  'relacionViaje',
  'pagadorViaje',
  'viajaConOtros',
  'haVisitadoEEUU',
  'haTenidoVisaEEUU',
  'fechaEmisionUltimaVisa',
  'numeroVisa',
  'mismoTipoVisa',
  'mismoPaisResidenciaVisa',
  'diezHuellasTomadas',
  'visaEEUUPerdidaORobada',
  'motivoVisaEEUUPerdidaORobada',
  'anioVisaEEUUPerdidaORobada',
  'visaEEUUCanceladaORevocada',
  'razonVisaEEUUCanceladaORevocada',
  'tienePeticionInmigracion',
  'razonPeticionInmigracion',
  'enfermedadContagiosa',
  'detalleEnfermedadContagiosa',
]

var CANTIDAD_MAXIMA_REPETIBLES = 5

// ============================================================
// doPost - recibe el formulario como application/x-www-form-urlencoded
// El frontend envia: payload={"cedula":"...","primerNombre":"..."}
// ============================================================
function doPost(e) {
  try {
    var datos = interpretarEntrada(e)
    var resultado = procesarFormulario(datos)
    return crearRespuesta(resultado)
  } catch (error) {
    var diagnostico = ''
    try {
      diagnostico = JSON.stringify({
        parameter: e.parameter,
        postDataContents: e.postData ? e.postData.contents : null,
      })
    } catch (_) {}
    return crearRespuesta({ success: false, message: 'Error interno: ' + error.message, debug: diagnostico })
  }
}

function interpretarEntrada(e) {
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload)
  }

  var contenido = (e.postData && e.postData.contents) ? e.postData.contents : ''

  if (contenido.charAt(0) === '{') {
    return JSON.parse(contenido)
  }

  if (contenido.indexOf('payload=') === 0) {
    var codificado = contenido.substring('payload='.length)
    var decodificado = decodeURIComponent(codificado.replace(/\+/g, ' '))
    return JSON.parse(decodificado)
  }

  throw new Error('No se pudo interpretar el body: ' + contenido.substring(0, 120))
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'IntiTrip Apps Script activo' })
  ).setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// Logica principal
// ============================================================
function procesarFormulario(datos) {
  var nombreCarpeta = construirNombreCarpeta(datos)
  var carpetaPadre = DriveApp.getFolderById(CONFIGURACION.PARENT_FOLDER_ID)
  var carpetaCliente = carpetaPadre.createFolder(nombreCarpeta)

  var archivoPlantilla = DriveApp.getFileById(CONFIGURACION.TEMPLATE_DOC_ID)
  var archivoNuevo = archivoPlantilla.makeCopy('Formulario_' + nombreCarpeta, carpetaCliente)
  var documento = DocumentApp.openById(archivoNuevo.getId())
  var cuerpo = documento.getBody()

  var reemplazos = crearReemplazos(datos)
  Object.keys(reemplazos).forEach(function(clave) {
    cuerpo.replaceText('\\{\\{\\s*' + escaparExpresionRegular(clave) + '\\s*\\}\\}', escaparReemplazo(reemplazos[clave]))
  })

  cuerpo.replaceText('\\{\\{\\s*[^{}]+\\s*\\}\\}', CONFIGURACION.VALOR_PREDETERMINADO)
  documento.saveAndClose()

  var pdfBlob = DriveApp.getFileById(archivoNuevo.getId()).getAs('application/pdf')
  pdfBlob.setName('Visa_' + nombreCarpeta + '.pdf')
  var archivoPdf = carpetaCliente.createFile(pdfBlob)
  archivoPdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  return {
    success: true,
    message: 'Formulario procesado exitosamente',
    folderId: carpetaCliente.getId(),
    pdfUrl: 'https://drive.google.com/file/d/' + archivoPdf.getId() + '/view',
  }
}

function construirNombreCarpeta(datos) {
  var base = obtenerValor(datos, 'primerApellido')
  if (base === CONFIGURACION.VALOR_PREDETERMINADO) base = obtenerValor(datos, 'cedula')

  var normalizado = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')

  return (normalizado || 'sin_nombre') + '_' + (datos.cedula || 'sin_cedula')
}

function crearReemplazos(datos) {
  var reemplazos = {}

  CLAVES_CAMPOS.forEach(function(clave) {
    reemplazos[clave] = obtenerValor(datos, clave)
  })

  agregarCamposAcompanantes(reemplazos, datos)
  agregarCamposVisitas(reemplazos, datos)
  agregarCamposFamiliaresInmediatos(reemplazos, datos)

  return reemplazos
}

function agregarCamposAcompanantes(reemplazos, datos) {
  for (var indice = 0; indice < CANTIDAD_MAXIMA_REPETIBLES; indice++) {
    var acompanante = datos.acompanantesViaje && datos.acompanantesViaje[indice] ? datos.acompanantesViaje[indice] : {}
    var numero = indice + 1
    reemplazos['acompananteViaje' + numero + 'Apellidos'] = normalizarValor(acompanante.apellidos, obtenerValorPredeterminado('acompananteViaje' + numero + 'Apellidos'))
    reemplazos['acompananteViaje' + numero + 'Nombres'] = normalizarValor(acompanante.nombres, obtenerValorPredeterminado('acompananteViaje' + numero + 'Nombres'))
    reemplazos['acompananteViaje' + numero + 'Relacion'] = normalizarValor(acompanante.relacion, obtenerValorPredeterminado('acompananteViaje' + numero + 'Relacion'))
  }
}

function agregarCamposVisitas(reemplazos, datos) {
  for (var indice = 0; indice < CANTIDAD_MAXIMA_REPETIBLES; indice++) {
    var visita = datos.visitasAnterioresEEUU && datos.visitasAnterioresEEUU[indice] ? datos.visitasAnterioresEEUU[indice] : {}
    var numero = indice + 1
    reemplazos['visitaAnteriorEEUU' + numero + 'FechaLlegada'] = normalizarValor(visita.fechaLlegada, obtenerValorPredeterminado('visitaAnteriorEEUU' + numero + 'FechaLlegada'))
    reemplazos['visitaAnteriorEEUU' + numero + 'ValorDuracion'] = normalizarValor(visita.valorDuracion, obtenerValorPredeterminado('visitaAnteriorEEUU' + numero + 'ValorDuracion'))
    reemplazos['visitaAnteriorEEUU' + numero + 'UnidadDuracion'] = normalizarValor(visita.unidadDuracion, obtenerValorPredeterminado('visitaAnteriorEEUU' + numero + 'UnidadDuracion'))
  }
}

function agregarCamposFamiliaresInmediatos(reemplazos, datos) {
  for (var indice = 0; indice < CANTIDAD_MAXIMA_REPETIBLES; indice++) {
    var familiar = datos.familiaresInmediatosDetalle && datos.familiaresInmediatosDetalle[indice] ? datos.familiaresInmediatosDetalle[indice] : {}
    var numero = indice + 1
    reemplazos['familiarInmediato' + numero + 'Nombres'] = normalizarValor(familiar.nombres, obtenerValorPredeterminado('familiarInmediato' + numero + 'Nombres'))
    reemplazos['familiarInmediato' + numero + 'Apellidos'] = normalizarValor(familiar.apellidos, obtenerValorPredeterminado('familiarInmediato' + numero + 'Apellidos'))
    reemplazos['familiarInmediato' + numero + 'Relacion'] = normalizarValor(familiar.relacion, obtenerValorPredeterminado('familiarInmediato' + numero + 'Relacion'))
    reemplazos['familiarInmediato' + numero + 'Estatus'] = normalizarValor(familiar.estatus, obtenerValorPredeterminado('familiarInmediato' + numero + 'Estatus'))
  }
}

function obtenerValor(datos, clave) {
  return normalizarValor(datos ? datos[clave] : null, obtenerValorPredeterminado(clave))
}

function normalizarValor(valor, valorPredeterminado) {
  valorPredeterminado = valorPredeterminado || CONFIGURACION.VALOR_PREDETERMINADO

  if (valor === null || valor === undefined) return valorPredeterminado
  if (Array.isArray(valor) || typeof valor === 'object') return valorPredeterminado

  var texto = String(valor).trim()
  if (!texto) return valorPredeterminado
  if (texto === 'si') return 'Si'
  if (texto === 'no') return 'No'
  return humanizarTexto(texto)
}

function humanizarTexto(texto) {
  if (texto.indexOf('_') === -1 || texto === texto.toUpperCase()) return texto
  return texto
    .replace(/_/g, ' ')
    .replace(/\b\w/g, function(letra) { return letra.toUpperCase() })
}

function obtenerValorPredeterminado(clave) {
  return Object.prototype.hasOwnProperty.call(VALORES_PREDETERMINADOS, clave)
    ? VALORES_PREDETERMINADOS[clave]
    : CONFIGURACION.VALOR_PREDETERMINADO
}

function escaparExpresionRegular(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escaparReemplazo(valor) {
  return normalizarValor(valor).replace(/\\/g, '\\\\').replace(/\$/g, '\\$')
}

function crearRespuesta(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}