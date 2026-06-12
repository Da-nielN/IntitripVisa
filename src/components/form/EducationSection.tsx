import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'

interface Props { form: UseFormReturn<VisaFormSchema> }

export const EducationSection: React.FC<Props> = ({ form }) => {
  const { register, formState: { errors } } = form
  return (
    <div className="section-card">
      <h2 className="section-title"><GraduationCap className="w-5 h-5 text-brand-green" /> Estudios Alcanzados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Institución de bachillerato" {...register('bachelorInstitution')} error={errors.bachelorInstitution?.message} placeholder="Nombre del colegio" />
        <Input label="Institución universitaria" required {...register('universityInstitution')} error={errors.universityInstitution?.message} placeholder="Nombre de la universidad" />
        <div className="md:col-span-2">
          <Input label="Carrera o programa" required {...register('careerName')} error={errors.careerName?.message} placeholder="Administración de Empresas, Ingeniería..." />
        </div>
        <div className="md:col-span-2">
          <Input label="Dirección de la institución" {...register('educationAddress')} error={errors.educationAddress?.message} placeholder="Av. Ejemplo & Calle" />
        </div>
        <Input label="Ciudad" {...register('educationCity')} error={errors.educationCity?.message} />
        <Input label="Provincia" {...register('educationProvince')} error={errors.educationProvince?.message} />
        <Input label="Código postal" {...register('educationPostalCode')} error={errors.educationPostalCode?.message} />
        <Input label="Teléfono de la institución" type="tel" {...register('educationPhone')} error={errors.educationPhone?.message} />
        <Input label="Fecha de inicio" type="date" {...register('educationStartDate')} error={errors.educationStartDate?.message} />
        <Input label="Fecha de finalización" type="date" {...register('educationEndDate')} error={errors.educationEndDate?.message} />
        <div className="md:col-span-2">
          <Input label="Idiomas que habla" required {...register('languages')} error={errors.languages?.message} placeholder="Español (nativo), Inglés (intermedio), Francés (básico)" />
        </div>
      </div>
    </div>
  )
}
