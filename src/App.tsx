import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react'

import { visaFormSchema, type VisaFormSchema } from './lib/schema'
import { submitVisaForm } from './services/appsScript'
import { usarMultiplesPasos } from './ganchos/usarMultiplesPasos'

import { Header } from './components/layout/Header'
import { SuccessScreen } from './components/layout/SuccessScreen'
import { IndicadorPasos } from './components/interfaz/IndicadorPasos'

import { SeccionPersonal } from './components/formulario/SeccionPersonal'
import { SeccionRedesSociales } from './components/formulario/SeccionRedesSociales'
import { SeccionTrabajo } from './components/formulario/SeccionTrabajo'
import { SeccionFamilia } from './components/formulario/SeccionFamilia'
import { SeccionViaje } from './components/formulario/SeccionViaje'
import { SeccionRevision } from './components/formulario/SeccionRevision'

const PASOS = [
  { label: 'Personal', icon: '1' },
  { label: 'Viaje', icon: '2' },
  { label: 'Social', icon: '3' },
  { label: 'Trabajo', icon: '4' },
  { label: 'Familia', icon: '5' },
  { label: 'Revisión', icon: '6' },
]

const CAMPOS_POR_PASO: (keyof VisaFormSchema)[][] = [
  //['cedula', 'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'fechaNacimiento', 'sexo', 'estadoCivil', 'nombresConyuge', 'apellidosConyuge', 'fechaNacimientoConyuge', 'nacionalidadConyuge', 'paisNacimientoConyuge', 'ciudadNacimientoConyuge', 'direccionConyuge', 'direccionConyugeOtro', 'nacionalidad', 'tieneOtraNacionalidad', 'otraNacionalidad', 'esResidentePermanenteExtranjero', 'paisResidenciaPermanente', 'ciudad', 'provincia', 'celular', 'tuvoTelefonosAnteriores', 'telefonosAnteriores', 'direccion', 'codigoPostal', 'correo', 'tuvoCorreosAnteriores', 'correosAnteriores', 'ciudadPasaporte', 'pasaportePerdidoORobado', 'numeroPasaportePerdidoORobado', 'paisAutoridadPasaportePerdidoORobado', 'explicacionPasaportePerdidoORobado', 'licenciaConducirEEUU', 'tieneIdentificacionFiscalEEUU', 'identificacionFiscalEEUU'],
  [],
  //['categoriaMotivoViaje', 'tipoVisa', 'tienePlanesViajeConcretos', 'pagadorViaje', 'viajaConOtros', 'haVisitadoEEUU', 'haTenidoVisaEEUU', 'visaNegada', 'tienePeticionInmigracion', 'enfermedadContagiosa', 'detalleEnfermedadContagiosa'],
  [],
  [],
  //['cargoActual', 'empleadorActual', 'descripcionTrabajoActual', 'sueldoActual', 'fechaInicioTrabajoActual', 'direccionTrabajoActual', 'tuvoTrabajoAnterior'],
  [],
  //['nombrePadre', 'fechaNacimientoPadre', 'padreEnEEUU', 'nombreMadre', 'fechaNacimientoMadre', 'madreEnEEUU', 'familiaresInmediatosEnEEUU', 'otrosFamiliaresEnEEUU'],
  [],
  [],
]

export default function App() {
  const [enviado, setEnviado] = useState(false)
  const [urlPdf, setUrlPdf] = useState<string>()
  const [cargando, setCargando] = useState(false)
  const [errorApi, setErrorApi] = useState<string>()
  const [modoOscuro, setModoOscuro] = useState(() => localStorage.getItem('intitrip-theme') !== 'light')

  const { pasoActual, esPrimero, esUltimo, siguiente, anterior } = usarMultiplesPasos(PASOS.length)

  const formulario = useForm<VisaFormSchema>({
    resolver: zodResolver(visaFormSchema),
    mode: 'onTouched',
    defaultValues: {
      tieneOtraNacionalidad: 'no',
      nombresConyuge: '',
      apellidosConyuge: '',
      nombreConyuge: '',
      fechaNacimientoConyuge: '',
      nacionalidadConyuge: '',
      paisNacimientoConyuge: '',
      ciudadNacimientoConyuge: '',
      direccionConyuge: '',
      direccionConyugeOtro: '',
      esResidentePermanenteExtranjero: 'no',
      tuvoTelefonosAnteriores: 'no',
      tuvoCorreosAnteriores: 'no',
      pasaportePerdidoORobado: 'no',
      numeroPasaportePerdidoORobado: '',
      paisAutoridadPasaportePerdidoORobado: '',
      explicacionPasaportePerdidoORobado: '',
      licenciaConducirEEUU: 'no',
      numeroLicenciaConducirEEUU: '',
      estadoLicenciaConducirEEUU: '',
      tieneIdentificacionFiscalEEUU: 'no',
      tuvoTrabajoAnterior: 'no',
      asistioInstitucionEducativa: 'no',
      nombresPadre: '',
      apellidosPadre: '',
      nombrePadre: '',
      padreEnEEUU: 'no',
      estatusPadreEEUU: '',
      nombresMadre: '',
      apellidosMadre: '',
      nombreMadre: '',
      madreEnEEUU: 'no',
      estatusMadreEEUU: '',
      familiaresInmediatosEnEEUU: 'no',
      familiaresInmediatosDetalle: [],
      otrosFamiliaresEnEEUU: 'no',
      tieneVisaActiva: 'no',
      visaNegada: 'no',
      deportadoDePais: 'no',
      tienePlanesViajeConcretos: 'no',
      unidadDuracionEstadiaPrevista: 'dias',
      pagadorViaje: 'YO',
      viajaConOtros: 'no',
      acompanantesViaje: [],
      haVisitadoEEUU: 'no',
      visitasAnterioresEEUU: [],
      haTenidoVisaEEUU: 'no',
      mismoTipoVisa: 'no',
      mismoPaisResidenciaVisa: 'no',
      diezHuellasTomadas: 'no',
      visaEEUUPerdidaORobada: 'no',
      motivoVisaEEUUPerdidaORobada: '',
      anioVisaEEUUPerdidaORobada: '',
      visaEEUUCanceladaORevocada: 'no',
      razonVisaEEUUCanceladaORevocada: '',
      tienePeticionInmigracion: 'no',
      enfermedadContagiosa: 'no',
      detalleEnfermedadContagiosa: '',
    },
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', modoOscuro)
    localStorage.setItem('intitrip-theme', modoOscuro ? 'dark' : 'light')
  }, [modoOscuro])

  const manejarSiguiente = async () => {
    const campos = CAMPOS_POR_PASO[pasoActual]
    const esValido = campos.length === 0 || await formulario.trigger(campos)
    if (esValido) siguiente()
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const alEnviar = async (datos: VisaFormSchema) => {
    setCargando(true)
    setErrorApi(undefined)
    try {
      const resultado = await submitVisaForm({
        ...datos,
        nombreCompleto: [datos.primerNombre, datos.segundoNombre, datos.primerApellido, datos.segundoApellido].filter(Boolean).join(' '),
        nombreConyuge: [datos.nombresConyuge, datos.apellidosConyuge].filter(Boolean).join(' '),
        nombrePadre: [datos.nombresPadre, datos.apellidosPadre].filter(Boolean).join(' '),
        nombreMadre: [datos.nombresMadre, datos.apellidosMadre].filter(Boolean).join(' '),
      })
      if (resultado.success) {
        setUrlPdf(resultado.pdfUrl)
        setEnviado(true)
      } else {
        setErrorApi(resultado.message || 'Error desconocido al enviar el formulario.')
      }
    } catch (error) {
      setErrorApi(error instanceof Error ? error.message : 'Error de conexión. Verifique su internet e intente nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
        <Header isDark={modoOscuro} onToggleTheme={() => setModoOscuro((valor) => !valor)} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <SuccessScreen pdfUrl={urlPdf} onReset={() => { setEnviado(false); formulario.reset() }} />
        </main>
      </div>
    )
  }

  const datosFormulario = formulario.watch()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <Header isDark={modoOscuro} onToggleTheme={() => setModoOscuro((valor) => !valor)} />

      <div className="bg-gradient-to-r from-brand-teal to-[#174f57] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-white/70 text-sm">
            Complete el formulario en su totalidad. Campos marcados con <span className="text-brand-brown font-bold">*</span> son obligatorios.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <IndicadorPasos pasos={PASOS} pasoActual={pasoActual} />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-base">
            {PASOS[pasoActual].icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest dark:text-slate-500">Paso {pasoActual + 1} de {PASOS.length}</p>
            <h2 className="font-display font-bold text-brand-teal text-lg leading-tight dark:text-emerald-300">{PASOS[pasoActual].label}</h2>
          </div>
        </div>

        <form onSubmit={formulario.handleSubmit(alEnviar)} noValidate>
          <div className="space-y-6">
            {pasoActual === 0 && <SeccionPersonal form={formulario} />}
            {pasoActual === 1 && <SeccionViaje form={formulario} />}
            {pasoActual === 2 && <SeccionRedesSociales form={formulario} />}
            {pasoActual === 3 && <SeccionTrabajo form={formulario} />}
            {pasoActual === 4 && <SeccionFamilia form={formulario} />}
            {pasoActual === 5 && <SeccionRevision data={datosFormulario} />}
          </div>

          {errorApi && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              <span className="text-red-500 shrink-0 mt-0.5">!</span>
              <div>
                <strong>Error al enviar:</strong> {errorApi}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={anterior} disabled={esPrimero} className="btn-secondary disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {esUltimo ? (
              <button type="submit" disabled={cargando} className="btn-primary min-w-[140px]">
                {cargando ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar formulario</>
                )}
              </button>
            ) : (
              <button type="button" onClick={manejarSiguiente} className="btn-primary">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </main>

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
