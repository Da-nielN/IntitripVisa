import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Entrada } from '../interfaz/Entrada'
import { AreaTexto } from '../interfaz/AreaTexto'
import { GrupoRadios } from '../interfaz/GrupoRadios'

interface Props { form: UseFormReturn<VisaFormSchema> }
const opcionesSiNo = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const SeccionTrabajo: React.FC<Props> = ({ form }) => {
  const { register, control, watch, formState: { errors } } = form
  const tieneTrabajoAnterior = watch('hasPreviousJob')

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-brand-green" /> Trabajo Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Entrada label="Cargo actual" required {...register('currentPosition')} error={errors.currentPosition?.message} placeholder="KAM, Gerente, Analista..." />
          <Entrada label="Nombre del empleador / empresa" required {...register('currentEmployer')} error={errors.currentEmployer?.message} placeholder="Empresa S.A." />
          <div className="md:col-span-2">
            <AreaTexto label="Descripción breve de sus funciones" required {...register('currentJobDescription')} error={errors.currentJobDescription?.message} placeholder="Describa sus responsabilidades principales..." />
          </div>
          <Entrada label="Sueldo mensual (USD)" required {...register('currentSalary')} error={errors.currentSalary?.message} placeholder="$1.200" />
          <Entrada label="Fecha de inicio" required type="date" {...register('currentJobStartDate')} error={errors.currentJobStartDate?.message} />
          <div className="md:col-span-2">
            <Entrada label="Dirección exacta del trabajo" required {...register('currentJobAddress')} error={errors.currentJobAddress?.message} placeholder="Av. Ejemplo & Calle N°" />
          </div>
          <Entrada label="Código postal del trabajo" {...register('currentJobPostalCode')} error={errors.currentJobPostalCode?.message} />
          <Entrada label="Teléfono del trabajo" type="tel" {...register('currentJobPhone')} error={errors.currentJobPhone?.message} />
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-slate-400" /> Trabajo Anterior</h2>
        <div className="mb-5">
          <Controller name="hasPreviousJob" control={control} render={({ field }) => (
            <GrupoRadios label="¿Tuvo trabajos anteriores?" required name="hasPreviousJob"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.hasPreviousJob?.message} />
          )} />
        </div>
        {tieneTrabajoAnterior === 'si' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <Entrada label="Nombre del empleador anterior" {...register('previousEmployer')} error={errors.previousEmployer?.message} />
            <Entrada label="Cargo desempeñado" {...register('previousPosition')} error={errors.previousPosition?.message} />
            <div className="md:col-span-2">
              <Entrada label="Dirección exacta" {...register('previousJobAddress')} error={errors.previousJobAddress?.message} />
            </div>
            <Entrada label="Código postal" {...register('previousJobPostalCode')} />
            <Entrada label="Teléfono" type="tel" {...register('previousJobPhone')} />
            <Entrada label="Nombre del supervisor" {...register('previousSupervisorName')} error={errors.previousSupervisorName?.message} />
            <div className="md:col-span-2">
              <AreaTexto label="Descripción breve del cargo" {...register('previousJobDescription')} />
            </div>
            <Entrada label="Fecha de inicio" type="date" {...register('previousJobStartDate')} />
            <Entrada label="Fecha de finalización" type="date" {...register('previousJobEndDate')} />
          </div>
        )}
      </div>
    </div>
  )
}


