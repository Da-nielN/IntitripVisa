import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { User } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { RadioGroup } from '../ui/RadioGroup'

interface Props { form: UseFormReturn<VisaFormSchema> }

const maritalOptions = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]
const siNoOpts = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const PersonalSection: React.FC<Props> = ({ form }) => {
  const { register, control, watch, formState: { errors } } = form
  const marital = watch('maritalStatus')

  return (
    <div className="section-card">
      <h2 className="section-title">
        <User className="w-5 h-5 text-brand-green" /> Datos Personales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Input label="Cédula de identidad" required {...register('cedula')} error={errors.cedula?.message} placeholder="1722520284" />
        </div>
        <div className="md:col-span-2">
          <Input label="Nombres y apellidos completos" required {...register('fullName')} error={errors.fullName?.message} placeholder="Tal como aparece en el pasaporte" />
        </div>

        <div className="md:col-span-2">
          <Controller name="maritalStatus" control={control} render={({ field }) => (
            <Select label="Estado civil" required options={maritalOptions} error={errors.maritalStatus?.message}
              value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>

        {marital === 'casado' && <>
          <Input label="Nombre completo del cónyuge" {...register('spouseName')} error={errors.spouseName?.message} />
          <Input label="Fecha de nacimiento del cónyuge" type="date" {...register('spouseBirthdate')} error={errors.spouseBirthdate?.message} />
          <Input label="Nacionalidad del cónyuge" {...register('spouseNationality')} error={errors.spouseNationality?.message} />
        </>}

        <Input label="Nacionalidad" required {...register('nationality')} error={errors.nationality?.message} placeholder="Ecuatoriano" />
        <Input label="Otra nacionalidad (si aplica)" {...register('otherNationality')} error={errors.otherNationality?.message} placeholder="No aplica" />

        <div className="md:col-span-2">
          <Controller name="isPermanentResidentAbroad" control={control} render={({ field }) => (
            <RadioGroup label="¿Es residente permanente en un país distinto al de nacimiento?" required
              name="isPermanentResidentAbroad" options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.isPermanentResidentAbroad?.message} />
          )} />
        </div>

        <Input label="Teléfono domicilio" {...register('homePhone')} error={errors.homePhone?.message} placeholder="02-595-6900" type="tel" />
        <Input label="Ciudad" required {...register('city')} error={errors.city?.message} placeholder="Quito" />
        <Input label="Provincia" required {...register('province')} error={errors.province?.message} placeholder="Pichincha" />
        <Input label="Celular" required {...register('cellPhone')} error={errors.cellPhone?.message} placeholder="099-999-9999" type="tel" />
        <div className="md:col-span-2">
          <Input label="Otros celulares en los últimos 5 años" {...register('previousPhones')} error={errors.previousPhones?.message} placeholder="Dejar vacío si no aplica" />
        </div>
        <div className="md:col-span-2">
          <Input label="Dirección exacta de domicilio" required {...register('address')} error={errors.address?.message} placeholder="Av. Ejemplo & Calle, Urb. Nombre, Lote 1" />
        </div>
        <Input label="Código postal domicilio" required {...register('postalCode')} error={errors.postalCode?.message} placeholder="170302" />
        <Input label="Correo electrónico" required type="email" {...register('email')} error={errors.email?.message} placeholder="ejemplo@gmail.com" />
        <div className="md:col-span-2">
          <Input label="Otros correos en los últimos 5 años" {...register('previousEmails')} error={errors.previousEmails?.message} placeholder="Dejar vacío si no aplica" />
        </div>
        <Input label="Ciudad donde tramitó el pasaporte vigente" required {...register('passportCity')} error={errors.passportCity?.message} placeholder="Quito" />
        <div className="md:col-span-2">
          <Controller name="passportLostOrStolen" control={control} render={({ field }) => (
            <RadioGroup label="¿Ha perdido o le han robado un pasaporte?" required name="passportLostOrStolen"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.passportLostOrStolen?.message} />
          )} />
        </div>
      </div>
    </div>
  )
}
