import { useFormContext, Controller } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Field } from '@/components/ui/Field'
import { SelectField } from '@/components/ui/SelectField'
import { RadioGroup, YES_NO } from '@/components/ui/RadioGroup'
import { SectionCard, FullRow } from '@/components/ui/SectionCard'
import { PROVINCES_EC } from '@/constants'

const MARITAL_OPTIONS = [
  { value: 'soltero',     label: 'Soltero/a' },
  { value: 'casado',      label: 'Casado/a' },
  { value: 'divorciado',  label: 'Divorciado/a' },
  { value: 'viudo',       label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]

const PROVINCE_OPTIONS = PROVINCES_EC.map((p) => ({ value: p, label: p }))

export function Step1PersonalData() {
  const { register, control, watch, formState: { errors } } = useFormContext<VisaFormData>()
  const maritalStatus = watch('maritalStatus')

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <SectionCard title="Identificación" icon="🪪">
        <FullRow>
          <Field
            label="Nombres y Apellidos completos"
            required
            placeholder="Ej: Luis Eduardo Rueda Montenegro"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </FullRow>
        <Field
          label="Número de Cédula"
          required
          placeholder="1722520284"
          maxLength={10}
          error={errors.cedula?.message}
          {...register('cedula')}
        />
        <Field
          label="Nacionalidad"
          required
          placeholder="Ej: Ecuatoriana"
          error={errors.nationality?.message}
          {...register('nationality')}
        />
        <Field
          label="Otra nacionalidad"
          placeholder="No aplica"
          hint="Si posee otra distinta a la de nacimiento"
          error={errors.otherNationality?.message}
          {...register('otherNationality')}
        />
        <FullRow>
          <Controller
            name="isPermanentResidentAbroad"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Es residente permanente en un país distinto al de nacimiento?"
                required
                options={YES_NO}
                name="isPermanentResidentAbroad"
                value={field.value}
                onChange={field.onChange}
                error={errors.isPermanentResidentAbroad?.message}
              />
            )}
          />
        </FullRow>
      </SectionCard>

      <SectionCard title="Estado Civil" icon="💍">
        <SelectField
          label="Estado civil"
          required
          options={MARITAL_OPTIONS}
          placeholder="Seleccione..."
          error={errors.maritalStatus?.message}
          {...register('maritalStatus')}
        />
        {maritalStatus === 'casado' && (
          <>
            <Field
              label="Nombre completo del cónyuge"
              placeholder="Nombres y apellidos"
              error={errors.spouseName?.message}
              {...register('spouseName')}
            />
            <Field
              label="Fecha de nacimiento del cónyuge"
              type="date"
              error={errors.spouseBirthdate?.message}
              {...register('spouseBirthdate')}
            />
            <Field
              label="Nacionalidad del cónyuge"
              placeholder="Ej: Ecuatoriana"
              error={errors.spouseNationality?.message}
              {...register('spouseNationality')}
            />
          </>
        )}
      </SectionCard>

      <SectionCard title="Contacto" icon="📞">
        <Field
          label="Teléfono del domicilio"
          type="tel"
          placeholder="Ej: 022595690"
          error={errors.homePhone?.message}
          {...register('homePhone')}
        />
        <Field
          label="Celular"
          required
          type="tel"
          placeholder="Ej: 0999999999"
          error={errors.cellPhone?.message}
          {...register('cellPhone')}
        />
        <FullRow>
          <Field
            label="¿Otros números de celular en los últimos 5 años?"
            placeholder="Indicar números anteriores o 'No aplica'"
            error={errors.previousPhones?.message}
            {...register('previousPhones')}
          />
        </FullRow>
        <Field
          label="Correo electrónico"
          required
          type="email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Otros correos (últimos 5 años)"
          placeholder="Correos anteriores o 'No aplica'"
          error={errors.previousEmails?.message}
          {...register('previousEmails')}
        />
      </SectionCard>

      <SectionCard title="Domicilio" icon="🏠">
        <FullRow>
          <Field
            label="Dirección exacta del domicilio"
            required
            placeholder="Av. Mariscal Sucre & Francisco Granizo..."
            error={errors.address?.message}
            {...register('address')}
          />
        </FullRow>
        <Field
          label="Ciudad"
          required
          placeholder="Ej: Quito"
          error={errors.city?.message}
          {...register('city')}
        />
        <SelectField
          label="Provincia"
          required
          options={PROVINCE_OPTIONS}
          placeholder="Seleccione provincia..."
          error={errors.province?.message}
          {...register('province')}
        />
        <Field
          label="Código postal"
          placeholder="Ej: 170302"
          error={errors.postalCode?.message}
          {...register('postalCode')}
        />
      </SectionCard>

      <SectionCard title="Pasaporte" icon="📗">
        <Field
          label="Ciudad donde tramitó el pasaporte vigente"
          required
          placeholder="Ej: Quito"
          error={errors.passportCity?.message}
          {...register('passportCity')}
        />
        <Controller
          name="passportLostOrStolen"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="¿Alguna vez ha perdido o le han robado el pasaporte?"
              required
              options={YES_NO}
              name="passportLostOrStolen"
              value={field.value}
              onChange={field.onChange}
              error={errors.passportLostOrStolen?.message}
            />
          )}
        />
      </SectionCard>
    </div>
  )
}
