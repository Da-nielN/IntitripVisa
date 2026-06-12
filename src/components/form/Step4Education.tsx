import { useFormContext } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Field } from '@/components/ui/Field'
import { SectionCard, FullRow } from '@/components/ui/SectionCard'
//import { PROVINCES_EC } from '@/constants'

//const PROVINCE_OPTIONS = PROVINCES_EC.map((p) => ({ value: p, label: p }))

export function Step4Education() {
  const { register, formState: { errors } } = useFormContext<VisaFormData>()

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <SectionCard title="Formación Académica" icon="🎓">
        <Field
          label="Institución de bachillerato"
          placeholder="Ej: Cardenal Spellman"
          error={errors.bachelorInstitution?.message}
          {...register('bachelorInstitution')}
        />
        <Field
          label="Institución universitaria"
          required
          placeholder="Ej: Pontificia Universidad Católica del Ecuador"
          error={errors.universityInstitution?.message}
          {...register('universityInstitution')}
        />
        <FullRow>
          <Field
            label="Nombre de la carrera o programa"
            required
            placeholder="Ej: Administración de Empresas"
            error={errors.careerName?.message}
            {...register('careerName')}
          />
        </FullRow>
        <FullRow>
          <Field
            label="Dirección de la institución"
            placeholder="Ej: 12 de Octubre y Francisco Ramón Roca"
            error={errors.educationAddress?.message}
            {...register('educationAddress')}
          />
        </FullRow>
        <Field
          label="Ciudad"
          placeholder="Ej: Quito"
          error={errors.educationCity?.message}
          {...register('educationCity')}
        />
        <Field
          label="Provincia"
          placeholder="Ej: Pichincha"
          error={errors.educationProvince?.message}
          {...register('educationProvince')}
        />
        <Field
          label="Código postal"
          placeholder="Ej: 170525"
          error={errors.educationPostalCode?.message}
          {...register('educationPostalCode')}
        />
        <Field
          label="Teléfono de la institución"
          type="tel"
          placeholder="Ej: +593 2-299-1700"
          error={errors.educationPhone?.message}
          {...register('educationPhone')}
        />
        <Field
          label="Fecha de inicio de la carrera"
          required
          type="date"
          error={errors.educationStartDate?.message}
          {...register('educationStartDate')}
        />
        <Field
          label="Fecha de finalización"
          type="date"
          hint="Dejar en blanco si aún está en curso"
          error={errors.educationEndDate?.message}
          {...register('educationEndDate')}
        />
        <FullRow>
          <Field
            label="Idiomas que habla"
            required
            placeholder="Ej: Español (nativo), Inglés (intermedio)"
            error={errors.languages?.message}
            {...register('languages')}
          />
        </FullRow>
      </SectionCard>
    </div>
  )
}
