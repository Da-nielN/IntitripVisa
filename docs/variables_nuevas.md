# Variables nuevas para la página web generadora
 
Derivadas de aplicar `decisiones_alcance.md` sobre `mapeo_ds160.json`.
**Revisado contra el mapeo v2.14 el 2026-09-24.**
Eran **39 variables nuevas** cuando se escribió este documento; el mapeo v2.13 referencia hoy
**208 variables** en total, sin `pendientes`, y el fixture `ejemplo_datos_cliente.json` trae 205
(§15 del plan). Las tres variables de país de §15.1 todavía **no** están en el mapeo: cuando la
web las emita, serán 211.
 
Recordatorio del formato (sección 4 del plan): texto libre → string; fechas →
`AAAA-MM-DD`; `select` → objeto `{ "texto": "...", "valor": "..." }` con el `value` real del
DS-160; **`radio` → string plano** `"Y"` / `"N"`.
 
> **Decidido el 2026-09-08:** los `radio` van como string plano. `"Y"`/`"N"` ya es el `value` del
> DS-160 y la app no muestra el texto. Illari acepta las dos formas, así que el generador no
> tiene que cambiar nada. Ver §16.1 del plan.
 
---
 
## 1. Personal1
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `ciudadNacimiento` | texto | — | máx. 20 caracteres |
| `paisNacimiento` | select | `catalogo_paises_lugar_nacimiento.md` (281) | no es el mismo catálogo que nacionalidad |
 
## 2. Travel — bloque del pagador
 
> **Congelado (2026-09-24).** La web deja `pagadorViaje` fijo en `"S"` y comenta el select y
> estos 6 campos, sin borrarlos, así que en la práctica **ninguna de estas variables viaja**. El
> motivo no es solo la dirección del pagador: de las cinco opciones del catálogo `quienPaga`, el
> mapeo solo cubre `O`, y `P`, `U` y `C` abren bloques de empresa que no están relevados. Ver
> §15.3 y el punto 6 de §13.6 del plan.
>
> **El fixture máximo sí las emite, a propósito**, con `pagadorViaje = "O"` y
> `direccionPagadorIgualSolicitante = "Y"`: es lo único que ejercita esos 6 campos del mapeo, y se
> queda en la mitad que sí está mapeada. No lo alinees con la web — la divergencia está
> documentada en §15 del plan.
 
Solo se llenan si `pagadorViaje = "O"` (Other Person). Si no, la app las omite.
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `apellidosPagador` | texto | — | |
| `nombresPagador` | texto | — | |
| `telefonoPagador` | texto | — | |
| `correoPagador` | texto | — | |
| `relacionPagador` | select | `catalogo_relacion_pagador.md` (7 entradas, 6 seleccionables) | volcado el 2026-09-03. Ojo: aquí `F` = FRIEND y `R` = OTHER RELATIVE; no es el catálogo de acompañantes |
| `direccionPagadorIgualSolicitante` | radio | `Y` / `N` | si es `N`, el sub-bloque de dirección queda manual (no relevado) |
 
## 3. Travel — lugares que planea visitar (repetidor, 5 slots)
 
Reemplazan a `lugaresPlaneadosEEUU`.
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `lugarPlaneadoEEUU1` … `lugarPlaneadoEEUU5` | texto | — | máx. 40 caracteres cada uno; el 1 es obligatorio, del 2 al 5 opcionales |
 
## 4. AddressPhone
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `paisDomicilio` | select | `catalogo_paises_residencia_permanente.md` (253) | mismo catálogo de 253 que residencia permanente |
 
## 5. PptVisa
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `numeroPasaporte` | texto | — | máx. 20 |
| `provinciaEmisionPasaporte` | texto | — | máx. 25 |
| `tipoDocumentoPasaporte` | select | `catalogo_tipo_documento_pasaporte.md` (6 entradas, 5 seleccionables) | volcado el 2026-09-03; dispara postback |
| `autoridadEmisoraPasaporte` | select | `catalogo_paises_autoridad_pasaporte.md` (217) | no incluye Estados Unidos |
| `paisEmisionPasaporte` | select | `catalogo_paises_residencia_permanente.md` (253) | lugar físico de emisión, distinto del anterior |
| `fechaEmisionPasaporte` | fecha | — | `AAAA-MM-DD` |
| `fechaExpiracionPasaporte` | fecha | — | `AAAA-MM-DD` |
 
## 6. USContact
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `apellidosContactoEEUU` | texto | — | máx. 33 |
| `nombresContactoEEUU` | texto | — | máx. 33 |
| `direccionContactoEEUU` | texto | — | máx. 40 |
| `ciudadContactoEEUU` | texto | — | máx. 20 |
| `estadoContactoEEUU` | select | `catalogo_estados_eeuu.md` (57) | mismo catálogo que el estado de hospedaje |
| `telefonoContactoEEUU` | texto | — | máx. 15 |
| `relacionContactoEEUU` | select | `catalogo_relacion_contacto_eeuu.md` (8) | **no** es el catálogo de acompañantes: aquí `C = FRIEND` y `P = EMPLOYER` |
 
## 7. WorkEducation3
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `tieneHistorialViajes` | radio | `Y` / `N` | derivada: `Y` si hay al menos un país visitado |
| `paisVisitado1` … `paisVisitado5` | select | `catalogo_paises_residencia_permanente.md` (253) | repetidor de 5 slots |
| `idioma1` … `idioma5` | texto | — | máx. 66 cada uno; reemplazan a `idiomas` |
 
---
 
## 8. Variables que cambian de significado (ya existen, revisar el generador)
 
| Variable | Cambio |
|---|---|
| `celular` | pasa al campo "Primary Phone Number" (`tbxAPP_HOME_TEL`). Es el único teléfono que llega al DS-160. |
| `telefonoDomicilio` | **Fuera del modelo, decidido el 2026-09-08.** Su checkbox "no aplica" va marcado y `tbxAPP_MOBILE_TEL` se eliminó del mapeo, así que el DS-160 no lo exige y el generador no tiene que capturarlo. El único teléfono que llega al formulario es `celular`. Ver §16.2 del plan. |
| `cargoActual` | deja de ser variable propia: se concatena con `descripcionTrabajoActual` dentro de `tbxDescribeDuties`. El generador debe seguir capturándola. |
 
## 8.bis. Variables que pasan a ser obligatorias (mapeo v2.3, revisado en v2.7)
 
Al desmarcar los checkboxes "Does Not Apply / Do Not Know" que las bloqueaban, estas variables
ya existentes sí llegan al DS-160 y el formulario las va a exigir. El generador debe
capturarlas siempre:
 
`codigoPostal`, `ciudadNacimientoConyuge`,
`provinciaTrabajoAnterior`, `codigoPostalTrabajoAnterior`, `apellidosSupervisorAnterior`,
`nombreSupervisorAnterior`, `provinciaEducacion`, `codigoPostalEducacion`.
 
De las 11 originales salieron **tres**: `telefonoDomicilio` y `codigoPostalTrabajoActual` en la
v2.4 (decidido el 2026-09-08), y `identificacionFiscalEEUU` en la v2.7 (2026-09-10). En los tres
casos el checkbox "no aplica" vuelve a **marcado** y el campo de texto sale del mapeo, así que el
DS-160 no los exige. Ver §16.2 del plan. Quedan **8** obligatorias por esta vía, las de la lista
de arriba.
 
Obligatorias decididas después de esa lista: `sueldoActual` (`tbxCURR_MONTHLY_SALARY`, con
`cbxCURR_MONTHLY_SALARY_NA` desmarcado) y `provinciaEmisionPasaporte`
(`tbxPPT_ISSUED_IN_STATE`).
 
`identificacionFiscalEEUU` salió de esta lista en el mapeo **v2.7**: en vez de desmarcar
`cbexAPP_TAX_ID_NA` se lo dejó marcado, así que el DS-160 ya no exige el número. Mismo
criterio que la v2.4 con `telefonoDomicilio`. Ver §9.
 
## 9. Variables que salen del modelo
 
Eliminarlas del generador y del JSON de datos:
 
- Sin control en el DS-160 (sesión de decisiones de alcance): `tieneVisaActiva`, `paisVisa`,
  `fechaEmisionVisa`, `cantidadViajeros`, `relacionViaje`.
- Ya no estaban en el código del generador: `direccionConyuge`, `direccionConyugeOtro`.
- Salida en el mapeo **v2.4**: `otrasRedesSociales` — la cuarta red social pasa a manual
  entera, plataforma e identificador.
- Salidas en el mapeo **v2.5**: `institucionBachillerato` (el DS-160 usa un solo repetidor para
  toda la educación: el bachillerato es otra fila del mismo `dtlPrevEduc`) y
  `telefonoEducacion` (el DS-160 no pide teléfono de la institución educativa).
- Salidas también en la v2.4, confirmado el 2026-09-08: `telefonoDomicilio` y
  `codigoPostalTrabajoActual` (sus checkboxes "no aplica" van marcados, §16.2 del plan).
- Salidas en el mapeo **v2.7**: `identificacionFiscalEEUU` y `tieneIdentificacionFiscalEEUU`.
  `cbexAPP_TAX_ID_NA` pasa a marcado y `tbxAPP_TAX_ID` se elimina, así que el DS-160 no pide
  el número de identificación fiscal. La segunda solo existía para decidir si la web mostraba
  el campo de la primera, y con esa baja el mapeo se queda **sin pendientes**.
  Contrapartida aceptada: un cliente que sí tenga tax ID ya no puede declararlo.
 
Reemplazadas por slots numerados: `lugaresPlaneadosEEUU`, `idiomas`, `historialViajes`.
 
## 10. Catálogos: no falta ninguno
 
Los 19 catálogos están volcados desde el 2026-09-03, incluidos los dos que faltaban:
`ddlPayerRelationship` → `catalogo_relacion_pagador.md` y `ddlPPT_TYPE` →
`catalogo_tipo_documento_pasaporte.md`. El único sin volcar, por baja prioridad, es
`ddlSocialMedia` (22 plataformas de redes sociales); esa cuarta fila va manual, así que el
generador no lo necesita.
 
**Ojo con los cuatro catálogos de "relación".** `ddlTCRelationship` (acompañante),
`ddlPayerRelationship` (pagador), `ddlUS_POC_REL_TO_APP` (contacto en EE. UU.) y
`ddlUS_REL_TYPE` (familiar en EE. UU.) usan las mismas letras con significados distintos:
`F` es FRIEND en tres de ellos y FIANCÉ en `ddlUS_REL_TYPE`; `B` es BUSINESS ASSOCIATE en uno
y SIBLING en otro. El generador tiene que elegir el catálogo **por campo**, no por concepto.
 
---
 
## 11. Repetidores: numeración corrida y slots nuevos
 
- **Sin huecos.** Illari agrega filas hasta el número más alto que trae dato, no hasta la
  cantidad de datos: si el JSON manda solo `lugarPlaneadoEEUU5`, la app agrega igual las cuatro
  filas anteriores y quedan vacías. El generador debe compactar cada lista a `1..N`. El techo
  son 5 slots y viene del mapeo.
- **Variables nuevas del mapeo v2.4:** `familiarInmediato2..5` con sus cuatro controles cada
  uno (`Nombres`, `Apellidos`, `Relacion`, `Estatus`) = 16 variables, en
  `dlUSRelatives_ctl01..ctl04`. `Relacion` usa `catalogo_parentesco_familiar_eeuu.md` y
  `Estatus` usa `catalogo_estatus_eeuu.md`.
- Repetidores de 5 slots: `lugarPlaneadoEEUU`, `idioma`, `paisVisitado`, `acompananteViaje`,
  `familiarInmediato`, `visitaAnteriorEEUU`.
 
---
 
## 12. Variables disparadoras: emitirlas SIEMPRE (mapeo v2.6 en adelante)
 
Desde la v2.6, y ya **161 campos** en la v2.14, el mapeo declara `condicion`: esos campos solo
existen en una rama del formulario. Illari evalúa esa condición con el dato del cliente, y **si
la variable disparadora no viene en el JSON no adivina**: marca el campo como *omitido — sin dato
disparador*.
 
Desde la v2.13 la variable disparadora **puede vivir en otra pantalla**: los cuatro radios de
`Security` que dependen de `haVisitadoEEUU` (que es de `PreviousUSTravel`) son el primer caso.
Para el generador no cambia nada —la lista de abajo sigue siendo la misma—, pero explica por qué
`haVisitadoEEUU` aparece en tres pantallas.
 
Son exactamente **25** desde la v2.14, sacadas de las `condicion` que declara el mapeo. El
generador tiene
que emitirlas **siempre**, aunque la respuesta sea `"N"` o la rama no aplique:
 
| Pantalla | Variables disparadoras |
|---|---|
| Personal1 | `estadoCivil` (v2.14) |
| Personal2 | `tieneOtraNacionalidad`, `esResidentePermanenteExtranjero` |
| Travel | `tienePlanesViajeConcretos`, `pagadorViaje` |
| TravelCompanions | `viajaConOtros` |
| PreviousUSTravel | `haVisitadoEEUU`, `haTenidoVisaEEUU`, `licenciaConducirEEUU`, `visaEEUUPerdidaORobada`, `visaEEUUCanceladaORevocada`, `tienePeticionInmigracion`, `visaNegada` |
| AddressPhone | `tuvoTelefonosAnteriores`, `tuvoCorreosAnteriores` |
| PptVisa | `pasaportePerdidoORobado` |
| Relatives | `padreEnEEUU`, `madreEnEEUU`, `familiaresInmediatosEnEEUU` |
| WorkEducation1 | `categoriaOcupacionActual` |
| WorkEducation2 | `tuvoTrabajoAnterior`, `asistioInstitucionEducativa` |
| WorkEducation3 | `tieneHistorialViajes` |
| SecurityandBackground1 | `enfermedadContagiosa` |
| SecurityandBackground4 | `deportadoDePais`, y `haVisitadoEEUU` en tres radios (v2.13) |
| SecurityandBackground5 | `haVisitadoEEUU` en un radio (v2.13) |
| Spouse y DeceasedSpouse | `estadoCivil` en todos sus campos (v2.14) |
 
Todas son preguntas Sí/No o selects que la web ya hace. Lo que hay que garantizar es que **el
"no" viaje como dato** en vez de omitirse del JSON. Emitir de más no molesta: una variable que
ningún campo usa simplemente se ignora.
 
---
 
## 13. Fixtures de ejemplo
 
Un solo cliente no puede cubrir las 208 variables: si es soltero no tiene bloque de cónyuge, si
nunca viajó a EE. UU. no tiene visitas anteriores. Por eso hay **tres** fixtures, regenerados
**el 2026-09-23 contra el mapeo v2.13**, para que cada uno traiga exactamente las variables de las
ramas que ese cliente tomó, ni una más:
 
| Archivo | Variables | Qué ejercita |
|---|---|---|
| `ejemplo_datos_cliente.json` | 205 | Caso máximo: casado, empleado, planes de viaje concretos (rama A), pagador "otra persona", los 5 slots de todos los repetidores, visas previas, pasaporte perdido, familiares en EE. UU., trabajo anterior y educación |
| `ejemplo_cliente_minimo.json` | 89 | Caso mínimo: soltera, primer viaje, **sin** planes concretos (rama B), paga ella misma, todas las ramas condicionales en `N`. Es la prueba de que la app marca *no aplica* en masa sin reportar errores. Desde la v2.14 no trae los 6 datos del cónyuge: es soltera y ninguna de las dos pantallas de cónyuge le aplica |
| `ejemplo_cliente_jubilado.json` | 163 | Jubilada: con `categoriaOcupacionActual = RT` **desaparece todo el bloque de empleador actual**, que es lo único que ejercita `valorExcepto`. Además repetidores parcialmente llenos (2 y 3 de 5 slots) y `DeceasedSpouse`, por el estado civil viudo |
 
Se generan con un script a partir del mapeo, así que cuando el mapeo cambie hay que regenerarlos
en vez de editarlos a mano. Ya pasó una vez: el fixture quedó en 196 variables contra un mapeo de
209 y nadie lo notó hasta que se compararon a mano.
 
**La unión de los tres cubre las 208 variables del mapeo**, y los tres traen las 25 disparadoras.
Los tres pasan `revisar_fixture.py` con **0 hallazgos**.
 
**Desde el 2026-09-23 los tres emiten exactamente lo que debe emitir la página web:** sin tildes,
sin barras, sin puntos fuera de los correos, respetando el `maxlength` de cada campo y con las dos
reglas de consistencia de §14.
 
> **Resultado (2026-09-14): el DS-160 rechaza los acentos.** Al guardar `Personal1` respondió
> *"Surnames is invalid. Valid characters include A-Z and single spaces in between names."* La web
> ya normaliza todo el texto antes de emitir el JSON (sin tildes, `ñ` → `N`), así que con datos
> reales no pasa. Queda anotado en §4 y §16.5 del plan. Hasta el 2026-09-23 los fixtures llevaban
> `Villacís`, `Peñafiel` y `logística` a propósito para probarlo; desde la regeneración están
> normalizados y ya representan lo que emite la web.
 
---
 
## 14. Reglas de contenido que la web debe cumplir (prueba real del 2026-09-22)
 
La prueba completa de las 18 pantallas con el fixture máximo dejó cuatro reglas. Las cuatro son
de la página web: Illari escribe el valor tal cual llega y no corrige nada.
 
| Regla | Por qué | Qué pasa si no se cumple |
|---|---|---|
| **Solo letras sin tildes, números, espacios y guiones** en nombres, apellidos y nombres de empresa | El DS-160 valida carácter por carácter | Rechaza la pantalla al guardar: *"…is invalid. Valid characters include A-Z…"* |
| **Sin puntos en nombres de empresa** (`S.A.` → `SA`) | Misma validación | *"Present Employer or School Name is invalid"* |
| **Sin barras en las explicaciones** (`B1/B2` → `B1 B2`) | Misma validación | *"…is invalid"* |
| **Respetar el `maxlength` de cada campo** (las direcciones son de 40) | El DS-160 **no** lo valida | **Rompe la sesión**: responde "Application Error" y hay que recuperar la solicitud con el Application ID |
 
El `maxlength` es el más serio: no da un mensaje de error, tira la sesión entera. Illari ahora
lo comprueba antes de escribir y marca el campo como advertencia, pero la web no debería llegar
a mandarlo.
 
**Dos reglas de consistencia entre campos** (2026-09-23, salieron con el fixture jubilado). El
DS-160 las valida y frena el guardado:
 
| Regla | Mensaje del DS-160 |
|---|---|
| El parentesco de un familiar en EE. UU. no puede ser "cónyuge" si el estado civil no lo admite (por ejemplo, viudo) | *"Marital status selected on Personal Information 1 page should match selection made for 'Relationship to You.'"* |
| No se puede repetir un país en la lista de países visitados | *"The country listed has already been selected."* |
 
Se pueden comprobar antes de abrir el DS-160 con `python tools/revisar_fixture.py <archivo.json>`
del repositorio de Illari, junto con el resto de la coherencia contra el mapeo.
 
---
 
## 15. PENDIENTE en la página web
 
Lista de lo que le falta a la página web, salida de las tres pruebas reales del DS-160
(2026-09-22 y 2026-09-23). Cada punto dice **qué agregar y dónde**.
 
### 15.1. Tres variables de país
 
El DS-160 exige tres `select` de país que hoy **no están en el mapeo** porque no tienen variable.
Durante las pruebas se completaron a mano; mientras no existan, el formulario no deja guardar esas
dos pantallas (salvo `WorkEducation1` en la rama de estudiante, que no lo pidió).
 
| Variable propuesta | Pantalla | Control del DS-160 | Qué país es |
|---|---|---|---|
| `paisTrabajoActual` | WorkEducation1 | `ddlEmpSchCountry` | Del empleador o institución actual |
| `paisTrabajoAnterior` | WorkEducation2 | `dtlPrevEmpl_ctl00_DropDownList2` | Del empleador anterior |
| `paisEducacion` | WorkEducation2 | `dtlPrevEduc_ctl00_ddlSchoolCountry` | De la institución educativa |
 
- **Catálogo: `catalogo_paises_residencia_permanente.md`**, el mismo que ya usan `ddlCountry` y
  los demás países de residencia. 253 opciones; Ecuador es `ECUA`. **No hay que volcar nada
  nuevo.**
- Cada una acompaña a un bloque que la web ya pide (dirección del trabajo actual, del trabajo
  anterior y de la institución educativa), así que el campo va al lado de esa dirección.
- `paisTrabajoAnterior` y `paisEducacion` solo se emiten si el cliente declaró trabajo anterior
  o estudios (`tuvoTrabajoAnterior` / `asistioInstitucionEducativa` en `Y`).
- **Por qué no se resolvieron con un valor fijo "Ecuador":** si el valor fijo estuviera
  equivocado —alguien que estudió o trabajó afuera— el DS-160 **no lo detecta**, y quedaría un
  dato falso en la solicitud. Un campo vacío, en cambio, frena al guardar y se ve.
 
**Dónde agregarlo en el formulario web:**
 
| Variable | Paso del formulario | Ubicación exacta | Cuándo se emite |
|---|---|---|---|
| `paisTrabajoActual` | Trabajo / estudio actual | Debajo de la dirección del empleador o institución, junto a ciudad y provincia | Siempre que el bloque exista, es decir con `categoriaOcupacionActual` fuera de `H`, `RT` y `N` |
| `paisTrabajoAnterior` | Trabajo anterior | Debajo de la dirección del empleador anterior | Solo con `tuvoTrabajoAnterior = "Y"` |
| `paisEducacion` | Educación | Debajo de la dirección de la institución educativa | Solo con `asistioInstitucionEducativa = "Y"` |
 
Las tres son un `select` con el mismo catálogo, `catalogo_paises_residencia_permanente.md`, y
viajan como objeto `{texto, valor}` igual que los demás países. Por defecto conviene dejar
**Ecuador (`ECUA`)** preseleccionado, que es el caso habitual, pero el cliente debe poder
cambiarlo.
 
Cuando las tres existan, se agregan al mapeo como campos normales con `variable`.
 
### 15.2. Pedir los datos del cónyuge también con estado civil "viudo"
 
Con `estadoCivil = W`, el DS-160 muestra una pantalla propia, **Deceased Spouse**, que pide los
**mismos datos que la del cónyuge**: nombres, apellidos, fecha de nacimiento, nacionalidad, y
ciudad y país de nacimiento. El mapeo ya la cubre (v2.13) reutilizando las variables
`nombresConyuge`, `apellidosConyuge`, `fechaNacimientoConyuge`, `nacionalidadConyuge`,
`ciudadNacimientoConyuge` y `paisNacimientoConyuge`.
 
**Qué hacer en la web:** hoy esos campos solo aparecen cuando el cliente elige "casado". Deben
aparecer **también con "viudo"**, con las mismas variables. Si no, la solicitud de un cliente
viudo llega sin esos datos y la pantalla queda vacía.
 
### 15.3. El pagador queda fijo en el propio solicitante
 
**Decisión del 2026-09-24:** la web deja **`pagadorViaje = "S"`** fijo y **comenta** el select y
los 6 campos que dependen de él, sin borrarlos.
 
**Por qué, con el detalle que salió al revisar el generador.** La web sí emite `pagadorViaje` como
`{texto, valor}` y ofrece las cinco opciones del catálogo `quienPaga`, pero despliega campos
**solo con `O`**. El mapeo cubre exactamente esa rama:
 
| Opción | La web despliega | El DS-160 pide | Estado |
|---|---|---|---|
| `S` — Yo mismo | nada | nada | cubierto |
| `O` — Otra persona | los 6 campos | esos 6, más dirección si `direccionPagadorIgualSolicitante = "N"` | mapeado a medias |
| `P` — Empleador actual | **nada** | nombre y dirección de la empresa | **sin mapear** |
| `U` — Empleador en EE. UU. | **nada** | ídem | **sin mapear** |
| `C` — Otra empresa | **nada** | ídem | **sin mapear** |
 
O sea que hoy `P`, `U` y `C` son trampas: el cliente las puede elegir, la web no pide nada, y la
solicitud llega al DS-160 sin datos que el formulario exige. Fijarlo en `"S"` cierra las cuatro
ramas de golpe.
 
**Qué hacer en la web:** dejar `pagadorViaje` fijo en `"S"` y comentar el select y los 6 campos
condicionales. Seguir emitiendo la variable: es disparadora, y si no viaja Illari no puede evaluar
la condición de esos 6 campos.
 
**Para rehabilitarlo** hay que relevar y mapear antes: el bloque de dirección del pagador de `O`
(`tbxPayerStreetAddress1` y siguientes) y los bloques de empresa de `P`, `U` y `C`, con sus
variables nuevas.
 
### 15.4. Emitir siempre la dirección de hospedaje en EE. UU.
 
`direccionHospedajeEEUU`, `ciudadHospedajeEEUU` y `estadoHospedajeEEUU` se emitían solo con
`tienePlanesViajeConcretos = "Y"`. **El DS-160 las exige igual en la otra rama**, así que la web
tiene que pedirlas siempre (mapeo v2.11).
 
---
 
### 15.5. Dos validaciones que el DS-160 hace y la web debería hacer antes
 
Las dos frenaron el guardado durante las pruebas y conviene resolverlas en el formulario, que es
donde el cliente carga los datos:
 
- **Sin países repetidos** en la lista de países visitados.
- **El parentesco de un familiar en EE. UU. tiene que ser coherente con el estado civil**: no se
  puede declarar un "cónyuge" si el estado civil es soltero, viudo o divorciado. Lo más simple es
  filtrar las opciones de parentesco según el estado civil elegido.
 
### 15.6. Los datos del cónyuge: solo con casado o viudo
 
Desde el mapeo **v2.14**, `Spouse` y `DeceasedSpouse` declaran condición sobre `estadoCivil`:
`Spouse` aplica con todo menos soltero y viudo, `DeceasedSpouse` solo con viudo. Para la web eso
significa dos cosas:
 
- **Pedir los 6 datos del cónyuge con "casado" y con "viudo"** (§15.2), y **no** con soltero.
- **Emitir siempre `estadoCivil`**, que desde la v2.14 es variable disparadora. Ya lo era de hecho
  —es un `select` que la web siempre manda—, pero ahora además gobierna 15 campos.
 
Los tres fixtures **ya se regeneraron** contra el mapeo v2.13 (2026-09-23) con esas dos reglas
aplicadas y con la dirección de hospedaje del punto 15.4. El generador de la página web debería
aplicar las mismas.
 
---
 
---
 
**Una aclaración sobre `esResidentePermanenteExtranjero`** (decisión del 2026-09-23: **el valor
por defecto es `"N"`**, y solo se cambia si el cliente declara residencia permanente en otro
país)**:** no es dónde vive el cliente. El
DS-160 pregunta si es residente permanente de un país **distinto del de su nacionalidad** (por
ejemplo, un ecuatoriano con residencia en España). Un cliente ecuatoriano que vive en Ecuador
responde `"N"`, y entonces `paisResidenciaPermanente` no se emite. Además, el DS-160 **no acepta
el mismo país** en "otra nacionalidad" y en "residencia permanente": responde *"…has already been
(entered or selected)"*.