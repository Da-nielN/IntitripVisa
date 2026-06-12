import { useFormContext, Controller } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Field } from '@/components/ui/Field'
import { TextareaField } from '@/components/ui/TextareaField'
import { RadioGroup, YES_NO } from '@/components/ui/RadioGroup'
import { SectionCard, FullRow } from '@/components/ui/SectionCard'

export function Step3Work() {
  const { register, control, watch, formState: { errors } } = useFormContext<VisaFormData>()
  const hasPreviousJob = watch('hasPreviousJob')

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <SectionCard title="Empleo Actual" icon="💼">
        <Field
          label="Cargo actual"
          required
          placeholder="Ej: KAM - Key Account Manager"
          error={errors.currentPosition?.message}
          {...register('currentPosition')}
        />
        <Field
          label="Nombre del empleador / empresa"
          required
          placeholder="Ej: Beiersdorf Ecuador"
          error={errors.currentEmployer?.message}
          {...register('currentEmployer')}
        />
        <FullRow>
          <TextareaField
            label="Descripción breve de funciones"
            required
            placeholder="Describa sus principales responsabilidades..."
            error={errors.currentJobDescription?.message}
            {...register('currentJobDescription')}
          />
        </FullRow>
        <Field
          label="Sueldo mensual (USD)"
          required
          placeholder="Ej: $1.200"
          error={errors.currentSalary?.message}
          {...register('currentSalary')}
        />
        <Field
          label="Fecha de inicio de labores"
          required
          type="date"
          error={errors.currentJobStartDate?.message}
          {...register('currentJobStartDate')}
        />
        <FullRow>
          <Field
            label="Dirección exacta del trabajo"
            required
            placeholder="Av. Manuel Najas & Juan de Selis..."
            error={errors.currentJobAddress?.message}
            {...register('currentJobAddress')}
          />
        </FullRow>
        <Field
          label="Código postal del trabajo"
          placeholder="Ej: 170302"
          error={errors.currentJobPostalCode?.message}
          {...register('currentJobPostalCode')}
        />
        <Field
          label="Teléfono del trabajo"
          type="tel"
          placeholder="Ej: +1800 064 832"
          error={errors.currentJobPhone?.message}
          {...register('currentJobPhone')}
        />
      </SectionCard>

      <SectionCard title="Empleo Anterior" icon="📋">
        <FullRow>
          <Controller
            name="hasPreviousJob"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Tuvo trabajos anteriores?"
                required
                options={YES_NO}
                name="hasPreviousJob"
                value={field.value}
                onChange={field.onChange}
                error={errors.hasPreviousJob?.message}
              />
            )}
          />
        </FullRow>

        {hasPreviousJob === 'si' && (
          <>
            <Field
              label="Nombre del empleador anterior"
              placeholder="Ej: Banco Diners Club del Ecuador"
              error={errors.previousEmployer?.message}
              {...register('previousEmployer')}
            />
            <Field
              label="Cargo desempeñado"
              placeholder="Ej: Especialista de Sistemática"
              error={errors.previousPosition?.message}
              {...register('previousPosition')}
            />
            <FullRow>
              <Field
                label="Dirección exacta del empleo anterior"
                placeholder="Av. Amazonas N38-70 & Villalengua..."
                error={errors.previousJobAddress?.message}
                {...register('previousJobAddress')}
              />
            </FullRow>
            <Field
              label="Código postal"
              placeholder="Ej: 170507"
              error={errors.previousJobPostalCode?.message}
              {...register('previousJobPostalCode')}
            />
            <Field
              label="Teléfono del empleo anterior"
              type="tel"
              placeholder="Ej: 022984400"
              error={errors.previousJobPhone?.message}
              {...register('previousJobPhone')}
            />
            <Field
              label="Nombre del supervisor"
              placeholder="Ej: Francisca de la Rosa"
              error={errors.previousSupervisorName?.message}
              {...register('previousSupervisorName')}
            />
            <Field
              label="Fecha de inicio"
              type="date"
              error={errors.previousJobStartDate?.message}
              {...register('previousJobStartDate')}
            />
            <Field
              label="Fecha de finalización"
              type="date"
              error={errors.previousJobEndDate?.message}
              {...register('previousJobEndDate')}
            />
            <FullRow>
              <TextareaField
                label="Descripción del cargo desempeñado"
                placeholder="Describa sus funciones en el empleo anterior..."
                error={errors.previousJobDescription?.message}
                {...register('previousJobDescription')}
              />
            </FullRow>
          </>
        )}
      </SectionCard>
    </div>
  )
}
