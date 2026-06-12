import { useFormContext, Controller } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Field } from '@/components/ui/Field'
import { RadioGroup, YES_NO } from '@/components/ui/RadioGroup'
import { SectionCard, FullRow } from '@/components/ui/SectionCard'

export function Step2SocialNetworks() {
  const { register, control, formState: { errors } } = useFormContext<VisaFormData>()

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <SectionCard title="Redes Sociales" icon="🌐">
        <Field
          label="Facebook"
          placeholder="Ej: Edu Rueda"
          hint="Tal como aparece en tu perfil"
          error={errors.facebook?.message}
          {...register('facebook')}
        />
        <Field
          label="Instagram"
          placeholder="@usuario"
          error={errors.instagram?.message}
          {...register('instagram')}
        />
        <Field
          label="LinkedIn"
          placeholder="Ej: Eduardo Rueda"
          error={errors.linkedin?.message}
          {...register('linkedin')}
        />
        <FullRow>
          <Field
            label="Otras redes sociales"
            placeholder="Indicar red y usuario, o 'No aplica'"
            error={errors.otherSocialMedia?.message}
            {...register('otherSocialMedia')}
          />
        </FullRow>
      </SectionCard>

      <SectionCard title="Documentos Estadounidenses" icon="🇺🇸">
        <FullRow>
          <Controller
            name="usDriversLicense"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Le han emitido una licencia de conducir en Estados Unidos?"
                required
                options={YES_NO}
                name="usDriversLicense"
                value={field.value}
                onChange={field.onChange}
                error={errors.usDriversLicense?.message}
              />
            )}
          />
        </FullRow>
        <FullRow>
          <Field
            label="Número de identificación fiscal de EE.UU. (ITIN/SSN)"
            placeholder="Indicar número o 'No aplica'"
            hint="Si lo tiene pero no recuerda, indicar 'No recuerdo el número'"
            error={errors.usTaxId?.message}
            {...register('usTaxId')}
          />
        </FullRow>
      </SectionCard>
    </div>
  )
}
