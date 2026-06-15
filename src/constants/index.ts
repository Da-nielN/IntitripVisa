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

export const COUNTRIES = [
  'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín',
  'Bielorrusia', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután',
  'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia',
  'Comoras', 'Congo', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica',
  'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia',
  'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana',
  'Granada', 'Grecia', 'Guatemala', 'Guinea', 'Guinea Ecuatorial', 'Guinea-Bisáu', 'Guyana', 'Haití', 'Honduras', 'Hungría',
  'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia',
  'Jamaica', 'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto',
  'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia',
  'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia',
  'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger',
  'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Palestina', 'Panamá', 'Papúa Nueva Guinea',
  'Paraguay', 'Perú', 'Polonia', 'Portugal', 'Reino Unido', 'República Centroafricana', 'República Checa', 'República Democrática del Congo', 'República Dominicana', 'Ruanda',
  'Rumanía', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia',
  'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez',
  'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Vaticano', 'Venezuela',
  'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue',
]

export const NATIONALITIES = [
  'Afgana', 'Albanesa', 'Alemana', 'Andorrana', 'Angoleña', 'Antiguana', 'Saudí', 'Argelina', 'Argentina', 'Armenia',
  'Australiana', 'Austriaca', 'Azerbaiyana', 'Bahameña', 'Bangladesí', 'Barbadense', 'Bareiní', 'Belga', 'Beliceña', 'Beninesa',
  'Bielorrusa', 'Boliviana', 'Bosnia', 'Botsuana', 'Brasileña', 'Bruneana', 'Búlgara', 'Burkinesa', 'Burundesa', 'Butanesa',
  'Caboverdiana', 'Camboyana', 'Camerunesa', 'Canadiense', 'Catarí', 'Chadiana', 'Chilena', 'China', 'Chipriota', 'Colombiana',
  'Comorense', 'Congoleña', 'Norcoreana', 'Surcoreana', 'Marfileña', 'Costarricense', 'Croata', 'Cubana', 'Danesa', 'Dominiquesa',
  'Ecuatoriana', 'Egipcia', 'Salvadoreña', 'Emiratí', 'Eritrea', 'Eslovaca', 'Eslovena', 'Española', 'Estadounidense', 'Estonia',
  'Suazi', 'Etíope', 'Filipina', 'Finlandesa', 'Fiyiana', 'Francesa', 'Gabonesa', 'Gambiana', 'Georgiana', 'Ghanesa',
  'Granadina', 'Griega', 'Guatemalteca', 'Guineana', 'Ecuatoguineana', 'Guineana-bisauense', 'Guyanesa', 'Haitiana', 'Hondureña', 'Húngara',
  'India', 'Indonesia', 'Iraquí', 'Iraní', 'Irlandesa', 'Islandesa', 'Marshalesa', 'Salomonense', 'Israelí', 'Italiana',
  'Jamaicana', 'Japonesa', 'Jordana', 'Kazaja', 'Keniana', 'Kirguisa', 'Kiribatiana', 'Kuwaití', 'Laosiana', 'Lesotense',
  'Letona', 'Libanesa', 'Liberiana', 'Libia', 'Liechtensteiniana', 'Lituana', 'Luxemburguesa', 'Macedonia', 'Malgache', 'Malasia',
  'Malauí', 'Maldiva', 'Maliense', 'Maltesa', 'Marroquí', 'Mauriciana', 'Mauritana', 'Mexicana', 'Micronesia', 'Moldava',
  'Monegasca', 'Mongola', 'Montenegrina', 'Mozambiqueña', 'Birmana', 'Namibia', 'Nauruana', 'Nepalí', 'Nicaragüense', 'Nigerina',
  'Nigeriana', 'Noruega', 'Neozelandesa', 'Omaní', 'Neerlandesa', 'Pakistaní', 'Palauana', 'Palestina', 'Panameña', 'Papú',
  'Paraguaya', 'Peruana', 'Polaca', 'Portuguesa', 'Británica', 'Centroafricana', 'Checa', 'Congoleña', 'Dominicana', 'Ruandesa',
  'Rumana', 'Rusa', 'Samoana', 'Sancristobaleña', 'Sanmarinense', 'Sanvicentina', 'Santalucense', 'Santotomense', 'Senegalesa', 'Serbia',
  'Seychellense', 'Sierraleonesa', 'Singapurense', 'Siria', 'Somalí', 'Esrilanquesa', 'Sudafricana', 'Sudanesa', 'Sursudanesa', 'Sueca',
  'Suiza', 'Surinamesa', 'Tailandesa', 'Tanzana', 'Tayika', 'Timorense', 'Togolesa', 'Tongana', 'Trinitense', 'Tunecina',
  'Turcomana', 'Turca', 'Tuvaluana', 'Ucraniana', 'Ugandesa', 'Uruguaya', 'Uzbeka', 'Vanuatuense', 'Vaticana', 'Venezolana',
  'Vietnamita', 'Yemení', 'Yibutiana', 'Zambiana', 'Zimbabuense',
]


