# Diagnóstico — Migración del generador web de PDF a JSON para el DS-160

Fecha: 2026-09-02. Sin cambios de código: esto es solo el relevamiento.

Fuentes leídas: `docs/mapeo_ds160.json` (v2.3), `docs/variables_nuevas.md`,
`docs/decisiones_alcance.md`, `docs/plan_asistente_formularios_v5.md` (§4, §6, §7),
los 10 `docs/catalogo_*.md`, y todo `src/` + `apps-script/Code.gs`.

---

## 1. Inventario de lo que hay hoy

### 1.1. Cómo viajan los datos

El formulario es una SPA de React + Vite. Todo el estado vive en **un único
`useForm` de react-hook-form** creado en [App.tsx](src/App.tsx:59), validado con
un esquema Zod (`visaFormSchema`, en [schema.ts](src/lib/schema.ts)). Los seis
"pasos" (`SeccionPersonal`, `SeccionViaje`, `SeccionRedesSociales`,
`SeccionTrabajo`, `SeccionFamilia`, `SeccionRevision`) no son formularios
independientes: son vistas del mismo objeto, y reciben el `form` por props. Eso
significa que **no hay transformación de datos en ninguna capa intermedia**: lo
que el `<input>` guarda es literalmente lo que se manda.

Al pulsar "Enviar formulario", `alEnviar` llama a
[`submitVisaForm`](src/services/appsScript.ts:20), que hace
`JSON.stringify(datos)` y lo mete en **un solo campo** de un
`application/x-www-form-urlencoded` llamado `payload`. Ese truco existe para
esquivar el *preflight* de CORS (la petición de permiso que el navegador manda
antes de un POST con `Content-Type: application/json`, y que Apps Script no sabe
responder). La URL del script está en `.env` como `VITE_APPS_SCRIPT_URL`. El
objeto que se manda es **el `VisaFormSchema` crudo**: 136 claves planas más tres
arrays (`acompanantesViaje`, `visitasAnterioresEEUU`,
`familiaresInmediatosDetalle`).

Del lado de Google, `doPost` en [Code.gs](apps-script/Code.gs:158) desempaqueta
el `payload` y llama a `procesarFormulario`. Ese método: (1) crea una carpeta en
Drive con nombre `<primerApellido>_<cedula>` dentro de `PARENT_FOLDER_ID`;
(2) copia un Google Doc plantilla (`TEMPLATE_DOC_ID`) dentro de esa carpeta;
(3) construye un diccionario `reemplazos` con las 136 claves de `CLAVES_CAMPOS`
más las claves derivadas de los tres arrays, aplanadas a slots numerados
(`acompananteViaje1..5*`, `visitaAnteriorEEUU1..5*`, `familiarInmediato1..5*`);
(4) recorre ese diccionario haciendo `cuerpo.replaceText('{{clave}}', valor)`;
(5) borra cualquier `{{...}}` que haya quedado sin sustituir; (6) exporta el Doc
a PDF, lo guarda en la carpeta y lo comparte como "cualquiera con el enlace".
Devuelve `{success, message, folderId, pdfUrl}`, y la web muestra el enlace.

Dos detalles del script que importan para la migración. Primero,
`normalizarValor` **transforma los valores en el camino**: convierte `'si'`→`'Si'`,
`'no'`→`'No'`, aplica `humanizarTexto` (que convierte `union_libre` →
`Union Libre`), y colapsa `null`/`undefined`/objetos/arrays a cadena vacía. Es
decir, hoy el script está pensado para producir texto legible por humanos, no
datos para máquina. Segundo, **la lógica de aplanado de repetidores ya existe y
funciona** (`agregarCamposAcompanantes`, `agregarCamposVisitas`,
`agregarCamposFamiliaresInmediatos`) y produce exactamente los nombres de slot
que el mapeo v2.3 espera. Eso es reutilizable tal cual.

### 1.2. Campos que se capturan hoy

136 claves planas en el contrato (`CLAVES_CAMPOS` en `Code.gs` ==
`camposFormulario` en [mapaCamposFormulario.ts](src/constants/mapaCamposFormulario.ts);
las dos listas son idénticas), más 3 arrays que el script aplana a 50 claves
numeradas. Total del payload actual: **186 nombres**.

**Advertencia previa:** de esas 136 claves, **13 no tienen ningún control en la
interfaz**. Están en el esquema, viajan en el payload y siempre llegan vacías (o
con su valor por defecto). Son: `cargoActual`, `sueldoActual`,
`institucionBachillerato`, `nombreCarrera`, `telefonoEducacion`,
`historialViajes`, `tieneVisaActiva`, `paisVisa`, `fechaEmisionVisa`,
`deportadoDePais`, `detallesDeportacion`, `cantidadViajeros`, `relacionViaje`.

#### Campos de texto, número y fecha (sin catálogo)

| Variable | Control | Notas |
|---|---|---|
| `cedula` | texto, solo dígitos, máx 10 | |
| `primerNombre`, `segundoNombre`, `primerApellido`, `segundoApellido` | texto, solo letras | los cuatro obligatorios |
| `fechaNacimiento` | `input type=date` | emite `AAAA-MM-DD` |
| `nombresConyuge`, `apellidosConyuge` | texto | solo si `estadoCivil = casado` |
| `fechaNacimientoConyuge` | fecha | |
| `ciudadNacimientoConyuge` | texto | |
| `direccionConyugeOtro` | textarea | |
| `telefonoDomicilio` | texto, 7 dígitos | |
| `celular` | texto, 10 dígitos | |
| `telefonosAnteriores` | texto, 10 dígitos | |
| `direccion` | texto | |
| `codigoPostal` | texto, solo dígitos | |
| `correo`, `correosAnteriores` | `input type=email` | |
| `numeroPasaportePerdidoORobado` | texto, solo dígitos | |
| `explicacionPasaportePerdidoORobado` | textarea | |
| `facebook`, `instagram`, `linkedin`, `otrasRedesSociales` | texto | |
| `numeroLicenciaConducirEEUU` | texto | |
| `identificacionFiscalEEUU` | texto, solo dígitos | |
| `empleadorActual` | texto | |
| `descripcionTrabajoActual` | texto (no textarea) | |
| `direccionTrabajoActual` | texto | |
| `codigoPostalTrabajoActual`, `telefonoTrabajoActual` | texto, solo dígitos | |
| `fechaInicioTrabajoActual` | fecha | |
| `empleadorAnterior`, `cargoAnterior`, `direccionTrabajoAnterior` | texto | |
| `codigoPostalTrabajoAnterior`, `telefonoTrabajoAnterior` | texto, solo dígitos | |
| `nombreSupervisorAnterior`, `apellidosSupervisorAnterior` | texto | etiquetados "Nombres/Apellidos del empleador anterior" |
| `descripcionTrabajoAnterior` | textarea | |
| `fechaInicioTrabajoAnterior`, `fechaFinTrabajoAnterior` | fecha | |
| `institucionUniversitaria`, `direccionEducacion` | texto | |
| `codigoPostalEducacion` | texto, solo dígitos | |
| `fechaInicioEducacion`, `fechaFinEducacion` | fecha | |
| `idiomas` | texto libre, un solo campo | "Español (nativo), Inglés (intermedio)…" |
| `nombresPadre`, `apellidosPadre`, `nombresMadre`, `apellidosMadre` | texto | |
| `fechaNacimientoPadre`, `fechaNacimientoMadre` | fecha | |
| `detallesVisaNegada`, `razonPeticionInmigracion` | textarea | |
| `fechaLlegadaPrevista`, `fechaLlegadaEEUU`, `fechaSalidaEEUU` | fecha | |
| `valorDuracionEstadiaPrevista` | `input type=number` | |
| `ciudadLlegadaEEUU`, `ciudadSalidaEEUU` | texto | |
| `lugaresPlaneadosEEUU` | textarea, un solo campo | "Nueva York, Orlando, Miami…" |
| `direccionHospedajeEEUU`, `ciudadHospedajeEEUU` | texto | |
| `fechaEmisionUltimaVisa` | fecha | |
| `numeroVisa` | texto | |
| `motivoVisaEEUUPerdidaORobada` | textarea | |
| `anioVisaEEUUPerdidaORobada` | texto, 4 dígitos | |
| `razonVisaEEUUCanceladaORevocada` | textarea | |
| `detalleEnfermedadContagiosa` | textarea | |
| **sin control**: `cargoActual`, `sueldoActual`, `institucionBachillerato`, `nombreCarrera`, `telefonoEducacion`, `historialViajes`, `paisVisa`, `fechaEmisionVisa`, `detallesDeportacion`, `cantidadViajeros`, `relacionViaje` | — | siempre `""` |

Repetidores (arrays, aplanados por Apps Script a 5 slots):

| Variable | Control | Notas |
|---|---|---|
| `acompanantesViaje[].apellidos` / `.nombres` | texto | |
| `acompanantesViaje[].relacion` | select | ver catálogos |
| `visitasAnterioresEEUU[].fechaLlegada` | fecha | |
| `visitasAnterioresEEUU[].valorDuracion` | número | |
| `visitasAnterioresEEUU[].unidadDuracion` | select | ver catálogos |
| `familiaresInmediatosDetalle[].nombres` / `.apellidos` | texto | |
| `familiaresInmediatosDetalle[].relacion` / `.estatus` | select | ver catálogos |

**Ojo:** los tres arrays no tienen tope de 5 en la interfaz — el botón "Añadir"
permite agregar indefinidamente. Apps Script recorta a 5 silenciosamente.

#### Radios

Los 25 radios de la web usan el mismo componente
[`GrupoRadios`](src/components/interfaz/GrupoRadios.tsx) con `opcionesSiNo`, así
que **todos guardan la cadena `'si'` o `'no'`** (minúscula, sin tilde en el
valor; la tilde está solo en la etiqueta visible).

`tieneOtraNacionalidad`, `esResidentePermanenteExtranjero`,
`tuvoTelefonosAnteriores`, `tuvoCorreosAnteriores`, `pasaportePerdidoORobado`,
`licenciaConducirEEUU`, `tieneIdentificacionFiscalEEUU`, `tuvoTrabajoAnterior`,
`asistioInstitucionEducativa`, `padreEnEEUU`, `madreEnEEUU`,
`familiaresInmediatosEnEEUU`, `otrosFamiliaresEnEEUU`,
`tienePlanesViajeConcretos`, `viajaConOtros`, `haVisitadoEEUU`,
`haTenidoVisaEEUU`, `mismoTipoVisa`, `mismoPaisResidenciaVisa`,
`diezHuellasTomadas`, `visaEEUUPerdidaORobada`, `visaEEUUCanceladaORevocada`,
`tienePeticionInmigracion`, `visaNegada`, `enfermedadContagiosa`.

Más `tieneVisaActiva` y `deportadoDePais`, que están en el esquema con valor por
defecto `'no'` pero **no tienen radio en pantalla**.

#### Selects

Todos usan [`Selector`](src/components/interfaz/Selector.tsx), que renderiza
`<option value={opcion.value}>{opcion.label}</option>` y guarda el `value`. En
casi todos los casos del formulario actual, `value === label`: el `.map()` que
construye las listas hace `{ value: x, label: x }`. **La única excepción real es
`estadoCivil`**, donde el `value` es un slug (`union_libre`) distinto de la
etiqueta.

| Variable | Origen de las opciones | Qué guarda hoy |
|---|---|---|
| `sexo` | `opcionesSexo` (2, literal) | `masculino` / `femenino` |
| `estadoCivil` | `opcionesEstadoCivil` (5, literal) | slug: `soltero`, `casado`, `divorciado`, `viudo`, `union_libre` |
| `direccionConyuge` | `opcionesDireccionConyuge` (5, literal) | texto español sin tildes |
| `nacionalidadConyuge` | `opcionesPaises` ← `COUNTRIES` (195) | nombre de país en español ("Ecuador") |
| `paisNacimientoConyuge` | `opcionesPaises` (195) | nombre de país en español |
| `nacionalidad` | `opcionesNacionalidades` ← `NATIONALITIES` (195) | **gentilicio** en español ("Ecuatoriana") |
| `otraNacionalidad` | `opcionesNacionalidades` (195) | gentilicio en español |
| `paisResidenciaPermanente` | `opcionesPaises` (195) | nombre de país en español |
| `provincia` | `opcionesProvincias` ← `PROVINCES_EC` (24) | nombre de provincia |
| `ciudad` | derivado de `ECUADOR_CITIES_BY_PROVINCE[provincia]` | nombre de ciudad; se limpia si cambia la provincia |
| `ciudadPasaporte` | `opcionesCiudadesEcuador` (todas las ciudades EC) | nombre de ciudad |
| `paisAutoridadPasaportePerdidoORobado` | `opcionesPaises` (195) | nombre de país en español |
| `estadoLicenciaConducirEEUU` | `opcionesEstadosUnidos` (56) | nombre del estado **en inglés y mayúsculas** ("FLORIDA") |
| `estadoHospedajeEEUU` | `opcionesEstadosUnidos` (56) | ídem |
| `categoriaOcupacionActual` | `opcionesOcupaciones` (22, literal) | texto español ("Ama de casa") |
| `ciudadTrabajoActual`, `ciudadTrabajoAnterior`, `ciudadEducacion` | `opcionesCiudadesEcuador` | nombre de ciudad |
| `provinciaTrabajoActual`, `provinciaTrabajoAnterior`, `provinciaEducacion` | `opcionesProvincias` (24) | nombre de provincia |
| `estatusPadreEEUU`, `estatusMadreEEUU` | `opcionesEstatusFamiliarEEUU` (4) | texto español en MAYÚSCULAS |
| `familiaresInmediatosDetalle[].relacion` | `opcionesRelacionFamiliarInmediato` (4) | texto español |
| `familiaresInmediatosDetalle[].estatus` | `opcionesEstatusFamiliarInmediatoEEUU` (4) | texto español, **distinto** al de padre/madre pese a ser el mismo concepto |
| `categoriaMotivoViaje` | `razonesViaje` (24) | texto español con el código entre paréntesis |
| `tipoVisa` | `razonesViajeEspecifico` (133), filtrado en vivo | texto español con el código entre paréntesis |
| `unidadDuracionEstadiaPrevista` | `opcionesDuracion` (4) | slug: `dias`, `semanas`, `meses`, `anios` |
| `visitasAnterioresEEUU[].unidadDuracion` | `opcionesDuracion` (4) | ídem |
| `pagadorViaje` | `opcionesPagador` (5) | texto español en MAYÚSCULAS ("OTRA PERSONA") |
| `acompanantesViaje[].relacion` | `opcionesRelacionAcompanante` (7) | texto español ("Padre o Madre") |

**Conclusión del inventario:** hoy ningún select guarda un código del DS-160.
Los tres que guardan un valor distinto de la etiqueta (`estadoCivil`,
`unidadDuracion*`) guardan slugs propios, no valores del DS-160.

---

## 2. Tabla de correspondencia

De los 186 nombres que el payload produce hoy, **157 coinciden literalmente**
con una variable canónica del mapeo. Ese es el resultado más importante del
diagnóstico: la nomenclatura ya está casi toda alineada, y la migración es
mayormente de *contenido* (valores, catálogos, repetidores), no de *nombres*.

### 2.1. Coincidencia exacta y sin reservas (134)

Mismo nombre en la web y en el mapeo, mismo significado, mismo tipo. No
requieren renombrado ni decisión:

`cedula`, `primerNombre`, `segundoNombre`, `primerApellido`, `segundoApellido`,
`fechaNacimiento`, `nombresConyuge`, `apellidosConyuge`,
`fechaNacimientoConyuge`, `ciudadNacimientoConyuge`, `direccion`, `ciudad`,
`provincia`, `codigoPostal`, `correo`, `correosAnteriores`,
`telefonosAnteriores`, `ciudadPasaporte`, `numeroPasaportePerdidoORobado`,
`explicacionPasaportePerdidoORobado`, `facebook`, `instagram`, `linkedin`,
`otrasRedesSociales`, `numeroLicenciaConducirEEUU`, `identificacionFiscalEEUU`,
`empleadorActual`, `descripcionTrabajoActual`, `direccionTrabajoActual`,
`ciudadTrabajoActual`, `provinciaTrabajoActual`, `codigoPostalTrabajoActual`,
`telefonoTrabajoActual`, `fechaInicioTrabajoActual`, `empleadorAnterior`,
`cargoAnterior`, `direccionTrabajoAnterior`, `ciudadTrabajoAnterior`,
`provinciaTrabajoAnterior`, `codigoPostalTrabajoAnterior`,
`telefonoTrabajoAnterior`, `nombreSupervisorAnterior`,
`apellidosSupervisorAnterior`, `descripcionTrabajoAnterior`,
`fechaInicioTrabajoAnterior`, `fechaFinTrabajoAnterior`,
`institucionUniversitaria`, `nombreCarrera`, `direccionEducacion`,
`ciudadEducacion`, `provinciaEducacion`, `codigoPostalEducacion`,
`fechaInicioEducacion`, `fechaFinEducacion`, `nombresPadre`, `apellidosPadre`,
`fechaNacimientoPadre`, `nombresMadre`, `apellidosMadre`,
`fechaNacimientoMadre`, `detallesVisaNegada`, `detallesDeportacion`,
`razonPeticionInmigracion`, `razonVisaEEUUCanceladaORevocada`,
`motivoVisaEEUUPerdidaORobada`, `anioVisaEEUUPerdidaORobada`, `numeroVisa`,
`fechaEmisionUltimaVisa`, `fechaLlegadaPrevista`,
`valorDuracionEstadiaPrevista`, `fechaLlegadaEEUU`, `ciudadLlegadaEEUU`,
`fechaSalidaEEUU`, `ciudadSalidaEEUU`, `direccionHospedajeEEUU`,
`ciudadHospedajeEEUU`, `detalleEnfermedadContagiosa`, `sueldoActual`,
más los 20 slots de acompañantes (`acompananteViaje1..5Nombres/Apellidos`), los
15 de visitas anteriores (`visitaAnteriorEEUU1..5FechaLlegada/ValorDuracion`) y
`familiarInmediato1Nombres/Apellidos`.

Los 25 radios listados en §1.2 también son coincidencia exacta **de nombre**,
pero todos requieren cambiar `'si'/'no'` por `'Y'/'N'`; los listo en 2.2 para
que quede constancia.

### 2.2. Coinciden en nombre, pero requieren trabajo

| Variable en mi web | Variable canónica (mapeo) | Confianza |
|---|---|---|
| `tieneOtraNacionalidad` | `tieneOtraNacionalidad` | Alta — solo cambia `'si'/'no'` → `Y`/`N` |
| `esResidentePermanenteExtranjero` | `esResidentePermanenteExtranjero` | Alta — ídem |
| `tuvoTelefonosAnteriores` | `tuvoTelefonosAnteriores` | Alta — ídem |
| `tuvoCorreosAnteriores` | `tuvoCorreosAnteriores` | Alta — ídem |
| `pasaportePerdidoORobado` | `pasaportePerdidoORobado` | Alta — ídem |
| `licenciaConducirEEUU` | `licenciaConducirEEUU` | Alta — ídem |
| `tuvoTrabajoAnterior` | `tuvoTrabajoAnterior` | Alta — ídem |
| `asistioInstitucionEducativa` | `asistioInstitucionEducativa` | Alta — ídem |
| `padreEnEEUU` | `padreEnEEUU` | Alta — ídem |
| `madreEnEEUU` | `madreEnEEUU` | Alta — ídem |
| `familiaresInmediatosEnEEUU` | `familiaresInmediatosEnEEUU` | Alta — ídem |
| `otrosFamiliaresEnEEUU` | `otrosFamiliaresEnEEUU` | **Dudosa** — la web solo muestra el radio cuando `familiaresInmediatosEnEEUU = no`, y lo fuerza a `no` cuando es `si` ([SeccionFamilia.tsx:47](src/components/formulario/SeccionFamilia.tsx:47)). En el DS-160 `rblUS_OTHER_RELATIVE_IND` es una pregunta independiente que siempre está |
| `tienePlanesViajeConcretos` | `tienePlanesViajeConcretos` | Alta — ídem `Y`/`N` |
| `viajaConOtros` | `viajaConOtros` | Alta — ídem |
| `haVisitadoEEUU` | `haVisitadoEEUU` | Alta — ídem |
| `haTenidoVisaEEUU` | `haTenidoVisaEEUU` | Alta — ídem |
| `mismoTipoVisa` | `mismoTipoVisa` | Alta — ídem |
| `mismoPaisResidenciaVisa` | `mismoPaisResidenciaVisa` | Alta — ídem |
| `diezHuellasTomadas` | `diezHuellasTomadas` | Alta — ídem |
| `visaEEUUPerdidaORobada` | `visaEEUUPerdidaORobada` | Alta — ídem |
| `visaEEUUCanceladaORevocada` | `visaEEUUCanceladaORevocada` | Alta — ídem |
| `tienePeticionInmigracion` | `tienePeticionInmigracion` | Alta — ídem |
| `visaNegada` | `visaNegada` | Alta — ídem |
| `enfermedadContagiosa` | `enfermedadContagiosa` | Alta — ídem |
| `deportadoDePais` | `deportadoDePais` | **Dudosa** — coincide el nombre, pero no hay radio en pantalla; hoy siempre sale `no` |
| `sexo` | `sexo` | Alta en nombre; **catálogo `ddlAPP_GENDER` no volcado** |
| `estadoCivil` | `estadoCivil` | Alta en nombre; **catálogo `ddlAPP_MARITAL_STATUS` no volcado**. Además la web tiene 5 opciones y el DS-160 tiene más (incluye "legalmente separado", "unión civil") |
| `nacionalidad` | `nacionalidad` | Alta en nombre; **hay que reemplazar la lista entera**: la web guarda un gentilicio ("Ecuatoriana"), el catálogo tiene país + código (`ECUA|ECUADOR`) |
| `otraNacionalidad` | `otraNacionalidad` | Ídem — mismo catálogo de 212 |
| `nacionalidadConyuge` | `nacionalidadConyuge` | **Dudosa** — el mapeo la manda al catálogo `paisesNacionalidadConyuge`, que según `decisiones_alcance.md` §6 tiene **213** opciones frente a las 212 de nacionalidad, y la opción extra nunca se diffeó. No es seguro reutilizar el de 212 |
| `paisNacimientoConyuge` | `paisNacimientoConyuge` | Alta; catálogo `paisesLugarNacimiento` (281), disponible |
| `paisResidenciaPermanente` | `paisResidenciaPermanente` | Alta; catálogo `paisesResidenciaPermanente` (253), disponible |
| `paisAutoridadPasaportePerdidoORobado` | `paisAutoridadPasaportePerdidoORobado` | Alta; catálogo `paisesAutoridadPasaporte` (217), disponible. **No** es el de 253 ni el de 212 |
| `estadoLicenciaConducirEEUU` | `estadoLicenciaConducirEEUU` | Alta; catálogo `estadosEEUU` (57). **Los 56 nombres de la web coinciden uno a uno con el catálogo**: solo falta agregar el `value` |
| `estadoHospedajeEEUU` | `estadoHospedajeEEUU` | Ídem |
| `categoriaOcupacionActual` | `categoriaOcupacionActual` | Alta; catálogo `ocupacionActual` (23). Las 22 opciones de la web alinean **1 a 1 y en el mismo orden** con las 22 reales del catálogo |
| `categoriaMotivoViaje` | `categoriaMotivoViaje` | **Dudosa** — a la web le falta la opción `PAROLE-BEN` (25 reales vs 24). Y el código entre paréntesis **no es el `value`** en dos casos: la web muestra `(CW/E2C)` donde el `value` es `CNMI`, y `(PARCIS)` donde el `value` es `PAROLE-BEN` |
| `tipoVisa` | `tipoVisa` | **Dudosa** — hay que reemplazar la lista entera. La web tiene 133 opciones, el catálogo 134. En la web sobran `BCC`, `E3`, `E3R`, `TN`; faltan `C4`, `C4/D3`, `D3`, `T6`, `PRL-PARCIS`. Además el filtrado por prefijo del paréntesis ([SeccionViaje.tsx:23](src/components/formulario/SeccionViaje.tsx:23)) es una heurística: hay que sustituirlo por el mapa anidado real padre→hijos |
| `unidadDuracionEstadiaPrevista` | `unidadDuracionEstadiaPrevista` | Alta en nombre; **catálogo `unidadDuracion` (`ddlTRAVEL_LOS_CD`) no volcado** |
| `visitasAnterioresEEUU[i].unidadDuracion` | `visitaAnteriorEEUU{i}UnidadDuracion` | Ídem; el aplanado ya lo hace Apps Script |
| `pagadorViaje` | `pagadorViaje` | **Dudosa** — nombre alto, pero el catálogo `quienPaga` (`ddlWhoIsPaying`) **no está volcado**. Vos mencionás que "otra persona" es `"O"`; hay que confirmar los otros cuatro valores |
| `acompanantesViaje[i].relacion` | `acompananteViaje{i}Relacion` | Alta; catálogo `relacionAcompanante` (8), disponible. Ojo: `C`=CHILD, `P`=PARENT. La web tiene 7 opciones que se corresponden con las 7 reales |
| `estatusPadreEEUU` | `estatusPadreEEUU` | Alta en nombre; **catálogo `estatusEEUU` (`ddlFATHER_US_STATUS`) no volcado** |
| `estatusMadreEEUU` | `estatusMadreEEUU` | Ídem |
| `familiaresInmediatosDetalle[0].estatus` | `familiarInmediato1Estatus` | Ídem — **mismo catálogo `estatusEEUU`**, pero la web usa hoy dos listas de texto distintas para el mismo concepto |
| `familiaresInmediatosDetalle[0].relacion` | `familiarInmediato1Relacion` | **Dudosa** — catálogo `parentescoFamiliarEEUU` (`ddlUS_REL_TYPE`) **no volcado**. La web ofrece 4 opciones; no sé cuántas tiene el DS-160 |
| `celular` | `celular` | Alta en nombre; **cambió de significado**: ahora es el "Primary Phone Number" (`tbxAPP_HOME_TEL`), el único teléfono obligatorio |
| `telefonoDomicilio` | `telefonoDomicilio` | Alta en nombre; **cambió de significado**: ahora es "Secondary Phone Number" (`tbxAPP_MOBILE_TEL`). Ver §6, riesgo 3: hay una contradicción entre documentos sobre si se envía o no |
| `cargoActual` | `cargoActual` | Alta — sigue siendo variable de página web, pero la app la concatena dentro de `descripcionTrabajoActual` en `tbxDescribeDuties`. **No tiene control en la web hoy** |

### 2.3. Correspondencias de uno a muchos (reestructuración)

| Variable en mi web | Variable canónica (mapeo) | Confianza |
|---|---|---|
| `idiomas` (un textarea) | `idioma1` … `idioma5` | **Dudosa** — hay que partir el campo en 5 entradas separadas. El texto libre actual ("Español (nativo), Inglés (intermedio)") no se puede dividir de forma fiable por código |
| `lugaresPlaneadosEEUU` (un textarea) | `lugarPlaneadoEEUU1` … `5` | **Dudosa** — ídem, 5 campos de máx. 40 caracteres |
| `historialViajes` (campo sin control) | `tieneHistorialViajes` + `paisVisitado1` … `5` | **Dudosa** — pasa a ser un radio derivado más 5 selects del catálogo de 253 |

### 2.4. Sin correspondencia canónica

| Variable en mi web | Variable canónica (mapeo) | Confianza |
|---|---|---|
| `direccionConyuge` | — | Sin equivalente: `ddlSpouseAddressType` es valor fijo `"H"` |
| `direccionConyugeOtro` | — | Sin equivalente: el bloque de dirección del cónyuge es inalcanzable |
| `tieneVisaActiva`, `paisVisa`, `fechaEmisionVisa` | — | Eliminadas del modelo |
| `cantidadViajeros`, `relacionViaje` | — | Eliminadas del modelo |
| `tieneIdentificacionFiscalEEUU` | (pendiente) | En `pendientes` de Personal2 |
| `institucionBachillerato`, `telefonoEducacion` | (pendientes) | En `pendientes` de WorkEducation2 |
| `familiarInmediato2..5*` (16 slots) | (pendientes) | En `pendientes` de Relatives |

---

## 3. Campos que faltan

39 variables canónicas sin equivalente en el formulario web. Coincide exactamente
con las 39 de `variables_nuevas.md`. Agrupadas por `node`:

### Personal1 (2)

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `ciudadNacimiento` | texto (máx 20) | — | no |
| `paisNacimiento` | select | `paisesLugarNacimiento` (281) — **disponible** | no |

### Travel (11)

Bloque de lugares a visitar (5) — **no condicional**, reemplaza a `lugaresPlaneadosEEUU`:

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `lugarPlaneadoEEUU1` … `lugarPlaneadoEEUU5` | texto (máx 40) | — | el 1 obligatorio; 2–5 opcionales |

Bloque del pagador (6) — **condicional a `pagadorViaje = "O"`** (Other Person):

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `apellidosPagador` | texto | — | sí |
| `nombresPagador` | texto | — | sí |
| `telefonoPagador` | texto | — | sí |
| `correoPagador` | texto | — | sí |
| `relacionPagador` | select | `relacionPagador` (`ddlPayerRelationship`) — **NO volcado, bloqueante** | sí |
| `direccionPagadorIgualSolicitante` | radio | `Y`/`N` | sí. Si es `N`, el sub-bloque de dirección del pagador no está relevado y queda manual |

### AddressPhone (1)

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `paisDomicilio` | select | `paisesResidenciaPermanente` (253) — **disponible** | no |

### PptVisa (7)

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `tipoDocumentoPasaporte` | select | `tipoDocumentoPasaporte` (`ddlPPT_TYPE`, 6) — **NO volcado, bloqueante**. Dispara postback | no |
| `numeroPasaporte` | texto (máx 20) | — | no |
| `autoridadEmisoraPasaporte` | select | `paisesAutoridadPasaporte` (217) — **disponible**. No incluye Estados Unidos | no |
| `provinciaEmisionPasaporte` | texto (máx 25) | — | no |
| `paisEmisionPasaporte` | select | `paisesResidenciaPermanente` (253) — **disponible**. Distinto del anterior: es el lugar físico de emisión | no |
| `fechaEmisionPasaporte` | fecha | — | no |
| `fechaExpiracionPasaporte` | fecha | — | no |

### USContact (7)

Pantalla entera ausente del formulario web.

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `apellidosContactoEEUU` | texto (máx 33) | — | no |
| `nombresContactoEEUU` | texto (máx 33) | — | no |
| `relacionContactoEEUU` | select | `relacionContactoEEUU` (8) — **disponible**. `C`=FRIEND, `P`=EMPLOYER. Dispara postback | no |
| `direccionContactoEEUU` | texto (máx 40) | — | no |
| `ciudadContactoEEUU` | texto (máx 20) | — | no |
| `estadoContactoEEUU` | select | `estadosEEUU` (57) — **disponible** | no |
| `telefonoContactoEEUU` | texto (máx 15) | — | no |

### WorkEducation3 (11)

| Variable | Tipo | Catálogo | Condicional |
|---|---|---|---|
| `idioma1` … `idioma5` | texto (máx 66) | — | no. Reemplazan a `idiomas` |
| `tieneHistorialViajes` | radio | `Y`/`N` | no. Derivada: `Y` si hay al menos un país visitado |
| `paisVisitado1` … `paisVisitado5` | select | `paisesResidenciaPermanente` (253) — **disponible** | condicionales a `tieneHistorialViajes = Y` |

### Además: campos que ya están en el contrato pero sin control en pantalla

No son "faltantes" según el mapeo (el nombre ya existe), pero **hoy siempre
llegan vacíos**, así que en la práctica también hay que construirles interfaz:

| Variable | Tipo DS-160 | Por qué es obligatorio ahora |
|---|---|---|
| `cargoActual` | parte de `tbxDescribeDuties` | decisión explícita en `decisiones_alcance.md` §2 |
| `sueldoActual` | texto (`tbxCURR_MONTHLY_SALARY`) | su checkbox `cbxCURR_MONTHLY_SALARY_NA` va **desmarcado** en v2.3 |
| `nombreCarrera` | texto (`dtlPrevEduc_ctl00_tbxSchoolCourseOfStudy`) | campo del repetidor de educación |
| `deportadoDePais` | radio (`rblDeport`) | se mantiene como variable de página web |
| `detallesDeportacion` | textarea (`tbxDeport_EXPL`) | condicional a `deportadoDePais = Y` |

---

## 3.bis. Las 19 variables en `pendientes` (informativo, no las incluí arriba)

Están declaradas en el mapeo como variables del modelo sin `id` relevado. La web
**ya captura 3 de ellas** y podría capturar las otras 16 vía el array de
familiares. Las listo solo para que las tengas presentes:

| `node` | Variables | Estado en la web |
|---|---|---|
| Personal2 | `tieneIdentificacionFiscalEEUU` | ya capturada (radio) |
| WorkEducation2 | `institucionBachillerato`, `telefonoEducacion` | en el contrato, sin control |
| Relatives | `familiarInmediato2..5` × `Nombres`/`Apellidos`/`Relacion`/`Estatus` (16) | el `useFieldArray` ya permite N familiares; Apps Script ya aplana 5 slots |

Nota del propio mapeo: `telefonoEducacion` está pendiente porque **el DS-160 no
pide teléfono de la institución educativa**, e `institucionBachillerato` porque
el DS-160 usa un solo repetidor para toda la educación (el bachillerato sería
otra fila del mismo `dtlPrevEduc`). Ninguna de las dos parece que vaya a
resolverse a favor de emitirlas.

---

## 4. Campos que sobran

### 4.1. Eliminados por decisión de alcance (5)

`decisiones_alcance.md` §1 y `variables_nuevas.md` §9 los eliminan del modelo:

| Variable | Motivo |
|---|---|
| `tieneVisaActiva` | sin control en las 18 pantallas |
| `paisVisa` | sin control en las 18 pantallas |
| `fechaEmisionVisa` | sin control en las 18 pantallas |
| `cantidadViajeros` | se deduce de cuántos acompañantes se carguen |
| `relacionViaje` | cada acompañante ya tiene su propia relación |

Los cinco están hoy sin control en pantalla, así que borrarlos del esquema, del
contrato y de `Code.gs` no cambia nada visible.

### 4.2. Sin equivalente en el modelo (2)

| Variable | Motivo |
|---|---|
| `direccionConyuge` | `ddlSpouseAddressType` es **valor fijo `"H"`** (misma dirección que el solicitante). El select de 5 opciones de la web no tiene destino |
| `direccionConyugeOtro` | El sub-bloque `tbxSPOUSE_ADDR_*` es **inalcanzable** porque `ddlSpouseAddressType` está fijo en `"H"` |

Estos dos sí tienen control en pantalla, así que borrarlos cambia lo que ve el
cliente. **Es una decisión tuya** (ver §6, pregunta 1).

### 4.3. Reemplazados, no eliminados (3)

| Variable | Reemplazo |
|---|---|
| `idiomas` | `idioma1` … `idioma5` |
| `lugaresPlaneadosEEUU` | `lugarPlaneadoEEUU1` … `lugarPlaneadoEEUU5` |
| `historialViajes` | `tieneHistorialViajes` + `paisVisitado1` … `paisVisitado5` |

---

## 5. El problema de los catálogos

### 5.1. Estado de cada select y radio

**Los 25 radios** guardan `'si'`/`'no'`. El DS-160 usa `Y`/`N` en los `rbl`
(la app hace click sobre `id + '_0'` para `Y` e `id + '_1'` para `N`). Es una
conversión mecánica y no necesita catálogo: se convierte al construir el JSON.

Para los selects, hay cuatro situaciones distintas:

#### (a) La lista de la web ya coincide; solo falta agregar el `value` (3)

| Select | Catálogo | Detalle |
|---|---|---|
| `estadoLicenciaConducirEEUU` | `estadosEEUU` (57) | los 56 nombres en inglés de la web **coinciden uno a uno** con el catálogo. Verificado por comparación exacta de cadenas |
| `estadoHospedajeEEUU` | `estadosEEUU` (57) | ídem |
| `categoriaOcupacionActual` | `ocupacionActual` (23) | las 22 etiquetas en español de la web alinean 1 a 1 **y en el mismo orden** con las 22 opciones reales. Solo hay que anexar el `value` (`A`, `AP`, `B`, `CM`, `CS`, `C`, `ED`, `EN`, `G`, `H`, `LP`, `MH`, `M`, `NS`, `N`, `PS`, `RV`, `R`, `RT`, `SS`, `S`, `O`) |

Aun en estos tres conviene reemplazar la lista por la del catálogo, para que la
fuente de verdad sea una sola y no dos listas que hay que mantener sincronizadas
a mano.

#### (b) Hay que reemplazar la lista entera por el catálogo (8 controles, 6 catálogos)

| Select | Catálogo destino | Qué hay hoy |
|---|---|---|
| `nacionalidad`, `otraNacionalidad` | `paisesNacionalidad` (212) | gentilicios españoles ("Ecuatoriana") de una lista propia de 195 |
| `paisResidenciaPermanente` | `paisesResidenciaPermanente` (253) | lista propia de 195 países en español |
| `paisNacimientoConyuge` | `paisesLugarNacimiento` (281) | ídem |
| `paisAutoridadPasaportePerdidoORobado` | `paisesAutoridadPasaporte` (217) | ídem |
| `categoriaMotivoViaje` | `propositoViaje` (26) | 24 opciones propias; falta `PAROLE-BEN` |
| `tipoVisa` | `propositoViajeEspecifico` (134, anidado) | 133 opciones propias con filtrado heurístico; 4 sobran, 5 faltan |
| `acompanantesViaje[].relacion` | `relacionAcompanante` (8) | 7 etiquetas propias en español |

**Las tres listas de países no son intercambiables.** Verificado contra los
archivos: 212 / 253 / 281 opciones, con propósitos distintos. Y la de autoridad
emisora de pasaporte (217) es una cuarta lista, que además incluye tres entradas
que no son países (`XEU` Unión Europea, `UNLP` laissez-passer de la ONU, `SNTD`
documento de estatus neutral) y desdobla Hong Kong en `HNK` y `HOKO`. Nunca
reutilizar una por otra.

**Los dos catálogos de "relación" tienen 8 opciones cada uno y values
incompatibles.** En acompañantes (`ddlTCRelationship`): `C`=CHILD, `P`=PARENT.
En contacto en EE.UU. (`ddlUS_POC_REL_TO_APP`): `C`=FRIEND, `P`=EMPLOYER,
`H`=SCHOOL OFFICIAL. Los dos archivos existen y hay que usar cada uno en su
lugar.

#### (c) Selects nuevos, con catálogo disponible (4 controles, 3 catálogos)

`paisNacimiento` (281), `paisDomicilio` (253), `paisEmisionPasaporte` (253),
`autoridadEmisoraPasaporte` (217), `paisVisitado1..5` (253),
`estadoContactoEEUU` (57), `relacionContactoEEUU` (8). Todos con catálogo
volcado y listo.

#### (d) Selects sin catálogo volcado — **9 catálogos faltantes, no 2**

Este es un hallazgo que quiero destacar: vos identificaste dos catálogos
faltantes, pero el mapeo referencia **nueve** que `docs/` no contiene.

| Catálogo | Control DS-160 | Variables afectadas | ¿Bloqueante? |
|---|---|---|---|
| `relacionPagador` | `ddlPayerRelationship` | `relacionPagador` | **Sí** — ya identificado por vos |
| `tipoDocumentoPasaporte` | `ddlPPT_TYPE` (6 opc.) | `tipoDocumentoPasaporte` | **Sí** — ya identificado por vos. Dispara postback |
| `quienPaga` | `ddlWhoIsPaying` | `pagadorViaje` | **Sí** — sin él no puedo emitir el `valor`, y de él depende toda la condicionalidad del bloque del pagador |
| `unidadDuracion` | `ddlTRAVEL_LOS_CD`, `ddlPREV_US_VISIT_LOS_CD` | `unidadDuracionEstadiaPrevista` + 5 `visitaAnteriorEEUU*UnidadDuracion` | **Sí** — 6 variables |
| `estatusEEUU` | `ddlFATHER_US_STATUS`, `ddlMOTHER_US_STATUS`, `ddlUS_REL_STATUS` | `estatusPadreEEUU`, `estatusMadreEEUU`, `familiarInmediato1Estatus` | **Sí** — 3 variables |
| `parentescoFamiliarEEUU` | `ddlUS_REL_TYPE` | `familiarInmediato1Relacion` | **Sí** |
| `paisesNacionalidadConyuge` | `ddlSpouseNatDropDownList` (213) | `nacionalidadConyuge` | **Sí** — 213 opciones vs las 212 de nacionalidad; la diferencia nunca se diffeó |
| (sin nombre en el mapeo) | `ddlAPP_GENDER` | `sexo` | **Sí** — el campo no lleva ni siquiera la clave `catalogo` en el mapeo |
| (sin nombre en el mapeo) | `ddlAPP_MARITAL_STATUS` | `estadoCivil` | **Sí** — ídem. Dispara postback. La web tiene 5 opciones; el DS-160 tiene más |

En total, **10 catálogos disponibles y 9 faltantes**, que afectan a 16 variables.
Sin ellos no puedo emitir un `valor` correcto para esas 16 y hay que omitirlas
(que es el comportamiento seguro, pero deja al operador llenándolas a mano).

### 5.2. Dónde deben vivir los catálogos — recomendación

**Recomendación: solo en el formulario web. El Apps Script no lleva catálogos.**

El razonamiento:

1. **El formulario web los necesita de todas formas.** Un `<select>` no puede
   renderizarse sin sus opciones. Si el catálogo está en la web, el `value` del
   `<option>` ya *es* el `value` del DS-160, y el texto visible ya *es* el texto
   que se le muestra al operador. Construir el objeto `{texto, valor}` se vuelve
   trivial: `{ texto: option.label, valor: option.value }`.

2. **Ponerlos también en Apps Script duplicaría la información.** Si el navegador
   ya manda el par completo, el script solo tiene que serializarlo. Duplicar los
   catálogos crea dos copias que se pueden desincronizar, y la desincronización
   sería silenciosa.

3. **Mantiene `Code.gs` pegable.** Los 10 catálogos disponibles, serializados
   como JSON compacto (`[{"v":"ECUA","t":"Ecuador"}, …]`), pesan **~43 KB**:
   ~9,8 KB lugar de nacimiento, ~8,5 KB residencia permanente, ~7,3 KB autoridad
   de pasaporte, ~7,0 KB nacionalidad, ~6,2 KB propósito específico anidado, y el
   resto menor. Eso son unas **1 100 líneas** adicionales sobre las 344 actuales
   de `Code.gs`. Apps Script las aguanta sin problema técnico, pero convierte el
   copiar-y-pegar manual en una operación incómoda y propensa a truncarse.

4. **El plan ya dice esto.** §4 del plan: "Los catálogos ya volcados del
   formulario sirven para alimentar la página web, no la aplicación."

Con esto, el rol de `Code.gs` se reduce a: recibir el payload, decidir para cada
clave si emitir string plano u objeto `{texto, valor}`, omitir las ausentes,
aplanar los tres repetidores (código que ya existe) y escribir el `.json` en
Drive. Es un script pequeño y estable, que no habrá que volver a pegar cada vez
que cambie un catálogo.

**La contrapartida honesta:** el Apps Script no podrá validar que el `valor` que
recibe pertenezca al catálogo. Si querés esa red de seguridad, la variante
mínima es incrustar en `Code.gs` **solo los conjuntos de `value` válidos, sin
etiquetas** (`["ECUA","ARG",…]`), que pesan ~10 KB en vez de 43 KB, y rechazar o
registrar los que no encajen. Yo no lo haría en la primera versión: es un
formulario privado, el navegador no elige valores libremente, y añade una segunda
copia que mantener. Decime si lo querés igual.

### 5.3. Cómo cargar los catálogos en la web — recomendación

**Recomendación: archivos TypeScript generados a partir de los `.md` de `docs/`,
importados estáticamente.**

Concretamente:

- Un script de desarrollo (Node, no parte de la app) que lee `docs/catalogo_*.md`,
  parsea las líneas `value|inglés|español` y escribe
  `src/constants/catalogos/*.ts` con arrays tipados
  `{ valor: string; texto: string }[]`.
- Los `.ts` generados se comitean. La app los importa como cualquier constante.
- `docs/` sigue siendo la fuente de verdad; cuando vuelques un catálogo nuevo,
  volvés a correr el script.

Por qué así y no de otra manera:

- **Frente a escribirlos a mano:** 1 100 líneas transcritas a mano es una fuente
  garantizada de erratas en códigos como `C`/`CM`/`CS` o `M`/`MH`, donde un
  carácter equivocado escribe el valor incorrecto en el DS-160 sin dar error.
- **Frente a cargarlos por `fetch` desde `public/`:** agrega un estado de carga,
  un modo de fallo nuevo (¿qué muestra el select si el JSON no llegó?) y una
  petición de red que puede fallar justo cuando el cliente está llenando el
  formulario. No compensa por 43 KB.
- **Sobre el peso:** 43 KB de texto se comprimen a unos 12 KB con gzip, que es lo
  que el navegador descarga. Es menos de lo que pesa hoy una sola de las fuentes
  del sitio. No es un problema.

Un detalle de interfaz que conviene resolver a la vez: un `<select>` nativo con
281 opciones es incómodo. Vale la pena considerar un campo con búsqueda para los
cuatro catálogos de países. No es bloqueante y se puede dejar para después.

### 5.4. Los dos catálogos que quedan preparados sin opciones

Como pediste, `relacionPagador` (`ddlPayerRelationship`) y
`tipoDocumentoPasaporte` (`ddlPPT_TYPE`, 6 opciones) quedan como controles
declarados pero con lista vacía. Consecuencia práctica: **si no tienen valor, la
regla 3 del formato obliga a omitir la clave del JSON**, y el operador tendrá que
llenar esos dos campos a mano en el DS-160. Ambos son bloqueantes para un llenado
100 % automático. `ddlPPT_TYPE` además dispara postback, así que dejarlo en el
placeholder puede recargar la pantalla de pasaporte.

Y agrego los otros siete de §5.1(d) a la misma lista de bloqueantes.

---

## 6. Riesgos y decisiones que necesito tomar

### Preguntas que necesito que respondas

**1. `direccionConyuge` y `direccionConyugeOtro`: ¿los saco de la pantalla?**
No tienen destino en el DS-160 (`ddlSpouseAddressType` es fijo `"H"` y el
sub-bloque de dirección es inalcanzable). Puedo (a) eliminarlos por completo,
(b) dejarlos en pantalla porque te sirven para otra cosa y simplemente no
emitirlos en el JSON. Son los dos únicos campos "que sobran" que el cliente ve
hoy.

**2. `idiomas`, `lugaresPlaneadosEEUU`: ¿5 campos separados, o un campo que yo
parta?** Recomiendo 5 campos separados (el 1 obligatorio, 2–5 opcionales), que es
lo que el DS-160 espera y lo que evita adivinar. Partir el texto libre actual por
comas es frágil: "Español (nativo), Inglés (intermedio)" partiría bien, pero
"Nueva York, Washington D.C., Miami" partiría mal.

**3. `historialViajes` → `tieneHistorialViajes` + `paisVisitado1..5`:** hoy
`historialViajes` no tiene control en pantalla. ¿Agrego un radio "¿Ha visitado
otros países en los últimos 5 años?" más 5 selects de países? El mapeo dice que
`tieneHistorialViajes` es derivada (`Y` si hay al menos un país), así que técnicamente
podría calcularla sola, pero el radio explícito le da al cliente la salida "no".

**4. Interfaz para los 5 campos hoy huérfanos.** ¿Agrego controles para
`cargoActual`, `sueldoActual`, `nombreCarrera`, `deportadoDePais` y
`detallesDeportacion`? Los cinco son canónicos y hoy siempre llegan vacíos.
`sueldoActual` en particular pasó a obligatorio en la v2.3 (su checkbox "no
aplica" quedó desmarcado).

**5. `otrosFamiliaresEnEEUU`:** la web lo esconde y lo fuerza a `no` cuando
`familiaresInmediatosEnEEUU = si`. En el DS-160 es una pregunta independiente que
siempre está. ¿Lo hago siempre visible?

**6. Tope de repetidores.** Los tres arrays de la web no tienen tope; Apps Script
recorta a 5 en silencio. ¿Pongo el tope de 5 en la interfaz (con el botón
"Añadir" deshabilitado al llegar), o dejo que el cliente cargue más y se pierdan?
Recomiendo el tope visible: perder datos en silencio es peor.

**7. `pagadorViaje`: ¿me confirmás los 5 `value` de `ddlWhoIsPaying`?**
Mencionaste que "otra persona" es `"O"`. Sin los otros cuatro, no puedo emitir el
`valor` cuando el cliente elige "YO", "EMPLEADOR ACTUAL", "EMPLEADOR EN EE. UU"
o "OTRA EMPRESA/ORGANIZACIÓN". Y de este campo depende toda la condicionalidad
del bloque del pagador.

**8. ¿Volcás los 7 catálogos faltantes que no tenías identificados?**
`quienPaga`, `unidadDuracion`, `estatusEEUU`, `parentescoFamiliarEEUU`,
`paisesNacionalidadConyuge` (213), `ddlAPP_GENDER` y `ddlAPP_MARITAL_STATUS`.
Son 7 listas cortas salvo la de 213. Sin ellas quedan 16 variables sin `valor`.

**9. ¿Emito el JSON *además* del PDF desactivado, o dejo también la carpeta?**
Hoy el script crea una carpeta por cliente y guarda el PDF dentro. Vos decís que
el JSON va "en la misma carpeta de Drive donde hoy se guardan los PDF". ¿Te
referís a la carpeta padre (`PARENT_FOLDER_ID`), o a la subcarpeta por cliente que
el script crea? Recomiendo mantener la subcarpeta por cliente: cuando reactives
el PDF, los dos archivos quedan juntos.

**10. Nombre del archivo.** La regla dice "nombre del cliente + número de cédula".
El script hoy usa solo `primerApellido` normalizado. ¿Querés
`primerNombre_primerApellido_cedula.json`, o los cuatro nombres completos?

### Riesgos que quiero señalar

**Riesgo 1 — Contradicción entre documentos sobre `telefonoDomicilio`.**
`decisiones_alcance.md` §5 (AddressPhone) dice que `cbexAPP_MOBILE_TEL_NA` va
"fijo marcado", y concluye textualmente que "el teléfono de domicilio queda
capturado en el modelo de datos pero nunca se manda".
`variables_nuevas.md` §8 dice lo contrario: desde la v2.3 ese checkbox va
desmarcado y "el generador debe entregarla siempre". **Verifiqué el mapeo: gana
`variables_nuevas.md`** — en `mapeo_ds160.json` v2.3, `cbexAPP_MOBILE_TEL_NA`
tiene `"valor": false`. Lo señalo porque `decisiones_alcance.md` quedó desactualizado
en ese punto y puede confundir en el futuro. No cambia lo que voy a hacer:
`telefonoDomicilio` se emite siempre.

**Riesgo 2 — El campo "Explain / Specify Other" de ocupación no está en el
mapeo.** El catálogo de ocupación documenta que si `categoriaOcupacionActual` es
`O` (OTHER) o `N` (NOT EMPLOYED), el DS-160 muestra
`tbxExplainOtherPresentOccupation`, que es obligatorio. Ese control **no aparece
en `mapeo_ds160.json`** (lo verifiqué: cero coincidencias). La web ofrece "Otros"
y "Desempleado" como opciones, así que este caso va a ocurrir. Con `N` además
desaparecen los 16 campos del bloque de empleador, y con `H` (Ama de casa) y `RT`
(Jubilado) también. Es un hueco del lado del mapeo, no del generador, pero afecta
lo que la web debería preguntar.

**Riesgo 3 — La conversión de `estadoCivil` no es 1 a 1.** La web ofrece 5
opciones (`soltero`, `casado`, `divorciado`, `viudo`, `union_libre`). El DS-160
tiene más (incluye "legalmente separado" y "unión civil / pareja de hecho"), y el
catálogo no está volcado, así que no sé a qué `value` corresponde `union_libre`.
Además `ddlAPP_MARITAL_STATUS` dispara postback y decide si aparece la pantalla
`Spouse` entera.

**Riesgo 4 — La web y el DS-160 discrepan en el catálogo de tipo de visa.** Ya
detallado en §2.2: 4 opciones que la web ofrece no existen en el DS-160 (`BCC`,
`E3`, `E3R`, `TN`) y 5 del DS-160 no están en la web. Si un cliente ya llenó el
formulario eligiendo `BCC`, ese dato no tiene destino. Solo importa si tenés
formularios ya enviados que quieras reprocesar.

**Riesgo 5 — `normalizarValor` va a romper el JSON si se reutiliza tal cual.**
La función actual convierte `'si'`→`'Si'`, aplica `humanizarTexto`
(`union_libre`→`Union Libre`) y colapsa objetos a `''`. Para el JSON hay que
escribir una ruta de serialización nueva y dejar `normalizarValor` intacta para
cuando reactives el PDF. No es difícil, pero es el punto donde un descuido
produce un JSON que la app acepta y llena mal.

**Riesgo 6 — Los `select` con `disparaPostback` y valor ausente.** La regla 3 dice
que si un dato no aplica se omite la clave. Correcto. Pero en los 9 catálogos
faltantes el efecto es que 16 variables se omiten **siempre**, y varias de ellas
(`estadoCivil`, `pagadorViaje`, `tipoDocumentoPasaporte`, `relacionContactoEEUU`)
disparan postback. El DS-160 quedará en el placeholder de esos campos, lo cual es
correcto según el contrato, pero significa que el operador tiene trabajo manual
en cada formulario hasta que se vuelquen esos catálogos.

**Riesgo 7 — Cambiar `Code.gs` sin desplegarlo.** El script del repo es una copia
manual. Si cambio `Code.gs` y vos no lo pegás en el editor de Apps Script, el
formulario sigue produciendo PDF y ningún JSON, sin ningún error visible: la web
recibe `{success:true, pdfUrl:...}` igual. Conviene que la nueva versión devuelva
también un campo nuevo (por ejemplo `jsonUrl`) para que se note de inmediato si
el despliegue no se hizo.

---

## Resumen en una línea por sección

- **Inventario:** 136 claves planas + 3 arrays → 186 nombres; 13 claves no tienen
  control en pantalla y siempre llegan vacías.
- **Correspondencia:** 157 de 186 coinciden literalmente; la migración es de
  contenido, no de nombres.
- **Faltan:** 39 variables nuevas (2 Personal1, 11 Travel, 1 AddressPhone,
  7 PptVisa, 7 USContact, 11 WorkEducation3) + 5 con nombre correcto pero sin
  interfaz.
- **Sobran:** 5 eliminadas por decisión, 2 sin equivalente, 3 reemplazadas por
  slots numerados.
- **Catálogos:** 10 disponibles, **9 faltantes** (no 2). Recomiendo vivan solo en
  la web, generados desde `docs/` por un script, e importados estáticamente.
