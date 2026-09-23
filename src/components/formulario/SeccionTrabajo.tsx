import React, { useEffect } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Briefcase, GraduationCap, Languages, Plus } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import {
  opcionesCiudadesEcuador,
  ocupacionActual,
  opcionesProvincias,
  opcionesSiNo,
  paisesResidenciaPermanente,
} from '../../constants/opcionesFormulario'
import { useSlotsRepetidor } from '../../ganchos/useSlotsRepetidor'
import { recortarEspacios, soloLetras, soloNumeros } from '../../utils/validacionesFormulario'
import { Entrada } from '../interfaz/Entrada'
import { AreaTexto } from '../interfaz/AreaTexto'
import { GrupoRadios } from '../interfaz/GrupoRadios'
import { Selector } from '../interfaz/Selector'

interface Props { form: UseFormReturn<VisaFormSchema> }

// WorkEducation3 admite hasta cinco filas en cada repetidor
// (dtlLANGUAGES y dtlCountriesVisited, ctl00..ctl04).
const IDIOMAS = ['idioma1', 'idioma2', 'idioma3', 'idioma4', 'idioma5'] as const
const PAISES_VISITADOS = [
  'paisVisitado1',
  'paisVisitado2',
  'paisVisitado3',
  'paisVisitado4',
  'paisVisitado5',
] as const

export const SeccionTrabajo: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const tieneTrabajoAnterior = watch('tuvoTrabajoAnterior')
  const asistioInstitucionEducativa = watch('asistioInstitucionEducativa')
  const tieneHistorialViajes = watch('tieneHistorialViajes')
  const idiomas = useSlotsRepetidor(form, IDIOMAS)

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
      setValue('nombreCarrera', '')
    }
  }, [asistioInstitucionEducativa, setValue])

  useEffect(() => {
    if (tieneHistorialViajes === 'no') {
      PAISES_VISITADOS.forEach((campo) => setValue(campo, ''))
    }
  }, [setValue, tieneHistorialViajes])

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-brand-green" /> Trabajo y Educación Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Controller name="categoriaOcupacionActual" control={control} render={({ field }) => (
              <Selector label="Ocupación actual" required options={ocupacionActual} error={errors.categoriaOcupacionActual?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
          <div className="md:col-span-2">
            <Entrada label="Nombre de la empresa o escuela actual" required {...register('empleadorActual')} error={errors.empleadorActual?.message} placeholder="Empresa o institución actual" />
          </div>
          <Entrada label="Cargo actual" {...register('cargoActual')} error={errors.cargoActual?.message} placeholder="Analista de sistemas" />
          <Entrada label="Sueldo mensual (USD)" required {...register('sueldoActual', { onChange: soloNumeros() })} error={errors.sueldoActual?.message} placeholder="800" inputMode="numeric" />
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
            <Entrada label="Nombres del empleador anterior" required {...register('nombreSupervisorAnterior', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.nombreSupervisorAnterior?.message} />
            <Entrada label="Apellidos del empleador anterior" required {...register('apellidosSupervisorAnterior', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.apellidosSupervisorAnterior?.message} />
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
              <Entrada label="Nombre de la carrera o especialidad" {...register('nombreCarrera')} error={errors.nombreCarrera?.message} placeholder="Ingeniería en Sistemas" />
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
          </div>
        )}
      </div>

      <div className="section-card">
        <h2 className="section-title"><Languages className="w-5 h-5 text-brand-green" /> Idiomas y Países Visitados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <p className="md:col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wide dark:text-slate-500">
            Idiomas que habla
          </p>
          {IDIOMAS.slice(0, idiomas.visibles).map((campo, indice) => (
            <div key={campo}>
              <Entrada label={`Idioma ${indice + 1}`} required={indice === 0}
                {...register(campo)} error={errors[campo]?.message}
                placeholder={indice === 0 ? 'Español' : 'Opcional'} maxLength={66} />
              {indice > 0 && (
                <button type="button" onClick={() => idiomas.quitar(indice)}
                  className="mt-1 text-xs font-medium text-slate-400 hover:text-red-500 dark:text-slate-500">
                  Quitar
                </button>
              )}
            </div>
          ))}
          {idiomas.puedeAgregar && (
            <div className="md:col-span-2">
              <button type="button" onClick={idiomas.agregar} className="btn-secondary">
                <Plus className="w-4 h-4" /> Añadir idioma
              </button>
            </div>
          )}

          <div className="md:col-span-2">
            <Controller name="tieneHistorialViajes" control={control} render={({ field }) => (
              <GrupoRadios label="¿Ha viajado a algún país en los últimos 5 años?" required name="tieneHistorialViajes"
                options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tieneHistorialViajes?.message} />
            )} />
          </div>

          {tieneHistorialViajes === 'si' && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              {PAISES_VISITADOS.map((campo, indice) => (
                <Controller key={campo} name={campo} control={control} render={({ field }) => (
                  <Selector label={`País visitado ${indice + 1}`} required={indice === 0} options={paisesResidenciaPermanente}
                    error={errors[campo]?.message} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
                )} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
