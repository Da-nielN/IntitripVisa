import React from 'react'
import { UseFormReturn, Controller, useFieldArray } from 'react-hook-form'
import { Plus, Users } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import {
  opcionesEstatusFamiliarEEUU,
  opcionesEstatusFamiliarInmediatoEEUU,
  opcionesRelacionFamiliarInmediato,
  opcionesSiNo,
} from '../../constants/opcionesFormulario'
import { Entrada } from '../interfaz/Entrada'
import { GrupoRadios } from '../interfaz/GrupoRadios'
import { Selector } from '../interfaz/Selector'

interface Props { form: UseFormReturn<VisaFormSchema> }

export const SeccionFamilia: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const padreEnEstadosUnidos = watch('padreEnEEUU')
  const madreEnEstadosUnidos = watch('madreEnEEUU')
  const tieneFamiliaresInmediatos = watch('familiaresInmediatosEnEEUU')
  const {
    fields: camposFamiliaresInmediatos,
    append: agregarFamiliarInmediato,
    remove: removerFamiliaresInmediatos,
  } = useFieldArray({ control, name: 'familiaresInmediatosDetalle' })

  React.useEffect(() => {
    if (padreEnEstadosUnidos === 'no') {
      setValue('estatusPadreEEUU', '')
    }
  }, [padreEnEstadosUnidos, setValue])

  React.useEffect(() => {
    if (madreEnEstadosUnidos === 'no') {
      setValue('estatusMadreEEUU', '')
    }
  }, [madreEnEstadosUnidos, setValue])

  React.useEffect(() => {
    if (tieneFamiliaresInmediatos === 'si' && camposFamiliaresInmediatos.length === 0) {
      agregarFamiliarInmediato({ apellidos: '', nombres: '', relacion: '', estatus: '' })
    }

    if (tieneFamiliaresInmediatos === 'si') {
      setValue('otrosFamiliaresEnEEUU', 'no')
    }

    if (tieneFamiliaresInmediatos === 'no' && camposFamiliaresInmediatos.length > 0) {
      removerFamiliaresInmediatos()
    }
  }, [agregarFamiliarInmediato, camposFamiliaresInmediatos.length, removerFamiliaresInmediatos, setValue, tieneFamiliaresInmediatos])

  const agregarOtroFamiliarInmediato = () => agregarFamiliarInmediato({ apellidos: '', nombres: '', relacion: '', estatus: '' })

  return (
    <div className="section-card">
      <h2 className="section-title"><Users className="w-5 h-5 text-brand-green" /> Datos Familiares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Entrada label="Nombres del padre" required {...register('nombresPadre')} error={errors.nombresPadre?.message} />
        <Entrada label="Apellidos del padre" required {...register('apellidosPadre')} error={errors.apellidosPadre?.message} />
        <Entrada label="Fecha de nacimiento del padre" required type="date" {...register('fechaNacimientoPadre')} error={errors.fechaNacimientoPadre?.message} />
        <div className="md:col-span-2">
          <Controller name="padreEnEEUU" control={control} render={({ field }) => (
            <GrupoRadios label="¿Su padre está en Estados Unidos?" required name="padreEnEEUU"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.padreEnEEUU?.message} />
          )} />
        </div>
        {padreEnEstadosUnidos === 'si' && (
          <div className="md:col-span-2 animate-fade-in">
            <Controller name="estatusPadreEEUU" control={control} render={({ field }) => (
              <Selector label="Estatus del padre en Estados Unidos" required options={opcionesEstatusFamiliarEEUU}
                error={errors.estatusPadreEEUU?.message} value={field.value ?? ''} onChange={field.onChange} />
            )} />
          </div>
        )}

        <Entrada label="Nombres de la madre" required {...register('nombresMadre')} error={errors.nombresMadre?.message} />
        <Entrada label="Apellidos de la madre" required {...register('apellidosMadre')} error={errors.apellidosMadre?.message} />
        <Entrada label="Fecha de nacimiento de la madre" required type="date" {...register('fechaNacimientoMadre')} error={errors.fechaNacimientoMadre?.message} />
        <div className="md:col-span-2">
          <Controller name="madreEnEEUU" control={control} render={({ field }) => (
            <GrupoRadios label="¿Su madre está en Estados Unidos?" required name="madreEnEEUU"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.madreEnEEUU?.message} />
          )} />
        </div>
        {madreEnEstadosUnidos === 'si' && (
          <div className="md:col-span-2 animate-fade-in">
            <Controller name="estatusMadreEEUU" control={control} render={({ field }) => (
              <Selector label="Estatus de la madre en Estados Unidos" required options={opcionesEstatusFamiliarEEUU}
                error={errors.estatusMadreEEUU?.message} value={field.value ?? ''} onChange={field.onChange} />
            )} />
          </div>
        )}

        <div className="md:col-span-2">
          <Controller name="familiaresInmediatosEnEEUU" control={control} render={({ field }) => (
            <GrupoRadios label="¿Tiene parientes inmediatos (excluyendo padres) en EE.UU?" required name="familiaresInmediatosEnEEUU"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.familiaresInmediatosEnEEUU?.message} />
          )} />
        </div>
        {tieneFamiliaresInmediatos === 'si' && (
          <div className="md:col-span-2 space-y-4 animate-fade-in">
            {camposFamiliaresInmediatos.map((campo, indice) => (
              <div key={campo.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
                <Entrada label="Nombres" required {...register(`familiaresInmediatosDetalle.${indice}.nombres` as const)}
                  error={errors.familiaresInmediatosDetalle?.[indice]?.nombres?.message} />
                <Entrada label="Apellidos" required {...register(`familiaresInmediatosDetalle.${indice}.apellidos` as const)}
                  error={errors.familiaresInmediatosDetalle?.[indice]?.apellidos?.message} />
                <Controller name={`familiaresInmediatosDetalle.${indice}.relacion` as const} control={control} render={({ field }) => (
                  <Selector label="Relación contigo" required options={opcionesRelacionFamiliarInmediato}
                    error={errors.familiaresInmediatosDetalle?.[indice]?.relacion?.message} value={field.value ?? ''} onChange={field.onChange} />
                )} />
                <Controller name={`familiaresInmediatosDetalle.${indice}.estatus` as const} control={control} render={({ field }) => (
                  <Selector label="Estado relativo" required options={opcionesEstatusFamiliarInmediatoEEUU}
                    error={errors.familiaresInmediatosDetalle?.[indice]?.estatus?.message} value={field.value ?? ''} onChange={field.onChange} />
                )} />
              </div>
            ))}
            <button type="button" onClick={agregarOtroFamiliarInmediato} className="btn-secondary">
              <Plus className="w-4 h-4" /> Añadir pariente inmediato
            </button>
          </div>
        )}
        {tieneFamiliaresInmediatos === 'no' && (
          <div className="md:col-span-2 animate-fade-in">
            <Controller name="otrosFamiliaresEnEEUU" control={control} render={({ field }) => (
              <GrupoRadios label="¿Tiene usted algún otro familiar en los Estados Unidos?" required name="otrosFamiliaresEnEEUU"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.otrosFamiliaresEnEEUU?.message} />
            )} />
          </div>
        )}
      </div>
    </div>
  )
}
