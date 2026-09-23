# Plan de la aplicación de escritorio modular — Asistente de llenado DS-160
 
**Versión:** 5.12
**Estado:** Fase 0 (relevamiento) **completa** — 18 pantallas, más `DeceasedSpouse`, relevada el
2026-09-23 en la prueba con el fixture jubilado: **19 en total**.
Fase 0.5 (decisión de alcance) **completa** — ver sección 13.
Fase 1 (MVP funcional) **terminada**: entre el 2026-09-22 y el 2026-09-23 los **tres fixtures**
—máximo, mínimo y jubilado— recorrieron el formulario de punta a punta, con todas las pantallas
llenas y guardadas en el DS-160 real (§16.6). Lo único que la app nunca llenó es `DeceasedSpouse`,
que se relevó a mano.
 
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
 
Cambios de la v5.5 (2026-09-10): mapeo **v2.7**. Se aplica a `identificacionFiscalEEUU` el mismo
criterio que ya se había usado con `telefonoDomicilio`: `cbexAPP_TAX_ID_NA` pasa a **marcado** y
`tbxAPP_TAX_ID` sale del mapeo (§13.5). Con eso salen del modelo esa variable y
`tieneIdentificacionFiscalEEUU`, y **el mapeo se queda sin `pendientes`** por primera vez: 317
campos, 208 variables. Los tres fixtures se regeneraron contra la v2.7 (§15).
 
Cambios de la v5.6 (2026-09-14): Illari implementa lo decidido en la v5.4 y la v5.5, y arranca la
primera prueba real con los fixtures. Día y mes se emiten como números sin cero a la izquierda, y
se quita el plan B que elegía la opción de un `select` por su texto visible (§9). `condicion`
queda implementada, con un estado propio **no aplica** en el resumen (§7, §16.3). Se decide que
un control ausente **sin** `condicion` siga marcándose **no encontrado**, y se explica por qué
(§7). La versión del mapeo ya estaba solo en el pie (§16.4). La prueba real, detenida en
`Personal2`, **contradice en parte la corrección de meses de la v5.4**: `ddlDOBMonth` usa `JAN`…`DEC`
como `value` (§8). También confirma que el DS-160 **rechaza los acentos** en los apellidos
(§16.5); la página web ya normaliza el texto y ahora queda anotado en §4. Y encuentra que al
mapeo le faltaba la pregunta del pasaporte de la otra nacionalidad: el mapeo **v2.8** la agrega
fija en "N" (318 campos, 142 con `condicion`; §16.6).
 
Cambios de la v5.7 (2026-09-22): **primera prueba real completa** con el fixture máximo, las 18
pantallas llenas y guardadas (§16.6). El mapeo pasa a **v2.9** (319 campos, 143 con `condicion`):
tres radios disparadores que sí recargan la página, la condición de `rblGroupTravel`, la pregunta
de ESTA y los `value` reales de las redes sociales. Se confirman los **tres grupos `_verificar`** y
se les quita la marca (§16.3). Los `value` de mes y día **tienen tres formatos distintos** que
conviven en el formulario (§8). El DS-160 rechaza acentos, puntos y barras, y ante un texto más
largo que el `maxlength` **rompe la sesión**: Illari ahora lo detiene antes de escribir (§9, §16.5).
Quedan tres `select` de país sin mapear (§13.6) y una espera corta tras los postbacks (§16.6).
 
Cambios de la v5.8 (2026-09-23): se implementan las dos correcciones que la prueba dejó abiertas.
El mapeo pasa a **v2.10**: los campos `fecha` declaran `formatoMes` y `formatoDia` (§7), y el
validador gana una **octava** comprobación (§10.1). Illari escribe el mes y el día según ese
formato, así que las fechas de `Personal1`, `Relatives`, `Spouse` y `PptVisa` ya no hay que
corregirlas a mano. Las esperas tras un postback suben a 2 s de gracia, 4 intentos y 1 s entre
reintentos (§16.6, punto 7).
 
Cambios de la v5.9 (2026-09-23): **segunda prueba real completa**, con el fixture mínimo (§16.6).
Los formatos de fecha de la v2.10 funcionaron. El mapeo pasa a **v2.11** con tres correcciones que
solo la rama `N` podía descubrir: la dirección de hospedaje de `Travel` **no** era condicional, y
cuatro radios de `PreviousUSTravel` sí lo son. Aparece un límite del esquema: los radios de
`SecurityandBackground` 4 y 5 dependen de una variable de **otra** pantalla y hoy no se pueden
declarar (§16.6, punto 8). Los tres `select` de país tienen catálogo identificado y quedan como
pendiente de la página web (§13.6).
 
Cambios de la v5.10 (2026-09-23): **tercera prueba real completa**, con el fixture jubilado, y con
eso **los tres fixtures recorrieron el formulario entero** (§16.6). `valorExcepto` queda
confirmado. Los tiempos nuevos de postback también: `PreviousUSTravel` se llenó en una sola
pasada. El mapeo pasa a **v2.12**: la pregunta de ESTA depende de `visaNegada`, no del bloque de
visa previa, y la fecha de nacimiento de `Personal1` lleva día con cero. Aparecen dos bloques del
DS-160 que el mapeo no cubre —la **pantalla de cónyuge fallecido** y la **dirección del
pagador**— y dos reglas de consistencia de datos para la web (§16.6). Nueva herramienta
`tools/revisar_fixture.py`, que cruza un JSON de cliente contra el mapeo antes de usarlo (§10.1).
 
Cambios de la v5.11 (2026-09-23): se resuelven los puntos que la tercera prueba dejó abiertos.
El mapeo pasa a **v2.13**, con **19 pantallas**: se agrega `DeceasedSpouse`, que reutiliza las
variables del cónyuge (§16.6, punto 9). **Se permiten condiciones entre pantallas** (§7): los
cuatro radios de `Security` declaran `haVisitadoEEUU = Y`, que vive en `PreviousUSTravel`, y el
validador ahora solo exige que la variable disparadora exista en el mapeo. La dirección del
pagador **no se mapea**: la web emite siempre al solicitante como pagador (§16.6, punto 10).
Los tres fixtures se regeneraron contra la v2.13 (§15): el mínimo suma los tres campos de
hospedaje, se corrigen los datos que el DS-160 rechazaba y **dejan de llevar acentos**, porque
ya emiten lo mismo que la página web.
 
Cambios de la v5.12 (2026-09-24): mapeo **v2.14**. `Spouse` y `DeceasedSpouse` declaran
`condicion` sobre `estadoCivil` en todos sus campos (§7), con lo que se cierra el último foco de
*no encontrado* falso: un cliente soltero sacaba 13 entre las dos pantallas y uno casado sacaba 7
en `DeceasedSpouse`. El fixture mínimo baja a **89 variables** al salir los seis datos del cónyuge,
que en una soltera no tenían dónde ir (§15). Se corrige `revisar_fixture.py`, que daba un falso
positivo cuando dos pantallas comparten variables (§10.1). Y se documenta el **hueco del pagador**:
la web ofrece cinco opciones y solo una está mapeada (§13.6, punto 6).
 
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
- **Texto sin tildes ni caracteres no ASCII.** La página web **normaliza todo el texto** antes
  de emitir el JSON: quita tildes y convierte `ñ` en `N`. Hace falta porque el DS-160 rechaza
  al guardar cualquier carácter fuera de A-Z en nombres y apellidos (§16.5). La aplicación no
  normaliza nada: escribe el valor tal cual llega. Los fixtures de `docs/` conservan los acentos
  **a propósito**, para probar ese rechazo, así que no representan lo que emite la web.
 
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
 
Una variable que el archivo del cliente no traiga hace que su campo quede **omitido**. No es un
error. Es distinto de un control ausente del DOM, que se marca **no encontrado** (§7).
 
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
| `formatoMes` / `formatoDia` | Solo en `fecha`: formato del `value`. Opcional |
 
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
 
**Formato de las fechas (desde la v2.10 del mapeo).** El `value` del mes y del día no es el
mismo en todas las pantallas y **no se deduce del texto visible** (§8), así que cada campo
`fecha` puede declararlo:
 
```json
{ "id": ["...ddlDOBDay", "...ddlDOBMonth", "...tbxDOBYear"], "tipo": "fecha",
  "formatoMes": "abreviado", "variable": "fechaNacimiento" }
```
 
- `formatoMes`: `numero` (`1`…`12`), `numeroConCero` (`01`…`12`) o `abreviado` (`JAN`…`DEC`).
- `formatoDia`: `numero` (`1`…`31`) o `numeroConCero` (`01`…`31`).
- Los dos son **opcionales** y valen `numero` si no se declaran, que es como se comportaba la
  app antes. El año siempre es un input de texto.
- Se declaran **solo cuando la prueba real los verificó**. Si el formato está mal, la app no
  encuentra la opción y el campo queda como **advertencia** con la lista de opciones reales: se
  ve, no se pierde en silencio.
 
**`checkbox` (desde la v2.2 del mapeo):** su `valor` es booleano — `true` = marcado,
`false` = desmarcado. La app compara el estado actual del control y solo hace `.click()` si
difiere; nunca asigna `checked` directamente, porque varios de estos checkboxes disparan
postback.
 
**Repetidores:** se declaran con slots explícitos `ctl00` … `ctl04`, una variable numerada por
slot (`idioma1`…`idioma5`, `paisVisitado1`…`paisVisitado5`, `lugarPlaneadoEEUU1`…`5`,
`acompananteViaje1…5`). Las filas `ctl01`–`ctl04` no existen en el DOM hasta pulsar
"Add Another", y la app las agrega antes de escribir (§9). Si aun así una fila no aparece, sus
campos se marcan **no encontrado**, y el resumen avisa qué pasó con el botón (ver más abajo la
regla de los controles ausentes).
 
**Numeración corrida obligatoria (hallazgo de la Fase 1).** Illari mira **hasta qué número hay
dato**, no cuántos slots traen dato: si el JSON manda solo `lugarPlaneadoEEUU5`, la app agrega
igual las cuatro filas anteriores y quedan vacías. **La página web debe compactar sus listas a
`1..N`, sin huecos.** El techo de 5 slots viene del mapeo, no del código.
 
`pendientes`: variables sin `id` relevado. Lista de tareas viva. **Desde la v2.7 está vacía en
las 18 pantallas**: no queda ninguna variable del modelo sin `id`.
 
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
- La variable disparadora puede vivir **en cualquier pantalla** (desde el 2026-09-23). La app
  evalúa la condición contra el diccionario del cliente, que no está separado por pantallas, así
  que una condición entre pantallas funciona igual. Hizo falta porque cuatro radios de `Security`
  dependen de `haVisitadoEEUU`, que es de `PreviousUSTravel` (§16.6, punto 8). El validador sigue
  comprobando que la variable **exista en el mapeo**, que es lo que atrapa un nombre mal escrito.
- Comportamiento en la app: si el dato del cliente **no cumple** la condición, el campo se marca
  **no aplica** y ni siquiera se busca en el DOM. Es un estado propio, contado aparte en el
  resumen y con su propio color. Si **la cumple** y el control no está, eso sí es **no
  encontrado**, y el detalle lo dice ("…aunque su rama aplica (X = Y)"). Si la variable
  disparadora **no vino** en el JSON, se marca **omitido — sin dato disparador**, con un aviso
  por variable; la app no adivina. Si el dato viene como objeto `{texto, valor}` se compara su
  `valor`; si viene como string plano, el string.
- Consecuencia para el generador: la página web debe emitir **siempre** las variables
  disparadoras, aunque la respuesta sea `"N"`.
- Algunas condiciones llevan `_verificar` porque se dedujeron del inventario y no de una prueba
  en vivo. La marca se quita cuando la prueba real las confirma.
 
**Control ausente sin `condicion`: se marca *no encontrado*, no *omitido* (decidido el
2026-09-14).** Hasta la v5.5 este plan decía lo contrario, pero Illari siempre lo marcó *no
encontrado*, y se decide dejarlo así por estas razones:
 
- La regla de *omitido* se escribió cuando todavía no existían las condiciones, y cualquier
  campo de una rama oculta salía en rojo sin que hubiera un error. Con 146 condiciones
  declaradas, un control sin condición que falta es casi siempre un error real.
- Un *omitido* se pierde entre los omitidos normales, que son los campos manuales y los que no
  traen dato (`SecurityandBackground3` muestra 12 en cada llenado). Ejemplo: si el DS-160
  renombra `tbxAPP_SURNAME`, en rojo se ve en el momento; en gris pasa desapercibido y el campo
  queda vacío.
- Mantiene la coherencia entre repetidores. Si falla "Add Another", los slots de `dtlTravelLoc`
  (con condición) salen en rojo; con la regla vieja, los de `dtlLANGUAGES` y `dtlSocial` (sin
  condición) saldrían en gris por la misma falla.
- Costo aceptado: un campo condicional **no declarado** (§16.3, "ante la duda, no declararla")
  sale en rojo cuando su rama no aplica. Es una falsa alarma, pero visible, y se resuelve
  declarando la condición.
 
**`Spouse` y `DeceasedSpouse` (resuelto en la v2.14, 2026-09-24).** Son las dos únicas pantallas
que existen o no según un dato del cliente, `estadoCivil`. Las pruebas del 2026-09-22 y 23
confirmaron el comportamiento: con **casado** aparece `Spouse`; con **viudo** aparece
`DeceasedSpouse` en su lugar; con **soltero** no aparece ninguna de las dos.
 
La condición va **en cada campo, no en la pantalla**. Es deliberado: ni el validador ni
`ModelosMapeo` leen una `condicion` declarada a nivel de pantalla, así que ponerla ahí se
ignoraría en silencio. A nivel de campo funciona con el código que ya existe.
 
Los dos criterios son distintos a propósito:
 
| Pantalla | Condición | Por qué |
|---|---|---|
| `Spouse` | `valorExcepto: ["S", "W"]` | Excluye **solo lo verificado**. Unión de hecho (`C`), unión civil (`P`), divorciado (`D`), separado legalmente (`L`) y otro (`O`) no se probaron, así que se dejan dentro: si alguno no muestra la pantalla, sus campos salen *no encontrado* y se ve en el resumen. Excluirlos sin saber haría que la app saltara la pantalla en silencio |
| `DeceasedSpouse` | `valor: "W"` | Aquí va cerrada. Las dos pantallas comparten las mismas 6 variables del cónyuge, así que con una condición abierta un cliente casado intentaría llenar `DeceasedSpouse` y sacaría 7 *no encontrado* |
 
La asimetría es el principio general para declarar condiciones: **un `valorExcepto` equivocado
degrada a *no encontrado*, que se ve; un `valor` equivocado salta el campo en silencio.** Ante la
duda, `valorExcepto` con la lista corta de lo confirmado.
 
Qué mirar cuando aparezca un cliente con `C`, `P`, `D`, `L` u `O`: si los campos de `Spouse` salen
*no encontrado*, ese estado civil no muestra la pantalla y se agrega a su `valorExcepto`.
 
---
 
## 8. Hechos confirmados del DS-160 (relevamiento en vivo)
 
Estos reemplazan a las suposiciones de la v4. Todos verificados sobre el formulario real.
 
- **Los `rbl` son contenedores `<table>`.** Los inputs reales son `id + "_0"` (`value="Y"`) e
  `id + "_1"` (`value="N"`). Hay que hacer `.click()` sobre el input, nunca escribir sobre el
  `id` base. Afecta a más de 40 campos.
- **Meses y días: conviven TRES formatos de `value` — relevado el 2026-09-22.** No hay una regla
  única, y **el `value` no se puede deducir del texto visible**: en `WorkEducation1` el día se ve
  `02` y el mes `APR`, pero sus `value` son `2` y `4`. Lo que sigue sale de la prueba real, campo
  por campo, leyendo las opciones que la app reporta cuando el `value` no existe:
 
  | Pantalla | Fecha | Mes | Día |
  |---|---|---|---|
  | `Personal1` | Nacimiento | `JAN`…`DEC` | numérico |
  | `Travel` | Llegada y salida | numérico | numérico |
  | `PreviousUSTravel` | Última visa y 5 visitas | numérico | numérico sin cero |
  | `PptVisa` | Emisión y expiración | `01`…`12` | sin determinar |
  | `Relatives` | Nacimiento del padre | `JAN`…`DEC` | sin determinar |
  | `Relatives` | Nacimiento de la madre | `JAN`…`DEC` | `01`…`31` |
  | `Spouse` | Nacimiento del cónyuge | `JAN`…`DEC` | `01`…`31` |
  | `WorkEducation1` | Inicio del trabajo actual | numérico | numérico sin cero |
  | `WorkEducation2` | Trabajo anterior y estudios (4) | numérico | numérico sin cero |
 
  "Sin determinar" significa que el dato del fixture no distinguía los dos formatos: un día `19`
  o `15` entra igual con cero o sin él. La v5.4 había generalizado a partir de `Travel` que todos
  eran numéricos, y por eso Illari emite números desde el 2026-09-10; las fechas de los otros dos
  formatos quedan como **advertencia** y hoy se corrigen a mano. La corrección definitiva es
  declarar el formato por campo en el mapeo (§16.6, punto 2).
- **El DS-160 rechaza caracteres al guardar, no al llenar.** Confirmado en la prueba real:
  acentos en nombres y apellidos (*"Valid characters include A-Z and single spaces"*), **puntos**
  en el nombre de un empleador (`Comercializadora Andina S.A.` es inválido) y la **barra** en una
  explicación (`B1/B2` es inválido, `B1 B2` pasa). La app no puede detectarlo: escribe el valor,
  el navegador lo acepta y el error aparece al pulsar *Next*.
- **Un texto más largo que el `maxlength` rompe la sesión.** El DS-160 no lo valida: responde
  `AppError.aspx` —"An unexpected error has occurred"— y hay que recuperar la solicitud con su
  Application ID. Pasó dos veces, con direcciones de 61 y 46 caracteres en campos de 40. Desde el
  2026-09-22 Illari lo comprueba antes de escribir (§9).
- **Cloudflare corta el paso si el ritmo no parece humano.** Tras varias pantallas seguidas,
  llenadas y navegadas sin pausas, `ceac.state.gov` devolvió *"Sorry, you have been blocked"* y
  hubo que esperar. Con el uso normal de la app —una persona revisando cada pantalla— no aparece.
- **`node=Family` no es una pantalla.** Redirige a `complete_family1.aspx?node=Relatives`.
  Padre, madre y familiares inmediatos están todos en `Relatives`. Eran **18 pantallas** hasta
  que la prueba con el fixture jubilado encontró la 19: `complete_family5.aspx?node=DeceasedSpouse`,
  que el DS-160 intercala entre `Relatives` y `WorkEducation1` **solo si el estado civil es
  viudo**. Pide los mismos datos que `Spouse`, con otros `id`.
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
   (§7).
8. Insertar el valor con el setter nativo; para radios y checkboxes, `.click()` — en los
   checkboxes, solo si el estado actual difiere del deseado. **Antes de escribir un texto se
   compara su largo con el `maxLength` del control: si lo excede no se escribe y queda como
   advertencia**, porque el DS-160 responde con su página de error y se pierde la sesión (§8).
   Un `select` se elige **solo por el `value`** de la opción. Si no existe, el campo queda como advertencia y el detalle lista las
   opciones reales. No hay plan B por texto visible: se quitó el 2026-09-10 porque escondía
   errores del mapeo y de los datos.
9. Disparar `focus`, `input`, `change` y `blur`.
10. Registrar el resultado por campo.
11. Mostrar el resumen: llenados, no encontrados, no aplican, omitidos, advertencias.
**Campos condicionales:** los campos con `condicion` (§7) se evalúan **antes** del paso 6, y
antes que cualquier otra cosa del campo, incluidos los checkboxes: hay 10 condicionales y 7 de
ellos disparan postback. Si la rama no aplica, se marcan *no aplica* y no se buscan en el DOM.
Si aplica, siguen el flujo normal, y un control ausente cuenta como *no encontrado*. Si falta la
variable disparadora, *omitido — sin dato disparador*.
 
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
de trabajo. Pasó de 4 a **8 comprobaciones** sobre `mapeo_ds160.json`:
 
- `id` duplicados dentro de una misma pantalla.
- Campos `fecha` que no tengan exactamente 3 `id`.
- Campos con más de un origen, o con ninguno.
- Tipo faltante o desconocido.
- Tipo del campo `valor`: booleano en `checkbox`, texto en el resto.
- Que todo `id` sea texto o lista de textos.
- Que `condicion` esté bien formada y su variable disparadora exista en el mapeo, en cualquier
  pantalla (§7).
- Que `formatoMes` y `formatoDia` tengan un valor conocido y solo aparezcan en campos `fecha`.
  Un valor desconocido no rompe la carga: .NET lo dejaría en `numero` y la fecha se llenaría
  mal en silencio.
 
Dos comprobaciones más quedan pendientes de que exista un catálogo canónico de variables
(§15): variables referenciadas que no existen en el modelo, y variables del modelo no
referenciadas por ningún campo.
 
Una tercera, **`node` declarado que no coincide con la pantalla donde vive el `id`**, se verificó
a mano durante el relevamiento: se encontraron dos casos reales (`rblDeport` / `tbxDeport_EXPL`
declarados en `SecurityandBackground3` pero ubicados en `SecurityandBackground4`, y
`rblOtherEduc` declarado en `WorkEducation3` pero ubicado en `WorkEducation2`), **ambos ya
corregidos**.
 
**`tools/revisar_fixture.py` (desde el 2026-09-23)** hace la comprobación complementaria: cruza un
**JSON de cliente** contra el mapeo y avisa de variables que ningún campo usa, campos que se
quedarían sin dato, **datos que caerían en una rama que no aplica** y variables disparadoras que
faltan. Sirve para revisar lo que emite la página web antes de abrir el DS-160. No reemplaza a la
prueba real: no puede ver lo que **no** está en el mapeo, que es justo donde estuvieron los
hallazgos de §16.6, puntos 9 y 10.
 
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
| Slots `ctl01`–`ctl04` inferidos del patrón, no relevados | Se marcan no encontrados si no aparecen, y el resumen avisa si falló "Add Another" (§7); verificar en la primera prueba real. |
| El DS-160 rechaza un valor al guardar aunque la app lo haya llenado (acentos, puntos, barras; §16.5) | La validación de formato es de la página web (§4). El usuario ve el error del DS-160 al pulsar *Next* y lo corrige ahí. |
| Un texto más largo que el `maxlength` rompe la sesión del DS-160 (§8) | La app lo detecta antes de escribir y lo marca como advertencia (§9, paso 8). La web además no debe emitirlo. |
| Cloudflare bloquea por ritmo no humano (§8) | Uso asistido, una pantalla por vez y revisada por el usuario. No se automatiza la navegación. |
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
- ✅ Campos condicionales (`condicion`) y estado *no aplica* en el resumen (2026-09-10).
- ✅ **Primera prueba real completa (2026-09-22):** las 18 pantallas llenadas y guardadas con el
  fixture máximo, hasta llegar a la carga de la foto (§16.6).
- ✅ **Los tres fixtures recorrieron el formulario completo** (2026-09-22 y 2026-09-23): máximo,
  mínimo y jubilado (§16.6).
- ✅ Resueltos los puntos abiertos de §16.6: la pantalla de cónyuge fallecido está mapeada, las
  condiciones entre pantallas se permiten y la dirección del pagador no se mapea (2026-09-23).
- ✅ Fixtures regenerados contra el mapeo v2.13 (2026-09-23): 205, 95 y 163 variables, unión de
  208, sin acentos y dentro del `maxlength`.
- Pendiente: lo que le toca a la **página web** (`variables_nuevas.md` §15) y volver a probar
  `DeceasedSpouse`, la única pantalla del mapeo que la app nunca llenó.
### Fase 2: Robustez
Resaltado de campos llenados, limpieza selectiva, mejor manejo de errores.
 
### Fase 3: Crecimiento
Nuevos módulos; reevaluación de Playwright.
 
---
 
## 13. Decisión de alcance — RESUELTA
 
Cada campo del DS-160 sin variable en la plantilla recibió una de tres decisiones: **página
web** (la genera el generador y la trae la app), **manual** (el usuario lo completa a mano) o
**valor fijo** (la app lo llena siempre igual). El detalle está en `decisiones_alcance.md` y ya
está aplicado en `mapeo_ds160.json` **v2.13**, que pasa las ocho comprobaciones de
`validar_mapeo.py` con 0 errores. La v2.13 tiene **19 pantallas, 326 campos, 208 variables** con
`id` relevado, **146 campos con `condicion`** declarada y **0 `pendientes`**.
 
### 13.1. Campos del DS-160 sin variable en la plantilla — resuelto
 
Todos incorporados al mapeo: lugar de nacimiento, checkboxes "Do Not Know" / "Does Not Apply"
de todas las pantallas, bloque del pagador, `PptVisa` completa, las 14 preguntas de `USContact`
y los 29 pares indicador + explicación de Security and Background. El mapeo pasó de 128 a
**304 campos** en la v2.3, a **318** en la v2.5, a **317** en la v2.7 al eliminarse
`tbxAPP_TAX_ID`, a **318** en la v2.8 al agregarse `rblOTHER_PPT_IND` fijo en "N", y a **319**
en la v2.9 con la pregunta de ESTA, `rblVWP_DENIAL_IND`, también fija en "N" (§16.6).
 
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
| Personal2 | `cbexAPP_TAX_ID_NA` | `identificacionFiscalEEUU` — *revertido en la v2.7, ver abajo* |
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
> el checkbox y se vuelven a agregar las dos variables.
>
> **Corrección de la v2.7 (2026-09-10) — un tercer checkbox vuelve a marcado.** Mismo criterio,
> ahora con `cbexAPP_TAX_ID_NA`: pasa a **marcado** y `tbxAPP_TAX_ID` sale del mapeo. Con el
> checkbox desmarcado el DS-160 exigía el número de identificación fiscal de EE. UU. aunque el
> cliente no tuviera uno. Salen del modelo `identificacionFiscalEEUU` y
> `tieneIdentificacionFiscalEEUU` — esta última solo existía para que la web decidiera si mostraba
> el campo de la primera, y era el último `pendientes` del mapeo. Contrapartida aceptada: un
> cliente que **sí** tenga tax ID ya no puede declararlo.
>
> **Los otros ocho siguen desmarcados**, y sus variables sí son obligatorias.
 
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
5. **Tres `select` de país que el DS-160 exige y el mapeo no tiene — abierto (2026-09-22).**
   Salieron en la prueba real, los tres con el mensaje *"Country/Region has not been completed"*:
 
   | Pantalla | `id` | Qué país es |
   |---|---|---|
   | WorkEducation1 | `ddlEmpSchCountry` | País del empleador o institución actual |
   | WorkEducation2 | `dtlPrevEmpl_ctl00_DropDownList2` | País del empleador anterior (id autogenerado, §8) |
   | WorkEducation2 | `dtlPrevEduc_ctl00_ddlSchoolCountry` | País de la institución educativa |
 
   Los tres están en el inventario —el primero anotado como *"[NUEVO, sin variable]"*— pero
   quedaron fuera del mapeo. Durante la prueba se completaron a mano con `ECUADOR`.
 
   **Catálogo (2026-09-23):** los tres usan el mismo que ya existe,
   `catalogo_paises_residencia_permanente.md` del repositorio de la web (253 opciones, Ecuador es
   `ECUA`). No hay que volcar ningún catálogo nuevo: **solo faltan las variables**.
 
   **Decisión (2026-09-23): van como variables de la página web**, con nombres propuestos
   `paisTrabajoActual`, `paisTrabajoAnterior` y `paisEducacion`. Un valor fijo era tentador, pero
   si estuviera equivocado el DS-160 **no se queja**: quedaría un dato falso en la solicitud sin
   que nadie lo note, al revés de un campo vacío, que sí frena al guardar. Queda **pendiente en
   la página web**; detalle en `variables_nuevas.md` §15. Hasta que existan, esos tres campos se
   completan a mano y el DS-160 los exige al guardar (con una excepción: con el fixture mínimo,
   en la rama de estudiante, `WorkEducation1` guardó sin pedir el país).
 
6. **El pagador: cuatro de sus cinco opciones abren bloques sin mapear — abierto (2026-09-24).**
   Al revisar el generador se confirmó que la web **sí** emite `pagadorViaje` como
   `{texto, valor}`, con las cinco opciones del catálogo `quienPaga`, y que despliega sus 6 campos
   **solo con `O`**. El mapeo cubre exactamente esa rama y ninguna otra:
 
   | Opción | Qué hace la web hoy | Qué pide el DS-160 | Estado |
   |---|---|---|---|
   | `S` — Yo mismo | nada | nada | cubierto |
   | `O` — Otra persona | los 6 campos del pagador | esos 6, más un bloque de dirección si `rblPayerAddrSameAsInd = N` | **mapeado a medias**: falta el sub-bloque de dirección |
   | `P` — Empleador actual | nada | nombre y dirección de la empresa | **sin mapear** |
   | `U` — Empleador en EE. UU. | nada | ídem | **sin mapear** |
   | `C` — Otra empresa | nada | ídem | **sin mapear** |
 
   Con `P`, `U` o `C` la web no pide nada y el mapeo no tiene dónde ponerlo, así que esas tres
   opciones **producen una solicitud que el DS-160 no deja guardar** y hay que completar a mano.
 
   **Decisión (2026-09-24):** la web deja `pagadorViaje` fijo en `"S"` y comenta el select y los
   6 campos condicionales, sin borrarlos. Es lo más rápido y elimina el riesgo: ninguna rama sin
   mapear puede elegirse. Para rehabilitarlo hay que relevar y mapear antes los bloques de `P`,
   `U`, `C` y la dirección del pagador de `O`. Ver `variables_nuevas.md` §15.3.
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
 
**El mapeo v2.13 referencia 208 variables** —las mismas desde la v2.7: ninguna de las versiones
v2.8 a v2.13 agrega ni quita variables, solo campos, condiciones y formatos de fecha— y esa lista
es hoy la fuente más confiable que hay. Los tres fixtures se regeneraron contra la v2.13 el
2026-09-23.
 
**Los fixtures no sirven como catálogo canónico**, y conviene tenerlo claro: un fixture es *un*
cliente concreto, así que nunca puede traer las 208. Si es soltero no tiene bloque de cónyuge; si
nunca viajó a EE. UU. no tiene visitas anteriores. Por eso hay **tres** fixtures en `docs/` del
repositorio de Illari, generados desde el mapeo para que cada uno traiga exactamente las
variables de las ramas que ese cliente tomó:
 
| Archivo | Variables | Qué ejercita |
|---|---|---|
| `ejemplo_datos_cliente.json` | 205 | Caso máximo: rama A de `Travel`, pagador "otra persona", los 5 slots de todos los repetidores, visas previas, casado, trabajo anterior y educación |
| `ejemplo_cliente_minimo.json` | 89 | Caso mínimo: rama B de `Travel`, todas las condicionales en `N`. Prueba que la app marque *no aplica* en masa. En la v2.14 pierde los 6 datos del cónyuge: es soltera y ninguna de las dos pantallas de cónyuge le aplica |
| `ejemplo_cliente_jubilado.json` | 163 | `categoriaOcupacionActual = RT`: desaparece el bloque de empleador actual, único caso que ejercita `valorExcepto` |
 
La **unión de los tres cubre las 208**, y los tres traen las 24 variables disparadoras. Se
regeneran con un script desde el mapeo cada vez que este cambia; no se editan a mano. Detalle en
`variables_nuevas.md` §13.
 
**Dos divergencias a propósito entre los fixtures y lo que emite la web.** Conviene dejarlas
escritas para que nadie las "corrija" más adelante:
 
- El fixture máximo emite `pagadorViaje = "O"`, mientras que la web emite siempre `"S"`
  (`variables_nuevas.md` §15.3). Es deliberado: esos 6 campos del bloque del pagador están
  mapeados y el fixture es lo único que los ejercita. Usa
  `direccionPagadorIgualSolicitante = "Y"`, así que se queda en la mitad que sí está mapeada y no
  toca el sub-bloque de dirección, que no lo está.
- El máximo y el jubilado traen las 6 variables del cónyuge; el mínimo ya no, desde la v2.14.
  Cada uno llena una pantalla distinta: el máximo (casado) `Spouse`, el jubilado (viudo)
  `DeceasedSpouse`, y la soltera ninguna.
 
**Decisión original, todavía válida como destino: el catálogo canónico se genera cuando la página
web generadora esté lista**, desde la misma fuente que la alimenta, para que no haya dos listas
que mantener. Hasta entonces las dos comprobaciones de §10.1 quedan sin cubrir.
 
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
 
### 16.3. Campos condicionales — APROBADO E IMPLEMENTADO EN ILLARI (2026-09-10)
 
`condicion` entra al esquema del mapeo (§7), con `valor` y `valorExcepto`. La v2.6 declara **141
campos condicionales**, deducidos del bloque `--- CONDICIONALES ---` del inventario cruzado con
el mapeo, sin tocar el formulario en vivo. El validador gana una séptima comprobación (§10.1).
 
**Implementación en Illari:**
- `CondicionCampo` vive en `ModelosMapeo.cs`, y `ConvertidorTextoOLista` lee su `valor` o
  `valorExcepto` (antes se llamaba `ConvertidorIdCampo`). `_verificar` se ignora al
  deserializar.
- `LlenadorDS160` evalúa la condición antes de buscar el control en el DOM. Hay tres
  resultados: *no aplica* (estado `NoAplica`), *no encontrado* con el detalle "aunque su rama
  aplica", y *omitido — sin dato disparador* con un aviso.
- Una condición sin `valor` ni `valorExcepto` se da por cumplida: es preferible buscar un campo
  de más que saltarlo en silencio.
- Verificado fuera de línea contra los tres fixtures: **3, 127 y 48** campos *no aplica*
  (máximo, mínimo y jubilado), igual que lo calculado desde el mapeo.
 
Tres grupos llevaban `_verificar` porque el inventario no los dejaba cerrados del todo y se
dedujeron por semántica: los acompañantes de `TravelCompanions` (`viajaConOtros`), las visitas
anteriores y el bloque de visa previa de `PreviousUSTravel` (`haVisitadoEEUU`,
`haTenidoVisaEEUU`). **La prueba real del 2026-09-22 los confirmó a los tres**, y la marca se
quitó en el mapeo v2.9. Lo que fallaba no eran las condiciones sino dos faltantes del mapeo: los
radios disparadores no estaban marcados con `disparaPostback`, así que la app buscaba los campos
antes de que el DS-160 los dibujara.
 
**Regla de oro para mantener esto:** una `condicion` **ausente** no rompe nada — el campo se
comporta como siempre. Una `condicion` **equivocada** hace que la app salte un campo que sí
debía llenar, y no lo vas a notar. Ante la duda, no declararla.
 
### 16.4. Desviaciones de Illari — ACEPTADAS
 
| Qué hizo Illari | Estado |
|---|---|
| Guarda preferencias de interfaz (tema, pantalla completa) en `%APPDATA%\Illari\configuration.json`, con `Illari/Comun/Configuracion.cs` | **Aceptado.** §5.2 excluye la persistencia de datos del cliente y de la sesión del DS-160, no las preferencias de la ventana |
| Reemplazó el árbol de navegación izquierdo por menú superior en cascada, portada, botón de búsqueda y temas claro/oscuro | **Aceptado.** El Anexo B ya lo refleja |
| "Volver al inicio" oculta la vista en vez de descartarla, para no destruir el WebView2 y perder login y caché | **Aceptado y documentado.** No era una desviación: destruir el WebView2 obliga a repetir login y captcha |
| Mostraba la versión del mapeo en dos sitios | **Resuelto:** queda **solo en el pie**. Verificado en el código el 2026-09-10: la barra de título muestra solo "Illari" y ningún otro elemento usa la versión |
 
### 16.5. Caracteres que el DS-160 rechaza — LA WEB NORMALIZA
 
El fixture llevaba `Villacís`, `Peñafiel` y `logística` a propósito, para descubrir si el DS-160
rechaza los no-ASCII. **Ya se comprobó, así que desde la regeneración del 2026-09-23 los fixtures
no llevan acentos**: emiten lo mismo que la página web, y así una prueba real no necesita
correcciones a mano.
 
**Resultado de la primera prueba real:**
- `tbxAPP_SURNAME` con `Torres Villacís` **se llenó** sin problema: el navegador acepta el valor
  y la app lo marca *llenado*.
- Al pulsar *Next*, el DS-160 lo rechazó con el mensaje: *"Surnames is invalid. Valid characters
  include A-Z and single spaces in between names."*
- El rechazo llega **al guardar, no al llenar**, así que el resumen de Illari no lo puede
  mostrar.
 
**La página web ya normaliza todo el texto** (sin tildes, `ñ` → `N`) antes de emitir el JSON.
Faltaba anotarlo en este plan; ahora está en §4. Con datos reales de la web este rechazo no
debería ocurrir. Con los fixtures de `docs/` sí ocurre, porque conservan los acentos a propósito,
así que un rechazo por acentos durante la prueba con fixtures **no es un defecto** ni de la app
ni de la web.
 
**No son solo los acentos.** La prueba completa del 2026-09-22 encontró dos rechazos más, del
mismo tipo, que la web también tiene que contemplar:
 
| Carácter | Dónde | Mensaje del DS-160 |
|---|---|---|
| `.` (punto) | Nombre de empleador: `Comercializadora Andina S.A.` | *"Present Employer or School Name is invalid"* |
| `/` (barra) | Explicación: `…solicitud B1/B2…` | *"…is invalid"* — con `B1 B2` pasa |
 
No hay una lista oficial de caracteres válidos por campo. La regla práctica: letras sin tildes,
números, espacios y guiones.
 
### 16.6. Lo que la primera prueba real completa tiene que confirmar
 
1. ~~Los tres grupos de `condicion` marcados con `_verificar` (§16.3).~~ **CONFIRMADOS** el
   2026-09-22 con el fixture máximo: los 15 campos de `viajaConOtros`, los 15 de `haVisitadoEEUU`
   y los 5 de `haTenidoVisaEEUU` se llenaron completos. La marca se quitó en el mapeo v2.9.
   Falta correr los fixtures mínimo y jubilado, que prueban la dirección contraria: que esos
   campos **no** aparezcan cuando la respuesta es `N`.
2. **El formato del `value` de mes y día en cada fecha del mapeo.** En `Personal1` el mes es
   `JAN`…`DEC` y no `1`…`12` (§8).
   **Decisión (2026-09-22): el formato se declara por campo en el mapeo**, no en la web ni con
   una app que pruebe los dos `value`. Motivo: el formato del mes es conocimiento del DS-160,
   igual que los `id`, y ese conocimiento vive en el mapeo; la web sigue emitiendo `AAAA-MM-DD`.
   Orden de trabajo:
   1. ~~Completar la prueba de las 18 pantallas.~~ **Hecho** el 2026-09-22.
   2. ~~Anotar el formato de cada campo `fecha`.~~ **Hecho para el fixture máximo**: la tabla
      está en §8. Quedan tres días "sin determinar", porque ese fixture no los distingue, y las
      fechas que solo aparecen en las ramas del mínimo y del jubilado.
   3. ~~Agregar el atributo al mapeo y a `LlenadorDS160`, con su comprobación en el validador.~~
      **Hecho el 2026-09-23** (mapeo v2.10, §7 y §10.1). Se declararon los seis campos que la
      prueba verificó; los demás quedan en `numero`. Los tres días "sin determinar" y la fecha
      de la rama B de `Travel` se van a resolver con los fixtures mínimo y jubilado, que traen
      días de una cifra.
3. ~~El `id` real del botón "Add Another", que hoy se localiza por texto.~~ **Confirmado el
   patrón** `<prefijo>_ctlNN_InsertButton<sufijo>` (por ejemplo
   `dtlOTHER_NATL_ctl00_InsertButtonOTHER_NATL`). La búsqueda por texto acotada al prefijo
   funcionó en los **siete** repetidores de la prueba, sin agregar filas de más ni en el
   repetidor equivocado.
4. ~~Los acentos (§16.5).~~ **Resuelto:** el DS-160 los rechaza, y la web ya normaliza el texto
   (§4).
5. Con qué valores de `ddlAPP_MARITAL_STATUS` aparece la pantalla `Spouse`, para poder declarar
   su condición de pantalla (§7). **Parcial:** con `M` (casado) aparece, verificado el
   2026-09-22. Faltan `S` (soltero) y `W` (viudo), que traen los otros dos fixtures; hasta
   tenerlos, la condición de pantalla sigue sin declararse.
6. **La pregunta del pasaporte de la otra nacionalidad — RESUELTO en el mapeo v2.8.** Con
   `tieneOtraNacionalidad = Y`, `Personal2` exige *"Do you hold a passport for the other
   country/region of…?"* (`dtlOTHER_NATL_ctl00_rblOTHER_PPT_IND`, con postback). Estaba en el
   inventario, pero no en el mapeo v2.7, y el DS-160 no dejaba avanzar.
   **Decisión (2026-09-14):** el radio se fija en `"N"`, con `condicion`
   `tieneOtraNacionalidad = Y`. `tbxOTHER_PPT_NUM` no se mapea, porque solo aparece con "Yes".
   No agrega variables. Contrapartida aceptada: un cliente que sí tenga pasaporte de la otra
   nacionalidad no puede declararlo desde la web; se corrige a mano en el DS-160.
 
7. **La espera después de un postback era corta — RESUELTO (2026-09-23).** En `Relatives`, los
   radios de padre y madre **sí** estaban marcados con `disparaPostback`, y aun así el `select`
   de estatus en EE. UU. no existía todavía cuando la app lo buscó: hizo falta una segunda
   pulsación de "Llenar formulario". Lo mismo con el radio de "otros familiares", que aparece
   recién tras esas recargas. La espera era de 800 ms de gracia más dos reintentos de 500 ms.
   **Números nuevos:** 2 s de gracia, 4 intentos y 1 s entre reintentos, con el tope duro en
   12 s. Sigue sin bloquear: si no hay señal de recarga, la app continúa igual (§8.1). Falta
   confirmarlo en la próxima prueba con `Relatives`.
 
8. **Condiciones que dependen de otra pantalla — abierto (2026-09-23).** Con el fixture mínimo,
   cuatro radios de Security no existen en el DOM: `rblRemovalHearing`, `rblFailToAttend` y
   `rblVisaViolation` en la parte 4, y `rblAttWoReimb` en la parte 5. Con el máximo sí estaban.
   Todo indica que el DS-160 los muestra solo a quien declaró `haVisitadoEEUU = Y`, que es una
   variable de **`PreviousUSTravel`**, otra pantalla. El esquema exige que la variable
   disparadora viva en la misma pantalla (§7), y el validador lo comprueba, así que **hoy no se
   pueden declarar**. Salen en rojo para todo cliente que nunca viajó a EE. UU. Las salidas
   posibles: permitir condiciones entre pantallas, o aceptar el rojo.
   **Hipótesis confirmada (2026-09-23):** con el fixture jubilado, que trae `haVisitadoEEUU = Y`,
   los cuatro radios **sí están** y la pantalla se llenó completa. Con el mínimo faltaban. Queda
   **RESUELTO (2026-09-23): se permiten condiciones entre pantallas.** El motivo original de la
   restricción no era técnico —la app siempre evaluó contra el diccionario del cliente, que no
   está separado por pantallas—, así que los cuatro radios declaran `haVisitadoEEUU = Y` en el
   mapeo v2.13 y el validador se ajustó (§7, §10.1).
 
9. **La pantalla del cónyuge fallecido no está en el mapeo — abierto (2026-09-23).** Con
   `estadoCivil = W` (viudo), el DS-160 intercala una pantalla entre `Relatives` y
   `WorkEducation1`: `complete_family5.aspx?node=DeceasedSpouse`. Illari la detecta y avisa
   correctamente —*"La pantalla 'DeceasedSpouse' no está en el mapeo. No se llenó nada"*— pero no
   la llena. Son 8 campos: `tbxSURNAME`, `tbxGIVEN_NAME`, la fecha de nacimiento (3 id),
   `ddlSpouseNatDropDownList`, `tbxSpousePOBCity` con su `cbxSPOUSE_POB_CITY_NA` y
   `ddlSpousePOBCountry`. **Pide exactamente los mismos datos que `Spouse`**, así que se puede
   mapear como una pantalla más reutilizando las variables del cónyuge, sin tocar la web. Con eso
   el total pasaría a **19 pantallas**.
   **RESUELTO (2026-09-23):** el mapeo v2.13 la incorpora con sus 7 campos, reutilizando las
   variables del cónyuge. El formato de su fecha se declaró igual que el de `Spouse` y **falta
   confirmarlo** en una prueba real. **Pendiente en la página web:** hoy los campos del cónyuge
   solo se piden con estado civil casado; deben pedirse también con **viudo**, o la solicitud
   llegará sin esos datos (`variables_nuevas.md` §15).
 
10. **La dirección del pagador no está en el mapeo — abierto (2026-09-23).** Con
    `pagadorViaje = O` y `direccionPagadorIgualSolicitante = N`, `Travel` despliega un bloque que
    el DS-160 exige: `tbxPayerStreetAddress1`, `tbxPayerStreetAddress2`, `tbxPayerCity`,
    `tbxPayerStateProvince`, `tbxPayerPostalZIPCode` y `ddlPayerCountry`, más los checkboxes
    `cbxDNAPayerStateProvince` y `cbxDNAPayerPostalZIPCode`. §13.6 ya lo listaba como sub-bloque
    no relevado; ahora está relevado. Dos salidas: **mapearlo** con variables nuevas de la web, o
    que la web emita siempre `direccionPagadorIgualSolicitante = "Y"`, lo que sería falso cuando
    el pagador vive en otro lado. En la prueba se resolvió marcando "Sí" a mano.
    **RESUELTO (2026-09-23): el bloque no se mapea.** La web emite siempre
    **`pagadorViaje = "S"`**, es decir que paga el propio solicitante, hasta que aparezca la
    necesidad real de hacerlo dinámico. Con ese valor el DS-160 no muestra ningún dato del
    pagador —ni nombre, ni teléfono, ni dirección—, así que los campos condicionales del pagador
    que ya están en el mapeo quedan en *no aplica*. Los fixtures máximo y jubilado usan `"O"`
    (otra persona) y por eso destaparon el bloque.
 
11. **Dos reglas de consistencia entre campos que el DS-160 valida — para la web (2026-09-23).**
    Las dos aparecieron con el fixture jubilado y frenaron el guardado:
    - El **parentesco de un familiar en EE. UU. no puede ser "cónyuge" si el estado civil no lo
      admite**: *"Marital status selected on Personal Information 1 page should match selection
      made for 'Relationship to You.'"*
    - **No se puede repetir un país** en la lista de países visitados: *"The country listed has
      already been selected."*
    Los dos casos son defectos del generador de fixtures, no de la app, y ahora son reglas que la
    página web tiene que respetar (`variables_nuevas.md` §14).
 
**Resultado de la tercera prueba real completa — 2026-09-23, fixture jubilado.** Recorrió las 18
pantallas más la de cónyuge fallecido (punto 9), hasta la carga de la foto.
 
- **`valorExcepto` confirmado:** `WorkEducation1` dio **1 llenado y 11 no aplican**, sin ningún
  no encontrado. Todo el bloque de empleador desapareció con `categoriaOcupacionActual = RT`.
- **Los tiempos nuevos funcionan:** `PreviousUSTravel` se llenó en **una sola pasada** (27
  campos), donde con el máximo hacían falta dos. `Relatives` todavía necesita una segunda para el
  radio de "otros familiares", que no existe hasta que padre y madre disparan su recarga.
- El resto coincide con lo calculado: `Travel` 26 y 3 no aplican, `Personal2` 7 y 3,
  `TravelCompanions` 1 y 16, `WorkEducation2` 28, `WorkEducation3` 16.
- Aportó además el día con cero de `Personal1` (nació un día 9) y desmintió la condición que la
  v2.11 le había puesto a la pregunta de ESTA.
 
**Resultado de la segunda prueba real completa — 2026-09-23, fixture mínimo.** Las 18 pantallas
recorridas (17 en realidad: `Spouse` no aparece, ver punto 5) hasta la carga de la foto. Los
conteos coinciden con lo calculado: `Travel` 7 llenados y **22 no aplican**, `TravelCompanions`
1 y 16, `PreviousUSTravel` 4 y 27, `Relatives` 16 y 22, `WorkEducation2` 2 y 26. **Cero falsos
"no encontrado"** salvo los ocho que destaparon errores reales del mapeo, ya corregidos en la
v2.11 o anotados en el punto 8.
 
Lo que el mínimo aportó, y el máximo no podía:
- La dirección de hospedaje de `Travel` **no es condicional**: el DS-160 la exige también en la
  rama B. Era una condición equivocada, el caso que §16.3 advierte.
- Cuatro radios de `PreviousUSTravel` **sí lo son** y les faltaba la condición.
- El día de las fechas de `PptVisa` lleva cero (`01`…`31`), y el de la rama B de `Travel` no.
- Con `estadoCivil = S` la pantalla `Spouse` **no aparece** (punto 5).
- Los formatos de fecha de la v2.10 funcionaron: `Personal1` pasó de 10 llenados y una
  advertencia a **11 llenados sin advertencias**, sin tocar nada a mano.
 
**Resultado de la primera prueba real completa — 2026-09-22, fixture máximo, solicitud ficticia
`AA00FT1F8J`.** Las 18 pantallas quedaron llenas y guardadas, hasta llegar a la carga de la foto.
 
| Pantalla | Llenados | No encontrados | No aplican | Omitidos | Advertencias |
|---|---|---|---|---|---|
| Personal1 | 10 | 0 | 0 | 0 | 1 (mes) |
| Personal2 | 10 | 0 | 0 | 0 | 0 |
| Travel | 26 | 0 | 3 | 0 | 0 |
| TravelCompanions | 17 | 0 | 0 | 0 | 0 |
| PreviousUSTravel | 34 | 0 | 0 | 0 | 0 |
| AddressPhone | 24 | 0 | 0 | 2 | 0 |
| PptVisa | 12 | 0 | 0 | 1 | 2 (mes) |
| USContact | 12 | 0 | 0 | 0 | 0 |
| Relatives | 38 | 0 | 0 | 0 | 2 (fechas) |
| Spouse | 7 | 0 | 0 | 0 | 1 (fecha) |
| WorkEducation1 | 12 | 0 | 0 | 0 | 0 |
| WorkEducation2 | 27 | 0 | 0 | 0 | 1 (largo) |
| WorkEducation3 | 16 | 0 | 0 | 0 | 0 |
| Security 1 a 5 | 4 / 7 / 12 / 6 / 4 | 0 | 0 | 2 / 7 / 12 / 4 / 4 | 0 |
 
Los conteos coinciden con lo calculado desde el mapeo antes de la prueba. `TravelCompanions`,
`PreviousUSTravel` y `Relatives` necesitaron una segunda pasada (puntos 7 y §16.3).
 
**Lo que hubo que corregir a mano**, y que la página web debe evitar: los meses de los tres
formatos no numéricos, el apellido y los nombres con acentos, `S.A.` y `B1/B2`, las direcciones
de más de 40 caracteres, los tres países del punto 5 de §13.6, y el país de residencia permanente
del fixture, que repetía el de la otra nacionalidad.
 
---
 
## Anexo A: Archivos del proyecto (documentación)
 
| Archivo | Contenido |
|---|---|
| `plan_asistente_formularios_v5.md` | Este documento. Fuente de verdad del proyecto. |
| `mapeo_ds160.json` | Mapeo campo → `id`. **v2.14**: 19 pantallas, 326 campos, 208 variables, 161 con `condicion`, 7 campos `fecha` con formato declarado, 0 pendientes. |
| `decisiones_alcance.md` | Decisión por campo: página web / manual / valor fijo. |
| `variables_nuevas.md` | Variables que debe generar la página web, con su catálogo. Vive en `docs/`, no en `claude/`. |
| `ejemplo_datos_cliente.json` | Fixture "caso máximo", en `docs/` del repositorio de Illari (§15). |
| `ejemplo_cliente_minimo.json` | Fixture "caso mínimo": todas las ramas condicionales en `N` (§15). |
| `ejemplo_cliente_jubilado.json` | Fixture con `categoriaOcupacionActual = RT`, para el `valorExcepto` de WorkEducation1 (§15). |
| `inventario_ds160_parcial.md` | Relevamiento completo de las 19 pantallas. |
| `sincronizacion_cambios_2026-09-23.md` | Resumen de los cambios de las tres pruebas reales y lista de archivos a sincronizar entre Illari, la página web y el proyecto de Claude. |
| `revisar_fixture.py` | Cruza un JSON de cliente contra el mapeo: variables sin uso, campos sin dato, datos en ramas que no aplican, disparadores faltantes. Vive en `tools/` (§10.1). Desde la v2.14 no reporta como inútil una variable que sí usa otro campo de una rama que aplica: `Spouse` y `DeceasedSpouse` comparten las 6 del cónyuge y solo una de las dos aplica por cliente. |
| `validar_mapeo.py` | Validador del mapeo, 8 comprobaciones. Vive en `tools/` del repositorio de Illari, no en `claude/`. Se ejecuta antes de compilar. |
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
            │   ├── ModelosMapeo.cs      Mapeo, PantallaMapeo, CampoMapeo, CondicionCampo,
            │   │                        ConvertidorTextoOLista, EstadoCampo (con NoAplica),
            │   │                        ResultadoCampo, delegado EjecutarScript
            │   ├── CargadorJson.cs      Lee el JSON del cliente (con try/catch) y el
            │   │                        mapeo desde el recurso embebido
            │   ├── GeneradorScript.cs   JavaScript genérico: localizar por id, setter
            │   │                        nativo, eventos, click condicional, select solo
            │   │                        por value, escapado seguro
            │   └── LlenadorDS160.cs     Los 11 pasos de §9 y la evaluación de condicion.
            │                            Recibe un EjecutarScript, no el navegador
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