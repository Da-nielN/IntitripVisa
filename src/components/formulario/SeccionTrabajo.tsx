import React, { useEffect } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Briefcase, GraduationCap } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import {
  opcionesCiudadesEcuador,
  opcionesOcupaciones,
  opcionesProvincias,
  opcionesSiNo,
} from '../../constants/opcionesFormulario'
import { soloNumeros } from '../../utils/validacionesFormulario'
import { Entrada } from '../interfaz/Entrada'
import { AreaTexto } from '../interfaz/AreaTexto'
import { GrupoRadios } from '../interfaz/GrupoRadios'
import { Selector } from '../interfaz/Selector'

interface Props { form: UseFormReturn<VisaFormSchema> }

export const SeccionTrabajo: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const tieneTrabajoAnterior = watch('tuvoTrabajoAnterior')
  const asistioInstitucionEducativa = watch('asistioInstitucionEducativa')

  useEffect(() => {
    if (tieneTrabajoAnterior === 'no') {
      setValue('empleadorAnterior', '')
      setValue('direccionTrabajoAnterior', '')
      setValue('telefonoTrabajoAnterior', '')
      setValue('codigoPostalTrabajoAnterior', '')
      setValue('ciudadTrabajoAnterior', '')
      setValue('provinciaTrabajoAnterior', '')
      setValue('cargoAnterior', '')
      setValue('nombreSupervisorAnterior', '')
      setValue('apellidosSupervisorAnterior', '')
      setValue('fechaInicioTrabajoAnterior', '')
      setValue('fechaFinTrabajoAnterior', '')
      setValue('descripcionTrabajoAnterior', '')
    }
  }, [setValue, tieneTrabajoAnterior])

  useEffect(() => {
    if (asistioInstitucionEducativa === 'no') {
      setValue('institucionUniversitaria', '')
      setValue('direccionEducacion', '')
      setValue('ciudadEducacion', '')
      setValue('provinciaEducacion', '')
      setValue('codigoPostalEducacion', '')
      setValue('fechaInicioEducacion', '')
      setValue('fechaFinEducacion', '')
      setValue('idiomas', '')
    }
  }, [asistioInstitucionEducativa, setValue])

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-brand-green" /> Trabajo y Educación Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Controller name="categoriaOcupacionActual" control={control} render={({ field }) => (
              <Selector label="Ocupación actual" required options={opcionesOcupaciones} error={errors.categoriaOcupacionActual?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
          <div className="md:col-span-2">
            <Entrada label="Nombre de la empresa o escuela actual" required {...register('empleadorActual')} error={errors.empleadorActual?.message} placeholder="Empresa o institución actual" />
          </div>
          <div className="md:col-span-2">
            <Entrada label="Dirección" required {...register('direccionTrabajoActual')} error={errors.direccionTrabajoActual?.message} placeholder="Av. Ejemplo & Calle N°" />
          </div>
          <Controller name="ciudadTrabajoActual" control={control} render={({ field }) => (
            <Selector label="Ciudad" required options={opcionesCiudadesEcuador} error={errors.ciudadTrabajoActual?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
          <Controller name="provinciaTrabajoActual" control={control} render={({ field }) => (
            <Selector label="Provincia" required options={opcionesProvincias} error={errors.provinciaTrabajoActual?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
          <Entrada label="Número de teléfono" type="tel" {...register('telefonoTrabajoActual', { onChange: soloNumeros() })} error={errors.telefonoTrabajoActual?.message} inputMode="numeric" />
          <Entrada label="Fecha de inicio" required type="date" {...register('fechaInicioTrabajoActual')} error={errors.fechaInicioTrabajoActual?.message} />
          <div className="md:col-span-2">
            <Entrada label="Describa brevemente sus funciones" required {...register('descripcionTrabajoActual')} error={errors.descripcionTrabajoActual?.message} placeholder="Describa sus responsabilidades principales..." />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-slate-400" /> Trabajo Anterior</h2>
        <div className="mb-5">
          <Controller name="tuvoTrabajoAnterior" control={control} render={({ field }) => (
            <GrupoRadios label="¿Tuvo trabajos anteriores?" required name="tuvoTrabajoAnterior"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tuvoTrabajoAnterior?.message} />
          )} />
        </div>
        {tieneTrabajoAnterior === 'si' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <div className="md:col-span-2">
              <Entrada label="Nombre del empleador anterior" required {...register('empleadorAnterior')} error={errors.empleadorAnterior?.message} />
            </div>
            <div className="md:col-span-2">
              <Entrada label="Dirección exacta" required {...register('direccionTrabajoAnterior')} error={errors.direccionTrabajoAnterior?.message} />
            </div>
            <Entrada label="Teléfono" required type="tel" {...register('telefonoTrabajoAnterior', { onChange: soloNumeros() })} error={errors.telefonoTrabajoAnterior?.message} inputMode="numeric" />
            <Entrada label="Código postal" required {...register('codigoPostalTrabajoAnterior', { onChange: soloNumeros() })} error={errors.codigoPostalTrabajoAnterior?.message} inputMode="numeric" />
            <Controller name="ciudadTrabajoAnterior" control={control} render={({ field }) => (
              <Selector label="Ciudad" required options={opcionesCiudadesEcuador} error={errors.ciudadTrabajoAnterior?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
            <Controller name="provinciaTrabajoAnterior" control={control} render={({ field }) => (
              <Selector label="Provincia" required options={opcionesProvincias} error={errors.provinciaTrabajoAnterior?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
            <Entrada label="Cargo desempeñado" required {...register('cargoAnterior')} error={errors.cargoAnterior?.message} />
            <Entrada label="Nombres del empleador anterior" required {...register('nombreSupervisorAnterior')} error={errors.nombreSupervisorAnterior?.message} />
            <Entrada label="Apellidos del empleador anterior" required {...register('apellidosSupervisorAnterior')} error={errors.apellidosSupervisorAnterior?.message} />
            <Entrada label="Fecha de inicio" required type="date" {...register('fechaInicioTrabajoAnterior')} error={errors.fechaInicioTrabajoAnterior?.message} />
            <Entrada label="Fecha de finalización" required type="date" {...register('fechaFinTrabajoAnterior')} error={errors.fechaFinTrabajoAnterior?.message} />
            <div className="md:col-span-2">
              <AreaTexto label="Descripción breve del cargo" required {...register('descripcionTrabajoAnterior')} error={errors.descripcionTrabajoAnterior?.message} />
            </div>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2 className="section-title"><GraduationCap className="w-5 h-5 text-brand-green" /> Educación</h2>
        <div className="mb-5">
          <Controller name="asistioInstitucionEducativa" control={control} render={({ field }) => (
            <GrupoRadios label="¿Has asistido a alguna institución educativa de nivel secundario o superior?" required name="asistioInstitucionEducativa"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.asistioInstitucionEducativa?.message} />
          )} />
        </div>
        {asistioInstitucionEducativa === 'si' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <div className="md:col-span-2">
              <Entrada label="Nombre de la Institución" required {...register('institucionUniversitaria')} error={errors.institucionUniversitaria?.message} placeholder="Nombre del colegio, instituto o universidad" />
            </div>
            <div className="md:col-span-2">
              <Entrada label="Dirección" required {...register('direccionEducacion')} error={errors.direccionEducacion?.message} placeholder="Av. Ejemplo & Calle" />
            </div>
            <Controller name="ciudadEducacion" control={control} render={({ field }) => (
              <Selector label="Ciudad" required options={opcionesCiudadesEcuador} error={errors.ciudadEducacion?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
            <Controller name="provinciaEducacion" control={control} render={({ field }) => (
              <Selector label="Provincia" required options={opcionesProvincias} error={errors.provinciaEducacion?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
            <Entrada label="Código postal" required {...register('codigoPostalEducacion', { onChange: soloNumeros() })} error={errors.codigoPostalEducacion?.message} inputMode="numeric" />
            <Entrada label="Fecha de inicio" required type="date" {...register('fechaInicioEducacion')} error={errors.fechaInicioEducacion?.message} />
            <Entrada label="Fecha de finalización" required type="date" {...register('fechaFinEducacion')} error={errors.fechaFinEducacion?.message} />
            <div className="md:col-span-2">
              <Entrada label="Idiomas que habla" required {...register('idiomas')} error={errors.idiomas?.message} placeholder="Español (nativo), Inglés (intermedio), Francés (básico)" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
