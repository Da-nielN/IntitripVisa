import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Contact } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { estadosEEUU, relacionContactoEEUU } from '../../constants/opcionesFormulario'
import { Entrada } from '../interfaz/Entrada'
import { Selector } from '../interfaz/Selector'
import { recortarEspacios, soloLetras } from '../../utils/validacionesFormulario'

interface Props { form: UseFormReturn<VisaFormSchema> }

// Pantalla USContact del DS-160. La organizacion queda fija en "no aplica"
// (cbxUS_POC_ORG_NA_IND), asi que aqui solo se pide la persona de contacto.
export const SeccionContactoEEUU: React.FC<Props> = ({ form }) => {
  const { register, control, formState: { errors } } = form

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Contact className="w-5 h-5 text-brand-green" /> Contacto en Estados Unidos
      </h2>
      <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">
        Persona en Estados Unidos que pueda confirmar su viaje. Puede ser un familiar, un amigo o el hotel donde se hospedará.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Entrada label="Apellidos del contacto" required {...register('apellidosContactoEEUU', { onChange: soloLetras, onBlur: recortarEspacios })}
          error={errors.apellidosContactoEEUU?.message} maxLength={33} />
        <Entrada label="Nombres del contacto" required {...register('nombresContactoEEUU', { onChange: soloLetras, onBlur: recortarEspacios })}
          error={errors.nombresContactoEEUU?.message} maxLength={33} />
        <div className="md:col-span-2">
          <Controller name="relacionContactoEEUU" control={control} render={({ field }) => (
            <Selector label="Relación del contacto con usted" required options={relacionContactoEEUU}
              error={errors.relacionContactoEEUU?.message} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Entrada label="Dirección del contacto" required {...register('direccionContactoEEUU')}
            error={errors.direccionContactoEEUU?.message} placeholder="123 Main St, Apt 4B" maxLength={40} />
        </div>
        <Entrada label="Ciudad" required {...register('ciudadContactoEEUU')}
          error={errors.ciudadContactoEEUU?.message} placeholder="Miami" maxLength={20} />
        <Controller name="estadoContactoEEUU" control={control} render={({ field }) => (
          <Selector label="Estado" required options={estadosEEUU} error={errors.estadoContactoEEUU?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        <div className="md:col-span-2">
          <Entrada label="Teléfono del contacto" required type="tel" {...register('telefonoContactoEEUU')}
            error={errors.telefonoContactoEEUU?.message} placeholder="3055551234" maxLength={15} />
        </div>
      </div>
    </div>
  )
}
