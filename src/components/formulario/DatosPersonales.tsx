import { useEffect, type ChangeEvent } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Campo } from '@/components/interfaz/Campo'
import { CampoSelector } from '@/components/interfaz/CampoSelector'
import { GrupoRadios, SI_NO } from '@/components/interfaz/GrupoRadios'
import { TarjetaSeccion, FilaCompleta } from '@/components/interfaz/TarjetaSeccion'
import { COUNTRIES, ECUADOR_CITIES, ECUADOR_CITIES_BY_PROVINCE, NATIONALITIES, PROVINCES_EC } from '@/constants'

const OPCIONES_ESTADO_CIVIL = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'union_libre', label: 'Unión libre' },
]
const OPCIONES_SEXO = [{ value: 'masculino', label: 'Masculino' }, { value: 'femenino', label: 'Femenino' }]
const OPCIONES_PROVINCIA = PROVINCES_EC.map((provincia) => ({ value: provincia, label: provincia }))
const OPCIONES_CIUDADES_EC = ECUADOR_CITIES.map((ciudad) => ({ value: ciudad, label: ciudad }))
const OPCIONES_NACIONALIDAD = NATIONALITIES.map((nacionalidad) => ({ value: nacionalidad, label: nacionalidad }))
const OPCIONES_PAISES = COUNTRIES.map((pais) => ({ value: pais, label: pais }))

const soloNumeros = (maxLength?: number) => (event: ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.replace(/\D/g, '')
  event.target.value = maxLength ? value.slice(0, maxLength) : value
}

export function DatosPersonales() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<VisaFormData>()
  const estadoCivil = watch('maritalStatus')
  const provincia = watch('province')
  const ciudad = watch('city')
  const tieneOtraNacionalidad = watch('hasOtherNationality')
  const esResidentePermanenteExtranjero = watch('isPermanentResidentAbroad')
  const tuvoCorreosAnteriores = watch('hasPreviousEmails')
  const tieneIdentificacionFiscal = watch('hasUsTaxId')
  const ciudadesProvincia = provincia ? ECUADOR_CITIES_BY_PROVINCE[provincia] ?? [] : []
  const opcionesCiudad = ciudadesProvincia.map((item) => ({ value: item, label: item }))

  useEffect(() => {
    if (ciudad && provincia && !ciudadesProvincia.includes(ciudad)) setValue('city', '')
  }, [ciudad, ciudadesProvincia, provincia, setValue])

  useEffect(() => {
    if (tieneOtraNacionalidad === 'no') setValue('otherNationality', '')
    if (esResidentePermanenteExtranjero === 'no') setValue('permanentResidentCountry', '')
    if (tuvoCorreosAnteriores === 'no') setValue('previousEmails', '')
    if (tieneIdentificacionFiscal === 'no') setValue('usTaxId', '')
  }, [esResidentePermanenteExtranjero, setValue, tieneIdentificacionFiscal, tieneOtraNacionalidad, tuvoCorreosAnteriores])

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <TarjetaSeccion title="Identificación" icon="ID">
        <Campo label="Primer nombre" required placeholder="Luis" error={errors.firstName?.message} {...register('firstName')} />
        <Campo label="Segundo nombre" required placeholder="Eduardo" error={errors.middleName?.message} {...register('middleName')} />
        <Campo label="Primer apellido" required placeholder="Rueda" error={errors.paternalLastName?.message} {...register('paternalLastName')} />
        <Campo label="Segundo apellido" required placeholder="Montenegro" error={errors.maternalLastName?.message} {...register('maternalLastName')} />
        <Campo label="Número de Cédula" required placeholder="1722520284" maxLength={10} error={errors.cedula?.message} {...register('cedula')} />
        <Campo label="Fecha de nacimiento" required type="date" error={errors.birthdate?.message} {...register('birthdate')} />
        <CampoSelector label="Sexo del cliente" required options={OPCIONES_SEXO} placeholder="Seleccione..." error={errors.sex?.message} {...register('sex')} />
        <CampoSelector label="Nacionalidad" required options={OPCIONES_NACIONALIDAD} placeholder="Seleccione..." error={errors.nationality?.message} {...register('nationality')} />
        <CampoSelector label="¿Tiene otra nacionalidad?" required options={SI_NO} placeholder="Seleccione..." error={errors.hasOtherNationality?.message} {...register('hasOtherNationality')} />
        {tieneOtraNacionalidad === 'si' && (
          <CampoSelector label="Otra nacionalidad" required options={OPCIONES_NACIONALIDAD} placeholder="Seleccione..." error={errors.otherNationality?.message} {...register('otherNationality')} />
        )}
        <FilaCompleta>
          <Controller
            name="isPermanentResidentAbroad"
            control={control}
            render={({ field }) => (
              <GrupoRadios label="¿Es residente permanente en un país distinto al de nacimiento?" required options={SI_NO} name="isPermanentResidentAbroad" value={field.value} onChange={field.onChange} error={errors.isPermanentResidentAbroad?.message} />
            )}
          />
        </FilaCompleta>
        {esResidentePermanenteExtranjero === 'si' && (
          <FilaCompleta>
            <CampoSelector label="País de residencia permanente" required options={OPCIONES_PAISES} placeholder="Seleccione..." error={errors.permanentResidentCountry?.message} {...register('permanentResidentCountry')} />
          </FilaCompleta>
        )}
      </TarjetaSeccion>

      <TarjetaSeccion title="Estado Civil" icon="EC">
        <CampoSelector label="Estado civil" required options={OPCIONES_ESTADO_CIVIL} placeholder="Seleccione..." error={errors.maritalStatus?.message} {...register('maritalStatus')} />
        {estadoCivil === 'casado' && (
          <>
            <Campo label="Nombre completo del cónyuge" placeholder="Nombres y apellidos" error={errors.spouseName?.message} {...register('spouseName')} />
            <Campo label="Fecha de nacimiento del cónyuge" type="date" error={errors.spouseBirthdate?.message} {...register('spouseBirthdate')} />
            <Campo label="Nacionalidad del cónyuge" placeholder="Ej: Ecuatoriana" error={errors.spouseNationality?.message} {...register('spouseNationality')} />
          </>
        )}
      </TarjetaSeccion>

      <TarjetaSeccion title="Contacto" icon="CO">
        <Campo label="Teléfono del domicilio" type="tel" inputMode="numeric" maxLength={7} placeholder="2595690" error={errors.homePhone?.message} {...register('homePhone', { onChange: soloNumeros(7) })} />
        <Campo label="Celular" required type="tel" inputMode="numeric" maxLength={10} placeholder="0999999999" error={errors.cellPhone?.message} {...register('cellPhone', { onChange: soloNumeros(10) })} />
        <FilaCompleta>
          <Campo label="¿Otros números de celular en los últimos 5 años?" placeholder="Indicar números anteriores o 'No aplica'" error={errors.previousPhones?.message} {...register('previousPhones')} />
        </FilaCompleta>
        <Campo label="Correo electrónico" required type="email" placeholder="correo@ejemplo.com" error={errors.email?.message} {...register('email')} />
        <CampoSelector label="¿Ha tenido otro correo en los últimos 5 años?" required options={SI_NO} placeholder="Seleccione..." error={errors.hasPreviousEmails?.message} {...register('hasPreviousEmails')} />
        {tuvoCorreosAnteriores === 'si' && (
          <Campo label="Correo anterior" required type="email" placeholder="anterior@ejemplo.com" error={errors.previousEmails?.message} {...register('previousEmails')} />
        )}
      </TarjetaSeccion>

      <TarjetaSeccion title="Domicilio" icon="DO">
        <FilaCompleta>
          <Campo label="Dirección exacta del domicilio" required placeholder="Av. Mariscal Sucre & Francisco Granizo..." error={errors.address?.message} {...register('address')} />
        </FilaCompleta>
        <CampoSelector label="Provincia" required options={OPCIONES_PROVINCIA} placeholder="Seleccione provincia..." error={errors.province?.message} {...register('province')} />
        <CampoSelector label="Ciudad" required options={opcionesCiudad} placeholder="Seleccione ciudad..." error={errors.city?.message} disabled={!provincia} {...register('city')} />
        <Campo label="Código postal" inputMode="numeric" placeholder="Ej: 170302" error={errors.postalCode?.message} {...register('postalCode', { onChange: soloNumeros() })} />
      </TarjetaSeccion>

      <TarjetaSeccion title="Pasaporte y documentos de EE.UU." icon="PA">
        <CampoSelector label="Ciudad donde tramitó el pasaporte vigente" required options={OPCIONES_CIUDADES_EC} placeholder="Seleccione ciudad..." error={errors.passportCity?.message} {...register('passportCity')} />
        <Controller
          name="passportLostOrStolen"
          control={control}
          render={({ field }) => (
            <GrupoRadios label="¿Alguna vez ha perdido o le han robado el pasaporte?" required options={SI_NO} name="passportLostOrStolen" value={field.value} onChange={field.onChange} error={errors.passportLostOrStolen?.message} />
          )}
        />
        <FilaCompleta>
          <Controller
            name="usDriversLicense"
            control={control}
            render={({ field }) => (
              <GrupoRadios label="¿Le han emitido licencia de conducir en EE.UU?" required options={SI_NO} name="usDriversLicense" value={field.value} onChange={field.onChange} error={errors.usDriversLicense?.message} />
            )}
          />
        </FilaCompleta>
        <CampoSelector label="¿Tiene identificación fiscal de EE.UU.?" required options={SI_NO} placeholder="Seleccione..." error={errors.hasUsTaxId?.message} {...register('hasUsTaxId')} />
        {tieneIdentificacionFiscal === 'si' && (
          <Campo label="Número de identificación fiscal de EE.UU. (si tiene)" required inputMode="numeric" placeholder="Solo números" error={errors.usTaxId?.message} {...register('usTaxId', { onChange: soloNumeros() })} />
        )}
      </TarjetaSeccion>
    </div>
  )
}
