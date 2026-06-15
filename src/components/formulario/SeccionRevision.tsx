import React from 'react'
import { VisaFormSchema } from '../../lib/schema'
import { ClipboardCheck } from 'lucide-react'

interface Props { data: VisaFormSchema }

const FilaResumen = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-slate-50 last:border-0 dark:border-slate-800">
      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide sm:w-52 shrink-0 dark:text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800 mt-0.5 sm:mt-0 dark:text-slate-100">{value}</dd>
    </div>
  ) : null
)

export const SeccionRevision: React.FC<Props> = ({ data }) => (
  <div className="section-card">
    <h2 className="section-title"><ClipboardCheck className="w-5 h-5 text-brand-green" /> Revisión Final</h2>
    <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">Por favor, verifique que todos los datos sean correctos antes de enviar.</p>
    <dl className="divide-y divide-slate-50 dark:divide-slate-800">
      <FilaResumen label="Cédula" value={data.cedula} />
      <FilaResumen label="Primer nombre" value={data.firstName} />
      <FilaResumen label="Segundo nombre" value={data.middleName} />
      <FilaResumen label="Primer apellido" value={data.paternalLastName} />
      <FilaResumen label="Segundo apellido" value={data.maternalLastName} />
      <FilaResumen label="Fecha de nacimiento" value={data.birthdate} />
      <FilaResumen label="Sexo" value={data.sex} />
      <FilaResumen label="Estado civil" value={data.maritalStatus} />
      <FilaResumen label="Nacionalidad" value={data.nationality} />
      <FilaResumen label="Otra nacionalidad" value={data.otherNationality} />
      <FilaResumen label="País de residencia permanente" value={data.permanentResidentCountry} />
      <FilaResumen label="Ciudad" value={data.city} />
      <FilaResumen label="Celular" value={data.cellPhone} />
      <FilaResumen label="Email" value={data.email} />
      <FilaResumen label="Correo anterior" value={data.previousEmails} />
      <FilaResumen label="Dirección" value={data.address} />
      <FilaResumen label="Licencia de conducir EE.UU." value={data.usDriversLicense} />
      <FilaResumen label="Identificación fiscal EE.UU." value={data.usTaxId} />
      <FilaResumen label="Facebook" value={data.facebook} />
      <FilaResumen label="Instagram" value={data.instagram} />
      <FilaResumen label="Cargo actual" value={data.currentPosition} />
      <FilaResumen label="Empleador" value={data.currentEmployer} />
      <FilaResumen label="Sueldo" value={data.currentSalary} />
      <FilaResumen label="Universidad" value={data.universityInstitution} />
      <FilaResumen label="Carrera" value={data.careerName} />
      <FilaResumen label="Idiomas" value={data.languages} />
      <FilaResumen label="Padre" value={data.fatherName} />
      <FilaResumen label="Madre" value={data.motherName} />
      <FilaResumen label="Historial de viajes" value={data.travelHistory} />
      <FilaResumen label="Motivo del viaje" value={data.tripPurpose} />
      <FilaResumen label="Paga el viaje" value={data.tripPayer} />
    </dl>
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <strong>Importante:</strong> Al enviar, acepta que la información proporcionada es veraz. IntiTrip la utilizará únicamente para gestionar su trámite de visa.
    </div>
  </div>
)


