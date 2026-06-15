import React, { useEffect } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { User } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { COUNTRIES, ECUADOR_CITIES, ECUADOR_CITIES_BY_PROVINCE, NATIONALITIES, PROVINCES_EC } from '../../constants'
import { Entrada } from '../interfaz/Entrada'
import { Selector } from '../interfaz/Selector'
import { GrupoRadios } from '../interfaz/GrupoRadios'

interface Props { form: UseFormReturn<VisaFormSchema> }

const opcionesEstadoCivil = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]
const opcionesSiNo = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]
const opcionesSexo = [{ value: 'masculino', label: 'Masculino' }, { value: 'femenino', label: 'Femenino' }]
const opcionesPaises = COUNTRIES.map((country) => ({ value: country, label: country }))
const opcionesNacionalidades = NATIONALITIES.map((nationality) => ({ value: nationality, label: nationality }))
const opcionesProvincias = PROVINCES_EC.map((province) => ({ value: province, label: province }))
const opcionesCiudadesEcuador = ECUADOR_CITIES.map((city) => ({ value: city, label: city }))

const soloNumeros = (maxLength?: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.replace(/\D/g, '')
  event.target.value = maxLength ? value.slice(0, maxLength) : value
}

export const SeccionPersonal: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const estadoCivil = watch('maritalStatus')
  const provinciaSeleccionada = watch('province')
  const ciudadSeleccionada = watch('city')
  const tieneOtraNacionalidad = watch('hasOtherNationality')
  const esResidentePermanenteExtranjero = watch('isPermanentResidentAbroad')
  const tuvoCorreosAnteriores = watch('hasPreviousEmails')
  const tieneIdentificacionFiscal = watch('hasUsTaxId')
  const ciudadesPorProvincia = provinciaSeleccionada ? ECUADOR_CITIES_BY_PROVINCE[provinciaSeleccionada] ?? [] : []
  const opcionesCiudadesPorProvincia = ciudadesPorProvincia.map((city) => ({ value: city, label: city }))

  useEffect(() => {
    if (ciudadSeleccionada && provinciaSeleccionada && !ciudadesPorProvincia.includes(ciudadSeleccionada)) {
      setValue('city', '')
    }
  }, [ciudadSeleccionada, ciudadesPorProvincia, provinciaSeleccionada, setValue])

  useEffect(() => {
    if (tieneOtraNacionalidad === 'no') setValue('otherNationality', '')
    if (esResidentePermanenteExtranjero === 'no') setValue('permanentResidentCountry', '')
    if (tuvoCorreosAnteriores === 'no') setValue('previousEmails', '')
    if (tieneIdentificacionFiscal === 'no') setValue('usTaxId', '')
  }, [esResidentePermanenteExtranjero, setValue, tieneIdentificacionFiscal, tieneOtraNacionalidad, tuvoCorreosAnteriores])

  return (
    <div className="section-card">
      <h2 className="section-title">
        <User className="w-5 h-5 text-brand-green" /> Datos Personales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Entrada label="Cédula de identidad" required {...register('cedula')} error={errors.cedula?.message} placeholder="1722520284" />
        </div>
        <Entrada label="Primer nombre" required {...register('firstName')} error={errors.firstName?.message} placeholder="Luis" />
        <Entrada label="Segundo nombre" required {...register('middleName')} error={errors.middleName?.message} placeholder="Eduardo" />
        <Entrada label="Primer apellido" required {...register('paternalLastName')} error={errors.paternalLastName?.message} placeholder="Rueda" />
        <Entrada label="Segundo apellido" required {...register('maternalLastName')} error={errors.maternalLastName?.message} placeholder="Montenegro" />
        <Entrada label="Fecha de nacimiento" required type="date" {...register('birthdate')} error={errors.birthdate?.message} />
        <Controller name="sex" control={control} render={({ field }) => (
          <Selector label="Sexo del cliente" required options={opcionesSexo} error={errors.sex?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />

        <div className="md:col-span-2">
          <Controller name="maritalStatus" control={control} render={({ field }) => (
            <Selector label="Estado civil" required options={opcionesEstadoCivil} error={errors.maritalStatus?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>

        {estadoCivil === 'casado' && <>
          <Entrada label="Nombre completo del cónyuge" {...register('spouseName')} error={errors.spouseName?.message} />
          <Entrada label="Fecha de nacimiento del cónyuge" type="date" {...register('spouseBirthdate')} error={errors.spouseBirthdate?.message} />
          <Entrada label="Nacionalidad del cónyuge" {...register('spouseNationality')} error={errors.spouseNationality?.message} />
        </>}

        <Controller name="nationality" control={control} render={({ field }) => (
          <Selector label="Nacionalidad" required options={opcionesNacionalidades} error={errors.nationality?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        <Controller name="hasOtherNationality" control={control} render={({ field }) => (
          <Selector label="¿Tiene otra nacionalidad?" required options={opcionesSiNo} error={errors.hasOtherNationality?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        {tieneOtraNacionalidad === 'si' && (
          <div className="md:col-span-2">
            <Controller name="otherNationality" control={control} render={({ field }) => (
              <Selector label="Otra nacionalidad" required options={opcionesNacionalidades} error={errors.otherNationality?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
        )}

        <div className="md:col-span-2">
          <Controller name="isPermanentResidentAbroad" control={control} render={({ field }) => (
            <GrupoRadios label="¿Es residente permanente en un país distinto al de nacimiento?" required
              name="isPermanentResidentAbroad" options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.isPermanentResidentAbroad?.message} />
          )} />
        </div>
        {esResidentePermanenteExtranjero === 'si' && (
          <div className="md:col-span-2">
            <Controller name="permanentResidentCountry" control={control} render={({ field }) => (
              <Selector label="País de residencia permanente" required options={opcionesPaises} error={errors.permanentResidentCountry?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
        )}

        <Entrada label="Teléfono domicilio" {...register('homePhone', { onChange: soloNumeros(7) })} error={errors.homePhone?.message} placeholder="2595690" type="tel" inputMode="numeric" maxLength={7} />
        <Entrada label="Celular" required {...register('cellPhone', { onChange: soloNumeros(10) })} error={errors.cellPhone?.message} placeholder="0999999999" type="tel" inputMode="numeric" maxLength={10} />
        <div className="md:col-span-2">
          <Entrada label="Otros celulares en los últimos 5 años" {...register('previousPhones')} error={errors.previousPhones?.message} placeholder="Dejar vacío si no aplica" />
        </div>
        <div className="md:col-span-2">
          <Entrada label="Dirección exacta de domicilio" required {...register('address')} error={errors.address?.message} placeholder="Av. Ejemplo & Calle, Urb. Nombre, Lote 1" />
        </div>
        <Controller name="province" control={control} render={({ field }) => (
          <Selector label="Provincia" required options={opcionesProvincias} error={errors.province?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        <Controller name="city" control={control} render={({ field }) => (
          <Selector label="Ciudad" required options={opcionesCiudadesPorProvincia} error={errors.city?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} disabled={!provinciaSeleccionada} />
        )} />
        <Entrada label="Código postal domicilio" required {...register('postalCode', { onChange: soloNumeros() })} error={errors.postalCode?.message} placeholder="170302" inputMode="numeric" />
        <Entrada label="Correo electrónico" required type="email" {...register('email')} error={errors.email?.message} placeholder="ejemplo@gmail.com" />
        <Controller name="hasPreviousEmails" control={control} render={({ field }) => (
          <Selector label="¿Ha tenido otro correo en los últimos 5 años?" required options={opcionesSiNo} error={errors.hasPreviousEmails?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        {tuvoCorreosAnteriores === 'si' && (
          <Entrada label="Correo anterior" required type="email" {...register('previousEmails')} error={errors.previousEmails?.message} placeholder="anterior@gmail.com" />
        )}
        <div className="md:col-span-2">
          <Controller name="passportCity" control={control} render={({ field }) => (
            <Selector label="Ciudad donde tramitó el pasaporte vigente" required options={opcionesCiudadesEcuador} error={errors.passportCity?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Controller name="passportLostOrStolen" control={control} render={({ field }) => (
            <GrupoRadios label="¿Ha perdido o le han robado un pasaporte?" required name="passportLostOrStolen"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.passportLostOrStolen?.message} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Controller name="usDriversLicense" control={control} render={({ field }) => (
            <GrupoRadios label="¿Le han emitido licencia de conducir en EE.UU?" required name="usDriversLicense"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.usDriversLicense?.message} />
          )} />
        </div>
        <Controller name="hasUsTaxId" control={control} render={({ field }) => (
          <Selector label="¿Tiene identificación fiscal de EE.UU.?" required options={opcionesSiNo} error={errors.hasUsTaxId?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        {tieneIdentificacionFiscal === 'si' && (
          <Entrada label="Número de identificación fiscal de EE.UU. (si tiene)" required {...register('usTaxId', { onChange: soloNumeros() })} error={errors.usTaxId?.message} placeholder="Solo números" inputMode="numeric" />
        )}
      </div>
    </div>
  )
}
