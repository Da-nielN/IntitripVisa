# Catálogo — Parentesco del familiar inmediato en EE. UU. (`ddlUS_REL_TYPE`)

**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_dlUSRelatives_ctl0N_ddlUS_REL_TYPE`
— pantalla `Relatives`. Mapeado en `mapeo_ds160_1.json` a la variable
`familiarInmediato1Relacion`.

**Condición para verlo:** `rblUS_IMMED_RELATIVE_IND = Y` (dispara postback).
Solo existe la fila `ctl00`; las filas `ctl01…` requieren "Add Another" y
usan el mismo catálogo.

5 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.

```
|- SELECT ONE -|(sin seleccionar)
S|SPOUSE|Cónyuge
F|FIANCÉ/FIANCÉE|Prometido/Prometida
C|CHILD|Hijo/Hija
B|SIBLING|Hermano/Hermana
```

**Ojo:** este catálogo es de "familiares inmediatos" y por eso **no incluye
PARENT** — padre y madre tienen sus propios campos en la misma pantalla. No
confundir sus `value` con los de `ddlTCRelationship` ni `ddlPayerRelationship`
(allí `F` = FRIEND, aquí `F` = FIANCÉ; allí `B` = BUSINESS ASSOCIATE, aquí
`B` = SIBLING).
