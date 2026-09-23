# Variables nuevas para la página web generadora
 
Derivadas de aplicar `decisiones_alcance.md` sobre `mapeo_ds160.json`.
**Revisado contra el mapeo v2.6 el 2026-09-08.**
Eran **39 variables nuevas** cuando se escribió este documento; el mapeo v2.5 referencia hoy
**209 variables** en total y el fixture `ejemplo_datos_cliente.json` trae 196 (§15 del plan).
 
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
 
## 8.bis. Variables que pasan a ser obligatorias (mapeo v2.3, revisado en v2.5)
 
Al desmarcar los checkboxes "Does Not Apply / Do Not Know" que las bloqueaban, estas variables
ya existentes sí llegan al DS-160 y el formulario las va a exigir. El generador debe
capturarlas siempre:
 
`identificacionFiscalEEUU`, `codigoPostal`, `ciudadNacimientoConyuge`,
`provinciaTrabajoAnterior`, `codigoPostalTrabajoAnterior`, `apellidosSupervisorAnterior`,
`nombreSupervisorAnterior`, `provinciaEducacion`, `codigoPostalEducacion`.
 
De las 11 originales salieron dos: `telefonoDomicilio` y `codigoPostalTrabajoActual`. La v2.4
volvió a marcar sus checkboxes y eliminó sus campos de texto del mapeo, y **así queda**
(decidido el 2026-09-08, §16.2 del plan).
 
Obligatorias decididas después de esa lista: `sueldoActual` (`tbxCURR_MONTHLY_SALARY`, con
`cbxCURR_MONTHLY_SALARY_NA` desmarcado) y `provinciaEmisionPasaporte`
(`tbxPPT_ISSUED_IN_STATE`).
 
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
 
## 12. Variables disparadoras: emitirlas SIEMPRE (mapeo v2.6)
 
Desde la v2.6, 141 campos del mapeo declaran `condicion`: solo existen en una rama del
formulario. Illari evalúa esa condición con el dato del cliente, y **si la variable disparadora
no viene en el JSON no adivina**: marca el campo como *omitido — sin dato disparador*.
 
El generador tiene que emitir estas 34 variables **siempre**, aunque la respuesta sea `"N"` o
la rama no aplique:
 
| Pantalla | Variables |
|---|---|
| Personal1 | `estadoCivil` |
| Personal2 | `nacionalidad`, `tieneOtraNacionalidad`, `esResidentePermanenteExtranjero` |
| Travel | `categoriaMotivoViaje`, `tipoVisa`, `tienePlanesViajeConcretos`, `pagadorViaje`, `direccionPagadorIgualSolicitante` |
| TravelCompanions | `viajaConOtros` |
| PreviousUSTravel | `haVisitadoEEUU`, `haTenidoVisaEEUU`, `mismoTipoVisa`, `mismoPaisResidenciaVisa`, `diezHuellasTomadas`, `licenciaConducirEEUU`, `visaEEUUPerdidaORobada`, `visaEEUUCanceladaORevocada`, `tienePeticionInmigracion`, `visaNegada` |
| AddressPhone | `tuvoTelefonosAnteriores`, `tuvoCorreosAnteriores` |
| PptVisa | `tipoDocumentoPasaporte`, `pasaportePerdidoORobado` |
| USContact | `relacionContactoEEUU` |
| Relatives | `padreEnEEUU`, `madreEnEEUU`, `familiaresInmediatosEnEEUU`, `otrosFamiliaresEnEEUU` |
| WorkEducation1 | `categoriaOcupacionActual` |
| WorkEducation2 | `tuvoTrabajoAnterior`, `asistioInstitucionEducativa` |
| WorkEducation3 | `tieneHistorialViajes` |
| SecurityandBackground1 y 4 | `enfermedadContagiosa`, `deportadoDePais` |
 
Casi todas son preguntas Sí/No que la web ya hace. Lo que hay que garantizar es que **el "no"
viaje como dato** en vez de omitirse del JSON.