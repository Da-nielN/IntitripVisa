# Catálogo — Estatus migratorio en EE. UU. (`C5_SC`)

**Campos que lo usan** (los tres comparten exactamente el mismo catálogo,
verificado opción por opción):

| id completo | Pantalla | Variable del mapeo |
|---|---|---|
| `ctl00_SiteContentPlaceHolder_FormView1_ddlFATHER_US_STATUS` | `Relatives` | `estatusPadreEEUU` |
| `ctl00_SiteContentPlaceHolder_FormView1_ddlMOTHER_US_STATUS` | `Relatives` | `estatusMadreEEUU` |
| `ctl00_SiteContentPlaceHolder_FormView1_dlUSRelatives_ctl0N_ddlUS_REL_STATUS` | `Relatives` | `familiarInmediato1Estatus` |

**Condición para verlos:** cada uno depende de su radio.
`ddlFATHER_US_STATUS` requiere `rblFATHER_LIVE_IN_US_IND = Y`;
`ddlMOTHER_US_STATUS`, `rblMOTHER_LIVE_IN_US_IND = Y`;
`ddlUS_REL_STATUS`, `rblUS_IMMED_RELATIVE_IND = Y`. Los tres radios disparan
postback real. En el repetidor `dlUSRelatives` solo existe `ctl00`; las filas
`ctl01…` requieren "Add Another" y usan el mismo catálogo.

5 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.

```
|- SELECT ONE -|(sin seleccionar)
S|U.S. CITIZEN|Ciudadano estadounidense
C|U.S. LEGAL PERMANENT RESIDENT (LPR)|Residente permanente legal de EE. UU.
P|NONIMMIGRANT|No inmigrante
O|OTHER/I DON'T KNOW|Otro / No sé
```
