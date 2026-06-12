// ============================================================
// IntiTrip – Google Apps Script Web App
// ============================================================
// CONFIGURAR antes de usar:
var CONFIG = {
  TEMPLATE_DOC_ID: '1PsfmYfeFEMjy0FzMCus-JMWeX0VSl9lU2btbtzecRg0',       // ID del Google Doc plantilla
  PARENT_FOLDER_ID: '1UedawxmFR_ndhZljWm0AzgpiihsRQXUn',      // ID de la carpeta raíz en Drive
}

// ============================================================
// doPost — recibe el formulario como application/x-www-form-urlencoded
// El frontend envía: payload={"fullName":"...","cedula":"..."}
// Esto evita el preflight CORS que bloquea los JSON directos.
// ============================================================
function doPost(e) {
  try {
    var data = parseIncoming(e)
    var result = processForm(data)
    return buildResponse(result)
  } catch (err) {
    // Devolver el raw para diagnóstico
    var debug = ''
    try { debug = JSON.stringify({ parameter: e.parameter, postDataContents: e.postData ? e.postData.contents : null }) } catch(_) {}
    return buildResponse({ success: false, message: 'Error interno: ' + err.message, debug: debug })
  }
}

/**
 * Maneja los tres casos posibles de cómo puede llegar el body:
 * 1. application/x-www-form-urlencoded → e.parameter.payload tiene el JSON ya decodificado
 * 2. postData.contents es el JSON directamente (pruebas con curl)
 * 3. postData.contents es "payload=..." URL-encoded (versiones antiguas del fetch)
 */
function parseIncoming(e) {
  // Caso 1: form-encoded correcto → Apps Script decodifica automáticamente
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload)
  }

  var raw = (e.postData && e.postData.contents) ? e.postData.contents : ''

  // Caso 2: el body ya es JSON puro
  if (raw.charAt(0) === '{') {
    return JSON.parse(raw)
  }

  // Caso 3: el body llegó como "payload=%7B%22..." sin que Apps Script lo decodificara
  if (raw.indexOf('payload=') === 0) {
    var encoded = raw.substring('payload='.length)
    var decoded = decodeURIComponent(encoded.replace(/\+/g, ' '))
    return JSON.parse(decoded)
  }

  throw new Error('No se pudo interpretar el body: ' + raw.substring(0, 120))
}

// Prueba desde el navegador (GET)
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'IntiTrip Apps Script activo ✓' })
  ).setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// Lógica principal
// ============================================================
function processForm(data) {
  var folderName   = buildFolderName(data.fullName, data.cedula)
  var parentFolder = DriveApp.getFolderById(CONFIG.PARENT_FOLDER_ID)
  var clientFolder = parentFolder.createFolder(folderName)

  var templateFile = DriveApp.getFileById(CONFIG.TEMPLATE_DOC_ID)
  var newFile      = templateFile.makeCopy('Formulario_' + folderName, clientFolder)
  var doc          = DocumentApp.openById(newFile.getId())
  var body         = doc.getBody()

  var replacements = buildReplacements(data)
  Object.keys(replacements).forEach(function(key) {
    body.replaceText('{{' + key + '}}', replacements[key] || 'N/A')
  })
  doc.saveAndClose()

  var pdfBlob = DriveApp.getFileById(newFile.getId()).getAs('application/pdf')
  pdfBlob.setName('Visa_' + folderName + '.pdf')
  var pdfFile = clientFolder.createFile(pdfBlob)
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  return {
    success:  true,
    message:  'Formulario procesado exitosamente',
    folderId: clientFolder.getId(),
    pdfUrl:   'https://drive.google.com/file/d/' + pdfFile.getId() + '/view',
  }
}

// ============================================================
// Helpers
// ============================================================
function buildFolderName(fullName, cedula) {
  var normalized = (fullName || 'sin_nombre')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
  return normalized + '_' + (cedula || 'sin_cedula')
}

function buildReplacements(d) {
  return {
    cedula: d.cedula, fullName: d.fullName, maritalStatus: d.maritalStatus,
    spouseName: d.spouseName, spouseBirthdate: d.spouseBirthdate,
    spouseNationality: d.spouseNationality, nationality: d.nationality,
    otherNationality: d.otherNationality,
    isPermanentResidentAbroad: d.isPermanentResidentAbroad,
    homePhone: d.homePhone, city: d.city, province: d.province,
    cellPhone: d.cellPhone, previousPhones: d.previousPhones,
    address: d.address, postalCode: d.postalCode, email: d.email,
    previousEmails: d.previousEmails, passportCity: d.passportCity,
    passportLostOrStolen: d.passportLostOrStolen,
    facebook: d.facebook, instagram: d.instagram, linkedin: d.linkedin,
    otherSocialMedia: d.otherSocialMedia,
    usDriversLicense: d.usDriversLicense, usTaxId: d.usTaxId,
    currentPosition: d.currentPosition, currentEmployer: d.currentEmployer,
    currentJobDescription: d.currentJobDescription, currentSalary: d.currentSalary,
    currentJobAddress: d.currentJobAddress, currentJobPostalCode: d.currentJobPostalCode,
    currentJobPhone: d.currentJobPhone, currentJobStartDate: d.currentJobStartDate,
    hasPreviousJob: d.hasPreviousJob, previousEmployer: d.previousEmployer,
    previousPosition: d.previousPosition, previousJobAddress: d.previousJobAddress,
    previousJobPhone: d.previousJobPhone, previousSupervisorName: d.previousSupervisorName,
    previousJobDescription: d.previousJobDescription,
    previousJobStartDate: d.previousJobStartDate, previousJobEndDate: d.previousJobEndDate,
    bachelorInstitution: d.bachelorInstitution, universityInstitution: d.universityInstitution,
    careerName: d.careerName, educationAddress: d.educationAddress,
    educationCity: d.educationCity, educationProvince: d.educationProvince,
    educationPostalCode: d.educationPostalCode, educationStartDate: d.educationStartDate,
    educationEndDate: d.educationEndDate, educationPhone: d.educationPhone,
    languages: d.languages,
    fatherName: d.fatherName, fatherBirthdate: d.fatherBirthdate, fatherInUSA: d.fatherInUSA,
    motherName: d.motherName, motherBirthdate: d.motherBirthdate, motherInUSA: d.motherInUSA,
    immediateRelativesInUSA: d.immediateRelativesInUSA, otherRelativesInUSA: d.otherRelativesInUSA,
    travelHistory: d.travelHistory, hasActiveVisa: d.hasActiveVisa,
    visaCountry: d.visaCountry, visaIssueDate: d.visaIssueDate,
    visaDenied: d.visaDenied, visaDeniedDetails: d.visaDeniedDetails,
    deportedFromCountry: d.deportedFromCountry, deportedDetails: d.deportedDetails,
    travelersCount: d.travelersCount, travelRelationship: d.travelRelationship,
    tripPurpose: d.tripPurpose, tripPayer: d.tripPayer,
    contagiousDisease: d.contagiousDisease, medicalTreatment: d.medicalTreatment,
    covidVaccine: d.covidVaccine, covidDoses: d.covidDoses,
  }
}

function buildResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// doPost — recibe el formulario como application/x-www-form-urlencoded
// El frontend envía: payload={"fullName":"...","cedula":"..."}
// Esto evita el preflight CORS que bloquea los JSON directos.
// ============================================================
function doPost(e) {
  try {
    // Leer el campo "payload" del form-encoded body
    var raw = e.parameter && e.parameter.payload
      ? e.parameter.payload
      : e.postData.contents          // fallback para pruebas con curl/JSON

    var data = JSON.parse(raw)
    var result = processForm(data)
    return buildResponse(result)
  } catch (err) {
    return buildResponse({ success: false, message: 'Error interno: ' + err.message })
  }
}

// Prueba desde el navegador (GET)
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'IntiTrip Apps Script activo ✓' })
  ).setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// Lógica principal
// ============================================================
function processForm(data) {
  var folderName   = buildFolderName(data.fullName, data.cedula)
  var parentFolder = DriveApp.getFolderById(CONFIG.PARENT_FOLDER_ID)
  var clientFolder = parentFolder.createFolder(folderName)

  var templateFile = DriveApp.getFileById(CONFIG.TEMPLATE_DOC_ID)
  var newFile      = templateFile.makeCopy('Formulario_' + folderName, clientFolder)
  var doc          = DocumentApp.openById(newFile.getId())
  var body         = doc.getBody()

  var replacements = buildReplacements(data)
  Object.keys(replacements).forEach(function(key) {
    body.replaceText('{{' + key + '}}', replacements[key] || 'N/A')
  })
  doc.saveAndClose()

  var pdfBlob = DriveApp.getFileById(newFile.getId()).getAs('application/pdf')
  pdfBlob.setName('Visa_' + folderName + '.pdf')
  var pdfFile = clientFolder.createFile(pdfBlob)
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  return {
    success:  true,
    message:  'Formulario procesado exitosamente',
    folderId: clientFolder.getId(),
    pdfUrl:   'https://drive.google.com/file/d/' + pdfFile.getId() + '/view',
  }
}

// ============================================================
// Helpers
// ============================================================
function buildFolderName(fullName, cedula) {
  var normalized = (fullName || 'sin_nombre')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
  return normalized + '_' + (cedula || 'sin_cedula')
}

function buildReplacements(d) {
  return {
    cedula: d.cedula, fullName: d.fullName, maritalStatus: d.maritalStatus,
    spouseName: d.spouseName, spouseBirthdate: d.spouseBirthdate,
    spouseNationality: d.spouseNationality, nationality: d.nationality,
    otherNationality: d.otherNationality,
    isPermanentResidentAbroad: d.isPermanentResidentAbroad,
    homePhone: d.homePhone, city: d.city, province: d.province,
    cellPhone: d.cellPhone, previousPhones: d.previousPhones,
    address: d.address, postalCode: d.postalCode, email: d.email,
    previousEmails: d.previousEmails, passportCity: d.passportCity,
    passportLostOrStolen: d.passportLostOrStolen,
    facebook: d.facebook, instagram: d.instagram, linkedin: d.linkedin,
    otherSocialMedia: d.otherSocialMedia,
    usDriversLicense: d.usDriversLicense, usTaxId: d.usTaxId,
    currentPosition: d.currentPosition, currentEmployer: d.currentEmployer,
    currentJobDescription: d.currentJobDescription, currentSalary: d.currentSalary,
    currentJobAddress: d.currentJobAddress, currentJobPostalCode: d.currentJobPostalCode,
    currentJobPhone: d.currentJobPhone, currentJobStartDate: d.currentJobStartDate,
    hasPreviousJob: d.hasPreviousJob, previousEmployer: d.previousEmployer,
    previousPosition: d.previousPosition, previousJobAddress: d.previousJobAddress,
    previousJobPhone: d.previousJobPhone, previousSupervisorName: d.previousSupervisorName,
    previousJobDescription: d.previousJobDescription,
    previousJobStartDate: d.previousJobStartDate, previousJobEndDate: d.previousJobEndDate,
    bachelorInstitution: d.bachelorInstitution, universityInstitution: d.universityInstitution,
    careerName: d.careerName, educationAddress: d.educationAddress,
    educationCity: d.educationCity, educationProvince: d.educationProvince,
    educationPostalCode: d.educationPostalCode, educationStartDate: d.educationStartDate,
    educationEndDate: d.educationEndDate, educationPhone: d.educationPhone,
    languages: d.languages,
    fatherName: d.fatherName, fatherBirthdate: d.fatherBirthdate, fatherInUSA: d.fatherInUSA,
    motherName: d.motherName, motherBirthdate: d.motherBirthdate, motherInUSA: d.motherInUSA,
    immediateRelativesInUSA: d.immediateRelativesInUSA, otherRelativesInUSA: d.otherRelativesInUSA,
    travelHistory: d.travelHistory, hasActiveVisa: d.hasActiveVisa,
    visaCountry: d.visaCountry, visaIssueDate: d.visaIssueDate,
    visaDenied: d.visaDenied, visaDeniedDetails: d.visaDeniedDetails,
    deportedFromCountry: d.deportedFromCountry, deportedDetails: d.deportedDetails,
    travelersCount: d.travelersCount, travelRelationship: d.travelRelationship,
    tripPurpose: d.tripPurpose, tripPayer: d.tripPayer,
    contagiousDisease: d.contagiousDisease, medicalTreatment: d.medicalTreatment,
    covidVaccine: d.covidVaccine, covidDoses: d.covidDoses,
  }
}

function buildResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
