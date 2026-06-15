import { useFormContext } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Campo } from '@/components/interfaz/Campo'
import { TarjetaSeccion, FilaCompleta } from '@/components/interfaz/TarjetaSeccion'

export function Educacion() {
  const { register, formState: { errors } } = useFormContext<VisaFormData>()

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <TarjetaSeccion title="Formación Académica" icon="ED">
        <Campo label="Institución de bachillerato" placeholder="Ej: Cardenal Spellman" error={errors.bachelorInstitution?.message} {...register('bachelorInstitution')} />
        <Campo label="Institución universitaria" required placeholder="Ej: Pontificia Universidad Católica del Ecuador" error={errors.universityInstitution?.message} {...register('universityInstitution')} />
        <FilaCompleta>
          <Campo label="Nombre de la carrera o programa" required placeholder="Ej: Administración de Empresas" error={errors.careerName?.message} {...register('careerName')} />
        </FilaCompleta>
        <FilaCompleta>
          <Campo label="Dirección de la institución" placeholder="Ej: 12 de Octubre y Francisco Ramón Roca" error={errors.educationAddress?.message} {...register('educationAddress')} />
        </FilaCompleta>
        <Campo label="Ciudad" placeholder="Ej: Quito" error={errors.educationCity?.message} {...register('educationCity')} />
        <Campo label="Provincia" placeholder="Ej: Pichincha" error={errors.educationProvince?.message} {...register('educationProvince')} />
        <Campo label="Código postal" placeholder="Ej: 170525" error={errors.educationPostalCode?.message} {...register('educationPostalCode')} />
        <Campo label="Teléfono de la institución" type="tel" placeholder="Ej: +593 2-299-1700" error={errors.educationPhone?.message} {...register('educationPhone')} />
        <Campo label="Fecha de inicio de la carrera" required type="date" error={errors.educationStartDate?.message} {...register('educationStartDate')} />
        <Campo label="Fecha de finalización" type="date" hint="Dejar en blanco si aún está en curso" error={errors.educationEndDate?.message} {...register('educationEndDate')} />
        <FilaCompleta>
          <Campo label="Idiomas que habla" required placeholder="Ej: Español (nativo), Inglés (intermedio)" error={errors.languages?.message} {...register('languages')} />
        </FilaCompleta>
      </TarjetaSeccion>
    </div>
  )
}


