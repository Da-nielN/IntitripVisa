import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Entrada } from '../interfaz/Entrada'

interface Props { form: UseFormReturn<VisaFormSchema> }

export const SeccionEducacion: React.FC<Props> = ({ form }) => {
  const { register, formState: { errors } } = form
  return (
    <div className="section-card">
      <h2 className="section-title"><GraduationCap className="w-5 h-5 text-brand-green" /> Estudios Alcanzados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Entrada label="Institución de bachillerato" {...register('bachelorInstitution')} error={errors.bachelorInstitution?.message} placeholder="Nombre del colegio" />
        <Entrada label="Institución universitaria" required {...register('universityInstitution')} error={errors.universityInstitution?.message} placeholder="Nombre de la universidad" />
        <div className="md:col-span-2">
          <Entrada label="Carrera o programa" required {...register('careerName')} error={errors.careerName?.message} placeholder="Administración de Empresas, Ingeniería..." />
        </div>
        <div className="md:col-span-2">
          <Entrada label="Dirección de la institución" {...register('educationAddress')} error={errors.educationAddress?.message} placeholder="Av. Ejemplo & Calle" />
        </div>
        <Entrada label="Ciudad" {...register('educationCity')} error={errors.educationCity?.message} />
        <Entrada label="Provincia" {...register('educationProvince')} error={errors.educationProvince?.message} />
        <Entrada label="Código postal" {...register('educationPostalCode')} error={errors.educationPostalCode?.message} />
        <Entrada label="Teléfono de la institución" type="tel" {...register('educationPhone')} error={errors.educationPhone?.message} />
        <Entrada label="Fecha de inicio" type="date" {...register('educationStartDate')} error={errors.educationStartDate?.message} />
        <Entrada label="Fecha de finalización" type="date" {...register('educationEndDate')} error={errors.educationEndDate?.message} />
        <div className="md:col-span-2">
          <Entrada label="Idiomas que habla" required {...register('languages')} error={errors.languages?.message} placeholder="Español (nativo), Inglés (intermedio), Francés (básico)" />
        </div>
      </div>
    </div>
  )
}


