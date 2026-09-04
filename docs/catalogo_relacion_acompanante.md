# Catálogo — Relación con el acompañante de viaje (`ddlTCRelationship`)
 
**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_dlTravelCompanions_ctl0N_ddlTCRelationship`
(uno por cada slot del repetidor `ctl00`–`ctl04`) — pantalla
`TravelCompanions`. Mapeado en `mapeo_ds160_1.json` a las variables
`acompananteViajeNRelacion`.
 
8 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.
 
```
|- SELECT ONE -|(sin seleccionar)
P|PARENT|Padre/Madre
S|SPOUSE|Cónyuge
C|CHILD|Hijo/Hija
R|OTHER RELATIVE|Otro familiar
F|FRIEND|Amigo/Amiga
B|BUSINESS ASSOCIATE|Socio/Asociado de negocios
O|OTHER|Otro
```