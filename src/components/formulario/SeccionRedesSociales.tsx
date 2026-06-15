import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Share2 } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Entrada } from '../interfaz/Entrada'

interface Props { form: UseFormReturn<VisaFormSchema> }

export const SeccionRedesSociales: React.FC<Props> = ({ form }) => {
  const { register, formState: { errors } } = form
  return (
    <div className="section-card">
      <h2 className="section-title">
        <Share2 className="w-5 h-5 text-brand-green" /> Redes Sociales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Entrada label="Facebook (usuario)" {...register('facebook')} error={errors.facebook?.message} placeholder="@usuario o nombre completo" />
        <Entrada label="Instagram (usuario)" {...register('instagram')} error={errors.instagram?.message} placeholder="@usuario" />
        <Entrada label="LinkedIn (usuario)" {...register('linkedin')} error={errors.linkedin?.message} placeholder="nombre-apellido" />
        <Entrada label="Otras redes sociales" {...register('otherSocialMedia')} error={errors.otherSocialMedia?.message} placeholder="Twitter: @usuario, TikTok: @usuario" />
      </div>
    </div>
  )
}


