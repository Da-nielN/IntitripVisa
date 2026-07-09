import React from 'react'
import { VisaFormSchema } from '../../lib/schema'
import { ClipboardCheck } from 'lucide-react'

interface Props { data: VisaFormSchema }

const FilaResumen = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-slate-50 last:border-0 dark:border-slate-800">
      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide sm:w-52 shrink-0 dark:text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800 mt-0.5 sm:mt-0 dark:text-slate-100">{value}</dd>
    </div>
  ) : null
)

const formatearAcompanantes = (acompanantes?: VisaFormSchema['acompanantesViaje']) => (
  acompanantes?.map((acompanante) => (
    [acompanante.apellidos, acompanante.nombres, acompanante.relacion].filter(Boolean).join(' - ')
  )).filter(Boolean).join('; ')
)

const formatearVisitas = (visitas?: VisaFormSchema['visitasAnterioresEEUU']) => (
  visitas?.map((visita) => (
    [visita.fechaLlegada, visita.valorDuracion && `${visita.valorDuracion} ${visita.unidadDuracion}`].filter(Boolean).join(' - ')
  )).filter(Boolean).join('; ')
)

const formatearFamiliaresInmediatos = (familiares?: VisaFormSchema['familiaresInmediatosDetalle']) => (
  familiares?.map((familiar) => (
    [familiar.apellidos, familiar.nombres, familiar.relacion, familiar.estatus].filter(Boolean).join(' - ')
  )).filter(Boolean).join('; ')
)

export const SeccionRevision: React.FC<Props> = ({ data }) => (
  <div className="section-card">
    <h2 className="section-title"><ClipboardCheck className="w-5 h-5 text-brand-green" /> Revisión Final</h2>
    <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">Por favor, verifique que todos los datos sean correctos antes de enviar.</p>
    <dl className="divide-y divide-slate-50 dark:divide-slate-800">
      <FilaResumen label="Cédula" value={data.cedula} />
      <FilaResumen label="Primer nombre" value={data.primerNombre} />
      <FilaResumen label="Segundo nombre" value={data.segundoNombre} />
      <FilaResumen label="Primer apellido" value={data.primerApellido} />
      <FilaResumen label="Segundo apellido" value={data.segundoApellido} />
      <FilaResumen label="Fecha de nacimiento" value={data.fechaNacimiento} />
      <FilaResumen label="Sexo" value={data.sexo} />
      <FilaResumen label="Estado civil" value={data.estadoCivil} />
      <FilaResumen label="Nombres del cónyuge" value={data.nombresConyuge} />
      <FilaResumen label="Apellidos del cónyuge" value={data.apellidosConyuge} />
      <FilaResumen label="Fecha de nacimiento del cónyuge" value={data.fechaNacimientoConyuge} />
      <FilaResumen label="Nacionalidad del cónyuge" value={data.nacionalidadConyuge} />
      <FilaResumen label="País de nacimiento del cónyuge" value={data.paisNacimientoConyuge} />
      <FilaResumen label="Ciudad de nacimiento del cónyuge" value={data.ciudadNacimientoConyuge} />
      <FilaResumen label="Dirección del cónyuge" value={data.direccionConyuge} />
      <FilaResumen label="Dirección del cónyuge especificada" value={data.direccionConyugeOtro} />
      <FilaResumen label="Nacionalidad" value={data.nacionalidad} />
      <FilaResumen label="Otra nacionalidad" value={data.otraNacionalidad} />
      <FilaResumen label="País de residencia permanente" value={data.paisResidenciaPermanente} />
      <FilaResumen label="Ciudad" value={data.ciudad} />
      <FilaResumen label="Celular" value={data.celular} />
      <FilaResumen label="Otros celulares en los últimos 5 años" value={data.tuvoTelefonosAnteriores} />
      <FilaResumen label="Otro celular" value={data.telefonosAnteriores} />
      <FilaResumen label="Email" value={data.correo} />
      <FilaResumen label="Correo anterior" value={data.correosAnteriores} />
      <FilaResumen label="Dirección" value={data.direccion} />
      <FilaResumen label="Pasaporte perdido o robado" value={data.pasaportePerdidoORobado} />
      <FilaResumen label="Número de pasaporte/documento de viaje" value={data.numeroPasaportePerdidoORobado} />
      <FilaResumen label="País/Autoridad del pasaporte/documento de viaje" value={data.paisAutoridadPasaportePerdidoORobado} />
      <FilaResumen label="Explicación pasaporte perdido o robado" value={data.explicacionPasaportePerdidoORobado} />
      <FilaResumen label="Licencia de conducir EE.UU." value={data.licenciaConducirEEUU} />
      <FilaResumen label="Número de licencia de conducir" value={data.numeroLicenciaConducirEEUU} />
      <FilaResumen label="Estado de emisión de licencia" value={data.estadoLicenciaConducirEEUU} />
      <FilaResumen label="Identificación fiscal EE.UU." value={data.identificacionFiscalEEUU} />
      <FilaResumen label="Facebook" value={data.facebook} />
      <FilaResumen label="Instagram" value={data.instagram} />
      <FilaResumen label="Ocupación actual" value={data.categoriaOcupacionActual} />
      <FilaResumen label="Empresa o escuela actual" value={data.empleadorActual} />
      <FilaResumen label="Dirección actual" value={data.direccionTrabajoActual} />
      <FilaResumen label="Provincia actual" value={data.provinciaTrabajoActual} />
      <FilaResumen label="Ciudad actual" value={data.ciudadTrabajoActual} />
      <FilaResumen label="Teléfono actual" value={data.telefonoTrabajoActual} />
      <FilaResumen label="Fecha de inicio actual" value={data.fechaInicioTrabajoActual} />
      <FilaResumen label="Funciones actuales" value={data.descripcionTrabajoActual} />
      <FilaResumen label="Tuvo trabajos anteriores" value={data.tuvoTrabajoAnterior} />
      <FilaResumen label="Empleador anterior" value={data.empleadorAnterior} />
      <FilaResumen label="Dirección trabajo anterior" value={data.direccionTrabajoAnterior} />
      <FilaResumen label="Provincia trabajo anterior" value={data.provinciaTrabajoAnterior} />
      <FilaResumen label="Ciudad trabajo anterior" value={data.ciudadTrabajoAnterior} />
      <FilaResumen label="Teléfono trabajo anterior" value={data.telefonoTrabajoAnterior} />
      <FilaResumen label="Código postal trabajo anterior" value={data.codigoPostalTrabajoAnterior} />
      <FilaResumen label="Cargo anterior" value={data.cargoAnterior} />
      <FilaResumen label="Nombres empleador anterior" value={data.nombreSupervisorAnterior} />
      <FilaResumen label="Apellidos empleador anterior" value={data.apellidosSupervisorAnterior} />
      <FilaResumen label="Fecha inicio trabajo anterior" value={data.fechaInicioTrabajoAnterior} />
      <FilaResumen label="Fecha fin trabajo anterior" value={data.fechaFinTrabajoAnterior} />
      <FilaResumen label="Descripción trabajo anterior" value={data.descripcionTrabajoAnterior} />
      <FilaResumen label="Asistió a institución educativa" value={data.asistioInstitucionEducativa} />
      <FilaResumen label="Institución educativa" value={data.institucionUniversitaria} />
      <FilaResumen label="Dirección institución educativa" value={data.direccionEducacion} />
      <FilaResumen label="Provincia institución educativa" value={data.provinciaEducacion} />
      <FilaResumen label="Ciudad institución educativa" value={data.ciudadEducacion} />
      <FilaResumen label="Código postal institución educativa" value={data.codigoPostalEducacion} />
      <FilaResumen label="Fecha inicio educación" value={data.fechaInicioEducacion} />
      <FilaResumen label="Fecha fin educación" value={data.fechaFinEducacion} />
      <FilaResumen label="Idiomas" value={data.idiomas} />
      <FilaResumen label="Nombres del padre" value={data.nombresPadre} />
      <FilaResumen label="Apellidos del padre" value={data.apellidosPadre} />
      <FilaResumen label="Padre en EE.UU." value={data.padreEnEEUU} />
      <FilaResumen label="Estatus del padre en EE.UU." value={data.estatusPadreEEUU} />
      <FilaResumen label="Nombres de la madre" value={data.nombresMadre} />
      <FilaResumen label="Apellidos de la madre" value={data.apellidosMadre} />
      <FilaResumen label="Madre en EE.UU." value={data.madreEnEEUU} />
      <FilaResumen label="Estatus de la madre en EE.UU." value={data.estatusMadreEEUU} />
      <FilaResumen label="Parientes inmediatos en EE.UU." value={data.familiaresInmediatosEnEEUU} />
      <FilaResumen label="Detalle parientes inmediatos" value={formatearFamiliaresInmediatos(data.familiaresInmediatosDetalle)} />
      <FilaResumen label="Otros familiares en EE.UU." value={data.otrosFamiliaresEnEEUU} />
      <FilaResumen label="Razón de viaje" value={data.categoriaMotivoViaje} />
      <FilaResumen label="Motivo Especifico" value={data.tipoVisa} />
      <FilaResumen label="Planes concretos" value={data.tienePlanesViajeConcretos} />
      <FilaResumen label="Fecha prevista de llegada" value={data.fechaLlegadaPrevista} />
      <FilaResumen label="Duración prevista" value={data.valorDuracionEstadiaPrevista ? `${data.valorDuracionEstadiaPrevista} ${data.unidadDuracionEstadiaPrevista}` : undefined} />
      <FilaResumen label="Fecha llegada a USA" value={data.fechaLlegadaEEUU} />
      <FilaResumen label="Ciudad de llegada" value={data.ciudadLlegadaEEUU} />
      <FilaResumen label="Fecha de salida de EE. UU" value={data.fechaSalidaEEUU} />
      <FilaResumen label="Ciudad de salida" value={data.ciudadSalidaEEUU} />
      <FilaResumen label="Lugares que planea visitar" value={data.lugaresPlaneadosEEUU} />
      <FilaResumen label="Dirección hospedaje EE.UU." value={data.direccionHospedajeEEUU} />
      <FilaResumen label="Ciudad hospedaje" value={data.ciudadHospedajeEEUU} />
      <FilaResumen label="Estado hospedaje" value={data.estadoHospedajeEEUU} />
      <FilaResumen label="Paga el viaje" value={data.pagadorViaje} />
      <FilaResumen label="Viaja con otras personas" value={data.viajaConOtros} />
      <FilaResumen label="Acompañantes" value={formatearAcompanantes(data.acompanantesViaje)} />
      <FilaResumen label="Ha estado en EE.UU." value={data.haVisitadoEEUU} />
      <FilaResumen label="Visitas anteriores" value={formatearVisitas(data.visitasAnterioresEEUU)} />
      <FilaResumen label="Visa EE.UU. emitida" value={data.haTenidoVisaEEUU} />
      <FilaResumen label="Último visado" value={data.fechaEmisionUltimaVisa} />
      <FilaResumen label="Número de visa" value={data.numeroVisa} />
      <FilaResumen label="Mismo tipo de visa" value={data.mismoTipoVisa} />
      <FilaResumen label="Mismo país/residencia" value={data.mismoPaisResidenciaVisa} />
      <FilaResumen label="Impresión diez veces" value={data.diezHuellasTomadas} />
      <FilaResumen label="Visa perdida o robada" value={data.visaEEUUPerdidaORobada} />
      <FilaResumen label="Motivo visa perdida o robada" value={data.motivoVisaEEUUPerdidaORobada} />
      <FilaResumen label="Año visa perdida o robada" value={data.anioVisaEEUUPerdidaORobada} />
      <FilaResumen label="Visa cancelada o revocada" value={data.visaEEUUCanceladaORevocada} />
      <FilaResumen label="Razón visa cancelada o revocada" value={data.razonVisaEEUUCanceladaORevocada} />
      <FilaResumen label="Visa negada" value={data.visaNegada} />
      <FilaResumen label="Motivo visa negada" value={data.detallesVisaNegada} />
      <FilaResumen label="Solicitud inmigración" value={data.tienePeticionInmigracion} />
      <FilaResumen label="Razón solicitud inmigración" value={data.razonPeticionInmigracion} />
      <FilaResumen label="Enfermedad contagiosa" value={data.enfermedadContagiosa} />
      <FilaResumen label="Detalle enfermedad contagiosa" value={data.detalleEnfermedadContagiosa} />
      </dl>
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <strong>Importante:</strong> Al enviar, acepta que la información proporcionada es veraz. IntiTrip la utilizará únicamente para gestionar su trámite de visa.
    </div>
  </div>
)


