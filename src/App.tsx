import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react'

import { visaFormSchema, type VisaFormSchema } from './lib/schema'
import { submitVisaForm } from './services/appsScript'
import { useMultiStep } from './hooks/useMultiStep'

import { Header } from './components/layout/Header'
import { SuccessScreen } from './components/layout/SuccessScreen'
import { StepIndicator } from './components/ui/StepIndicator'

import { PersonalSection } from './components/form/PersonalSection'
import { SocialMediaSection } from './components/form/SocialMediaSection'
import { WorkSection } from './components/form/WorkSection'
import { EducationSection } from './components/form/EducationSection'
import { FamilySection } from './components/form/FamilySection'
import { TravelSection } from './components/form/TravelSection'
import { ReviewSection } from './components/form/ReviewSection'

const STEPS = [
  { label: 'Personal', icon: '👤' },
  { label: 'Social', icon: '📱' },
  { label: 'Trabajo', icon: '💼' },
  { label: 'Estudios', icon: '🎓' },
  { label: 'Familia', icon: '👨‍👩‍👧' },
  { label: 'Viaje', icon: '✈️' },
  { label: 'Revisión', icon: '✅' },
]

// Step-specific fields to validate per step (trigger on next)
const STEP_FIELDS: (keyof VisaFormSchema)[][] = [
  ['cedula', 'fullName', 'maritalStatus', 'nationality', 'city', 'province', 'cellPhone', 'address', 'postalCode', 'email', 'passportCity', 'passportLostOrStolen', 'isPermanentResidentAbroad'],
  ['usDriversLicense'],
  ['currentPosition', 'currentEmployer', 'currentJobDescription', 'currentSalary', 'currentJobStartDate', 'currentJobAddress', 'hasPreviousJob'],
  ['universityInstitution', 'careerName', 'languages'],
  ['fatherName', 'fatherBirthdate', 'fatherInUSA', 'motherName', 'motherBirthdate', 'motherInUSA', 'immediateRelativesInUSA', 'otherRelativesInUSA'],
  ['hasActiveVisa', 'visaDenied', 'deportedFromCountry', 'travelersCount', 'tripPurpose', 'tripPayer', 'contagiousDisease', 'medicalTreatment', 'covidVaccine'],
  [],
]

export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string>()
  const [isDark, setIsDark] = useState(() => localStorage.getItem('intitrip-theme') !== 'light')

  const { currentStep, isFirst, isLast, next, prev } = useMultiStep(STEPS.length)

  const form = useForm<VisaFormSchema>({
    resolver: zodResolver(visaFormSchema),
    mode: 'onTouched',
    defaultValues: {
      isPermanentResidentAbroad: 'no',
      passportLostOrStolen: 'no',
      usDriversLicense: 'no',
      hasPreviousJob: 'no',
      fatherInUSA: 'no',
      motherInUSA: 'no',
      immediateRelativesInUSA: 'no',
      otherRelativesInUSA: 'no',
      hasActiveVisa: 'no',
      visaDenied: 'no',
      deportedFromCountry: 'no',
      tripPayer: 'yo',
      contagiousDisease: 'no',
      medicalTreatment: 'no',
      covidVaccine: 'si',
    },
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('intitrip-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]
    const valid = fields.length === 0 || await form.trigger(fields)
    if (valid) next()
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: VisaFormSchema) => {
    setLoading(true)
    setApiError(undefined)
    try {
      const result = await submitVisaForm(data as never)
      if (result.success) {
        setPdfUrl(result.pdfUrl)
        setSubmitted(true)
      } else {
        setApiError(result.message || 'Error desconocido al enviar el formulario.')
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error de conexión. Verifique su internet e intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
        <Header isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <SuccessScreen pdfUrl={pdfUrl} onReset={() => { setSubmitted(false); form.reset() }} />
        </main>
      </div>
    )
  }

  const formData = form.watch()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <Header isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />

      {/* Hero bar */}
      <div className="bg-gradient-to-r from-brand-teal to-[#174f57] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-white/70 text-sm">
            Complete el formulario en su totalidad. Campos marcados con <span className="text-brand-brown font-bold">*</span> son obligatorios.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Step indicator */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Current step heading */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-base">
            {STEPS[currentStep].icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest dark:text-slate-500">Paso {currentStep + 1} de {STEPS.length}</p>
            <h2 className="font-display font-bold text-brand-teal text-lg leading-tight dark:text-emerald-300">{STEPS[currentStep].label}</h2>
          </div>
        </div>

        {/* Form sections */}
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-6">
            {currentStep === 0 && <PersonalSection form={form} />}
            {currentStep === 1 && <SocialMediaSection form={form} />}
            {currentStep === 2 && <WorkSection form={form} />}
            {currentStep === 3 && <EducationSection form={form} />}
            {currentStep === 4 && <FamilySection form={form} />}
            {currentStep === 5 && <TravelSection form={form} />}
            {currentStep === 6 && <ReviewSection data={formData} />}
          </div>

          {/* API error */}
          {apiError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              <span className="text-red-500 shrink-0 mt-0.5">⚠️</span>
              <div>
                <strong>Error al enviar:</strong> {apiError}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={prev} disabled={isFirst} className="btn-secondary disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {isLast ? (
              <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar formulario</>
                )}
              </button>
            ) : (
              <button type="button" onClick={handleNext} className="btn-primary">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 bg-white transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 5 7 13 7 13s7-8 7-13c0-3.866-3.134-7-7-7z" fill="#349A5E"/>
              <circle cx="12" cy="9" r="3" fill="#2a7a4b"/>
              <ellipse cx="12" cy="9.5" rx="2" ry="2.5" fill="#f5e6d0"/>
              <circle cx="11" cy="8.5" r="0.4" fill="#2c1810"/>
              <circle cx="13" cy="8.5" r="0.4" fill="#2c1810"/>
            </svg>
            <span className="text-xs text-slate-500 font-medium dark:text-slate-400">IntiTrip Agencia de Viajes</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Todos los datos son tratados con estricta confidencialidad</p>
        </div>
      </footer>
    </div>
  )
}
