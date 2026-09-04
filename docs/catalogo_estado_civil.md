# Catálogo — Estado civil (`ddlAPP_MARITAL_STATUS`)

**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_ddlAPP_MARITAL_STATUS` —
pantalla `Personal1` ("Marital Status"). Mapeado en `mapeo_ds160_1.json` a la
variable `estadoCivil`.

9 opciones (incluye el placeholder). **Dispara postback**: al cambiarlo la
página recarga, y el valor elegido determina si la pantalla `Spouse`
(`complete_family2.aspx?node=Spouse`) existe en el árbol de navegación.
Con `M` (MARRIED) la pantalla `Spouse` aparece.

Formato: `value|texto en inglés (DS-160)|traducción al español`.

```
|-Select One-|(sin seleccionar)
M|MARRIED|Casado/a
C|COMMON LAW MARRIAGE|Unión de hecho
P|CIVIL UNION/DOMESTIC PARTNERSHIP|Unión civil / pareja de hecho
S|SINGLE|Soltero/a
W|WIDOWED|Viudo/a
D|DIVORCED|Divorciado/a
L|LEGALLY SEPARATED|Separado/a legalmente
O|OTHER|Otro
```
