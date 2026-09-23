# Plan de la aplicación de escritorio modular — Asistente de llenado DS-160
 
**Versión:** 5.4
**Estado:** Fase 0 (relevamiento) **completa** — 18 de 18 pantallas.
Fase 0.5 (decisión de alcance) **completa** — ver sección 13.
Fase 1 (MVP funcional) **funcionalmente terminada** en Illari — pendiente la primera prueba
real de punta a punta.
 
Cambios respecto a la v5.0: decisiones técnicas de implementación tomadas antes de escribir
código — nombre del proyecto, versión de .NET, forma de publicación, modelo de datos, patrón de
interfaz, eliminación del panel de revisión editable y simplificación de las validaciones. El
anexo B fija la estructura de carpetas del proyecto. El archivo de mapeo pasa a llamarse
`mapeo_ds160.json`.
 
Cambios de la v5.3 (2026-09-04): consolidación de la sesión de Illari y la de la página web.
Se incorporan el mapeo v2.5, el resultado de la Fase 1, los hechos nuevos del DS-160 salidos de
la primera prueba real y las rutas reales de los archivos.
 
Cambios de la v5.4 (2026-09-08): **se cierran los conflictos** que la v5.3 dejó abiertos, y se
corrige un error de fondo del relevamiento. Los `radio` viajan como string plano (§4). Los dos
checkboxes en disputa quedan marcados (§13.5). Los meses y los días del DS-160 **no son
`JAN`…`DEC` ni llevan cero a la izquierda**: son `1`…`12` y `1`…`31` (§8). El mapeo pasa a
**v2.6** con campos condicionales declarados (§7). Las decisiones tomadas están en §16.
 
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
**JSON con los datos reales**. La aplicación carga ese JSON. **El PDF está desactivado** en el generador web
(`GENERAR_PDF: false`) y ya no se comparte públicamente.
 
Las **validaciones** (formato, obligatoriedad, longitudes) se hacen en la página web, no en la
aplicación.
 
**Convención de nombre del archivo:** el JSON se guarda con el nombre y la cédula del cliente.
La aplicación muestra ese nombre de archivo en pantalla; no necesita interpretar su contenido
para identificar de quién son los datos.
 
**Formato del JSON de datos:**
 
- Fechas: `AAAA-MM-DD`.
- Texto libre: string plano.
- Campos `select`: objeto con texto para mostrar y `value` del DS-160.
- Campos `radio`: **string plano** `"Y"` / `"N"`. Esas dos letras ya *son* el `value` del
  DS-160 y no hay ningún texto que mostrar, porque la aplicación no tiene panel de revisión
  (§5.1). Así los emite hoy la página web.
 
La aplicación **acepta las dos formas** en cualquier campo: si el valor es un objeto lee
`texto` y `valor`; si es un string plano, `Texto` y `Valor` toman ese mismo string. Verificado
en la práctica el 2026-09-08. Esa tolerancia es a propósito: evita que un cambio de formato en
el generador rompa el llenado.
```json
{
  "primerNombre": "Juan",
  "fechaNacimiento": "1990-05-14",
  "nacionalidad": { "texto": "Ecuador", "valor": "ECUA" },
  "tieneOtraNacionalidad": "N"
}
```
 
La aplicación escribe `valor` y muestra `texto`. **No traduce nada** ni mantiene tablas de
equivalencias. Los catálogos ya volcados del formulario (`docs/catalogo_*.md`, en el repositorio de la
página web) sirven para alimentar la página web, no la aplicación.
 
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
de la aplicación**; más de un archivo de datos por sesión; persistencia de **los datos del
cliente o de la sesión del DS-160** — las preferencias de interfaz (tema, pantalla completa) sí
se guardan en `%APPDATA%\Illari\configuration.json`, ver §16.4;
historial; cifrado; multi-idioma; instalador; logs persistentes; plantillas de mapeo para otras
páginas; canal bidireccional permanente JS↔C#.
 
---
 
## 6. Modelo de datos
 
**Claves canónicas: `variable` e `id`.** Ningún código compara `etiqueta`.
 
`DatosCliente` es un diccionario `nombreDeVariable → ValorDato`. `ValorDato` guarda dos cosas:
`Texto` (lo que se muestra) y `Valor` (lo que se escribe en el DS-160). Para texto libre y fechas
ambos coinciden; para `select` difieren (`"Ecuador"` / `"ECUA"`). Para los `radio` el JSON trae
un string plano `"Y"` / `"N"` y `Texto` y `Valor` toman los dos ese mismo string (§4).
 
`telefonosAnteriores` y `correosAnteriores` no son bloques repetibles: el DS-160 admite un
solo valor adicional (`dtlAddPhone_ctl00_tbxAddPhoneInfo`, `dtlAddEmail_ctl00_tbxAddEmailInfo`).
 
Las variables nuevas que la página web generadora debe producir, con el catálogo de cada
`select`, están en `docs/variables_nuevas.md`.
 
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
| `condicion` | Rama del formulario en la que el campo existe. Opcional |
 
```json
{ "id": "...ddlAPP_GENDER",  "tipo": "select", "variable": "sexo" }
{ "id": "...tbxAPP_SURNAME", "tipo": "texto",  "variables": ["primerApellido", "segundoApellido"] }
{ "id": "...ddlSpouseAddressType", "tipo": "select", "valor": "H" }
{ "id": "...cbexAPP_SSN_NA", "tipo": "checkbox", "valor": true }
{ "id": "...dtlSocial_ctl03_ddlSocialMedia", "tipo": "select", "manual": true }
```
 
El archivo lleva un campo `version` en la raíz. Esa versión debe mostrarse en la interfaz **una
sola vez, en el pie de la ventana**: con el mapeo embebido en el `.exe`, es la única forma de
saber qué mapeo lleva una copia instalada cuando un llenado sale mal.
 
**`checkbox` (desde la v2.2 del mapeo):** su `valor` es booleano — `true` = marcado,
`false` = desmarcado. La app compara el estado actual del control y solo hace `.click()` si
difiere; nunca asigna `checked` directamente, porque varios de estos checkboxes disparan
postback.
 
**Repetidores:** se declaran con slots explícitos `ctl00` … `ctl04`, una variable numerada por
slot (`idioma1`…`idioma5`, `paisVisitado1`…`paisVisitado5`, `lugarPlaneadoEEUU1`…`5`,
`acompananteViaje1…5`). Las filas `ctl01`–`ctl04` no existen en el DOM hasta pulsar
"Add Another": si no están, el campo se marca **omitido**, no error.
 
**Numeración corrida obligatoria (hallazgo de la Fase 1).** Illari mira **hasta qué número hay
dato**, no cuántos slots traen dato: si el JSON manda solo `lugarPlaneadoEEUU5`, la app agrega
igual las cuatro filas anteriores y quedan vacías. **La página web debe compactar sus listas a
`1..N`, sin huecos.** El techo de 5 slots viene del mapeo, no del código.
 
`pendientes`: variables sin `id` relevado. Lista de tareas viva.
 
**Campos condicionales (desde la v2.6 del mapeo).** Un campo que solo existe en una rama del
formulario lo declara con `condicion`:
 
```json
{ "id": "...tbxArriveCity", "tipo": "texto", "variable": "ciudadLlegadaEEUU",
  "condicion": { "variable": "tienePlanesViajeConcretos", "valor": "Y" } }
 
{ "id": "...tbxEmpSchName", "tipo": "texto", "variable": "empleadorActual",
  "condicion": { "variable": "categoriaOcupacionActual", "valorExcepto": ["H", "RT", "N"] } }
```
 
- `condicion` es **opcional**. Un campo sin ella se comporta exactamente como antes.
- Lleva `variable` más **uno solo** de `valor` (la rama activa con ese valor) o `valorExcepto`
  (la rama activa con cualquier valor menos esos). Los dos aceptan texto o lista de textos.
- La variable disparadora vive **en la misma pantalla**. El validador lo comprueba (§10.1):
  una condición que apunte a otra pantalla no se puede evaluar y haría que la app saltara el
  campo en silencio.
- Comportamiento en la app: si el dato del cliente **no cumple** la condición, el campo se marca
  **omitido — no aplica** y ni siquiera se busca en el DOM. Si **la cumple** y el control no
  está, eso sí es **no encontrado**, y ahora significa de verdad que algo se rompió. Si la
  variable disparadora **no vino** en el JSON, se marca **omitido — sin dato disparador**; la
  app no adivina.
- Consecuencia para el generador: la página web debe emitir **siempre** las variables
  disparadoras, aunque la respuesta sea `"N"`.
- Algunas condiciones llevan `_verificar` porque se dedujeron del inventario y no de una prueba
  en vivo. La marca se quita cuando la prueba real las confirma.
 
Un control que no esté en el DOM y **no** tenga `condicion` se sigue marcando **omitido**, no
error, igual que antes.
 
`Spouse` es el único caso que necesitaría una condición **de pantalla** y no de campo: el DS-160
la muestra según `ddlAPP_MARITAL_STATUS`, pero no está confirmado con qué valores exactos.
Declararla mal haría que la app saltara la pantalla entera, así que **no se declara** hasta
verificarlo.
 
---
 
## 8. Hechos confirmados del DS-160 (relevamiento en vivo)
 
Estos reemplazan a las suposiciones de la v4. Todos verificados sobre el formulario real.
 
- **Los `rbl` son contenedores `<table>`.** Los inputs reales son `id + "_0"` (`value="Y"`) e
  `id + "_1"` (`value="N"`). Hay que hacer `.click()` sobre el input, nunca escribir sobre el
  `id` base. Afecta a más de 40 campos.
- **Meses y días son NÚMEROS SIN CERO A LA IZQUIERDA — corregido el 2026-09-08.** Meses: `1`…`12`.
  Días: `1`…`31`. Leído del formulario en vivo: el `<option>` de enero es
  `value="1"` con texto visible `JAN`, y el de diciembre `value="12"`; el día 1 es `value="1"` y
  el 9 es `value="9"`.
  El relevamiento original anotó el **texto visible** creyendo que era el `value`, y por eso el
  plan y el inventario decían `JAN`…`DEC` y `01`…`31`. Ese error explica el síntoma de la
  primera prueba real de `Travel`: el mes de `fechaLlegadaEEUU` y `fechaSalidaEEUU` **no se
  llenaba** (día y año sí, porque `05` y `5` colisionan poco en los días bajos). Afectaba a
  **todas** las fechas del formulario: nacimiento, pasaporte, empleos, educación, visas.
  `CodigosDeMes` en `LlenadorDS160.cs` hay que cambiarlo a números, y revisar que el día no se
  formatee con cero a la izquierda.
- **`node=Family` no es una pantalla.** Redirige a `complete_family1.aspx?node=Relatives`.
  Padre, madre y familiares inmediatos están todos en `Relatives`. Total: **18 pantallas**.
- **Las listas de países son varias y distintas:** nacionalidad (212), nacionalidad del cónyuge
  (213), residencia permanente (253), lugar de nacimiento (281), autoridad emisora del
  pasaporte (217), lugar físico de emisión (253). No son intercambiables.
- **`ddlSpouseAddressType`: el valor "igual que la del solicitante" es `"H"`**, no `""`.
- **Los repetidores solo traen la fila `ctl00` en una solicitud nueva.** Las demás requieren
  "Add Another". Tres precisiones salidas de la prueba real:
  - **Cada fila dibuja su propio botón "Add Another"** (`<prefijo>_ctlNN_InsertButton…`). Hay
    que pulsar el de la **última** fila; los anteriores insertan en medio. En `Travel` además
    convive `dlPrincipalAppTravel_ctl00_InsertButtonAlias`, que es de otro repetidor.
  - **Las filas agregadas se guardan en el servidor.** Al volver a la misma pantalla del mismo
    cliente siguen ahí: hay que **contar los slots presentes antes de pulsar**, o se duplican.
  - El `id` del botón "Add Another" **no está relevado**. Illari lo localiza por el texto y lo
    acota por el prefijo del repetidor; falta verificarlo contra el DS-160 real.
- **`ceac.state.gov` está detrás de Cloudflare:** la URL trae `__cf_chl_rt_tk`, así que el
  `node=` hay que buscarlo **entre los parámetros**, no comparando la URL completa.
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
**Regla de operación resultante — cuatro fases por pantalla (refinada en la Fase 1):**
 
1. Disparadores (`disparaPostback`) que están **fuera** de repetidores.
2. Pulsar "Add Another" las veces que falten, contando las filas ya presentes (§9).
3. Disparadores que están **dentro** de repetidores.
4. El resto de los campos.
 
Separar 1 de 3 hace falta porque `dtlSocial_ctl01…ctl03_ddlSocialMedia` son postback y slots de
repetidor a la vez. Para los pares `rbl`/`tbx` sin postback la app puede escribir el `textarea`
directamente sin tocar el radio.
 
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
**Campos condicionales:** los campos con `condicion` (§7) se evalúan **antes** del paso 6. Si la
rama no aplica, se marcan *omitido — no aplica* y no se buscan en el DOM; si aplica, siguen el
flujo normal y un control ausente sí cuenta como *no encontrado*.
 
**Repetidores:** antes de escribir en los slots `ctl01`–`ctl04`, **contar las filas que ya
existen** y pulsar "Add Another" solo las veces que falten, siempre sobre el botón de la última
fila (§8). El número **ya no es fijo**: la afirmación anterior "en `AddressPhone` son siempre
tres pulsaciones" dejó de ser exacta, porque las filas agregadas en una visita anterior siguen
guardadas en el servidor.
 
---
 
## 10. Comprobaciones
 
### 10.1. Validación del mapeo — fuera de la aplicación
 
`tools/validar_mapeo.py` (el plan lo listaba en `claude/`; vive en `tools/` del repositorio de
Illari) se ejecuta **al editar el mapeo, antes de compilar**. Es un paso obligatorio del flujo
de trabajo. Pasó de 4 a **7 comprobaciones** sobre `mapeo_ds160.json`:
 
- `id` duplicados dentro de una misma pantalla.
- Campos `fecha` que no tengan exactamente 3 `id`.
- Campos con más de un origen, o con ninguno.
- Tipo faltante o desconocido.
- Tipo del campo `valor`: booleano en `checkbox`, texto en el resto.
- Que todo `id` sea texto o lista de textos.
- Que `condicion` esté bien formada y su variable disparadora exista en la misma pantalla.
 
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
 
### Fase 1: MVP funcional — **FUNCIONALMENTE TERMINADA**
- ✅ WPF con navegación y módulo Formularios.
- ✅ Carga del JSON del cliente, con el nombre del archivo visible.
- ✅ WebView2 integrado, navegación libre.
- ✅ Mapeo embebido, con su versión visible.
- ✅ Llenado por pantalla con resultado por campo: llamadas, postbacks, reintentos y repetidores.
- Pendiente: la primera prueba real completa de las 18 pantallas. Solo se probó `Travel`.
### Fase 2: Robustez
Resaltado de campos llenados, limpieza selectiva, mejor manejo de errores.
 
### Fase 3: Crecimiento
Nuevos módulos; reevaluación de Playwright.
 
---
 
## 13. Decisión de alcance — RESUELTA
 
Cada campo del DS-160 sin variable en la plantilla recibió una de tres decisiones: **página
web** (la genera el generador y la trae la app), **manual** (el usuario lo completa a mano) o
**valor fijo** (la app lo llena siempre igual). El detalle está en `decisiones_alcance.md` y ya
está aplicado en `mapeo_ds160.json` **v2.6**, que pasa las siete comprobaciones de
`validar_mapeo.py` con 0 errores. La v2.6 tiene **18 pantallas, 318 campos, 209 variables** con
`id` relevado y **141 campos con `condicion`** declarada. El único `pendientes` que queda en todo el archivo es
`tieneIdentificacionFiscalEEUU` en `Personal2`, y es correcto: esa variable se queda en la web y
no se emite.
 
### 13.1. Campos del DS-160 sin variable en la plantilla — resuelto
 
Todos incorporados al mapeo: lugar de nacimiento, checkboxes "Do Not Know" / "Does Not Apply"
de todas las pantallas, bloque del pagador, `PptVisa` completa, las 14 preguntas de `USContact`
y los 29 pares indicador + explicación de Security and Background. El mapeo pasó de 128 a
**304 campos** en la v2.3, y a **318** desde la v2.5.
 
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
  variable. **Desde la v2.4 la cuarta fila queda entera manual:** `otrasRedesSociales` salió del
  modelo, así que tanto la plataforma (`dtlSocial_ctl03_ddlSocialMedia`) como el identificador
  (`dtlSocial_ctl03_tbxSocialMediaIdent`) los carga el operador. Las pulsaciones de
  "Add Another" ya no son un número fijo (§9).
- `ddlSpouseNatDropDownList` (213 opciones) **ya está diffeado** contra las 212 de `ddlAPP_NATL`
  (2026-09-03): la diferencia es una sola entrada, `USA|UNITED STATES OF AMERICA`.
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
 
> **Corrección de la v2.4 — dos de estos once checkboxes vuelven a marcado.** Decidido el
> 2026-09-08: `cbexAPP_MOBILE_TEL_NA` y `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` van **marcados**, y sus
> campos de texto (`tbxAPP_MOBILE_TEL` y `tbxWORK_EDUC_ADDR_POSTAL_CD`) salen del mapeo. Con el
> checkbox marcado el DS-160 deshabilita el campo y **no lo exige**, así que `telefonoDomicilio`
> y `codigoPostalTrabajoActual` salen del modelo y el cliente no tiene que cargarlos en la web.
> Efecto: el único teléfono que llega al DS-160 es el celular, en "Primary Phone Number", y el
> código postal del trabajo no se manda. Es reversible: si algún día se necesitan, se desmarca
> el checkbox y se vuelven a agregar las dos variables. **Los otros nueve siguen desmarcados**, y
> sus variables sí son obligatorias.
 
Quedan marcados solo 7 checkboxes, todos sin variable detrás y por lo tanto sin conflicto:
`cbexAPP_FULL_NAME_NATIVE_NA`, `cbexAPP_POB_ST_PROVINCE_NA`, `cbexAPP_SSN_NA`,
`cbexAPP_BUS_TEL_NA`, `cbexPPT_BOOK_NUM_NA`, `cbxUS_POC_ORG_NA_IND`, `cbexUS_POC_EMAIL_ADDR_NA`.
 
### 13.6. Lo que queda abierto
 
No bloquea la Fase 1, pero conviene resolverlo antes de la primera prueba real:
 
1. **Dos catálogos sin volcar: RESUELTO (2026-09-03).** `ddlPayerRelationship`
   (`catalogo_relacion_pagador.md`, 7 entradas / 6 seleccionables) y `ddlPPT_TYPE`
   (`catalogo_tipo_documento_pasaporte.md`, 6 entradas / 5 seleccionables) ya están volcados.
   No falta ninguno de los 19; el único sin volcar por baja prioridad es `ddlSocialMedia`
   (22 opciones), que va manual.
2. **Slots `ctl01`–`ctl04` inferidos** de los repetidores `dtlLANGUAGES` y
   `dtlCountriesVisited`: solo se relevó `ctl00`. En `dtlTravelLoc` la prueba real de la Fase 1
   confirmó que el patrón es correcto.
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
 
**Estado real (2026-09-04): el catálogo ya existe de hecho, en dos formas que no coinciden.**
 
- `docs/ejemplo_datos_cliente.json` (repositorio de Illari, 2026-09-02): fixture de cliente
  ficticio con **196 variables** y su forma exacta — 69 objeto `{texto, valor}`, 107 string
  plano y 20 fecha `AAAA-MM-DD`. Ninguna variable aparece con dos tipos distintos. Es hoy el
  contrato de facto entre los dos proyectos, y este plan no lo mencionaba.
- `mapeo_ds160.json` **v2.5** referencia **209 variables**. La diferencia son las 16 de
  `familiarInmediato2..5` (declaradas en la v2.4) menos `telefonoDomicilio`,
  `codigoPostalTrabajoActual` y `otrasRedesSociales`, que salieron del modelo en la v2.4.
 
**Decisión original, todavía válida como destino: se genera cuando la página web generadora esté
lista**, desde la misma fuente que la alimenta, para que no haya dos listas que mantener. Hasta
entonces las dos comprobaciones de §10.1 quedan sin cubrir. Pendiente inmediato: regenerar el
fixture a las 209 variables.
 
---
 
## 16. Decisiones tomadas (2026-09-08)
 
Los conflictos que la v5.3 dejó abiertos entre Illari y la página web quedaron resueltos.
 
### 16.1. Formato de los `radio` — RESUELTO
 
Gana el formato de la página web: **string plano** `"Y"` / `"N"`. El objeto `{texto, valor}` no
aportaba nada, porque `"Y"`/`"N"` ya es el `value` del DS-160 y la app no muestra el `texto`
desde que se eliminó el panel de revisión (§5.1).
 
Se comprobó además que Illari **carga y llena correctamente** un radio en string plano, así que
no hizo falta tocar código: el conflicto era solo de documentación. §4 y §6 quedan corregidos, y
ahí queda anotado que la app tolera las dos formas a propósito.
 
### 16.2. `telefonoDomicilio` y `codigoPostalTrabajoActual` — RESUELTO
 
Gana el criterio de la página web: los dos checkboxes "Does Not Apply" van **marcados**, los
campos de texto salen del mapeo y las dos variables salen del modelo. Detalle y efectos en
§13.5. El mapeo ya estaba así desde la v2.4; lo que se corrigió fue el texto de este plan y de
`variables_nuevas.md`, que describían lo contrario.
 
### 16.3. Campos condicionales — APROBADO E IMPLEMENTADO
 
`condicion` entra al esquema del mapeo (§7), con `valor` y `valorExcepto`. La v2.6 declara **141
campos condicionales**, deducidos del bloque `--- CONDICIONALES ---` del inventario cruzado con
el mapeo, sin tocar el formulario en vivo. El validador gana una séptima comprobación (§10.1).
 
Tres grupos llevan `_verificar` porque el inventario no los deja cerrados del todo y se
dedujeron por semántica: los acompañantes de `TravelCompanions` (`viajaConOtros`), las visitas
anteriores y el bloque de visa previa de `PreviousUSTravel` (`haVisitadoEEUU`,
`haTenidoVisaEEUU`). La primera prueba real completa los confirma o los corrige.
 
**Regla de oro para mantener esto:** una `condicion` **ausente** no rompe nada — el campo se
comporta como siempre. Una `condicion` **equivocada** hace que la app salte un campo que sí
debía llenar, y no lo vas a notar. Ante la duda, no declararla.
 
### 16.4. Desviaciones de Illari — ACEPTADAS
 
| Qué hizo Illari | Estado |
|---|---|
| Guarda preferencias de interfaz (tema, pantalla completa) en `%APPDATA%\Illari\configuration.json`, con `Illari/Comun/Configuracion.cs` | **Aceptado.** §5.2 excluye la persistencia de datos del cliente y de la sesión del DS-160, no las preferencias de la ventana |
| Reemplazó el árbol de navegación izquierdo por menú superior en cascada, portada, botón de búsqueda y temas claro/oscuro | **Aceptado.** El Anexo B ya lo refleja |
| "Volver al inicio" oculta la vista en vez de descartarla, para no destruir el WebView2 y perder login y caché | **Aceptado y documentado.** No era una desviación: destruir el WebView2 obliga a repetir login y captcha |
| Mostraba la versión del mapeo en dos sitios | **Resuelto:** queda **solo en el pie**. Se saca de la barra superior |
 
### 16.5. Acentos y caracteres no ASCII — SIN PROBAR
 
El fixture lleva `Villacís`, `Peñafiel` y `logística` a propósito, para descubrir si el DS-160
rechaza los no-ASCII. **Todavía no se probó.** Si los rechaza, la normalización le toca a la
página web.
 
### 16.6. Lo que la primera prueba real completa tiene que confirmar
 
1. Los tres grupos de `condicion` marcados con `_verificar` (§16.3).
2. Que los meses y días numéricos llenan bien **todas** las fechas, no solo las de `Travel`.
3. El `id` real del botón "Add Another", que hoy se localiza por texto.
4. Los acentos (§16.5).
5. Con qué valores de `ddlAPP_MARITAL_STATUS` aparece la pantalla `Spouse`, para poder declarar
   su condición de pantalla (§7).
 
---
 
## Anexo A: Archivos del proyecto (documentación)
 
| Archivo | Contenido |
|---|---|
| `plan_asistente_formularios_v5.md` | Este documento. Fuente de verdad del proyecto. |
| `mapeo_ds160.json` | Mapeo campo → `id`. **v2.6**: 18 pantallas, 318 campos, 209 variables, 141 con `condicion`. |
| `decisiones_alcance.md` | Decisión por campo: página web / manual / valor fijo. |
| `variables_nuevas.md` | Variables que debe generar la página web, con su catálogo. Vive en `docs/`, no en `claude/`. |
| `ejemplo_datos_cliente.json` | Fixture de cliente ficticio, en `docs/` del repositorio de Illari. Contrato de facto del JSON de datos (§15). Hoy en 196 variables; hay que regenerarlo a 209. |
| `inventario_ds160_parcial.md` | Relevamiento completo de las 18 pantallas. |
| `validar_mapeo.py` | Validador del mapeo, 7 comprobaciones. Vive en `tools/` del repositorio de Illari, no en `claude/`. Se ejecuta antes de compilar. |
| `metodo_relevamiento.md` | Procedimiento de relevamiento, reutilizable. |
| `relevamiento_<Pantalla>.md` | Detalle por pantalla. |
| `catalogo_*.md` | Los 19 catálogos con `value`, inglés y español. Insumo de la página web; viven en `docs/` de ese repositorio y **no** están en el de Illari. |
| `diagnostico_json_ds160.md` | Diagnóstico del generador web. **Documento histórico:** sus conteos de catálogos y sus números de línea ya no describen el estado actual. |
| `FORMULARIO VISA.pdf` | Plantilla de origen. Referencia del modelo, ya no fuente de datos. |
 
---
 
## Anexo B: Estructura del proyecto Illari
 
```
Illari/                         raíz de la solución y del repositorio
├── Illari.sln
├── CLAUDE.md                   contexto permanente para Claude Code
├── .gitignore
├── docs/                       copia de la documentación del proyecto
│                            (incluye ejemplo_datos_cliente.json, §15)
├── tools/
│   └── validar_mapeo.py        el plan lo listaba en claude/; vive aquí
└── Illari/                     carpeta del proyecto
    ├── Illari.csproj              Versión de .NET, paquetes NuGet, publicación
    │                              single-file, mapeo como recurso embebido
    ├── App.xaml                   Ventana de inicio y diccionarios de recursos
    ├── App.xaml.cs                Arranque: verificación de WebView2 (§10.2)
    ├── VentanaPrincipal.xaml      Menú superior en cascada + portada + área de contenido
    │                              (era árbol de navegación; cambiado en la Fase 1, aceptado
    │                              en §16.4). El pie muestra la versión del mapeo
    ├── VentanaPrincipal.xaml.cs   Solo InitializeComponent()
    ├── VentanaPrincipalViewModel.cs   Pestañas y qué vista se muestra en cada una
    │
    ├── Comun/
    │   ├── ElementoNavegacion.cs  Un nodo de navegación: título, hijos, ViewModel que abre
    │   └── Configuracion.cs       Preferencias en %APPDATA%\Illari\configuration.json
    │                              (tema, pantalla completa) — aceptado, ver §16.4
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