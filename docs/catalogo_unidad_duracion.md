# Catálogo — Unidad de duración de la estadía (`ddlTRAVEL_LOS_CD`)

**Campos que lo usan:**

| id completo | Pantalla | Variable del mapeo |
|---|---|---|
| `ctl00_SiteContentPlaceHolder_FormView1_ddlTRAVEL_LOS_CD` | `Travel` | `unidadDuracionEstadiaPrevista` |
| `ctl00_SiteContentPlaceHolder_FormView1_dtlPREV_US_VISIT_ctl0N_ddlPREV_US_VISIT_LOS_CD` | `PreviousUSTravel` | `visitaAnteriorEEUU1…5UnidadDuracion` |

**Condición para verlo en `Travel`:** `ddlTRAVEL_LOS_CD` solo existe si
`rblSpecificTravel = N` ("no he hecho planes concretos"). Con `rblSpecificTravel = Y`
la pantalla muestra fechas de llegada/salida en vez de duración.
En `PreviousUSTravel` los slots `ctl01…ctl04` requieren pulsar "Add Another",
pero el catálogo es idéntico, así que con volcar el de `Travel` alcanza.

6 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.

```
|-Select One-|(sin seleccionar)
Y|Year(s)|Año(s)
M|Month(s)|Mes(es)
W|Week(s)|Semana(s)
D|Day(s)|Día(s)
H|Less Than 24 Hours|Menos de 24 horas
```
