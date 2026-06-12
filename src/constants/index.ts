import type { FormStep } from '@/types'

export const FORM_STEPS: FormStep[] = [
  { id: 1, title: 'Datos Personales',   description: 'Información básica e identificación', icon: '👤' },
  { id: 2, title: 'Redes Sociales',     description: 'Perfiles en redes y documentos',      icon: '🌐' },
  { id: 3, title: 'Trabajo',            description: 'Empleo actual y anterior',             icon: '💼' },
  { id: 4, title: 'Estudios',           description: 'Formación académica',                  icon: '🎓' },
  { id: 5, title: 'Familia',            description: 'Datos de familiares',                  icon: '👨‍👩‍👧' },
  { id: 6, title: 'Viajes y Visa',      description: 'Historial de viajes y visas',          icon: '✈️' },
  { id: 7, title: 'Sobre el Viaje',     description: 'Detalles del viaje planificado',       icon: '🗺️' },
  { id: 8, title: 'Salud',              description: 'Información médica',                   icon: '🏥' },
  { id: 9, title: 'Renovación',         description: 'Solo si tiene visa anterior',          icon: '🔄' },
]

export const PROVINCES_EC = [
  'Azuay','Bolívar','Cañar','Carchi','Chimborazo','Cotopaxi','El Oro',
  'Esmeraldas','Galápagos','Guayas','Imbabura','Loja','Los Ríos','Manabí',
  'Morona Santiago','Napo','Orellana','Pastaza','Pichincha','Santa Elena',
  'Santo Domingo','Sucumbíos','Tungurahua','Zamora Chinchipe',
]
