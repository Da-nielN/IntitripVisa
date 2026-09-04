# Catálogo — Relación con el contacto en EE. UU. (`ddlUS_POC_REL_TO_APP`)
 
**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_ddlUS_POC_REL_TO_APP`
— pantalla `USContact`, etiqueta "Relationship to You".
 
Sin variable en `mapeo_ds160_1.json`: la pantalla `USContact` está declarada
con `"campos": []`. Este catálogo alimentaría la variable de relación del
grupo `USContact` cuando se cree.
 
8 opciones (incluye el placeholder). Dispara postback.
Formato: `value|texto en inglés (DS-160)|traducción al español`.
 
```
|- SELECT ONE -|(sin seleccionar)
R|RELATIVE|Familiar
S|SPOUSE|Cónyuge
C|FRIEND|Amigo/Amiga
B|BUSINESS ASSOCIATE|Socio/Asociado de negocios
P|EMPLOYER|Empleador
H|SCHOOL OFFICIAL|Autoridad o funcionario de la institución educativa
O|OTHER|Otro
```
 
**Ojo con los `value`:** no siguen la inicial del texto en inglés.
`C` es FRIEND (no CHILD), `P` es EMPLOYER (no PARENT) y `H` es SCHOOL
OFFICIAL. Es un catálogo distinto de `ddlTCRelationship`
(`catalogo_relacion_acompanante.md`), donde `C`=CHILD y `P`=PARENT, pese a
que ambos tienen 8 opciones y ambos se llaman "relación". No se pueden
reutilizar el uno por el otro.