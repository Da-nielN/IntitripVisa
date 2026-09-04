# Decisiones de alcance — Asistente de llenado DS-160
 
Resultado de la sesión de decisiones sobre la sección 13 de `plan_asistente_formularios_v5.md`. Cubre 13.1, 13.2, 13.3 y valores por defecto. Fuente: `inventario_ds160_parcial.md`, `mapeo_ds160.json` (v2.1) y los `claude_relevamiento_<Pantalla>.md`.
 
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
| Travel | `dtlTravelLoc_ctl00_tbxSPECTRAVEL_LOCATION` (+ "Add Another" por lugar) | `lugaresPlaneadosEEUU` | Página web | Repetidor; corregir tipo a `texto` (40 car.) en el mapeo, no `textarea` |
| AddressPhone | `dtlSocial_ctl00_ddlSocialMedia` | — | Valor fijo | `"FACEBOOK"` |
| AddressPhone | `dtlSocial_ctl00_tbxSocialMediaIdent` | `facebook` | Página web | |
| AddressPhone | `dtlSocial_ctl01_ddlSocialMedia` | — | Valor fijo | `"INSTAGRAM"` |
| AddressPhone | `dtlSocial_ctl01_tbxSocialMediaIdent` | `instagram` | Página web | |
| AddressPhone | `dtlSocial_ctl02_ddlSocialMedia` | — | Valor fijo | `"LINKEDIN"` |
| AddressPhone | `dtlSocial_ctl02_tbxSocialMediaIdent` | `linkedin` | Página web | |
| AddressPhone | `dtlSocial_ctl03_ddlSocialMedia` | — | Manual | Plataforma variable, sin catálogo fijo aplicable |
| AddressPhone | `dtlSocial_ctl03_tbxSocialMediaIdent` | `otrasRedesSociales` | Página web | |
| AddressPhone | — (operación) | — | — | La app presiona "Add Another" x3 antes de llenar `ctl01`–`ctl03` |
 
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
 
### Spouse
 
| `id` | Decisión | Valor |
|---|---|---|
| `cbexSPOUSE_POB_CITY_NA` | Valor fijo | Marcado |
 
### WorkEducation1
 
| `id` | Decisión | Valor |
|---|---|---|
| `cbxWORK_EDUC_ADDR_STATE_NA` | Valor fijo | Desmarcado |
| `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` | Valor fijo | Marcado |
| `cbxCURR_MONTHLY_SALARY_NA` | Valor fijo | Desmarcado |
 
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
- **Corrección de tipo de campo:** `dtlTravelLoc_ctl00_tbxSPECTRAVEL_LOCATION` está tipado como `textarea` en `mapeo_ds160.json`; el DS-160 real lo tiene como `texto` (40 caracteres). Corregir junto con el resto del trabajo de mapeo de la sección 13.4.
- **Diferencia de catálogo:** `ddlSpouseNatDropDownList` y `ddlMILITARY_SVC_CNTRY` tienen 213 opciones frente a las 212 de `ddlAPP_NATL`. No se diffeó la opción extra — no bloquea ninguna decisión de esta sesión.