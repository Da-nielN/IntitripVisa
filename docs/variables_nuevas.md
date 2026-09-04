# Variables nuevas para la página web generadora
 
Derivadas de aplicar `decisiones_alcance.md` sobre `mapeo_ds160.json` (v2.2).
Son **39 variables nuevas** que hoy no existen en el generador y que la aplicación
espera encontrar en el JSON de datos.
 
Recordatorio del formato (sección 4 del plan): texto libre → string; fechas →
`AAAA-MM-DD`; `select` y `radio` → objeto `{ "texto": "...", "valor": "..." }` con el
`value` real del DS-160.
 
---
 
## 1. Personal1
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `ciudadNacimiento` | texto | — | máx. 20 caracteres |
| `paisNacimiento` | select | `catalogo_paises_lugar_nacimiento.md` (281) | no es el mismo catálogo que nacionalidad |
 
## 2. Travel — bloque del pagador
 
Solo se llenan si `pagadorViaje = "O"` (Other Person). Si no, la app las omite.
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `apellidosPagador` | texto | — | |
| `nombresPagador` | texto | — | |
| `telefonoPagador` | texto | — | |
| `correoPagador` | texto | — | |
| `relacionPagador` | select | **pendiente de volcar** (`ddlPayerRelationship`) | catálogo no relevado todavía |
| `direccionPagadorIgualSolicitante` | radio | `Y` / `N` | si es `N`, el sub-bloque de dirección queda manual (no relevado) |
 
## 3. Travel — lugares que planea visitar (repetidor, 5 slots)
 
Reemplazan a `lugaresPlaneadosEEUU`.
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `lugarPlaneadoEEUU1` … `lugarPlaneadoEEUU5` | texto | — | máx. 40 caracteres cada uno; el 1 es obligatorio, del 2 al 5 opcionales |
 
## 4. AddressPhone
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `paisDomicilio` | select | `catalogo_paises_residencia_permanente.md` (253) | mismo catálogo de 253 que residencia permanente |
 
## 5. PptVisa
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `numeroPasaporte` | texto | — | máx. 20 |
| `provinciaEmisionPasaporte` | texto | — | máx. 25 |
| `tipoDocumentoPasaporte` | select | **pendiente de volcar** (`ddlPPT_TYPE`, 6 opciones) | dispara postback |
| `autoridadEmisoraPasaporte` | select | `catalogo_paises_autoridad_pasaporte.md` (217) | no incluye Estados Unidos |
| `paisEmisionPasaporte` | select | `catalogo_paises_residencia_permanente.md` (253) | lugar físico de emisión, distinto del anterior |
| `fechaEmisionPasaporte` | fecha | — | `AAAA-MM-DD` |
| `fechaExpiracionPasaporte` | fecha | — | `AAAA-MM-DD` |
 
## 6. USContact
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `apellidosContactoEEUU` | texto | — | máx. 33 |
| `nombresContactoEEUU` | texto | — | máx. 33 |
| `direccionContactoEEUU` | texto | — | máx. 40 |
| `ciudadContactoEEUU` | texto | — | máx. 20 |
| `estadoContactoEEUU` | select | `catalogo_estados_eeuu.md` (57) | mismo catálogo que el estado de hospedaje |
| `telefonoContactoEEUU` | texto | — | máx. 15 |
| `relacionContactoEEUU` | select | `catalogo_relacion_contacto_eeuu.md` (8) | **no** es el catálogo de acompañantes: aquí `C = FRIEND` y `P = EMPLOYER` |
 
## 7. WorkEducation3
 
| Variable | Tipo | Catálogo | Notas |
|---|---|---|---|
| `tieneHistorialViajes` | radio | `Y` / `N` | derivada: `Y` si hay al menos un país visitado |
| `paisVisitado1` … `paisVisitado5` | select | `catalogo_paises_residencia_permanente.md` (253) | repetidor de 5 slots |
| `idioma1` … `idioma5` | texto | — | máx. 66 cada uno; reemplazan a `idiomas` |
 
---
 
## 8. Variables que cambian de significado (ya existen, revisar el generador)
 
| Variable | Cambio |
|---|---|
| `celular` | pasa al campo "Primary Phone Number" (`tbxAPP_HOME_TEL`). Es el único teléfono que llega al DS-160. |
| `telefonoDomicilio` | pasa a "Secondary Phone Number" (`tbxAPP_MOBILE_TEL`). Desde la v2.3 del mapeo su checkbox "no aplica" va **desmarcado**, así que sí se envía: el generador debe entregarla siempre. |
| `cargoActual` | deja de ser variable propia: se concatena con `descripcionTrabajoActual` dentro de `tbxDescribeDuties`. El generador debe seguir capturándola. |
 
## 8.bis. Variables que pasan a ser obligatorias (mapeo v2.3)
 
Al desmarcar los 11 checkboxes "Does Not Apply / Do Not Know" que las bloqueaban, estas
variables ya existentes sí llegan al DS-160 y el formulario las va a exigir. El generador debe
capturarlas siempre:
 
`identificacionFiscalEEUU`, `codigoPostal`, `telefonoDomicilio`, `ciudadNacimientoConyuge`,
`codigoPostalTrabajoActual`, `provinciaTrabajoAnterior`, `codigoPostalTrabajoAnterior`,
`apellidosSupervisorAnterior`, `nombreSupervisorAnterior`, `provinciaEducacion`,
`codigoPostalEducacion`.
 
## 9. Variables que salen del modelo
 
Eliminarlas del generador y del JSON de datos:
 
`tieneVisaActiva`, `paisVisa`, `fechaEmisionVisa`, `cantidadViajeros`, `relacionViaje`.
 
Reemplazadas por slots numerados: `lugaresPlaneadosEEUU`, `idiomas`, `historialViajes`.
 
## 10. Catálogos que faltan volcar
 
Los dos únicos `select` nuevos sin catálogo disponible:
 
- `ddlPayerRelationship` (parentesco con el pagador del viaje) — Travel.
- `ddlPPT_TYPE` (tipo de documento de viaje, 6 opciones) — PptVisa.
Sin ellos, el generador no puede producir el `valor` correcto de `relacionPagador`
ni de `tipoDocumentoPasaporte`.