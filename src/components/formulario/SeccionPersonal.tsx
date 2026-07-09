import React, { useEffect } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { User } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { ECUADOR_CITIES_BY_PROVINCE } from '../../constants'
import {
  opcionesCiudadesEcuador,
  opcionesDireccionConyuge,
  opcionesEstadoCivil,
  opcionesEstadosUnidos,
  opcionesNacionalidades,
  opcionesPaises,
  opcionesProvincias,
  opcionesSexo,
  opcionesSiNo,
} from '../../constants/opcionesFormulario'
import { recortarEspacios, soloLetras, soloNumeros } from '../../utils/validacionesFormulario'
import { Entrada } from '../interfaz/Entrada'
import { Selector } from '../interfaz/Selector'
import { GrupoRadios } from '../interfaz/GrupoRadios'
import { AreaTexto } from '../interfaz/AreaTexto'

interface Props { form: UseFormReturn<VisaFormSchema> }


export const SeccionPersonal: React.FC<Props> = ({ form }) => {
  const { register, control, watch, setValue, formState: { errors } } = form
  const estadoCivil = watch('estadoCivil')
  const provinciaSeleccionada = watch('provincia')
  const ciudadSeleccionada = watch('ciudad')
  const tieneOtraNacionalidad = watch('tieneOtraNacionalidad')
  const esResidentePermanenteExtranjero = watch('esResidentePermanenteExtranjero')
  const tuvoTelefonosAnteriores = watch('tuvoTelefonosAnteriores')
  const tuvoCorreosAnteriores = watch('tuvoCorreosAnteriores')
  const pasaportePerdidoORobado = watch('pasaportePerdidoORobado')
  const direccionConyuge = watch('direccionConyuge')
  const licenciaConducirEEUU = watch('licenciaConducirEEUU')
  const tieneIdentificacionFiscal = watch('tieneIdentificacionFiscalEEUU')
  const ciudadesPorProvincia = provinciaSeleccionada ? ECUADOR_CITIES_BY_PROVINCE[provinciaSeleccionada] ?? [] : []
  const opcionesCiudadesPorProvincia = ciudadesPorProvincia.map((ciudad) => ({ value: ciudad, label: ciudad }))

  useEffect(() => {
    if (ciudadSeleccionada && provinciaSeleccionada && !ciudadesPorProvincia.includes(ciudadSeleccionada)) {
      setValue('ciudad', '')
    }
  }, [ciudadSeleccionada, ciudadesPorProvincia, provinciaSeleccionada, setValue])

  useEffect(() => {
    if (estadoCivil !== 'casado') {
      setValue('nombresConyuge', '')
      setValue('apellidosConyuge', '')
      setValue('nombreConyuge', '')
      setValue('fechaNacimientoConyuge', '')
      setValue('nacionalidadConyuge', '')
      setValue('paisNacimientoConyuge', '')
      setValue('ciudadNacimientoConyuge', '')
      setValue('direccionConyuge', '')
      setValue('direccionConyugeOtro', '')
    }
    if (direccionConyuge !== 'Otro (Especificar direccion)') setValue('direccionConyugeOtro', '')
    if (tieneOtraNacionalidad === 'no') setValue('otraNacionalidad', '')
    if (esResidentePermanenteExtranjero === 'no') setValue('paisResidenciaPermanente', '')
    if (tuvoTelefonosAnteriores === 'no') setValue('telefonosAnteriores', '')
    if (tuvoCorreosAnteriores === 'no') setValue('correosAnteriores', '')
    if (pasaportePerdidoORobado === 'no') {
      setValue('numeroPasaportePerdidoORobado', '')
      setValue('paisAutoridadPasaportePerdidoORobado', '')
      setValue('explicacionPasaportePerdidoORobado', '')
    }
    if (licenciaConducirEEUU === 'no') {
      setValue('numeroLicenciaConducirEEUU', '')
      setValue('estadoLicenciaConducirEEUU', '')
    }
    if (tieneIdentificacionFiscal === 'no') setValue('identificacionFiscalEEUU', '')
  }, [direccionConyuge, esResidentePermanenteExtranjero, estadoCivil, licenciaConducirEEUU, pasaportePerdidoORobado, setValue, tieneIdentificacionFiscal, tieneOtraNacionalidad, tuvoCorreosAnteriores, tuvoTelefonosAnteriores])

  return (
    <div className="section-card">
      <h2 className="section-title">
        <User className="w-5 h-5 text-brand-green" /> Datos Personales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Entrada label="Cédula de identidad" required {...register('cedula', { onChange: soloNumeros(10) })} error={errors.cedula?.message} placeholder="1722520284" inputMode="numeric" maxLength={10} />
        </div>
        <Entrada label="Primer nombre" required {...register('primerNombre', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.primerNombre?.message} placeholder="Daniel" />
        <Entrada label="Segundo nombre" required {...register('segundoNombre', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.segundoNombre?.message} placeholder="Alejandro" />
        <Entrada label="Primer apellido" required {...register('primerApellido', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.primerApellido?.message} placeholder="Navarrete" />
        <Entrada label="Segundo apellido" required {...register('segundoApellido', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.segundoApellido?.message} placeholder="Torres" />
        <Entrada label="Fecha de nacimiento" required type="date" {...register('fechaNacimiento')} error={errors.fechaNacimiento?.message} />
        <Controller name="sexo" control={control} render={({ field }) => (
          <Selector label="Sexo del cliente" required options={opcionesSexo} error={errors.sexo?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />

        <div className="md:col-span-2">
          <Controller name="estadoCivil" control={control} render={({ field }) => (
            <Selector label="Estado civil" required options={opcionesEstadoCivil} error={errors.estadoCivil?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>

        {estadoCivil === 'casado' && <>
          <Entrada label="Nombres del cónyuge" {...register('nombresConyuge', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.nombresConyuge?.message} />
          <Entrada label="Apellidos del cónyuge" {...register('apellidosConyuge', { onChange: soloLetras, onBlur: recortarEspacios })} error={errors.apellidosConyuge?.message} />
          <Entrada label="Fecha de nacimiento del cónyuge" type="date" {...register('fechaNacimientoConyuge')} error={errors.fechaNacimientoConyuge?.message} />
          <Controller name="nacionalidadConyuge" control={control} render={({ field }) => (
            <Selector label="Nacionalidad del cónyuge" options={opcionesPaises} error={errors.nacionalidadConyuge?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
          <Controller name="paisNacimientoConyuge" control={control} render={({ field }) => (
            <Selector label="País de nacimiento del cónyuge" options={opcionesPaises} error={errors.paisNacimientoConyuge?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
          <Entrada label="Ciudad de nacimiento del cónyuge" {...register('ciudadNacimientoConyuge')} error={errors.ciudadNacimientoConyuge?.message} />
          <div className="md:col-span-2">
            <Controller name="direccionConyuge" control={control} render={({ field }) => (
              <Selector label="Dirección del cónyuge" options={opcionesDireccionConyuge} error={errors.direccionConyuge?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
          {direccionConyuge === 'Otro (Especificar direccion)' && (
            <div className="md:col-span-2">
              <AreaTexto label="Especificar dirección del cónyuge" {...register('direccionConyugeOtro')} error={errors.direccionConyugeOtro?.message} />
            </div>
          )}
        </>}

        <div className="md:col-span-2">
          <Controller name="nacionalidad" control={control} render={({ field }) => (
            <Selector label="Nacionalidad" required options={opcionesNacionalidades} error={errors.nacionalidad?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>
        <Controller name="tieneOtraNacionalidad" control={control} render={({ field }) => (
          <GrupoRadios label="¿Tiene otra nacionalidad?" required name="tieneOtraNacionalidad"
            options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tieneOtraNacionalidad?.message} />
        )} />
        {tieneOtraNacionalidad === 'si' && (
          <div className="md:col-span-2">
            <Controller name="otraNacionalidad" control={control} render={({ field }) => (
              <Selector label="Otra nacionalidad" required options={opcionesNacionalidades} error={errors.otraNacionalidad?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
        )}

        <div className="md:col-span-2">
          <Controller name="esResidentePermanenteExtranjero" control={control} render={({ field }) => (
            <GrupoRadios label="¿Es residente permanente en un país distinto al de nacimiento?" required
              name="esResidentePermanenteExtranjero" options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.esResidentePermanenteExtranjero?.message} />
          )} />
        </div>
        {esResidentePermanenteExtranjero === 'si' && (
          <div className="md:col-span-2">
            <Controller name="paisResidenciaPermanente" control={control} render={({ field }) => (
              <Selector label="País de residencia permanente" required options={opcionesPaises} error={errors.paisResidenciaPermanente?.message}
                value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
        )}

        <Entrada label="Teléfono domicilio" {...register('telefonoDomicilio', { onChange: soloNumeros(7) })} error={errors.telefonoDomicilio?.message} placeholder="2595690" type="tel" inputMode="numeric" maxLength={7} />
        <Entrada label="Celular" required {...register('celular', { onChange: soloNumeros(10) })} error={errors.celular?.message} placeholder="0999999999" type="tel" inputMode="numeric" maxLength={10} />
        <div className="md:col-span-2">
          <Controller name="tuvoTelefonosAnteriores" control={control} render={({ field }) => (
            <GrupoRadios label="¿Ha tenido otros celulares en los últimos 5 años?" required name="tuvoTelefonosAnteriores"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tuvoTelefonosAnteriores?.message} />
          )} />
        </div>
        {tuvoTelefonosAnteriores === 'si' && (
          <div className="md:col-span-2">
            <Entrada label="Otro celular en los últimos 5 años" required {...register('telefonosAnteriores', { onChange: soloNumeros(10) })}
              error={errors.telefonosAnteriores?.message} placeholder="0999999999" type="tel" inputMode="numeric" maxLength={10} />
          </div>
        )}
        <div className="md:col-span-2">
          <Entrada label="Dirección exacta de domicilio" required {...register('direccion')} error={errors.direccion?.message} placeholder="Av. Ejemplo & Calle, Urb. Nombre, Lote 1" />
        </div>
        <Controller name="provincia" control={control} render={({ field }) => (
          <Selector label="Provincia" required options={opcionesProvincias} error={errors.provincia?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
        )} />
        <Controller name="ciudad" control={control} render={({ field }) => (
          <Selector label="Ciudad" required options={opcionesCiudadesPorProvincia} error={errors.ciudad?.message}
            value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} disabled={!provinciaSeleccionada} />
        )} />
        <Entrada label="Código postal domicilio" required {...register('codigoPostal', { onChange: soloNumeros() })} error={errors.codigoPostal?.message} placeholder="170302" inputMode="numeric" />
        <Entrada label="Correo electrónico" required type="email" {...register('correo')} error={errors.correo?.message} placeholder="ejemplo@gmail.com" />
        <Controller name="tuvoCorreosAnteriores" control={control} render={({ field }) => (
          <GrupoRadios label="¿Ha tenido otro correo en los últimos 5 años?" required name="tuvoCorreosAnteriores"
            options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tuvoCorreosAnteriores?.message} />
        )} />
        {tuvoCorreosAnteriores === 'si' && (
          <Entrada label="Correo anterior" required type="email" {...register('correosAnteriores')} error={errors.correosAnteriores?.message} placeholder="anterior@gmail.com" />
        )}
        <div className="md:col-span-2">
          <Controller name="ciudadPasaporte" control={control} render={({ field }) => (
            <Selector label="Ciudad donde tramitó el pasaporte vigente" required options={opcionesCiudadesEcuador} error={errors.ciudadPasaporte?.message}
              value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
          )} />
        </div>
        <div className="md:col-span-2">
          <Controller name="pasaportePerdidoORobado" control={control} render={({ field }) => (
            <GrupoRadios label="¿Ha perdido o le han robado un pasaporte?" required name="pasaportePerdidoORobado"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.pasaportePerdidoORobado?.message} />
          )} />
        </div>
        {pasaportePerdidoORobado === 'si' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <Entrada label="Número de pasaporte/documento de viaje" required {...register('numeroPasaportePerdidoORobado', { onChange: soloNumeros() })}
              error={errors.numeroPasaportePerdidoORobado?.message} placeholder="Solo números" inputMode="numeric" />
            <Controller name="paisAutoridadPasaportePerdidoORobado" control={control} render={({ field }) => (
              <Selector label="País/Autoridad que emitió el pasaporte/documento de viaje" required options={opcionesPaises}
                error={errors.paisAutoridadPasaportePerdidoORobado?.message} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
            <div className="md:col-span-2">
              <AreaTexto label="Explicación" required {...register('explicacionPasaportePerdidoORobado')} error={errors.explicacionPasaportePerdidoORobado?.message} />
            </div>
          </div>
        )}
        <div className="md:col-span-2">
          <Controller name="licenciaConducirEEUU" control={control} render={({ field }) => (
            <GrupoRadios label="¿Tiene o ha tenido alguna vez una licencia de conducir estadounidense?" required name="licenciaConducirEEUU"
              options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.licenciaConducirEEUU?.message} />
          )} />
        </div>
        {licenciaConducirEEUU === 'si' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <Entrada label="Número de licencia de conducir" required {...register('numeroLicenciaConducirEEUU')} error={errors.numeroLicenciaConducirEEUU?.message} />
            <Controller name="estadoLicenciaConducirEEUU" control={control} render={({ field }) => (
              <Selector label="Estado en el que fue emitida esta licencia" required options={opcionesEstadosUnidos}
                error={errors.estadoLicenciaConducirEEUU?.message} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )} />
          </div>
        )}
        <Controller name="tieneIdentificacionFiscalEEUU" control={control} render={({ field }) => (
          <GrupoRadios label="¿Tiene identificación fiscal de EE.UU.?" required name="tieneIdentificacionFiscalEEUU"
            options={opcionesSiNo} value={field.value} onChange={field.onChange} error={errors.tieneIdentificacionFiscalEEUU?.message} />
        )} />
        {tieneIdentificacionFiscal === 'si' && (
          <Entrada label="Número de identificación fiscal de EE.UU. (si tiene)" required {...register('identificacionFiscalEEUU', { onChange: soloNumeros() })} error={errors.identificacionFiscalEEUU?.message} placeholder="Solo números" inputMode="numeric" />
        )}
      </div>
    </div>
  )
}
