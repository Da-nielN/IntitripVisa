import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Share2 } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'
import { RadioGroup } from '../ui/RadioGroup'

interface Props { form: UseFormReturn<VisaFormSchema> }
const siNoOpts = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const SocialMediaSection: React.FC<Props> = ({ form }) => {
  const { register, control, formState: { errors } } = form
  return (
    <div className="section-card">
      <h2 className="section-title">
        <Share2 className="w-5 h-5 text-brand-green" /> Redes Sociales y Documentos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Facebook (usuario)" {...register('facebook')} error={errors.facebook?.message} placeholder="@usuario o nombre completo" />
        <Input label="Instagram (usuario)" {...register('instagram')} error={errors.instagram?.message} placeholder="@usuario" />
        <Input label="LinkedIn (usuario)" {...register('linkedin')} error={errors.linkedin?.message} placeholder="nombre-apellido" />
        <Input label="Otras redes sociales" {...register('otherSocialMedia')} error={errors.otherSocialMedia?.message} placeholder="Twitter: @usuario, TikTok: @usuario" />
        <div className="md:col-span-2">
          <Controller name="usDriversLicense" control={control} render={({ field }) => (
            <RadioGroup label="¿Le han emitido licencia de conducir en EE.UU?" required name="usDriversLicense"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.usDriversLicense?.message} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Input label="Número de identificación fiscal de EE.UU. (si tiene)" {...register('usTaxId')} error={errors.usTaxId?.message} placeholder="No aplica si no tiene" />
        </div>
      </div>
    </div>
  )
}
