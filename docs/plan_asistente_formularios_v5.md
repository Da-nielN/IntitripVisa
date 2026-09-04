# Plan de la aplicación de escritorio modular — Asistente de llenado DS-160
 
**Versión:** 5.2
**Estado:** Fase 0 (relevamiento) **completa** — 18 de 18 pantallas.
Fase 0.5 (decisión de alcance) **completa** — ver sección 13. Siguiente paso: Fase 1 (MVP funcional).
 
Cambios respecto a la v5.0: decisiones técnicas de implementación tomadas antes de escribir
código — nombre del proyecto, versión de .NET, forma de publicación, modelo de datos, patrón de
interfaz, eliminación del panel de revisión editable y simplificación de las validaciones. El
anexo B fija la estructura de carpetas del proyecto.
 
---
 
## 1. Propósito del documento
 
Define la visión del proyecto, las decisiones tomadas, el alcance del MVP y las
posibilidades de crecimiento. Sirve como contexto para desarrolladores, diseñadores o
asistentes de inteligencia artificial que participen en el proyecto.
 
El proyecto nació como un asistente visual para trasladar información de un cliente a un
formulario web. La función sigue siendo el MVP, pero la aplicación debe construirse de forma
que después pueda incorporar otros módulos sin rehacer su base técnica.
 
---
 
## 2. Visión general del producto
 
Aplicación de escritorio para Windows, en C#, que funciona como plataforma modular.
El proyecto se llama **Illari**.
 
El primer módulo, **Formularios**, se encarga de:
 
1. Cargar un archivo JSON con los datos del cliente, generado por una página web propia.
2. Mostrar de forma visible **qué archivo se cargó**, para evitar trabajar con el cliente
   equivocado.
3. Mostrar el formulario web real (DS-160) dentro de la aplicación.
4. Insertar los datos en los campos correspondientes, pantalla por pantalla, cuando el
   usuario lo solicite.
5. Mantener siempre al usuario en control de la navegación, la corrección y el envío final.
**La aplicación no edita los datos del cliente.** Las correcciones se hacen en el propio DS-160
después del llenado, o regenerando el JSON desde la página web. Ver §5.1.
 
---
 
## 3. Contexto de negocio
 
- **Uso:** interno, para una agencia de viajes propia.
- **Usuarios:** 2 personas, cada una en su máquina, sin uso concurrente.
- **Origen de los datos:** el cliente entrega su información y otorga consentimiento directo.
- **Formulario objetivo:** [DS-160](https://ceac.state.gov/genniv/), Departamento de Estado.
- **Plazos:** sin fecha límite.
- **Términos de uso del sitio:** revisados; no prohíben scripts de asistencia al llenado. El
  diseño asistido, con control total del usuario incluyendo captchas, refuerza que no es un bot.
---
 
## 4. Origen de los datos
 
**El PDF no es la fuente de datos.** La página web que genera la plantilla produce también un
**JSON con los datos reales**. La aplicación carga ese JSON. El PDF queda como respaldo visual
para el cliente.
 
Las **validaciones** (formato, obligatoriedad, longitudes) se hacen en la página web, no en la
aplicación.
 
**Convención de nombre del archivo:** el JSON se guarda con el nombre y la cédula del cliente.
La aplicación muestra ese nombre de archivo en pantalla; no necesita interpretar su contenido
para identificar de quién son los datos.
 
**Formato del JSON de datos:**
 
- Fechas: `AAAA-MM-DD`.
- Texto libre: string plano.
- Campos de selección (`select` y `radio`): objeto con texto para mostrar y `value` del DS-160.
```json
{
  "primerNombre": "Juan",
  "fechaNacimiento": "1990-05-14",
  "nacionalidad": { "texto": "Ecuador", "valor": "ECUA" }
}
```
 
La aplicación escribe `valor` y muestra `texto`. **No traduce nada** ni mantiene tablas de
equivalencias. Los catálogos ya volcados del formulario (`claude_catalogo_*.md`) sirven para
alimentar la página web, no la aplicación.
 
---
 
## 5. Clasificación del alcance
 
### 5.1. Decisiones tomadas
 
**Plataforma y publicación**
 
- Lenguaje **C#**, interfaz **WPF**, Windows 10 o superior.
- **.NET 10 (LTS)**, soporte hasta noviembre de 2028. `TargetFramework`: `net10.0-windows`.
  .NET 8 y .NET 9 terminan soporte el 10 de noviembre de 2026, por lo que no son opción.
- Publicación **framework-dependent**. En las dos máquinas se instala **manualmente, una sola
  vez, el .NET Desktop Runtime 10 (x64)**. En la máquina de desarrollo, el SDK de .NET 10.
- Se mantiene **un solo archivo `.exe`** mediante `PublishSingleFile=true` +
  `SelfContained=false` + `IncludeNativeLibrariesForSelfExtract=true`.
- Formulario mostrado con **Microsoft WebView2**.
- Mapeo **embebido como recurso**, no editable por el usuario.
**Interfaz**
 
- Patrón **MVVM**, con el paquete **CommunityToolkit.Mvvm** (oficial de Microsoft) para generar
  las notificaciones de cambio y los comandos. Es una dependencia, no un framework: no impone
  estructura ni navegación.
- Paquetes NuGet del proyecto: `CommunityToolkit.Mvvm`, `Microsoft.Web.WebView2`, `WPF-UI`.
- **Sin panel de revisión editable.** La v5.0 preveía 196 campos editables con confirmación
  previa al llenado. Se elimina: el usuario puede corregir cualquier valor directamente en el
  DS-160 después del llenado, y el propio formulario obliga a revisar antes de enviar. En su
  lugar, la pantalla de llenado muestra el **nombre del archivo cargado**, que por convención
  contiene nombre y cédula del cliente. Consecuencia: el módulo Formularios tiene **una sola
  vista**, y desaparece la regla "no se puede llenar hasta confirmar la revisión", sustituida por
  "no se puede llenar hasta cargar un archivo".
**Modelo de datos**
 
- `DatosCliente` contiene un **`Dictionary<string, ValorDato>`**, no propiedades tipadas por
  variable. El mapeo referencia las variables por nombre en tiempo de ejecución (§6), así que el
  código nunca escribe `datos.PrimerNombre`: busca la clave que le indica el mapeo. Escribir ~196
  propiedades obligaría a recompilar cada vez que el generador web agregue una variable.
- El diccionario es de **solo lectura** para la aplicación: se carga y se consume, no se edita.
**Operación**
 
- Automatización visible y asistida; no es un bot autónomo.
- El usuario conserva login, captchas, navegación, correcciones y envío.
- Los `id` del DS-160 son estáticos entre sesiones — verificado.
- La URL cambia entre pantallas; el parámetro `node=` es el detector — verificado.
- La clase que orquesta el llenado de §9 se llama **`LlenadorDS160`**. Es la única pieza atada al
  sitio; la generación del script JavaScript es genérica y vive aparte.
- `LlenadorDS160` no conoce el control WebView2: recibe un **delegado** `EjecutarScript`
  (`delegate Task<string> EjecutarScript(string script)`) que la vista le entrega ya conectado al
  navegador. Una línea, sin interfaces ni clases intermedias.
- Sin cifrado, sin instalador, sin actualización automática, sin logs, idioma único español.
### 5.2. Fuera de alcance
 
Extracción desde PDF; edición del mapeo por el usuario; **edición de los datos del cliente dentro
de la aplicación**; más de un archivo de datos por sesión; persistencia de sesión o cookies;
historial; cifrado; multi-idioma; instalador; logs persistentes; plantillas de mapeo para otras
páginas; canal bidireccional permanente JS↔C#.
 
---
 
## 6. Modelo de datos
 
**Claves canónicas: `variable` e `id`.** Ningún código compara `etiqueta`.
 
`DatosCliente` es un diccionario `nombreDeVariable → ValorDato`. `ValorDato` guarda dos cosas:
`Texto` (lo que se muestra) y `Valor` (lo que se escribe en el DS-160). Para texto libre y fechas
ambos coinciden; para `select` y `radio` difieren (`"Ecuador"` / `"ECUA"`).
 
`telefonosAnteriores` y `correosAnteriores` no son bloques repetibles: el DS-160 admite un
solo valor adicional (`dtlAddPhone_ctl00_tbxAddPhoneInfo`, `dtlAddEmail_ctl00_tbxAddEmailInfo`).
 
Las variables nuevas que la página web generadora debe producir, con el catálogo de cada
`select`, están en `claude/variables_nuevas.md`.
 
Una variable que el archivo del cliente no traiga hace que su campo quede **omitido**, igual que
un control ausente del DOM (§7). No es un error.
 
---
 
## 7. Estructura del archivo de mapeo
 
**Centrado en el `id` del control.** Lista plana de pantallas; una pantalla = una URL = una
pulsación de "Llenar formulario". `seccion` es solo un texto para agrupar en la interfaz.
 
| Atributo | Uso |
|---|---|
| `id` | Texto, o lista de 3 `id` para fechas (día, mes, año) |
| `tipo` | `texto`, `textarea`, `select`, `radio`, `fecha`, `checkbox` |
| `variable` / `variables` / `valor` / `manual` | Origen del valor — exactamente uno |
| `disparaPostback` | `true` si el control recarga la página al cambiar |
| `grupo` | Agrupación temática dentro de la pantalla, decorativa |
| `catalogo` | Catálogo del `select`, informativo; la app no traduce |
 
```json
{ "id": "...ddlAPP_GENDER",  "tipo": "select", "variable": "sexo" }
{ "id": "...tbxAPP_SURNAME", "tipo": "texto",  "variables": ["primerApellido", "segundoApellido"] }
{ "id": "...ddlSpouseAddressType", "tipo": "select", "valor": "H" }
{ "id": "...cbexAPP_SSN_NA", "tipo": "checkbox", "valor": true }
{ "id": "...dtlSocial_ctl03_ddlSocialMedia", "tipo": "select", "manual": true }
```
 
El archivo lleva un campo `version` en la raíz. Esa versión debe mostrarse en la interfaz: con el
mapeo embebido en el `.exe`, es la única forma de saber qué mapeo lleva una copia instalada.
 
**`checkbox` (desde la v2.2 del mapeo):** su `valor` es booleano — `true` = marcado,
`false` = desmarcado. La app compara el estado actual del control y solo hace `.click()` si
difiere; nunca asigna `checked` directamente, porque varios de estos checkboxes disparan
postback.
 
**Repetidores:** se declaran con slots explícitos `ctl00` … `ctl04`, una variable numerada por
slot (`idioma1`…`idioma5`, `paisVisitado1`…`paisVisitado5`, `lugarPlaneadoEEUU1`…`5`,
`acompananteViaje1…5`). Las filas `ctl01`–`ctl04` no existen en el DOM hasta pulsar
"Add Another": si no están, el campo se marca **omitido**, no error.
 
`pendientes`: variables sin `id` relevado. Lista de tareas viva.
 
**Campos condicionales:** no se declaran condiciones en el mapeo. Si un control no está en el
DOM tras llenar los disparadores, se marca **omitido**, no error.
 
---
 
## 8. Hechos confirmados del DS-160 (relevamiento en vivo)
 
Estos reemplazan a las suposiciones de la v4. Todos verificados sobre el formulario real.
 
- **Los `rbl` son contenedores `<table>`.** Los inputs reales son `id + "_0"` (`value="Y"`) e
  `id + "_1"` (`value="N"`). Hay que hacer `.click()` sobre el input, nunca escribir sobre el
  `id` base. Afecta a más de 40 campos.
- **Meses: códigos `JAN`…`DEC`.** Días: `01`…`31` con cero a la izquierda.
- **`node=Family` no es una pantalla.** Redirige a `complete_family1.aspx?node=Relatives`.
  Padre, madre y familiares inmediatos están todos en `Relatives`. Total: **18 pantallas**.
- **Las listas de países son varias y distintas:** nacionalidad (212), nacionalidad del cónyuge
  (213), residencia permanente (253), lugar de nacimiento (281), autoridad emisora del
  pasaporte (217), lugar físico de emisión (253). No son intercambiables.
- **`ddlSpouseAddressType`: el valor "igual que la del solicitante" es `"H"`**, no `""`.
- **Los repetidores solo traen la fila `ctl00`.** Las demás requieren "Add Another".
- **Navegar entre pantallas dispara un diálogo "Leave site?"** que hay que descartar.
- **`tbZIPCode`** (código postal del hospedaje) no lleva la `x` de los demás `tbx`.
- **`dtlPrevEmpl_ctl00_DropDownList2`** es el país del empleador anterior, con id autogenerado
  por ASP.NET. Ningún filtro por nombre lo encuentra.
- **`tbxDeport_EXPL`** lleva sufijo `_EXPL`, rompiendo la convención `rbl<X>` / `tbx<X>`.
### 8.1. Postbacks: comportamiento mixto — crítico para el llenado
 
**Dentro de una misma pantalla conviven radios que recargan la página y radios que solo
cambian visibilidad por CSS, con el `textarea` ya presente en el DOM.** Confirmado en
`WorkEducation3`, `PreviousUSTravel` y `SecurityandBackground5`.
 
Consecuencias para la implementación:
 
- **`disparaPostback` no se puede inferir del nombre ni del tipo del control.** Debe venir del
  relevamiento, campo por campo.
- **`rblDisease` y `rblDeport` NO disparan postback**, contra lo que asumía el mapeo. Sus
  `_verificar` quedan desmentidos.
- **`rblAttWoReimb` es el único condicional real de las cinco pantallas de Security**, y su
  postback es **asíncrono** (ASP.NET AJAX). `tbxAttWoReimb` no existe en el DOM hasta marcar
  "Yes". Los otros 30 pares de esa sección se pueden llenar sin tocar el radio.
- **Un radio ya respondido "Yes" reporta `postback=false` aunque sí lo dispare**, porque
  ASP.NET solo pone `__doPostBack` en la opción que cambiaría el estado visible. Para un
  veredicto fiable hay que leer los dos inputs del grupo.
- **`disparaPostback` describe el control, no el valor que la app escribe.** Varios radios que
  el mapeo fija en `"N"` no recargan al marcar esa opción. La espera de recarga debe tener
  timeout y continuar, nunca bloquear.
**Regla de operación resultante:** la aplicación llena primero los controles marcados
`disparaPostback`, espera la recarga (síncrona o asíncrona), y luego el resto. Para los pares
`rbl`/`tbx` sin postback puede escribir el `textarea` directamente sin tocar el radio.
 
---
 
## 9. Operación de llenado
 
**Requisito previo, una sola vez por sesión:** el control WebView2 arranca su motor de forma
asíncrona. Hasta que `EnsureCoreWebView2Async()` termine, no se puede ejecutar ningún script. El
botón "Llenar formulario" permanece deshabilitado hasta entonces. Esta inicialización es distinta
de la verificación del runtime al arrancar la aplicación (§10.2): aquella comprueba que WebView2
esté instalado en la máquina; esta prepara el control concreto de la vista.
 
El diálogo "Leave site?" (§8) se descarta desde `CoreWebView2.ScriptDialogOpening`, con
`AreDefaultScriptDialogsEnabled = false`.
 
Por cada pantalla, al presionar **"Llenar formulario"**:
 
1. Confirmar por el `node=` de la URL que la pantalla es la esperada; si no, informar sin llenar.
2. Validar que existan datos para esa pantalla.
3. Llenar los controles con `disparaPostback` y esperar la recarga (con timeout).
4. Serializar los datos de forma segura para el script.
5. Ejecutar el script en WebView2.
6. Localizar cada elemento por su `id`; para radios, por `id + "_0"` / `_1`.
7. Si no existe, reintentar 2–3 veces con ~500 ms; si sigue sin existir, marcar no encontrado
   u omitido.
8. Insertar el valor con el setter nativo; para radios y checkboxes, `.click()` — en los
   checkboxes, solo si el estado actual difiere del deseado.
9. Disparar `focus`, `input`, `change` y `blur`.
10. Registrar el resultado por campo.
11. Mostrar el resumen: llenados, no encontrados, omitidos, advertencias.
**Repetidores:** antes de escribir en los slots `ctl01`–`ctl04`, pulsar "Add Another" tantas
veces como slots con dato haya. En `AddressPhone` son siempre tres pulsaciones (Instagram,
LinkedIn y la fila de otras redes).
 
---
 
## 10. Comprobaciones
 
### 10.1. Validación del mapeo — fuera de la aplicación
 
`claude/validar_mapeo.py` se ejecuta **al editar el mapeo, antes de compilar**. Es un paso
obligatorio del flujo de trabajo. Comprueba:
 
- `id` duplicados dentro de una misma pantalla.
- Campos `fecha` que no tengan exactamente 3 `id`.
- Campos con más de un origen, o con ninguno.
- Tipo faltante o desconocido.
Dos comprobaciones más quedan pendientes de que exista un catálogo canónico de variables
(§15): variables referenciadas que no existen en el modelo, y variables del modelo no
referenciadas por ningún campo.
 
Una tercera, **`node` declarado que no coincide con la pantalla donde vive el `id`**, se verificó
a mano durante el relevamiento: se encontraron dos casos reales (`rblDeport` / `tbxDeport_EXPL`
declarados en `SecurityandBackground3` pero ubicados en `SecurityandBackground4`, y
`rblOtherEduc` declarado en `WorkEducation3` pero ubicado en `WorkEducation2`), **ambos ya
corregidos**.
 
**Esta validación no se repite dentro de la aplicación.** El mapeo viaja embebido en el `.exe` y
nadie puede modificarlo después de compilar; revisarlo en cada arranque comprobaría algo que es
imposible que haya cambiado. Ninguna validación puede detectar el fallo que sí importa —que un
`id` haya dejado de existir en el DS-160—, y eso se asume como riesgo (§11).
 
### 10.2. Comprobaciones dentro de la aplicación
 
Solo dos, ambas de pocas líneas:
 
1. **Runtime de WebView2 presente**, con `CoreWebView2Environment.GetAvailableBrowserVersionString()`
   al arrancar. Suele venir con Windows, pero no está garantizado en todas las instalaciones de
   Windows 10. Si falta, mensaje con el enlace de descarga y no continuar. Vive en `App.xaml.cs`,
   sin archivo propio.
2. **Carga del JSON del cliente a prueba de errores.** Es el único archivo que un usuario puede
   abrir y modificar con el bloc de notas, así que la carga se envuelve en `try/catch` y devuelve
   un resultado explícito: *cargado* o *error con mensaje legible* (JSON mal formado, archivo
   ilegible, estructura inesperada). No es un validador de contenido: las validaciones de formato
   y obligatoriedad son de la página web (§4), y una variable ausente produce un campo **omitido**,
   no un error (§6).
---
 
## 11. Riesgos
 
| Riesgo | Mitigación |
|---|---|
| Cambios en los `id` o estructura del DS-160 | Actualización manual del mapeo. Aceptado; ninguna validación lo detecta. |
| Postbacks mixtos e impredecibles | `disparaPostback` relevado campo por campo, no inferido. |
| Fallo silencioso en el llenado | Verificación en el DOM con reintentos; resumen por campo. |
| Dependencia del runtime de WebView2 | Verificación al arrancar con mensaje claro (§10.2). |
| Falta el .NET Desktop Runtime en la máquina | La app no llega a arrancar y el mensaje lo da Windows, no la aplicación. No se puede mejorar desde el código. Se documenta como paso de instalación. |
| JSON del cliente editado a mano y corrompido | Carga con `try/catch` y mensaje legible (§10.2). |
| Ejecutar un script antes de que WebView2 termine de inicializar | Botón deshabilitado hasta `EnsureCoreWebView2Async()`. |
| Cierre de sesión por inactividad | Flujo rápido; sin dejar el formulario a medias. |
| Escribir sobre el contenedor `rbl` en vez del input | Regla explícita `_0` / `_1` en el llenador. |
| Slots `ctl01`–`ctl04` inferidos del patrón, no relevados | Se marcan omitidos si no aparecen; verificar en la primera prueba real. |
| Trabajar con el archivo del cliente equivocado | Nombre del archivo cargado visible en la pantalla de llenado. |
 
---
 
## 12. Fases
 
### Fase 0: Relevamiento — **COMPLETA**
- ✅ 18 de 18 pantallas relevadas sobre el formulario en vivo.
- ✅ Comportamiento de los `rbl`, meses, postbacks mixtos.
- ✅ Catálogos volcados y traducidos (países, estados, propósito de viaje, ocupación, etc.).
- ✅ Estructura del mapeo definida y convertida.
### Fase 0.5: Decisión de alcance — **COMPLETA** (ver sección 13)
 
### Fase 1: MVP funcional — **SIGUIENTE PASO**
- WPF con navegación básica y módulo Formularios.
- Carga del JSON del cliente, con el nombre del archivo visible.
- WebView2 integrado, navegación libre.
- Mapeo embebido, con su versión visible.
- Llenado por pantalla con resultado por campo.
### Fase 2: Robustez
Resaltado de campos llenados, limpieza selectiva, mejor manejo de errores.
 
### Fase 3: Crecimiento
Nuevos módulos; reevaluación de Playwright.
 
---
 
## 13. Decisión de alcance — RESUELTA
 
Cada campo del DS-160 sin variable en la plantilla recibió una de tres decisiones: **página
web** (la genera el generador y la trae la app), **manual** (el usuario lo completa a mano) o
**valor fijo** (la app lo llena siempre igual). El detalle está en `decisiones_alcance.md` y ya
está aplicado en `mapeo_ds160.json` **v2.3**, que pasa las cuatro comprobaciones de
`validar_mapeo.py` con 0 errores.
 
### 13.1. Campos del DS-160 sin variable en la plantilla — resuelto
 
Todos incorporados al mapeo: lugar de nacimiento, checkboxes "Do Not Know" / "Does Not Apply"
de todas las pantallas, bloque del pagador, `PptVisa` completa, las 14 preguntas de `USContact`
y los 29 pares indicador + explicación de Security and Background. El mapeo pasó de 128 a
**304 campos**.
 
### 13.2. Variables de la plantilla sin equivalente en el DS-160 — resuelto
 
- Eliminadas del modelo: `tieneVisaActiva`, `paisVisa`, `fechaEmisionVisa`, `cantidadViajeros`,
  `relacionViaje`.
- `cargoActual` se conserva en el modelo y se vuelca junto con `descripcionTrabajoActual`
  dentro de `tbxDescribeDuties` (`"variables": ["cargoActual", "descripcionTrabajoActual"]`).
### 13.3. Casos estructurales — resuelto
 
- `historialViajes` se separó en `tieneHistorialViajes` (indicador `Y`/`N`, derivado de si la
  lista está vacía) y `paisVisitado1`…`paisVisitado5`.
- `idiomas` → `idioma1`…`idioma5`; `lugaresPlaneadosEEUU` → `lugarPlaneadoEEUU1`…`5`, con el
  tipo corregido a `texto` (40 caracteres).
- Redes sociales: Facebook, Instagram y LinkedIn con plataforma de valor fijo y usuario por
  variable; la cuarta fila queda con plataforma manual. La app pulsa "Add Another" tres veces.
- `ddlSpouseNatDropDownList` (213 opciones) sigue sin diffear contra las 212 de `ddlAPP_NATL`.
  No bloquea el MVP.
### 13.4. Trabajo de mapeo pendiente — resuelto
 
`mapeo_ds160.json` v2.3 incorpora los `id` del relevamiento, corrige los dos `node` mal
asignados, actualiza los `disparaPostback` desmentidos y crea el grupo completo de `USContact`.
 
### 13.5. Corrección de los checkboxes "no aplica" (v2.3)
 
La primera aplicación de las decisiones dejó **11 campos con variable asignada y, a la vez, su
checkbox "Does Not Apply / Do Not Know" fijado en marcado**, lo que deshabilita el control y
haría que esas variables nunca llegaran al DS-160. En la v2.3 esos 11 checkboxes pasan a
**desmarcado**:
 
| Pantalla | Checkbox | Variable que libera |
|---|---|---|
| Personal2 | `cbexAPP_TAX_ID_NA` | `identificacionFiscalEEUU` |
| AddressPhone | `cbexAPP_ADDR_POSTAL_CD_NA` | `codigoPostal` |
| AddressPhone | `cbexAPP_MOBILE_TEL_NA` | `telefonoDomicilio` |
| Spouse | `cbexSPOUSE_POB_CITY_NA` | `ciudadNacimientoConyuge` |
| WorkEducation1 | `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` | `codigoPostalTrabajoActual` |
| WorkEducation2 | `cbxPREV_EMPL_ADDR_STATE_NA` | `provinciaTrabajoAnterior` |
| WorkEducation2 | `cbxPREV_EMPL_ADDR_POSTAL_CD_NA` | `codigoPostalTrabajoAnterior` |
| WorkEducation2 | `cbxSupervisorSurname_NA` | `apellidosSupervisorAnterior` |
| WorkEducation2 | `cbxSupervisorGivenName_NA` | `nombreSupervisorAnterior` |
| WorkEducation2 | `cbxEDUC_INST_ADDR_STATE_NA` | `provinciaEducacion` |
| WorkEducation2 | `cbxEDUC_INST_POSTAL_CD_NA` | `codigoPostalEducacion` |
 
Esto **revierte la reasignación de teléfonos** de `decisiones_alcance.md` §5: `telefonoDomicilio`
ahora sí se envía, en "Secondary Phone Number". El generador debe entregarla siempre, o el
campo queda vacío con el checkbox desmarcado.
 
Quedan marcados solo 7 checkboxes, todos sin variable detrás y por lo tanto sin conflicto:
`cbexAPP_FULL_NAME_NATIVE_NA`, `cbexAPP_POB_ST_PROVINCE_NA`, `cbexAPP_SSN_NA`,
`cbexAPP_BUS_TEL_NA`, `cbexPPT_BOOK_NUM_NA`, `cbxUS_POC_ORG_NA_IND`, `cbexUS_POC_EMAIL_ADDR_NA`.
 
### 13.6. Lo que queda abierto
 
No bloquea la Fase 1, pero conviene resolverlo antes de la primera prueba real:
 
1. **Dos catálogos sin volcar:** `ddlPayerRelationship` y `ddlPPT_TYPE`.
2. **Slots `ctl01`–`ctl04` inferidos** de los repetidores `dtlTravelLoc`, `dtlLANGUAGES` y
   `dtlCountriesVisited`: solo se relevó `ctl00`.
3. **Sub-bloques no relevados:** repetidor de "otros nombres", telecode y dirección del pagador
   cuando `rblPayerAddrSameAsInd = N`. Los tres quedan cubiertos por valores fijos o son casos
   poco frecuentes.
4. **Campos que ahora quedan obligatorios** al desmarcar su checkbox: si el cliente no tiene
   código postal, provincia o supervisor, el DS-160 los exigirá. Verificarlo en la primera
   prueba real; si molesta, el checkbox se marca a mano.
---
 
## 14. Principios de implementación
 
- Código sencillo y legible; separar responsabilidades sin sobrearquitectura.
- Sin lógica de negocio en code-behind; sin scripts JavaScript dispersos por la interfaz.
- Serializar de forma segura los valores usados en los scripts.
- **Los servicios del módulo no dependen de tipos de interfaz.** `CargadorJson`,
  `GeneradorScript` y `LlenadorDS160` trabajan sobre texto y objetos de datos; no referencian
  `Window`, `Dispatcher` ni el control `WebView2`. Esta propiedad sale gratis de la estructura y
  mantiene la lógica legible y aislada. **No** implica construir un arnés de pruebas ni una vía
  para ejercitar el mapeo sin abrir la aplicación: probar el llenado abriendo la app completa es
  aceptable y se prefiere por simplicidad.
- **Un archivo por responsabilidad, no por tipo.** Interfaces, delegados y clases pequeñas
  conviven en el archivo de quien las usa. No se crean archivos de una sola línea.
- Abstracciones solo cuando exista necesidad real.
---
 
## 15. Pendiente: catálogo canónico de variables
 
Con el modelo por diccionario, la lista de variables válidas ya no existe en el código. Las dos
últimas comprobaciones de §10.1 —variables referenciadas que no existen, y variables del modelo
que ningún campo usa— necesitan una lista explícita para poder ejecutarse.
 
**Decisión: se genera cuando la página web generadora esté lista**, desde la misma fuente que la
alimenta, para que no haya dos listas que mantener. Hasta entonces esas dos comprobaciones quedan
sin cubrir. No bloquea la Fase 1.
 
---
 
## Anexo A: Archivos del proyecto (documentación)
 
| Archivo | Contenido |
|---|---|
| `plan_asistente_formularios_v5.md` | Este documento. Fuente de verdad del proyecto. |
| `mapeo_ds160.json` | Mapeo campo → `id`. v2.3, con las decisiones de alcance aplicadas. |
| `decisiones_alcance.md` | Decisión por campo: página web / manual / valor fijo. |
| `claude/variables_nuevas.md` | Variables que debe generar la página web, con su catálogo. |
| `inventario_ds160_parcial.md` | Relevamiento completo de las 18 pantallas. |
| `claude/validar_mapeo.py` | Validador del mapeo. Se ejecuta antes de compilar. |
| `claude/metodo_relevamiento.md` | Procedimiento de relevamiento, reutilizable. |
| `claude/relevamiento_<Pantalla>.md` | Detalle por pantalla. |
| `claude/catalogo_*.md` | Catálogos con `value`, inglés y español. Insumo de la página web. |
| `FORMULARIO VISA.pdf` | Plantilla de origen. Referencia del modelo, ya no fuente de datos. |
 
---
 
## Anexo B: Estructura del proyecto Illari
 
```
Illari/
├── Illari.csproj              Versión de .NET, paquetes NuGet, publicación
│                              single-file, mapeo como recurso embebido
├── App.xaml                   Ventana de inicio y diccionarios de recursos
├── App.xaml.cs                Arranque: verificación de WebView2 (§10.2)
├── VentanaPrincipal.xaml      Árbol de navegación + área de contenido
├── VentanaPrincipal.xaml.cs   Solo InitializeComponent()
├── VentanaPrincipalViewModel.cs   Pestañas y qué vista se muestra en cada una
│
├── Comun/
│   └── ElementoNavegacion.cs  Un nodo del árbol: título, hijos, ViewModel que abre
│
└── Modulos/
    └── Formularios/
        ├── Nucleo/            Lógica pura; aquí no entra nada de WPF
        │   ├── ModelosDatos.cs      DatosCliente, ValorDato, ResultadoCarga
        │   ├── ModelosMapeo.cs      Mapeo, PantallaMapeo, CampoMapeo,
        │   │                        ResultadoCampo, delegado EjecutarScript
        │   ├── CargadorJson.cs      Lee el JSON del cliente (con try/catch) y el
        │   │                        mapeo desde el recurso embebido
        │   ├── GeneradorScript.cs   JavaScript genérico: localizar por id, setter
        │   │                        nativo, eventos, click condicional, escapado seguro
        │   └── LlenadorDS160.cs     Los 11 pasos de §9. Recibe un EjecutarScript,
        │                            no el navegador
        ├── Llenado/
        │   ├── LlenadoView.xaml     WebView2, botones y panel de resumen
        │   ├── LlenadoView.xaml.cs  InitializeComponent(), EnsureCoreWebView2Async()
        │   │                        y entrega del delegado al ViewModel
        │   └── LlenadoViewModel.cs  Estado, comandos de cargar y llenar, resumen
        └── Definiciones/
            └── mapeo_ds160.json   Recurso embebido
```
 
**Patrón para módulos futuros:** una carpeta por módulo bajo `Modulos/`, con `Nucleo/` para la
lógica y una subcarpeta por pantalla con su `View` + `ViewModel`. Ejemplo de cómo crecería un
módulo de Contabilidad:
 
```
Modulos/Contabilidad/
├── Facturas/     Modelos.cs, RepositorioFacturas.cs, FacturasView.xaml(.cs),
│                 FacturasViewModel.cs
└── Pagos/        Modelos.cs, ConciliadorPagos.cs, PagosView.xaml(.cs),
                  PagosViewModel.cs
```
 
**Navegación sin contenedor de dependencias:** `VentanaPrincipalViewModel` construye los
ViewModels al arrancar y cada `ElementoNavegacion` guarda el ViewModel ya creado. En `App.xaml`
un `DataTemplate` asocia cada ViewModel con su vista (`LlenadoViewModel` → `LlenadoView`). Así la
navegación nunca menciona vistas ni necesita pasar parámetros al crearlas.