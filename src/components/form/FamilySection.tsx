import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Users } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'
import { RadioGroup } from '../ui/RadioGroup'

interface Props { form: UseFormReturn<VisaFormSchema> }
const siNoOpts = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const FamilySection: React.FC<Props> = ({ form }) => {
  const { register, control, formState: { errors } } = form
  return (
    <div className="section-card">
      <h2 className="section-title"><Users className="w-5 h-5 text-brand-green" /> Datos Familiares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Nombre completo del padre" required {...register('fatherName')} error={errors.fatherName?.message} />
        <Input label="Fecha de nacimiento del padre" required type="date" {...register('fatherBirthdate')} error={errors.fatherBirthdate?.message} />
        <div className="md:col-span-2">
          <Controller name="fatherInUSA" control={control} render={({ field }) => (
            <RadioGroup label="¿Su padre está en Estados Unidos?" required name="fatherInUSA"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.fatherInUSA?.message} />
          )} />
        </div>

        <Input label="Nombre completo de la madre" required {...register('motherName')} error={errors.motherName?.message} />
        <Input label="Fecha de nacimiento de la madre" required type="date" {...register('motherBirthdate')} error={errors.motherBirthdate?.message} />
        <div className="md:col-span-2">
          <Controller name="motherInUSA" control={control} render={({ field }) => (
            <RadioGroup label="¿Su madre está en Estados Unidos?" required name="motherInUSA"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.motherInUSA?.message} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Controller name="immediateRelativesInUSA" control={control} render={({ field }) => (
            <RadioGroup label="¿Tiene parientes inmediatos (excluyendo padres) en EE.UU?" required name="immediateRelativesInUSA"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.immediateRelativesInUSA?.message} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Controller name="otherRelativesInUSA" control={control} render={({ field }) => (
            <RadioGroup label="¿Tiene otros parientes en EE.UU?" required name="otherRelativesInUSA"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.otherRelativesInUSA?.message} />
          )} />
        </div>
      </div>
    </div>
  )
}
