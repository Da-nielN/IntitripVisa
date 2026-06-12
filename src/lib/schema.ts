import { z } from 'zod'

const req = (msg = 'Campo requerido') => z.string().min(1, msg)
const siNo = z.enum(['si', 'no'])
const optionalStr = z.string().optional().default('')

export const visaFormSchema = z.object({
  cedula: req('Cédula requerida').min(10, 'Mínimo 10 dígitos'),
  fullName: req('Nombre completo requerido'),
  maritalStatus: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'], {
    required_error: 'Estado civil requerido',
  }),
  spouseName: optionalStr,
  spouseBirthdate: optionalStr,
  spouseNationality: optionalStr,
  nationality: req('Nacionalidad requerida'),
  otherNationality: optionalStr,
  isPermanentResidentAbroad: siNo,
  homePhone: optionalStr,
  city: req('Ciudad requerida'),
  province: req('Provincia requerida'),
  cellPhone: req('Celular requerido'),
  previousPhones: optionalStr,
  address: req('Dirección requerida'),
  postalCode: req('Código postal requerido'),
  email: req('Email requerido').email('Email inválido'),
  previousEmails: optionalStr,
  passportCity: req('Ciudad del pasaporte requerida'),
  passportLostOrStolen: siNo,

  facebook: optionalStr,
  instagram: optionalStr,
  linkedin: optionalStr,
  otherSocialMedia: optionalStr,

  usDriversLicense: siNo,
  usTaxId: optionalStr,

  currentPosition: req('Cargo actual requerido'),
  currentEmployer: req('Empleador actual requerido'),
  currentJobDescription: req('Descripción de funciones requerida'),
  currentSalary: req('Sueldo requerido'),
  currentJobAddress: req('Dirección del trabajo requerida'),
  currentJobPostalCode: optionalStr,
  currentJobPhone: optionalStr,
  currentJobStartDate: req('Fecha de inicio requerida'),

  hasPreviousJob: siNo,
  previousEmployer: optionalStr,
  previousPosition: optionalStr,
  previousJobAddress: optionalStr,
  previousJobPostalCode: optionalStr,
  previousJobPhone: optionalStr,
  previousSupervisorName: optionalStr,
  previousJobDescription: optionalStr,
  previousJobStartDate: optionalStr,
  previousJobEndDate: optionalStr,

  bachelorInstitution: optionalStr,
  universityInstitution: req('Institución universitaria requerida'),
  careerName: req('Carrera requerida'),
  educationAddress: optionalStr,
  educationCity: optionalStr,
  educationProvince: optionalStr,
  educationPostalCode: optionalStr,
  educationStartDate: optionalStr,
  educationEndDate: optionalStr,
  educationPhone: optionalStr,
  languages: req('Idiomas requeridos'),

  fatherName: req('Nombre del padre requerido'),
  fatherBirthdate: req('Fecha de nacimiento del padre requerida'),
  fatherInUSA: siNo,
  motherName: req('Nombre de la madre requerida'),
  motherBirthdate: req('Fecha de nacimiento de la madre requerida'),
  motherInUSA: siNo,
  immediateRelativesInUSA: siNo,
  otherRelativesInUSA: siNo,

  travelHistory: optionalStr,
  hasActiveVisa: siNo,
  visaCountry: optionalStr,
  visaIssueDate: optionalStr,
  visaDenied: siNo,
  visaDeniedDetails: optionalStr,
  deportedFromCountry: siNo,
  deportedDetails: optionalStr,

  travelersCount: req('Número de viajeros requerido'),
  travelRelationship: optionalStr,
  tripPurpose: req('Motivo del viaje requerido'),
  tripPayer: z.enum(['yo', 'empresa', 'familiar', 'otro']),

  contagiousDisease: siNo,
  medicalTreatment: siNo,
  covidVaccine: siNo,
  covidDoses: optionalStr,
})

export type VisaFormSchema = z.infer<typeof visaFormSchema>

// Alias kept for legacy imports in Step* components
export type VisaFormData = VisaFormSchema
