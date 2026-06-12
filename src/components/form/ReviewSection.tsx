import React from 'react'
import { VisaFormSchema } from '../../lib/schema'
import { ClipboardCheck } from 'lucide-react'

interface Props { data: VisaFormSchema }

const Row = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-slate-50 last:border-0 dark:border-slate-800">
      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide sm:w-52 shrink-0 dark:text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800 mt-0.5 sm:mt-0 dark:text-slate-100">{value}</dd>
    </div>
  ) : null
)

export const ReviewSection: React.FC<Props> = ({ data }) => (
  <div className="section-card">
    <h2 className="section-title"><ClipboardCheck className="w-5 h-5 text-brand-green" /> Revisión Final</h2>
    <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">Por favor, verifique que todos los datos sean correctos antes de enviar.</p>
    <dl className="divide-y divide-slate-50 dark:divide-slate-800">
      <Row label="Cédula" value={data.cedula} />
      <Row label="Nombre completo" value={data.fullName} />
      <Row label="Estado civil" value={data.maritalStatus} />
      <Row label="Nacionalidad" value={data.nationality} />
      <Row label="Ciudad" value={data.city} />
      <Row label="Celular" value={data.cellPhone} />
      <Row label="Email" value={data.email} />
      <Row label="Dirección" value={data.address} />
      <Row label="Facebook" value={data.facebook} />
      <Row label="Instagram" value={data.instagram} />
      <Row label="Cargo actual" value={data.currentPosition} />
      <Row label="Empleador" value={data.currentEmployer} />
      <Row label="Sueldo" value={data.currentSalary} />
      <Row label="Universidad" value={data.universityInstitution} />
      <Row label="Carrera" value={data.careerName} />
      <Row label="Idiomas" value={data.languages} />
      <Row label="Padre" value={data.fatherName} />
      <Row label="Madre" value={data.motherName} />
      <Row label="Historial de viajes" value={data.travelHistory} />
      <Row label="Motivo del viaje" value={data.tripPurpose} />
      <Row label="Paga el viaje" value={data.tripPayer} />
    </dl>
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <strong>Importante:</strong> Al enviar, acepta que la información proporcionada es veraz. IntiTrip la utilizará únicamente para gestionar su trámite de visa.
    </div>
  </div>
)
