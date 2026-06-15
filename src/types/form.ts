export interface VisaFormData {
  // Personal
  firstName: string
  middleName: string
  paternalLastName: string
  maternalLastName: string
  fullName?: string
  birthdate: string
  sex: 'masculino' | 'femenino'
  maritalStatus: 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre'
  spouseName: string
  spouseBirthdate: string
  spouseNationality: string
  nationality: string
  hasOtherNationality: 'si' | 'no'
  otherNationality: string
  isPermanentResidentAbroad: 'si' | 'no'
  permanentResidentCountry: string
  homePhone: string
  city: string
  province: string
  cellPhone: string
  previousPhones: string
  address: string
  postalCode: string
  email: string
  hasPreviousEmails: 'si' | 'no'
  previousEmails: string
  passportCity: string
  passportLostOrStolen: 'si' | 'no'

  // Social Media
  facebook: string
  instagram: string
  linkedin: string
  otherSocialMedia: string

  // Documents
  usDriversLicense: 'si' | 'no'
  hasUsTaxId: 'si' | 'no'
  usTaxId: string

  // Current Job
  currentPosition: string
  currentEmployer: string
  currentJobDescription: string
  currentSalary: string
  currentJobAddress: string
  currentJobPostalCode: string
  currentJobPhone: string
  currentJobStartDate: string

  // Previous Job
  hasPreviousJob: 'si' | 'no'
  previousEmployer: string
  previousPosition: string
  previousJobAddress: string
  previousJobPostalCode: string
  previousJobPhone: string
  previousSupervisorName: string
  previousJobDescription: string
  previousJobStartDate: string
  previousJobEndDate: string

  // Education
  bachelorInstitution: string
  universityInstitution: string
  careerName: string
  educationAddress: string
  educationCity: string
  educationProvince: string
  educationPostalCode: string
  educationStartDate: string
  educationEndDate: string
  educationPhone: string
  languages: string

  // Family
  fatherName: string
  fatherBirthdate: string
  fatherInUSA: 'si' | 'no'
  motherName: string
  motherBirthdate: string
  motherInUSA: 'si' | 'no'
  immediateRelativesInUSA: 'si' | 'no'
  otherRelativesInUSA: 'si' | 'no'

  // Travel
  travelHistory: string
  hasActiveVisa: 'si' | 'no'
  visaCountry: string
  visaIssueDate: string
  visaDenied: 'si' | 'no'
  visaDeniedDetails: string
  deportedFromCountry: 'si' | 'no'
  deportedDetails: string

  // Trip
  travelersCount: string
  travelRelationship: string
  tripPurpose: string
  tripPayer: 'yo' | 'empresa' | 'familiar' | 'otro'

  // Health
  contagiousDisease: 'si' | 'no'
  medicalTreatment: 'si' | 'no'
  covidVaccine: 'si' | 'no'
  covidDoses: string

  // Cedula (for folder name)
  cedula: string
}

export interface ApiResponse {
  success: boolean
  message: string
  folderId?: string
  pdfUrl?: string
}

