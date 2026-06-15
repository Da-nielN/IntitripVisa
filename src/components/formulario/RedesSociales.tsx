import { useFormContext } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Campo } from '@/components/interfaz/Campo'
import { TarjetaSeccion, FilaCompleta } from '@/components/interfaz/TarjetaSeccion'

export function RedesSociales() {
  const { register, formState: { errors } } = useFormContext<VisaFormData>()

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <TarjetaSeccion title="Redes Sociales" icon="RS">
        <Campo label="Facebook" placeholder="Ej: Edu Rueda" hint="Tal como aparece en tu perfil" error={errors.facebook?.message} {...register('facebook')} />
        <Campo label="Instagram" placeholder="@usuario" error={errors.instagram?.message} {...register('instagram')} />
        <Campo label="LinkedIn" placeholder="Ej: Eduardo Rueda" error={errors.linkedin?.message} {...register('linkedin')} />
        <FilaCompleta>
          <Campo label="Otras redes sociales" placeholder="Indicar red y usuario, o 'No aplica'" error={errors.otherSocialMedia?.message} {...register('otherSocialMedia')} />
        </FilaCompleta>
      </TarjetaSeccion>
    </div>
  )
}
