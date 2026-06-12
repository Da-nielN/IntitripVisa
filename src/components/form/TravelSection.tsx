import React from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Globe, Plane, Heart } from 'lucide-react'
import { VisaFormSchema } from '../../lib/schema'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { RadioGroup } from '../ui/RadioGroup'
import { Select } from '../ui/Select'

interface Props { form: UseFormReturn<VisaFormSchema> }
const siNoOpts = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export const TravelSection: React.FC<Props> = ({ form }) => {
  const { register, control, watch, formState: { errors } } = form
  const hasVisa = watch('hasActiveVisa')
  const denied = watch('visaDenied')
  const deported = watch('deportedFromCountry')
  const covidVaccine = watch('covidVaccine')

  return (
    <div className="space-y-6">
      <div className="section-card">
        <h2 className="section-title"><Globe className="w-5 h-5 text-brand-green" /> Viajes y Visas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Textarea label="Viajes realizados en los últimos 5 años (país, ciudad, fecha estimada)" {...register('travelHistory')}
              error={errors.travelHistory?.message} placeholder="EE.UU – Wisconsin Dells – Mayo 2023; Colombia – Cartagena – Oct 2024" />
          </div>
          <div className="md:col-span-2">
            <Controller name="hasActiveVisa" control={control} render={({ field }) => (
              <RadioGroup label="¿Tiene visas vigentes?" required name="hasActiveVisa"
                options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.hasActiveVisa?.message} />
            )} />
          </div>
          {hasVisa === 'si' && <>
            <Input label="País emisor de la visa vigente" {...register('visaCountry')} error={errors.visaCountry?.message} />
            <Input label="Fecha de emisión" type="date" {...register('visaIssueDate')} error={errors.visaIssueDate?.message} />
          </>}
          <div className="md:col-span-2">
            <Controller name="visaDenied" control={control} render={({ field }) => (
              <RadioGroup label="¿Le han negado alguna visa?" required name="visaDenied"
                options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.visaDenied?.message} />
            )} />
          </div>
          {denied === 'si' && (
            <div className="md:col-span-2 animate-fade-in">
              <Input label="Detalles de la visa negada (cuándo, qué país)" {...register('visaDeniedDetails')} error={errors.visaDeniedDetails?.message} placeholder="Visa americana a los 15 años" />
            </div>
          )}
          <div className="md:col-span-2">
            <Controller name="deportedFromCountry" control={control} render={({ field }) => (
              <RadioGroup label="¿Le han deportado de algún país?" required name="deportedFromCountry"
                options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.deportedFromCountry?.message} />
            )} />
          </div>
          {deported === 'si' && (
            <div className="md:col-span-2 animate-fade-in">
              <Textarea label="Fecha y motivo de la deportación" {...register('deportedDetails')} error={errors.deportedDetails?.message} />
            </div>
          )}
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Plane className="w-5 h-5 text-brand-green" /> Sobre el Viaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="¿Cuántas personas de su núcleo familiar se presentan a la entrevista?" required
            type="number" min="1" {...register('travelersCount')} error={errors.travelersCount?.message} placeholder="1" />
          <Input label="Parentesco de los acompañantes" {...register('travelRelationship')} error={errors.travelRelationship?.message} placeholder="Cónyuge, hijo, etc. (N/A si viaja solo)" />
          <Input label="Motivo de visita a EE.UU." required {...register('tripPurpose')} error={errors.tripPurpose?.message} placeholder="Turismo" />
          <div>
            <Controller name="tripPayer" control={control} render={({ field }) => (
              <Select label="¿Quién paga el viaje?" required
                options={[{ value: 'yo', label: 'Yo mismo' }, { value: 'empresa', label: 'Empresa' }, { value: 'familiar', label: 'Familiar' }, { value: 'otro', label: 'Otro' }]}
                error={errors.tripPayer?.message} value={field.value} onChange={field.onChange} />
            )} />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title"><Heart className="w-5 h-5 text-brand-green" /> Salud</h2>
        <div className="grid grid-cols-1 gap-5">
          <Controller name="contagiousDisease" control={control} render={({ field }) => (
            <RadioGroup label="¿Tiene o ha tenido alguna enfermedad contagiosa?" required name="contagiousDisease"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.contagiousDisease?.message} />
          )} />
          <Controller name="medicalTreatment" control={control} render={({ field }) => (
            <RadioGroup label="¿Está bajo tratamiento médico que requiere medicamentos?" required name="medicalTreatment"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.medicalTreatment?.message} />
          )} />
          <Controller name="covidVaccine" control={control} render={({ field }) => (
            <RadioGroup label="¿Cuenta con vacuna(s) contra el COVID-19?" required name="covidVaccine"
              options={siNoOpts} value={field.value} onChange={field.onChange} error={errors.covidVaccine?.message} />
          )} />
          {covidVaccine === 'si' && (
            <div className="animate-fade-in">
              <Input label="Número de dosis" {...register('covidDoses')} error={errors.covidDoses?.message} placeholder="3 dosis" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
