import { useFormContext, Controller } from 'react-hook-form'
import type { VisaFormData } from '@/lib/schema'
import { Campo } from '@/components/interfaz/Campo'
import { CampoAreaTexto } from '@/components/interfaz/CampoAreaTexto'
import { GrupoRadios, SI_NO } from '@/components/interfaz/GrupoRadios'
import { TarjetaSeccion, FilaCompleta } from '@/components/interfaz/TarjetaSeccion'

export function Trabajo() {
  const { register, control, watch, formState: { errors } } = useFormContext<VisaFormData>()
  const tieneTrabajoAnterior = watch('hasPreviousJob')

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <TarjetaSeccion title="Empleo Actual" icon="EA">
        <Campo label="Cargo actual" required placeholder="Ej: KAM - Key Account Manager" error={errors.currentPosition?.message} {...register('currentPosition')} />
        <Campo label="Nombre del empleador / empresa" required placeholder="Ej: Beiersdorf Ecuador" error={errors.currentEmployer?.message} {...register('currentEmployer')} />
        <FilaCompleta>
          <CampoAreaTexto label="Descripción breve de funciones" required placeholder="Describa sus principales responsabilidades..." error={errors.currentJobDescription?.message} {...register('currentJobDescription')} />
        </FilaCompleta>
        <Campo label="Sueldo mensual (USD)" required placeholder="Ej: $1.200" error={errors.currentSalary?.message} {...register('currentSalary')} />
        <Campo label="Fecha de inicio de labores" required type="date" error={errors.currentJobStartDate?.message} {...register('currentJobStartDate')} />
        <FilaCompleta>
          <Campo label="Dirección exacta del trabajo" required placeholder="Av. Manuel Najas & Juan de Selis..." error={errors.currentJobAddress?.message} {...register('currentJobAddress')} />
        </FilaCompleta>
        <Campo label="Código postal del trabajo" placeholder="Ej: 170302" error={errors.currentJobPostalCode?.message} {...register('currentJobPostalCode')} />
        <Campo label="Teléfono del trabajo" type="tel" placeholder="Ej: +1800 064 832" error={errors.currentJobPhone?.message} {...register('currentJobPhone')} />
      </TarjetaSeccion>

      <TarjetaSeccion title="Empleo Anterior" icon="EP">
        <FilaCompleta>
          <Controller
            name="hasPreviousJob"
            control={control}
            render={({ field }) => (
              <GrupoRadios label="¿Tuvo trabajos anteriores?" required options={SI_NO} name="hasPreviousJob" value={field.value} onChange={field.onChange} error={errors.hasPreviousJob?.message} />
            )}
          />
        </FilaCompleta>

        {tieneTrabajoAnterior === 'si' && (
          <>
            <Campo label="Nombre del empleador anterior" placeholder="Ej: Banco Diners Club del Ecuador" error={errors.previousEmployer?.message} {...register('previousEmployer')} />
            <Campo label="Cargo desempeñado" placeholder="Ej: Especialista de Sistemática" error={errors.previousPosition?.message} {...register('previousPosition')} />
            <FilaCompleta>
              <Campo label="Dirección exacta del empleo anterior" placeholder="Av. Amazonas N38-70 & Villalengua..." error={errors.previousJobAddress?.message} {...register('previousJobAddress')} />
            </FilaCompleta>
            <Campo label="Código postal" placeholder="Ej: 170507" error={errors.previousJobPostalCode?.message} {...register('previousJobPostalCode')} />
            <Campo label="Teléfono del empleo anterior" type="tel" placeholder="Ej: 022984400" error={errors.previousJobPhone?.message} {...register('previousJobPhone')} />
            <Campo label="Nombre del supervisor" placeholder="Ej: Francisca de la Rosa" error={errors.previousSupervisorName?.message} {...register('previousSupervisorName')} />
            <Campo label="Fecha de inicio" type="date" error={errors.previousJobStartDate?.message} {...register('previousJobStartDate')} />
            <Campo label="Fecha de finalización" type="date" error={errors.previousJobEndDate?.message} {...register('previousJobEndDate')} />
            <FilaCompleta>
              <CampoAreaTexto label="Descripción del cargo desempeñado" placeholder="Describa sus funciones en el empleo anterior..." error={errors.previousJobDescription?.message} {...register('previousJobDescription')} />
            </FilaCompleta>
          </>
        )}
      </TarjetaSeccion>
    </div>
  )
}


