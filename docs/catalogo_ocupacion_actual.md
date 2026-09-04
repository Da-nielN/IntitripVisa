# Catálogo — Ocupación actual (`ddlPresentOccupation`)
 
**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_ddlPresentOccupation`
— pantalla `WorkEducation1`, etiqueta "Primary Occupation".
Mapeado en `mapeo_ds160_1.json` a la variable `categoriaOcupacionActual`.
 
23 opciones (incluye el placeholder). **Dispara postback real.**
Formato: `value|texto en inglés (DS-160)|traducción al español`.
 
```
|-Select One-|(sin seleccionar)
A|AGRICULTURE|Agricultura
AP|ARTIST/PERFORMER|Artista/Intérprete
B|BUSINESS|Negocios
CM|COMMUNICATIONS|Comunicaciones
CS|COMPUTER SCIENCE|Informática
C|CULINARY/FOOD SERVICES|Gastronomía/Servicios de alimentación
ED|EDUCATION|Educación
EN|ENGINEERING|Ingeniería
G|GOVERNMENT|Gobierno
H|HOMEMAKER|Labores del hogar
LP|LEGAL PROFESSION|Profesión jurídica
MH|MEDICAL/HEALTH|Medicina/Salud
M|MILITARY|Militar
NS|NATURAL SCIENCE|Ciencias naturales
N|NOT EMPLOYED|Sin empleo
PS|PHYSICAL SCIENCES|Ciencias físicas
RV|RELIGIOUS VOCATION|Vocación religiosa
R|RESEARCH|Investigación
RT|RETIRED|Jubilado/a
SS|SOCIAL SCIENCE|Ciencias sociales
S|STUDENT|Estudiante
O|OTHER|Otro
```
 
## Comportamiento condicional
 
El valor elegido decide qué campos existen en la pantalla. Esto es parte del
catálogo, no un detalle de presentación:
 
| Valor | Efecto |
|---|---|
| Cualquier ocupación con empleo (`A`, `AP`, `B`, `CM`, `CS`, `C`, `ED`, `EN`, `G`, `LP`, `MH`, `M`, `NS`, `PS`, `RV`, `R`, `SS`, `S`) | bloque completo de empleador/escuela (16 campos) |
| `O` (OTHER) | bloque completo **+** `tbxExplainOtherPresentOccupation` con etiqueta "Specify Other" |
| `N` (NOT EMPLOYED) | **solo** `tbxExplainOtherPresentOccupation`, con etiqueta "Explain" |
| `H` (HOMEMAKER) | ningún campo adicional |
| `RT` (RETIRED) | ningún campo adicional |
 
`tbxExplainOtherPresentOccupation` es el mismo control en los dos casos que
lo muestran, pero con significado distinto (`O` = qué ocupación;
`N` = por qué no trabaja).
 
**Ojo con los `value` de una sola letra:** `C` es CULINARY (no
COMMUNICATIONS, que es `CM`), `M` es MILITARY (no MEDICAL, que es `MH`),
`R` es RESEARCH (no RETIRED, que es `RT`), `N` es NOT EMPLOYED (no NATURAL
SCIENCE, que es `NS`) y `S` es STUDENT (no SOCIAL SCIENCE, que es `SS`).
Cada letra suelta tiene una versión de dos letras que empieza igual y
significa otra cosa.