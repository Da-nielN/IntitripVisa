# Catálogo — Relación con quien paga el viaje (`ddlPayerRelationship`)

**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_ddlPayerRelationship` —
pantalla `Travel`. Mapeado en `mapeo_ds160_1.json` a la variable
`relacionPagador`.

**Solo existe en el DOM si `ddlWhoIsPaying = O` (Other Person).** Hay que
poner el select padre en `O`, esperar el postback y recién entonces leerlo.

7 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.

```
|- SELECT ONE -|(sin seleccionar)
C|CHILD|Hijo/Hija
P|PARENT|Padre/Madre
S|SPOUSE|Cónyuge
R|OTHER RELATIVE|Otro familiar
F|FRIEND|Amigo/Amiga
O|OTHER|Otro
```

**Ojo:** no confundir con `ddlTCRelationship` (relación con el acompañante de
viaje, 8 opciones) ni con `ddlUS_POC_REL_TO_APP` (relación con el contacto en
EE. UU., 8 opciones). Los tres catálogos comparten letras con significados
distintos. Aquí los `value` coinciden con los de `ddlTCRelationship`
(C=CHILD, P=PARENT, S=SPOUSE, R, F, O) pero **falta** `B|BUSINESS ASSOCIATE`,
que sí está en el de acompañantes.
