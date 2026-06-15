import { z } from 'zod'

const req = (msg = 'Campo requerido') => z.string().min(1, msg)
const siNo = z.enum(['si', 'no'])
const optionalStr = z.string().optional().default('')
const digits = (msg: string) => z.string().regex(/^\d+$/, msg)

export const visaFormSchema = z.object({
  cedula: req('Cédula requerida').min(10, 'Mínimo 10 dígitos'),
  firstName: req('Primer nombre requerido'),
  middleName: req('Segundo nombre requerido'),
  paternalLastName: req('Primer apellido requerido'),
  maternalLastName: req('Segundo apellido requerido'),
  fullName: optionalStr,
  birthdate: req('Fecha de nacimiento requerida'),
  sex: z.enum(['masculino', 'femenino'], {
    required_error: 'Sexo requerido',
  }),
  maritalStatus: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'], {
    required_error: 'Estado civil requerido',
  }),
  spouseName: optionalStr,
  spouseBirthdate: optionalStr,
  spouseNationality: optionalStr,
  nationality: req('Nacionalidad requerida'),
  hasOtherNationality: siNo,
  otherNationality: optionalStr,
  isPermanentResidentAbroad: siNo,
  permanentResidentCountry: optionalStr,
  homePhone: z.string().regex(/^\d{7}$|^$/, 'Teléfono domicilio debe tener 7 dígitos').optional().default(''),
  city: req('Ciudad requerida'),
  province: req('Provincia requerida'),
  cellPhone: digits('Celular debe contener solo números').length(10, 'Celular debe tener 10 dígitos'),
  previousPhones: optionalStr,
  address: req('Dirección requerida'),
  postalCode: digits('Código postal debe contener solo números'),
  email: req('Email requerido').email('Email inválido'),
  hasPreviousEmails: siNo,
  previousEmails: optionalStr,
  passportCity: req('Ciudad del pasaporte requerida'),
  passportLostOrStolen: siNo,

  facebook: optionalStr,
  instagram: optionalStr,
  linkedin: optionalStr,
  otherSocialMedia: optionalStr,

  usDriversLicense: siNo,
  hasUsTaxId: siNo,
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
}).superRefine((data, ctx) => {
  if (data.hasPreviousEmails === 'si') {
    const emailValidation = z.string().email().safeParse(data.previousEmails)
    if (!emailValidation.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese un correo anterior válido',
        path: ['previousEmails'],
      })
    }
  }

  if (data.hasOtherNationality === 'si' && !data.otherNationality) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione la otra nacionalidad',
      path: ['otherNationality'],
    })
  }

  if (data.isPermanentResidentAbroad === 'si' && !data.permanentResidentCountry) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Seleccione el país de residencia permanente',
      path: ['permanentResidentCountry'],
    })
  }

  if (data.hasUsTaxId === 'si') {
    if (!data.usTaxId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingrese el número de identificación fiscal',
        path: ['usTaxId'],
      })
    } else if (!/^\d+$/.test(data.usTaxId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La identificación fiscal debe contener solo números',
        path: ['usTaxId'],
      })
    }
  }
})

export type VisaFormSchema = z.infer<typeof visaFormSchema>

// Alias kept for legacy imports in Step* components
export type VisaFormData = VisaFormSchema


