# Catálogo — Quién paga el viaje (`ddlWhoIsPaying`)

**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_ddlWhoIsPaying` — pantalla
`Travel` ("Person/Entity Paying for Your Trip"). Mapeado en
`mapeo_ds160_1.json` a la variable `pagadorViaje`.

6 opciones (incluye el placeholder). **Dispara postback.** Con el valor `O`
(Other Person) se revela el bloque del pagador: `tbxPayerSurname`,
`tbxPayerGivenName`, `tbxPayerPhone`, `tbxPAYER_EMAIL_ADDR`,
`ddlPayerRelationship` y `rblPayerAddrSameAsInd`.

Formato: `value|texto en inglés (DS-160)|traducción al español`.

```
|-Select One-|(sin seleccionar)
S|Self|Yo mismo (el solicitante)
O|Other Person|Otra persona
P|Present Employer|Empleador actual
U|Employer in the U.S.|Empleador en EE. UU.
C|Other Company/Organization|Otra empresa u organización
```
