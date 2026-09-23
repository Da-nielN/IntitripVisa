import React from 'react'
import { UseFormReturn, Controller, useFieldArray } from 'react-hook-form'
import { Globe, Plane, Heart, Plus } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { MAXIMO_FILAS_REPETIDOR } from '../../constants'
import { Entrada } from '../interfaz/Entrada'
import { AreaTexto } from '../interfaz/AreaTexto'
import { GrupoRadios } from '../interfaz/GrupoRadios'
import { Selector } from '../interfaz/Selector'
import {
  unidadDuracion,
  estadosEEUU,
  quienPaga,
  relacionAcompanante,
  relacionPagador,
  opcionesSiNo,
  propositoViajeEspecifico,
  propositoViaje,
} from '../../constants/opcionesFormulario'
import { useSlotsRepetidor } from '../../ganchos/useSlotsRepetidor'
import { recortarEspacios, soloLetras, soloNumeros } from '../../utils/validacionesFormulario'

interface Props { form: UseFormReturn<VisaFormSchema> }

// El DS-160 acepta hasta cinco lugares (dtlTravelLoc_ctl00..ctl04).
const LUGARES_PLANEADOS = [
  'lugarPlaneadoEEUU1',
  'lugarPlaneadoEEUU2',
  'lugarPlaneadoEEUU3',
  'lugarPlaneadoEEUU4',
  'lugarPlaneadoEEUU5',
] as const

export const SeccionViaje: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const razonViaje = watch('categoriaMotivoViaje')
  const tienePlanesConcretos = watch('tienePlanesViajeConcretos')
  const viajaConOtros = watch('viajaConOtros')
  const haEstadoEnEstadosUnidos = watch('haVisitadoEEUU')
  const visaEmitida = watch('haTenidoVisaEEUU')
  const visaPerdidaORobada = watch('visaEEUUPerdidaORobada')
  const visaCanceladaORevocada = watch('visaEEUUCanceladaORevocada')
  const visaNegada = watch('visaNegada')
  const tienePeticionInmigracion = watch('tienePeticionInmigracion')
  const fueDeportado = watch('deportadoDePais')
  const pagadorViaje = watch('pagadorViaje')
  const pagaOtraPersona = pagadorViaje === 'O'
  const lugares = useSlotsRepetidor(form, LUGARES_PLANEADOS)
  const reiniciarLugares = lugares.reiniciar
  const tieneEnfermedadContagiosa = watch('enfermedadContagiosa')
  const propositoViajeEspecificoFiltradas = propositoViajeEspecifico[razonViaje ?? ''] ?? []

  const acompanantes = useFieldArray({ control, name: 'acompanantesViaje' })
  const visitasEstadosUnidos = useFieldArray({ control, name: 'visitasAnterioresEEUU' })

  React.useEffect(() => {
    if (viajaConOtros === 'si' && acompanantes.fields.length === 0) {
      acompanantes.append({ apellidos: '', nombres: '', relacion: '' })
    }
  }, [viajaConOtros, acompanantes.fields.length])

  React.useEffect(() => {
    if (haEstadoEnEstadosUnidos === 'si' && visitasEstadosUnidos.fields.length === 0) {
      visitasEstadosUnidos.append({ fechaLlegada: '', valorDuracion: '', unidadDuracion: 'D' })
    }
  }, [haEstadoEnEstadosUnidos, visitasEstadosUnidos.fields.length])

  React.useEffect(() => {
    if (visaPerdidaORobada === 'no') {
      setValue('motivoVisaEEUUPerdidaORobada', '')
      setValue('anioVisaEEUUPerdidaORobada', '')
    }
    if (visaCanceladaORevocada === 'no') {
      setValue('razonVisaEEUUCanceladaORevocada', '')
    }
  }, [setValue, visaCanceladaORevocada, visaPerdidaORobada])

  React.useEffect(() => {
    if (tieneEnfermedadContagiosa === 'no') setValue('detalleEnfermedadContagiosa', '')
  }, [setValue, tieneEnfermedadContagiosa])

  React.useEffect(() => {
    if (fueDeportado === 'no') setValue('detallesDeportacion', '')
  }, [fueDeportado, setValue])

  React.useEffect(() => {
    if (tienePlanesConcretos !== 'si') reiniciarLugares()
  }, [reiniciarLugares, tienePlanesConcretos])

  React.useEffect(() => {
    if (!pagaOtraPersona) {
      setValue('apellidosPagador', '')
      setValue('nombresPagador', '')
      setValue('telefonoPagador', '')
      setValue('correoPagador', '')
      setValue('relacionPagador', '')
      setValue('direccionPagadorIgualSolicitante', 'si')
    }
  }, [pagaOtraPersona, setValue])

  const acompanantesAlTope = acompanantes.fields.length >= MAXIMO_FILAS_REPETIDOR
  const visitasAlTope = visitasEstadosUnidos.fields.length >= MAXIMO_FILAS_REPETIDOR

  const agregarAcompanante = () => acompanantes.append({ apellidos: '', nombres: '', relacion: '' })
  const agregarVisita = () => visitasEstadosUnidos.append({ fechaLlegada: '', valorDuracion: '', unidadDuracion: 'D' })

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Globe className="w-5 h-5 text-brand-green" /> Viajes y Visas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Controller name="categoriaMotivoViaje" control={control} render={({ field }) => (
              <Selector label="Razón de viaje" required options={propositoViaje}
                error={errors.categoriaMotivoViaje?.message} value={field.value ?? ''} onChange={(evento) => {
                  field.onChange(evento)
                  setValue('tipoVisa', '', { shouldValidate: true })
                }} />
            )} />
          </div>
          <div className="md:col-span-2">
            <Controller name="tipoVisa" control={control} render={({ field }) => (
              <Selector label="Motivo Especifico" required options={propositoViajeEspecificoFiltradas} disabled={!razonViaje}
                error={errors.tipoVisa?.message} value={field.value ?? ''} onChange={(evento) => {
                  setValue('tipoVisa', evento.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                }} onBlur={field.onBlur} />
            )} />
          </div>

          <div className="md:col-span-2">
            <Controller name="tienePlanesViajeConcretos" control={control} render={({ field }) => (
              <GrupoRadios label="¿Has hecho planes de viaje concretos?" required name="tienePlanesViajeConcretos"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tienePlanesViajeConcretos?.message} />
            )} />
          </div>

          {tienePlanesConcretos === 'no' && (
            <>
              <Entrada label="Fecha prevista de llegada" type="date" {...register('fechaLlegadaPrevista')} error={errors.fechaLlegadaPrevista?.message} />
              <div className="grid grid-cols-2 gap-3">
                <Entrada label="Duración prevista de la estancia en EE. UU." type="number" min="1" step="1"
                  {...register('valorDuracionEstadiaPrevista')} error={errors.valorDuracionEstadiaPrevista?.message} />
                <Controller name="unidadDuracionEstadiaPrevista" control={control} render={({ field }) => (
                  <Selector label="Unidad" options={unidadDuracion} error={errors.unidadDuracionEstadiaPrevista?.message}
                    value={field.value ?? ''} onChange={field.onChange} />
                )} />
              </div>
            </>
          )}

          {tienePlanesConcretos === 'si' && (
            <>
              <Entrada label="Fecha llegada a USA" type="date" {...register('fechaLlegadaEEUU')} error={errors.fechaLlegadaEEUU?.message} />
              <Entrada label="Ciudad de llegada" {...register('ciudadLlegadaEEUU')} error={errors.ciudadLlegadaEEUU?.message} />
              <Entrada label="Fecha de salida de EE. UU" type="date" {...register('fechaSalidaEEUU')} error={errors.fechaSalidaEEUU?.message} />
              <Entrada label="Ciudad de salida" {...register('ciudadSalidaEEUU')} error={errors.ciudadSalidaEEUU?.message} />
              <div className="md:col-span-2 space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide dark:text-slate-500">
                  Lugares que planea visitar en los Estados Unidos
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LUGARES_PLANEADOS.slice(0, lugares.visibles).map((campo, indice) => (
                    <div key={campo}>
                      <Entrada label={`Lugar ${indice + 1}`} required={indice === 0}
                        {...register(campo)} error={errors[campo]?.message}
                        placeholder={indice === 0 ? 'Nueva York' : 'Opcional'} maxLength={40} />
                      {indice > 0 && (
                        <button type="button" onClick={() => lugares.quitar(indice)}
                          className="mt-1 text-xs font-medium text-slate-400 hover:text-red-500 dark:text-slate-500">
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {lugares.puedeAgregar && (
                  <button type="button" onClick={lugares.agregar} className="btn-secondary">
                    <Plus className="w-4 h-4" /> Añadir lugar
                  </button>
                )}
              </div>
            </>
          )}

          <Entrada label="Dirección donde se hospedará en los Estados Unidos" {...register('direccionHospedajeEEUU')} error={errors.direccionHospedajeEEUU?.message} />
          <Entrada label="Ciudad" {...register('ciudadHospedajeEEUU')} error={errors.ciudadHospedajeEEUU?.message} />
          <Controller name="estadoHospedajeEEUU" control={control} render={({ field }) => (
            <Selector label="Estado" options={estadosEEUU} error={errors.estadoHospedajeEEUU?.message}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
          <div className="md:col-span-2">
            <Controller name="pagadorViaje" control={control} render={({ field }) => (
              <Selector label="¿Quién paga el viaje?" required options={quienPaga}
                error={errors.pagadorViaje?.message} value={field.value} onChange={field.onChange} />
            )} />
          </div>

          {pagaOtraPersona && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              <p className="md:col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wide dark:text-slate-500">
                Datos de quien paga el viaje
              </p>
              <Entrada label="Apellidos" required {...register('apellidosPagador', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.apellidosPagador?.message} />
              <Entrada label="Nombres" required {...register('nombresPagador', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.nombresPagador?.message} />
              <Entrada label="Teléfono" required type="tel" {...register('telefonoPagador', { onChange: soloNumeros() })}
                error={errors.telefonoPagador?.message} inputMode="numeric" />
              <Entrada label="Correo electrónico" required type="email" {...register('correoPagador')} error={errors.correoPagador?.message} />
              <Controller name="relacionPagador" control={control} render={({ field }) => (
                <Selector label="Parentesco con usted" required options={relacionPagador} error={errors.relacionPagador?.message}
                  value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
              )} />
              <Controller name="direccionPagadorIgualSolicitante" control={control} render={({ field }) => (
                <GrupoRadios label="¿Su dirección es la misma que la suya?" required name="direccionPagadorIgualSolicitante"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.direccionPagadorIgualSolicitante?.message} />
              )} />
            </div>
          )}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Plane className="w-5 h-5 text-brand-green" /> Acompañantes e Historial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Controller name="viajaConOtros" control={control} render={({ field }) => (
              <GrupoRadios label="¿Viajas con otras personas?" required name="viajaConOtros"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.viajaConOtros?.message} />
            )} />
          </div>

          {viajaConOtros === 'si' && (
            <div className="md:col-span-2 space-y-4 animate-fade-in">
              {acompanantes.fields.map((campo, indice) => (
                <div key={campo.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
                  <Entrada label="Apellidos" {...register(`acompanantesViaje.${indice}.apellidos` as const, { onChange: soloLetras, onBlur: recortarEspacios })} />
                  <Entrada label="Nombres" {...register(`acompanantesViaje.${indice}.nombres` as const, { onChange: soloLetras, onBlur: recortarEspacios })} />
                  <Controller name={`acompanantesViaje.${indice}.relacion` as const} control={control} render={({ field }) => (
                    <Selector label="Relación con la persona" options={relacionAcompanante}
                      value={field.value ?? ''} onChange={field.onChange} />
                  )} />
                </div>
              ))}
              <button type="button" onClick={agregarAcompanante} disabled={acompanantesAlTope}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Añadir acompañante
              </button>
              {acompanantesAlTope && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  El DS-160 admite hasta {MAXIMO_FILAS_REPETIDOR} acompañantes.
                </p>
              )}
            </div>
          )}

          <div className="md:col-span-2">
            <Controller name="haVisitadoEEUU" control={control} render={({ field }) => (
              <GrupoRadios label="¿Has estado alguna vez en Estados Unidos?" required name="haVisitadoEEUU"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.haVisitadoEEUU?.message} />
            )} />
          </div>

          {haEstadoEnEstadosUnidos === 'si' && (
            <div className="md:col-span-2 space-y-4 animate-fade-in">
              {visitasEstadosUnidos.fields.map((campo, indice) => (
                <div key={campo.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
                  <Entrada label="Fecha de llegada" type="date" {...register(`visitasAnterioresEEUU.${indice}.fechaLlegada` as const)} />
                  <Entrada label="Duración de la estancia" type="number" min="1" step="1" {...register(`visitasAnterioresEEUU.${indice}.valorDuracion` as const)} />
                  <Controller name={`visitasAnterioresEEUU.${indice}.unidadDuracion` as const} control={control} render={({ field }) => (
                    <Selector label="Unidad" options={unidadDuracion} value={field.value ?? ''} onChange={field.onChange} />
                  )} />
                </div>
              ))}
              <button type="button" onClick={agregarVisita} disabled={visitasAlTope}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Añadir otro
              </button>
              {visitasAlTope && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  El DS-160 admite hasta {MAXIMO_FILAS_REPETIDOR} visitas anteriores.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Globe className="w-5 h-5 text-brand-green" /> Visa e Inmigración</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Controller name="haTenidoVisaEEUU" control={control} render={({ field }) => (
              <GrupoRadios label="¿Alguna vez ha emitido una visa de EE.UU.?" required name="haTenidoVisaEEUU"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.haTenidoVisaEEUU?.message} />
            )} />
          </div>

          {visaEmitida === 'si' && (
            <>
              <Entrada label="Fecha de emisión del último visado" type="date" {...register('fechaEmisionUltimaVisa')} error={errors.fechaEmisionUltimaVisa?.message} />
              <Entrada label="Número de visa (opcional)" {...register('numeroVisa')} error={errors.numeroVisa?.message} />
              <Controller name="mismoTipoVisa" control={control} render={({ field }) => (
                <GrupoRadios label="¿Estás solicitando el mismo tipo de visa?" required name="mismoTipoVisa"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.mismoTipoVisa?.message} />
              )} />
              <Controller name="mismoPaisResidenciaVisa" control={control} render={({ field }) => (
                <GrupoRadios label="¿Está solicitando la visa en el mismo país o lugar donde se emitió la visa mencionada anteriormente, y es este país o lugar su residencia principal?" required name="mismoPaisResidenciaVisa"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.mismoPaisResidenciaVisa?.message} />
              )} />
              <Controller name="diezHuellasTomadas" control={control} render={({ field }) => (
                <GrupoRadios label="¿Le han tomado las huellas dactilares de los diez dedos?" required name="diezHuellasTomadas"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.diezHuellasTomadas?.message} />
              )} />
              <Controller name="visaEEUUPerdidaORobada" control={control} render={({ field }) => (
                <GrupoRadios label="¿Alguna vez se le ha perdido o robado su visa estadounidense?" required name="visaEEUUPerdidaORobada"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.visaEEUUPerdidaORobada?.message} />
              )} />
              {visaPerdidaORobada === 'si' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                  <AreaTexto label="Explique el motivo" required {...register('motivoVisaEEUUPerdidaORobada')} error={errors.motivoVisaEEUUPerdidaORobada?.message} />
                  <Entrada label="Año en que ocurrió" required {...register('anioVisaEEUUPerdidaORobada', { onChange: soloNumeros(4) })}
                    error={errors.anioVisaEEUUPerdidaORobada?.message} inputMode="numeric" maxLength={4} />
                </div>
              )}
              <Controller name="visaEEUUCanceladaORevocada" control={control} render={({ field }) => (
                <GrupoRadios label="¿Alguna vez le han cancelado o revocado su visa estadounidense?" required name="visaEEUUCanceladaORevocada"
                  options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.visaEEUUCanceladaORevocada?.message} />
              )} />
              {visaCanceladaORevocada === 'si' && (
                <div className="md:col-span-2 animate-fade-in">
                  <AreaTexto label="Razón" required {...register('razonVisaEEUUCanceladaORevocada')} error={errors.razonVisaEEUUCanceladaORevocada?.message} />
                </div>
              )}
            </>
          )}

          <div className="md:col-span-2">
            <Controller name="visaNegada" control={control} render={({ field }) => (
              <GrupoRadios label="¿Le han negado alguna visa?" required name="visaNegada"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.visaNegada?.message} />
            )} />
          </div>
          {visaNegada === 'si' && (
            <div className="md:col-span-2 animate-fade-in">
              <AreaTexto label="Motivo" {...register('detallesVisaNegada')} error={errors.detallesVisaNegada?.message} />
            </div>
          )}

          <div className="md:col-span-2">
            <Controller name="deportadoDePais" control={control} render={({ field }) => (
              <GrupoRadios label="¿Alguna vez ha sido deportado o expulsado de algún país?" required name="deportadoDePais"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.deportadoDePais?.message} />
            )} />
          </div>
          {fueDeportado === 'si' && (
            <div className="md:col-span-2 animate-fade-in">
              <AreaTexto label="Explique la deportación o expulsión" required {...register('detallesDeportacion')} error={errors.detallesDeportacion?.message} />
            </div>
          )}

          <div className="md:col-span-2">
            <Controller name="tienePeticionInmigracion" control={control} render={({ field }) => (
              <GrupoRadios label="¿Alguna vez alguien ha presentado una solicitud de inmigración en su nombre ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos?" required name="tienePeticionInmigracion"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tienePeticionInmigracion?.message} />
            )} />
          </div>
          {tienePeticionInmigracion === 'si' && (
            <div className="md:col-span-2 animate-fade-in">
              <AreaTexto label="Razón" {...register('razonPeticionInmigracion')} error={errors.razonPeticionInmigracion?.message} />
            </div>
          )}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Heart className="w-5 h-5 text-brand-green" /> Salud</h2>
        <div className="grid grid-cols-1 gap-5">
          <Controller name="enfermedadContagiosa" control={control} render={({ field }) => (
            <GrupoRadios label="¿Tiene o ha tenido alguna enfermedad contagiosa?" required name="enfermedadContagiosa"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.enfermedadContagiosa?.message} />
          )} />
          {tieneEnfermedadContagiosa === 'si' && (
            <div className="animate-fade-in">
              <AreaTexto label="Explique qué enfermedad contagiosa tiene o ha tenido" required
                {...register('detalleEnfermedadContagiosa')} error={errors.detalleEnfermedadContagiosa?.message} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
