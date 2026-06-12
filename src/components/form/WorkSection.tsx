import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { RadioGroup } from '../ui/RadioGroup'

interface Props { form: UseFormReturn<VisaFormSchema> }
const siNoOpts = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const WorkSection: React.FC<Props> = ({ form }) => {
  const { register, control, watch, formState: { errors } } = form
  const hasPrevious = watch('hasPreviousJob')

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-brand-green" /> Trabajo Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Cargo actual" required {...register('currentPosition')} error={errors.currentPosition?.message} placeholder="KAM, Gerente, Analista..." />
          <Input label="Nombre del empleador / empresa" required {...register('currentEmployer')} error={errors.currentEmployer?.message} placeholder="Empresa S.A." />
          <div className="md:col-span-2">
            <Textarea label="Descripción breve de sus funciones" required {...register('currentJobDescription')} error={errors.currentJobDescription?.message} placeholder="Describa sus responsabilidades principales..." />
          </div>
          <Input label="Sueldo mensual (USD)" required {...register('currentSalary')} error={errors.currentSalary?.message} placeholder="$1.200" />
          <Input label="Fecha de inicio" required type="date" {...register('currentJobStartDate')} error={errors.currentJobStartDate?.message} />
          <div className="md:col-span-2">
            <Input label="Dirección exacta del trabajo" required {...register('currentJobAddress')} error={errors.currentJobAddress?.message} placeholder="Av. Ejemplo & Calle N°" />
          </div>
          <Input label="Código postal del trabajo" {...register('currentJobPostalCode')} error={errors.currentJobPostalCode?.message} />
          <Input label="Teléfono del trabajo" type="tel" {...register('currentJobPhone')} error={errors.currentJobPhone?.message} />
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Briefcase className="w-5 h-5 text-slate-400" /> Trabajo Anterior</h2>
        <div className="mb-5">
          <Controller name="hasPreviousJob" control={control} render={({ field }) => (
            <RadioGroup label="¿Tuvo trabajos anteriores?" required name="hasPreviousJob"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.hasPreviousJob?.message} />
          )} />
        </div>
        {hasPrevious === 'si' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <Input label="Nombre del empleador anterior" {...register('previousEmployer')} error={errors.previousEmployer?.message} />
            <Input label="Cargo desempeñado" {...register('previousPosition')} error={errors.previousPosition?.message} />
            <div className="md:col-span-2">
              <Input label="Dirección exacta" {...register('previousJobAddress')} error={errors.previousJobAddress?.message} />
            </div>
            <Input label="Código postal" {...register('previousJobPostalCode')} />
            <Input label="Teléfono" type="tel" {...register('previousJobPhone')} />
            <Input label="Nombre del supervisor" {...register('previousSupervisorName')} error={errors.previousSupervisorName?.message} />
            <div className="md:col-span-2">
              <Textarea label="Descripción breve del cargo" {...register('previousJobDescription')} />
            </div>
            <Input label="Fecha de inicio" type="date" {...register('previousJobStartDate')} />
            <Input label="Fecha de finalización" type="date" {...register('previousJobEndDate')} />
          </div>
        )}
      </div>
    </div>
  )
}
