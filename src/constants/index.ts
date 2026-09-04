import type { FormStep } from '@/types'

export const FORM_STEPS: FormStep[] = [
  { id: 1, title: 'Datos Personales',   description: 'Información básica e identificación', icon: '1' },
  { id: 2, title: 'Redes Sociales',     description: 'Perfiles en redes y documentos',      icon: '2' },
  { id: 3, title: 'Trabajo',            description: 'Empleo actual y anterior',             icon: '3' },
  { id: 4, title: 'Estudios',           description: 'Formación académica',                  icon: '4' },
  { id: 5, title: 'Familia',            description: 'Datos de familiares',                  icon: '5' },
  { id: 6, title: 'Viajes y Visa',      description: 'Historial de viajes y visas',          icon: '6' },
  { id: 7, title: 'Sobre el Viaje',     description: 'Detalles del viaje planificado',       icon: '7' },
  { id: 8, title: 'Salud',              description: 'Información médica',                   icon: '8' },
  { id: 9, title: 'Renovación',         description: 'Solo si tiene visa anterior',          icon: '9' },
]

export const PROVINCES_EC = [
  'Azuay','Bolívar','Cañar','Carchi','Chimborazo','Cotopaxi','El Oro',
  'Esmeraldas','Galápagos','Guayas','Imbabura','Loja','Los Ríos','Manabí',
  'Morona Santiago','Napo','Orellana','Pastaza','Pichincha','Santa Elena',
  'Santo Domingo','Sucumbíos','Tungurahua','Zamora Chinchipe',
]

export const ECUADOR_CITIES_BY_PROVINCE: Record<string, string[]> = {
  Azuay: ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Sigsig'],
  Bolívar: ['Guaranda', 'Chillanes', 'Chimbo', 'Echeandía', 'San Miguel'],
  Cañar: ['Azogues', 'Biblián', 'Cañar', 'La Troncal'],
  Carchi: ['Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca'],
  Chimborazo: ['Riobamba', 'Alausí', 'Chambo', 'Chunchi', 'Colta', 'Guano', 'Pallatanga'],
  Cotopaxi: ['Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'],
  'El Oro': ['Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'El Guabo', 'Huaquillas', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
  Esmeraldas: ['Esmeraldas', 'Atacames', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'Rioverde', 'San Lorenzo'],
  Galápagos: ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'],
  Guayas: ['Guayaquil', 'Durán', 'Daule', 'Milagro', 'Samborondón', 'Playas', 'Naranjal', 'Naranjito', 'Salitre', 'Yaguachi'],
  Imbabura: ['Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro', 'Urcuquí'],
  Loja: ['Loja', 'Calvas', 'Catamayo', 'Celica', 'Macará', 'Paltas', 'Saraguro', 'Zapotillo'],
  'Los Ríos': ['Babahoyo', 'Baba', 'Buena Fe', 'Mocache', 'Montalvo', 'Puebloviejo', 'Quevedo', 'Urdaneta', 'Valencia', 'Ventanas', 'Vinces'],
  Manabí: ['Portoviejo', 'Manta', 'Chone', 'El Carmen', 'Jipijapa', 'Montecristi', 'Pedernales', 'Rocafuerte', 'Santa Ana', 'Sucre'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Limón Indanza', 'Logroño', 'Morona', 'Palora', 'Santiago', 'Sucúa'],
  Napo: ['Tena', 'Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos'],
  Orellana: ['Francisco de Orellana', 'Aguarico', 'La Joya de los Sachas', 'Loreto'],
  Pastaza: ['Puyo', 'Arajuno', 'Mera', 'Santa Clara'],
  Pichincha: ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'Puerto Quito', 'Rumiñahui', 'San Miguel de los Bancos'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo': ['Santo Domingo', 'La Concordia'],
  Sucumbíos: ['Nueva Loja', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Lago Agrio', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
  Tungurahua: ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Pelileo', 'Píllaro', 'Quero', 'Tisaleo'],
  'Zamora Chinchipe': ['Zamora', 'Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza'],
}

export const ECUADOR_CITIES = Array.from(new Set(Object.values(ECUADOR_CITIES_BY_PROVINCE).flat())).sort((a, b) => a.localeCompare(b, 'es'))



