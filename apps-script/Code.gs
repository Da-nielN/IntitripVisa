// ============================================================
// IntiTrip - Google Apps Script Web App
// ============================================================
// CONFIGURAR antes de usar:
var CONFIGURACION = {
  TEMPLATE_DOC_ID: '1PsfmYfeFEMjy0FzMCus-JMWeX0VSl9lU2btbtzecRg0', // ID del Google Doc plantilla
  PARENT_FOLDER_ID: '1UedawxmFR_ndhZljWm0AzgpiihsRQXUn', // ID de la carpeta raiz en Drive
  VALOR_PREDETERMINADO: '',
  // La ruta del PDF quedo desactivada al migrar a JSON. Ponerlo en true la
  // vuelve a habilitar sin tocar nada mas: el codigo sigue completo abajo.
  GENERAR_PDF: false,
}

// Valores predeterminados especificos por campo opcional.
// Si un campo no aparece aqui, queda vacio.
// Ejemplo:
// var VALORES_PREDETERMINADOS = {
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
  'ciudadNacimiento',
  'paisNacimiento',
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
  'ciudad',
  'provincia',
  'celular',
  'tuvoTelefonosAnteriores',
  'telefonosAnteriores',
  'direccion',
  'codigoPostal',
  'paisDomicilio',
  'correo',
  'tuvoCorreosAnteriores',
  'correosAnteriores',
  'tipoDocumentoPasaporte',
  'numeroPasaporte',
  'autoridadEmisoraPasaporte',
  'ciudadPasaporte',
  'provinciaEmisionPasaporte',
  'paisEmisionPasaporte',
  'fechaEmisionPasaporte',
  'fechaExpiracionPasaporte',
  'pasaportePerdidoORobado',
  'numeroPasaportePerdidoORobado',
  'paisAutoridadPasaportePerdidoORobado',
  'explicacionPasaportePerdidoORobado',
  'facebook',
  'instagram',
  'linkedin',
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
  'institucionUniversitaria',
  'nombreCarrera',
  'direccionEducacion',
  'ciudadEducacion',
  'provinciaEducacion',
  'codigoPostalEducacion',
  'fechaInicioEducacion',
  'fechaFinEducacion',
  'idioma1',
  'idioma2',
  'idioma3',
  'idioma4',
  'idioma5',
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
  'tieneHistorialViajes',
  'paisVisitado1',
  'paisVisitado2',
  'paisVisitado3',
  'paisVisitado4',
  'paisVisitado5',
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
  'lugarPlaneadoEEUU1',
  'lugarPlaneadoEEUU2',
  'lugarPlaneadoEEUU3',
  'lugarPlaneadoEEUU4',
  'lugarPlaneadoEEUU5',
  'direccionHospedajeEEUU',
  'ciudadHospedajeEEUU',
  'estadoHospedajeEEUU',
  'apellidosContactoEEUU',
  'nombresContactoEEUU',
  'relacionContactoEEUU',
  'direccionContactoEEUU',
  'ciudadContactoEEUU',
  'estadoContactoEEUU',
  'telefonoContactoEEUU',
  'pagadorViaje',
  'apellidosPagador',
  'nombresPagador',
  'telefonoPagador',
  'correoPagador',
  'relacionPagador',
  'direccionPagadorIgualSolicitante',
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

// Identificacion fiscal de EE.UU.: desde el mapeo v2.7 el checkbox
// cbexAPP_TAX_ID_NA va marcado y tbxAPP_TAX_ID ya no existe, asi que el DS-160
// no pide el numero. La web todavia hace las dos preguntas -- salen del modelo
// recien cuando se limpie el formulario -- pero ninguna de las dos viaja.
var CLAVES_NO_EMITIDAS = ['tieneIdentificacionFiscalEEUU', 'identificacionFiscalEEUU']

// Variables disparadoras (mapeo v2.6, seccion 12 de variables_nuevas.md).
// 141 campos del mapeo declaran "condicion": solo existen en una rama del
// formulario. Illari evalua esa condicion con el dato del cliente y, si la
// variable disparadora no viene en el JSON, no adivina: marca el campo como
// "omitido - sin dato disparador" y no lo llena.
//
// Por eso estas 24 se emiten SIEMPRE, aunque la respuesta sea "N" o la rama
// quede sin llenar. Emitir de mas no molesta: una variable que ningun campo del
// mapeo usa se ignora. Lo que rompe el llenado de la rama contraria es que falte.
var CLAVES_DISPARADORAS = [
  // Personal2
  'tieneOtraNacionalidad',
  'esResidentePermanenteExtranjero',
  // Travel
  'tienePlanesViajeConcretos',
  'pagadorViaje',
  // TravelCompanions
  'viajaConOtros',
  // PreviousUSTravel
  'haVisitadoEEUU',
  'haTenidoVisaEEUU',
  'licenciaConducirEEUU',
  'visaEEUUPerdidaORobada',
  'visaEEUUCanceladaORevocada',
  'tienePeticionInmigracion',
  'visaNegada',
  // AddressPhone
  'tuvoTelefonosAnteriores',
  'tuvoCorreosAnteriores',
  // PptVisa
  'pasaportePerdidoORobado',
  // Relatives
  'padreEnEEUU',
  'madreEnEEUU',
  'familiaresInmediatosEnEEUU',
  // WorkEducation1
  'categoriaOcupacionActual',
  // WorkEducation2
  'tuvoTrabajoAnterior',
  'asistioInstitucionEducativa',
  // WorkEducation3
  'tieneHistorialViajes',
  // SecurityandBackground1
  'enfermedadContagiosa',
  // SecurityandBackground4
  'deportadoDePais',
]

// Las dos disparadoras que en el DS-160 son <select>. Importan solo para el
// relleno de emergencia de abajo: el formato no cambia, un select sigue saliendo
// como { texto, valor } y un radio como string plano.
var CLAVES_DISPARADORAS_SELECT = ['pagadorViaje', 'categoriaOcupacionActual']

var CANTIDAD_MAXIMA_REPETIBLES = 5

// Repetidores del DS-160. Los seis tienen techo de 5 slots y ese techo viene del
// mapeo, no de aca.
//
// Illari agrega filas hasta el numero mas ALTO que trae dato, no hasta la
// cantidad de datos: si el JSON manda solo lugarPlaneadoEEUU5, la app pulsa
// "Add Another" cuatro veces y deja cuatro filas vacias en el DS-160. Por eso al
// serializar las listas se compactan a 1..N, sin huecos.

// Un solo campo por slot: la clave es el prefijo mas el numero.
var REPETIDORES_SIMPLES = ['lugarPlaneadoEEUU', 'idioma', 'paisVisitado']

// Varios campos por fila. La fila se renumera entera: si el cliente dejo vacia la
// segunda de tres, la tercera pasa a ser la segunda con sus cuatro campos juntos.
var REPETIDORES_DE_FILA = [
  {
    prefijo: 'acompananteViaje',
    origen: 'acompanantesViaje',
    campos: [['Apellidos', 'apellidos'], ['Nombres', 'nombres'], ['Relacion', 'relacion']],
  },
  {
    prefijo: 'visitaAnteriorEEUU',
    origen: 'visitasAnterioresEEUU',
    campos: [['FechaLlegada', 'fechaLlegada'], ['ValorDuracion', 'valorDuracion'], ['UnidadDuracion', 'unidadDuracion']],
  },
  {
    prefijo: 'familiarInmediato',
    origen: 'familiaresInmediatosDetalle',
    campos: [['Nombres', 'nombres'], ['Apellidos', 'apellidos'], ['Relacion', 'relacion'], ['Estatus', 'estatus']],
  },
]

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

  var archivoJson = crearArchivoJson(datos, carpetaCliente)

  var respuesta = {
    success: true,
    message: 'Formulario procesado exitosamente',
    folderId: carpetaCliente.getId(),
    jsonUrl: 'https://drive.google.com/file/d/' + archivoJson.getId() + '/view',
  }

  if (CONFIGURACION.GENERAR_PDF) {
    respuesta.pdfUrl = generarPdf(datos, nombreCarpeta, carpetaCliente)
  }

  return respuesta
}

// Ruta del PDF: desactivada por CONFIGURACION.GENERAR_PDF, intacta por si hay
// que volver a ella.
function generarPdf(datos, nombreCarpeta, carpetaCliente) {
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
  // Sin setSharing: el archivo queda solo para quien tenga acceso a la carpeta.
  // Antes se publicaba con ANYONE_WITH_LINK y el enlace salia hacia el cliente.
  var archivoPdf = carpetaCliente.createFile(pdfBlob)

  return 'https://drive.google.com/file/d/' + archivoPdf.getId() + '/view'
}

// ============================================================
// Ruta JSON: la que consume Illari
// ============================================================
// El navegador manda los select ya resueltos como { texto, valor }, asi que
// aca no hay ni un catalogo: esto solo serializa.
//
// Reglas de formato (plan v5, seccion 4):
//   texto libre       -> string, sin tildes ni ñ
//   fechas            -> "AAAA-MM-DD", tal como llegan del input date
//   radios            -> "Y" / "N"   (la web manda 'si' / 'no')
//   selects           -> { "texto": "...", "valor": "..." }
//   vacio o no aplica -> la clave se omite

function crearArchivoJson(datos, carpetaCliente) {
  var contenido = JSON.stringify(construirDatosDs160(datos), null, 2)
  var blob = Utilities.newBlob(contenido, 'application/json', construirNombreArchivoJson(datos))
  return carpetaCliente.createFile(blob)
}

function construirDatosDs160(datos) {
  var salida = {}

  CLAVES_CAMPOS.forEach(function(clave) {
    if (CLAVES_NO_EMITIDAS.indexOf(clave) !== -1) return
    // Los slots numerados salen mas abajo, ya compactados.
    if (esSlotDeRepetidorSimple(clave)) return
    asignarCampoJson(salida, clave, datos ? datos[clave] : null)
  })

  agregarRepetidoresJson(salida, datos)
  garantizarDisparadoras(salida)

  return salida
}

// Compacta los seis repetidores a 1..N. Un slot -- o una fila entera -- que no
// deja dato no ocupa numero: el que sigue se corre hacia arriba.
function agregarRepetidoresJson(salida, datos) {
  REPETIDORES_SIMPLES.forEach(function(prefijo) {
    var numero = 1
    for (var indice = 1; indice <= CANTIDAD_MAXIMA_REPETIBLES; indice++) {
      var valor = datos ? datos[prefijo + indice] : null
      if (!tieneDatoJson(valor)) continue
      asignarCampoJson(salida, prefijo + numero, valor)
      numero++
    }
  })

  REPETIDORES_DE_FILA.forEach(function(definicion) {
    var numero = 1
    filasDeRepetidor(datos, definicion).forEach(function(fila) {
      var filaConDato = definicion.campos.some(function(campo) {
        return tieneDatoJson(fila[campo[1]])
      })
      if (!filaConDato) return

      definicion.campos.forEach(function(campo) {
        asignarCampoJson(salida, definicion.prefijo + numero + campo[0], fila[campo[1]])
      })
      numero++
    })
  })
}

function esSlotDeRepetidorSimple(clave) {
  for (var indice = 0; indice < REPETIDORES_SIMPLES.length; indice++) {
    var prefijo = REPETIDORES_SIMPLES[indice]
    if (clave.indexOf(prefijo) === 0 && /^\d+$/.test(clave.substring(prefijo.length))) return true
  }
  return false
}

function tieneDatoJson(valor) {
  return serializarValorJson(valor) !== null
}

// Red de seguridad: las 24 disparadoras nunca se omiten. Si el cliente contesto,
// ya salieron por el camino normal y esto no toca nada. Si no contesto -- payload
// viejo, borrador, o un reinicio de rama que dejo el campo vacio -- sale igual
// con el valor vacio del tipo que le corresponde, para que Illari pueda evaluar
// la condicion en vez de dejar toda la rama sin llenar.
function garantizarDisparadoras(salida) {
  CLAVES_DISPARADORAS.forEach(function(clave) {
    if (Object.prototype.hasOwnProperty.call(salida, clave)) return
    salida[clave] = CLAVES_DISPARADORAS_SELECT.indexOf(clave) !== -1
      ? { texto: '', valor: '' }
      : ''
  })
}

function asignarCampoJson(salida, clave, valor) {
  var serializado = serializarValorJson(valor)
  if (serializado !== null) salida[clave] = serializado
}

function serializarValorJson(valor) {
  if (valor === null || valor === undefined) return null
  if (Array.isArray(valor)) return null

  // Select ya resuelto por el navegador. El "valor" es un codigo del DS-160
  // (ECUA, B1-B2): nunca se le quitan las tildes porque se romperia.
  if (typeof valor === 'object') {
    var codigo = valor.valor === null || valor.valor === undefined ? '' : String(valor.valor).trim()
    if (!codigo) return null
    var etiqueta = valor.texto === null || valor.texto === undefined ? '' : String(valor.texto)
    return { texto: etiqueta, valor: codigo }
  }

  var texto = String(valor).trim()
  if (!texto) return null
  if (texto === 'si') return 'Y'
  if (texto === 'no') return 'N'
  return quitarTildes(texto)
}

// Misma tecnica que construirNombreCarpeta: "Munoz" sale de "Muñoz".
function quitarTildes(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function construirNombreArchivoJson(datos) {
  var partes = ['primerNombre', 'primerApellido', 'cedula']
    .map(function(clave) {
      return normalizarParteNombreArchivo(datos ? datos[clave] : '')
    })
    .filter(function(parte) {
      return parte !== ''
    })

  return (partes.length ? partes.join('_') : 'sin_datos') + '.json'
}

function normalizarParteNombreArchivo(valor) {
  return quitarTildes(valor === null || valor === undefined ? '' : String(valor))
    .replace(/[^A-Za-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
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

  REPETIDORES_DE_FILA.forEach(function(definicion) {
    paresDeRepetidor(datos, definicion).forEach(function(par) {
      reemplazos[par[0]] = normalizarValor(par[1], obtenerValorPredeterminado(par[0]))
    })
  })

  return reemplazos
}

// Los seis repetidores se declaran una sola vez, en REPETIDORES_* arriba. La
// ruta JSON los compacta; la del PDF no, porque la plantilla tiene un
// marcador fijo por slot y los que sobran se limpian al final.

// Las 5 filas del repetidor, tal como llegan del navegador y sin compactar.
function filasDeRepetidor(datos, definicion) {
  var origen = (datos && datos[definicion.origen]) || []
  var filas = []
  for (var indice = 0; indice < CANTIDAD_MAXIMA_REPETIBLES; indice++) {
    filas.push(origen[indice] || {})
  }
  return filas
}

// Los mismos datos como pares [nombre de slot, valor crudo], para el PDF.
function paresDeRepetidor(datos, definicion) {
  var pares = []
  filasDeRepetidor(datos, definicion).forEach(function(fila, indice) {
    definicion.campos.forEach(function(campo) {
      pares.push([definicion.prefijo + (indice + 1) + campo[0], fila[campo[1]]])
    })
  })
  return pares
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