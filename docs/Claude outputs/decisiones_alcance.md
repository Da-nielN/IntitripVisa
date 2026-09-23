# Decisiones de alcance — Asistente de llenado DS-160
 
Resultado de la sesión de decisiones sobre la sección 13 de `plan_asistente_formularios_v5.md`. Cubre 13.1, 13.2, 13.3 y valores por defecto. Fuente: `inventario_ds160_parcial.md`, `mapeo_ds160.json` y los `relevamiento_<Pantalla>.md`.
 
**Estado al 2026-09-08:** revisado contra el mapeo **v2.6**. Lo que cambió después de la sesión
original va marcado como *(actualizado v2.4 / v2.5 / v2.6)*. Los dos puntos que Illari y la
página web habían resuelto de forma distinta **ya están decididos** — ver §16 del plan. El resto
de este documento sigue vigente tal cual.
 
**Decisión = una de tres:** `página web` (la genera tu web y la trae la app), `manual` (el usuario la completa a mano en el DS-160), `valor fijo` (la app la llena siempre con el mismo valor, sin variable).
 
---
 
## 1. Variables eliminadas del modelo (sección 13.2)
 
| Pantalla | Variable | Motivo |
|---|---|---|
| PptVisa | `tieneVisaActiva` | Sin control en las 18 pantallas |
| PptVisa | `paisVisa` | Sin control en las 18 pantallas |
| PptVisa | `fechaEmisionVisa` | Sin control en las 18 pantallas |
| TravelCompanions | `cantidadViajeros` | Sin `id` directo; se deduce de cuántos acompañantes se carguen |
| TravelCompanions | `relacionViaje` | Sin `id` directo; cada acompañante ya tiene su propia relación |
 
## 2. Variable reubicada
 
| Pantalla | `id` | Variable | Decisión | Nota |
|---|---|---|---|---|
| WorkEducation1 | `tbxDescribeDuties` | `cargoActual` | Página web | Se vuelca dentro del texto de `descripcionTrabajoActual` (mismo campo), no tiene control propio |
 
---
 
## 3. Casos estructurales (sección 13.3)
 
| Pantalla | `id` | Variable | Decisión | Nota |
|---|---|---|---|---|
| WorkEducation3 | `rblCOUNTRIES_VISITED_IND` | `historialViajes` (indicador) | Página web | Derivado: "Y" si la lista de países no está vacía |
| WorkEducation3 | `dtlCountriesVisited_ctl00_ddlCOUNTRIES_VISITED` (+ "Add Another" por país) | `historialViajes` (lista países) | Página web | Repetidor; catálogo de 253 |
| WorkEducation3 | `dtlLANGUAGES_ctl00_tbxLANGUAGE_NAME` (+ "Add Another" por idioma) | `idiomas` | Página web | Repetidor; incondicional |
| Travel | `dtlTravelLoc_ctl00_tbxSPECTRAVEL_LOCATION` (+ "Add Another" por lugar) | `lugaresPlaneadosEEUU` | Página web | Repetidor de 5 slots (`lugarPlaneadoEEUU1..5`); el tipo `texto` (40 car.) **ya está corregido** en el mapeo |
| AddressPhone | `dtlSocial_ctl00_ddlSocialMedia` | — | Valor fijo | `"FACEBOOK"` |
| AddressPhone | `dtlSocial_ctl00_tbxSocialMediaIdent` | `facebook` | Página web | |
| AddressPhone | `dtlSocial_ctl01_ddlSocialMedia` | — | Valor fijo | `"INSTAGRAM"` |
| AddressPhone | `dtlSocial_ctl01_tbxSocialMediaIdent` | `instagram` | Página web | |
| AddressPhone | `dtlSocial_ctl02_ddlSocialMedia` | — | Valor fijo | `"LINKEDIN"` |
| AddressPhone | `dtlSocial_ctl02_tbxSocialMediaIdent` | `linkedin` | Página web | |
| AddressPhone | `dtlSocial_ctl03_ddlSocialMedia` | — | Manual | Plataforma variable, sin catálogo fijo aplicable |
| AddressPhone | `dtlSocial_ctl03_tbxSocialMediaIdent` | — | **Manual** *(actualizado v2.4)* | `otrasRedesSociales` salió del modelo: la cuarta red la carga entera el operador |
| AddressPhone | — (operación) | — | — | *(actualizado v2.5)* Las pulsaciones de "Add Another" **ya no son tres fijas**: hay que contar las filas que ya existen antes de pulsar, y pulsar el botón de la última fila (§9 del plan) |
 
---
 
## 4. Valores por defecto
 
### 4.1. Radios Sí/No — Security and Background (29 campos nuevos, valor fijo `"N"`)
 
| Pantalla | `id` |
|---|---|
| SecurityandBackground1 | `rblDisorder`, `rblDruguser` |
| SecurityandBackground2 | `rblArrested`, `rblControlledSubstances`, `rblProstitution`, `rblMoneyLaundering`, `rblHumanTrafficking`, `rblAssistedSevereTrafficking`, `rblHumanTraffickingRelated` |
| SecurityandBackground3 | `rblIllegalActivity`, `rblTerroristActivity`, `rblTerroristSupport`, `rblTerroristOrg`, `rblTerroristRel`, `rblGenocide`, `rblTorture`, `rblExViolence`, `rblChildSoldier`, `rblReligiousFreedom`, `rblPopulationControls`, `rblTransplant` |
| SecurityandBackground4 | `rblRemovalHearing`, `rblImmigrationFraud`, `rblFailToAttend`, `rblVisaViolation` |
| SecurityandBackground5 | `rblChildCustody`, `rblVotingViolation`, `rblRenounceExp`, `rblAttWoReimb` |
 
Sus `textarea` de explicación (`tbx<Nombre>` / `tbxDeport_EXPL`) quedan **manual** — nunca se llenan salvo caso excepcional real.
 
`rblDisease` (SecurityandBackground1) y `rblDeport` (SecurityandBackground4) **se mantienen como variable de página web** (`enfermedadContagiosa`, `deportadoDePais`), sin cambios — ya estaban mapeados así antes de esta sesión.
 
### 4.2. Otros radios con valor fijo
 
| Pantalla | `id` | Valor |
|---|---|---|
| TravelCompanions | `rblGroupTravel` | `"N"` |
| AddressPhone | `rblMailingAddrSame` | `"Y"` |
| AddressPhone | `rblAddSocial` | `"N"` |
| WorkEducation3 | `rblCLAN_TRIBE_IND` | `"N"` |
| WorkEducation3 | `rblMILITARY_SERVICE_IND` | `"N"` |
| WorkEducation3 | `rblINSURGENT_ORG_IND` | `"N"` |
| WorkEducation3 | `rblSPECIALIZED_SKILLS_IND` | `"N"` |
| WorkEducation3 | `rblORGANIZATION_IND` | `"N"` |
 
### 4.3. Selects con valor fijo
 
| Pantalla | `id` | Valor |
|---|---|---|
| Spouse | `ddlSpouseAddressType` | `"H"` (igual que la del solicitante) |
 
### 4.4. Campos consecuentemente inalcanzables (no requieren variable ni control)
 
| Pantalla | `id` | Motivo |
|---|---|---|
| TravelCompanions | `tbxGroupName` | `rblGroupTravel` fijo `"N"` |
| AddressPhone | `tbxMAILING_ADDR_LN1/LN2/CITY/STATE/POSTAL_CD`, `ddlMailCountry`, `cbexMAILING_ADDR_STATE_NA`, `cbexMAILING_ADDR_POSTAL_CD_NA` | `rblMailingAddrSame` fijo `"Y"` |
| Spouse | `tbxSPOUSE_ADDR_LN1/LN2/CITY/STATE/POSTAL_CD`, `ddlSPOUSE_ADDR_CNTRY`, `cbexSPOUSE_ADDR_STATE_NA`, `cbexSPOUSE_ADDR_POSTAL_CD_NA` | `ddlSpouseAddressType` fijo `"H"` |
 
---
 
## 5. Campos del DS-160 sin captar en la plantilla (sección 13.1)
 
### Personal1
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `ddlAPP_POB_CNTRY` | `paisNacimiento` | Página web | — |
| `tbxAPP_POB_CITY` | `ciudadNacimiento` | Página web | — |
| `cbexAPP_POB_ST_PROVINCE_NA` | — | Valor fijo | Marcado |
| `cbexAPP_FULL_NAME_NATIVE_NA` | — | Valor fijo | Marcado |
| `rblOtherNames` | — | Valor fijo | `"N"` |
| `rblTelecodeQuestion` | — | Valor fijo | `"N"` |
 
### Personal2
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `cbexAPP_SSN_NA` | — | Valor fijo | Marcado |
| `cbexAPP_NATIONAL_ID_NA` | — | Valor fijo | Desmarcado |
| `cbexAPP_TAX_ID_NA` | — | Valor fijo | Marcado |
 
### Travel
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `tbxArriveFlight` | — | Valor fijo | Vacío |
| `tbxDepartFlight` | — | Valor fijo | Vacío |
| `tbxStreetAddress2` | — | Valor fijo | Vacío |
| `tbZIPCode` | — | Valor fijo | Vacío |
| `tbxPayerSurname` | `apellidosPagador` | Página web | Condicional: `pagadorViaje = "O"` |
| `tbxPayerGivenName` | `nombresPagador` | Página web | Condicional |
| `tbxPayerPhone` | `telefonoPagador` | Página web | Condicional |
| `tbxPAYER_EMAIL_ADDR` | `correoPagador` | Página web | Condicional |
| `ddlPayerRelationship` | `relacionPagador` | Página web | Condicional |
| `rblPayerAddrSameAsInd` | `direccionPagadorIgualSolicitante` | Página web | Condicional |
 
### AddressPhone
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `tbxAPP_ADDR_LN2` | — | Valor fijo | Vacío |
| `cbexAPP_BUS_TEL_NA` | — | Valor fijo | Marcado |
| `ddlCountry` | `paisDomicilio` | Página web | — |
| `cbexAPP_ADDR_STATE_NA` | — | Valor fijo | Desmarcado |
| `cbexAPP_ADDR_POSTAL_CD_NA` | — | Valor fijo | Marcado |
| `cbexAPP_MOBILE_TEL_NA` | — | Valor fijo | Marcado (ver reasignación de teléfonos abajo) |
 
**Reasignación de teléfonos (corrige la asignación previa a esta sesión):**
 
| `id` | Etiqueta DS-160 | Variable | Decisión |
|---|---|---|---|
| `tbxAPP_HOME_TEL` | Primary Phone Number (obligatorio, sin checkbox) | `celular` | Página web |
| `tbxAPP_MOBILE_TEL` | Secondary Phone Number | `telefonoDomicilio` | Página web, pero `cbexAPP_MOBILE_TEL_NA` va fijo marcado → en la práctica `telefonoDomicilio` nunca se envía al DS-160 |
 
Efecto neto: el único teléfono que llega al formulario es el celular, cargado en el campo "Primary Phone Number". El teléfono de domicilio queda capturado en el modelo de datos pero nunca se manda.
 
> **DECIDIDO el 2026-09-08 — este punto cambió de criterio tres veces y ganó el original.**
> 1. Esta sesión (mapeo v2.1): checkbox **marcado**, `telefonoDomicilio` no se manda.
> 2. Mapeo v2.3 y plan §13.5: checkbox **desmarcado**, la variable pasa a obligatoria.
> 3. Mapeo v2.4 en adelante: checkbox **marcado** otra vez y `tbxAPP_MOBILE_TEL` eliminado del
>    mapeo; `telefonoDomicilio` sale del modelo. **Este es el criterio que queda.**
>
> Con el checkbox marcado el DS-160 deshabilita el campo y no lo exige, así que el cliente no
> tiene que cargarlo en la web. Lo mismo, en paralelo, con `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` y
> `codigoPostalTrabajoActual` (ver WorkEducation1 más abajo). Es reversible: si algún día se
> necesitan, se desmarca el checkbox y se vuelven a agregar las dos variables. Ver §16.2 del
> plan.
 
### PptVisa
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `tbxPPT_NUM` | `numeroPasaporte` | Página web | — |
| `cbexPPT_BOOK_NUM_NA` | — | Valor fijo | Marcado |
| `tbxPPT_ISSUED_IN_STATE` | `provinciaEmisionPasaporte` | Página web | — |
| `ddlPPT_TYPE` | `tipoDocumentoPasaporte` | Página web | — |
| `ddlPPT_ISSUED_CNTRY` | `autoridadEmisoraPasaporte` | Página web | Catálogo de 217 |
| `ddlPPT_ISSUED_IN_CNTRY` | `paisEmisionPasaporte` | Página web | Catálogo de 253 |
| `ddlPPT_ISSUED_DTEDay` / `ddlPPT_ISSUED_DTEMonth` / `tbxPPT_ISSUEDYear` | `fechaEmisionPasaporte` | Página web | Tipo fecha, 3 `id` |
| `ddlPPT_EXPIRE_DTEDay` / `ddlPPT_EXPIRE_DTEMonth` / `tbxPPT_EXPIREYear` | `fechaExpiracionPasaporte` | Página web | Tipo fecha, 3 `id` |
| `cbxPPT_EXPIRE_NA` | — | Manual | — |
| `dtlLostPPT_ctl00_cbxLOST_PPT_NUM_UNKN_IND` | — | Valor fijo | Desmarcado |
 
### USContact
 
| `id` | Variable propuesta | Decisión | Valor |
|---|---|---|---|
| `tbxUS_POC_SURNAME` | `apellidosContactoEEUU` | Página web | — |
| `tbxUS_POC_GIVEN_NAME` | `nombresContactoEEUU` | Página web | — |
| `cbxUS_POC_ORG_NA_IND` | — | Valor fijo | Marcado |
| `tbxUS_POC_ADDR_LN1` | `direccionContactoEEUU` | Página web | — |
| `tbxUS_POC_ADDR_LN2` | — | Valor fijo | Vacío |
| `tbxUS_POC_ADDR_CITY` | `ciudadContactoEEUU` | Página web | — |
| `tbxUS_POC_ADDR_POSTAL_CD` | — | Valor fijo | Vacío |
| `tbxUS_POC_HOME_TEL` | `telefonoContactoEEUU` | Página web | — |
| `cbexUS_POC_EMAIL_ADDR_NA` | — | Valor fijo | Marcado |
| `ddlUS_POC_REL_TO_APP` | `relacionContactoEEUU` | Página web | Catálogo de 8 |
| `ddlUS_POC_ADDR_STATE` | `estadoContactoEEUU` | Página web | Catálogo de 57 |
| `cbxUS_POC_NAME_NA` | — | Valor fijo | Desmarcado |
 
### Relatives
 
| `id` | Decisión | Valor |
|---|---|---|
| `cbxFATHER_SURNAME_UNK_IND` | Valor fijo | Desmarcado |
| `cbxFATHER_GIVEN_NAME_UNK_IND` | Valor fijo | Desmarcado |
| `cbxFATHER_DOB_UNK_IND` | Valor fijo | Desmarcado |
| `cbxMOTHER_SURNAME_UNK_IND` | Valor fijo | Desmarcado |
| `cbxMOTHER_GIVEN_NAME_UNK_IND` | Valor fijo | Desmarcado |
| `cbxMOTHER_DOB_UNK_IND` | Valor fijo | Desmarcado |
 
*(actualizado v2.4)* El repetidor `dlUSRelatives` declara ahora los cuatro slots
`ctl01`–`ctl04`, cada uno con sus cuatro controles y con `catalogo` en los dos selects: 16 `id`
nuevos. `familiarInmediato2..5` salieron de `pendientes`. Era el único repetidor de 5 filas que
declaraba solo `ctl00`, y la app busca los `id` literalmente.
 
### Spouse
 
| `id` | Decisión | Valor |
|---|---|---|
| `cbexSPOUSE_POB_CITY_NA` | Valor fijo | Marcado |
 
### WorkEducation1
 
| `id` | Decisión | Valor |
|---|---|---|
| `cbxWORK_EDUC_ADDR_STATE_NA` | Valor fijo | Desmarcado |
| `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` | Valor fijo | Marcado — decidido, ver §16.2 del plan |
| `cbxCURR_MONTHLY_SALARY_NA` | Valor fijo | Desmarcado → `sueldoActual` es obligatoria |
 
### WorkEducation2
 
| `id` | Decisión | Valor |
|---|---|---|
| `dtlPrevEmpl_ctl00_cbxPREV_EMPL_ADDR_STATE_NA` | Valor fijo | Marcado |
| `dtlPrevEmpl_ctl00_cbxPREV_EMPL_ADDR_POSTAL_CD_NA` | Valor fijo | Marcado |
| `dtlPrevEmpl_ctl00_cbxSupervisorSurname_NA` | Valor fijo | Marcado |
| `dtlPrevEmpl_ctl00_cbxSupervisorGivenName_NA` | Valor fijo | Marcado |
| `dtlPrevEduc_ctl00_cbxEDUC_INST_ADDR_STATE_NA` | Valor fijo | Marcado |
| `dtlPrevEduc_ctl00_cbxEDUC_INST_POSTAL_CD_NA` | Valor fijo | Marcado |
 
---
 
## 6. Pendientes técnicos (no son decisiones de negocio)
 
Quedan fuera del alcance de este documento porque son trabajo de relevamiento, no de negocio:
 
- **Repetidor de "otros nombres" (`rblOtherNames = Y`) y bloque de telecode (`rblTelecodeQuestion = Y`):** el relevamiento no detalló los `id` de estos condicionales. Con el valor fijo `"N"` de ambos, no bloquea el MVP.
- **Bloque de dirección del pagador cuando `rblPayerAddrSameAsInd = N`:** no se relevaron los `id` de ese sub-bloque. Si el cliente confirma que la dirección del pagador es la misma (caso más común), no afecta; si es distinta, ese caso puntual queda manual hasta relevarlo.
- ~~**Corrección de tipo de campo:** `dtlTravelLoc_ctl00_tbxSPECTRAVEL_LOCATION` tipado como `textarea`.~~ **Resuelto:** el mapeo ya lo declara como `texto` (40 caracteres).
- ~~**Diferencia de catálogo:** `ddlSpouseNatDropDownList` y `ddlMILITARY_SVC_CNTRY` tienen 213 opciones frente a las 212 de `ddlAPP_NATL`.~~ **Resuelto (2026-09-03):** la diferencia es una sola entrada, `USA|UNITED STATES OF AMERICA`, insertada entre `GRBR` y `URU`. Los dos campos usan el mismo catálogo, valor por valor.
- ~~**Catálogos sin volcar:** `ddlPayerRelationship` y `ddlPPT_TYPE`.~~ **Resuelto (2026-09-03):** los 19 catálogos están volcados. El único que queda sin volcar, por baja prioridad, es `ddlSocialMedia` (22 plataformas), y esa cuarta fila va manual.
 
**Requisito nuevo para la página web (mapeo v2.6):** hay que emitir **siempre** las variables
disparadoras de los campos condicionales, aunque la respuesta sea `"N"`. Sin ellas Illari no
puede evaluar la `condicion` y marca los campos como *omitido — sin dato disparador*. La lista
completa está en `variables_nuevas.md` §12.
 
**Requisito nuevo para la página web (Fase 1 de Illari):** las listas de los repetidores deben
llegar **numeradas de corrido, `1..N`, sin huecos** — `lugarPlaneadoEEUU`, `idioma`,
`paisVisitado`, `acompananteViaje`, `familiarInmediato`, `visitaAnteriorEEUU`. Illari agrega
filas hasta el número más alto que trae dato, no hasta la cantidad de datos: si llega solo el
slot 5, las cuatro filas anteriores se crean vacías.