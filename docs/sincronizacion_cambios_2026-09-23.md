# Sincronización de cambios — 22 y 23 de septiembre de 2026
 
Resumen de todo lo que cambió en Illari durante las tres pruebas reales del DS-160, para
actualizar los otros dos proyectos: el **proyecto de Claude** (donde vive la documentación) y el
**repositorio de la página web** (`IntitripVisa`).
 
**Versiones al cierre**
 
| Qué | Versión | Detalle |
|---|---|---|
| Plan | **5.11** | Era 5.5 al empezar |
| Mapeo `mapeo_ds160.json` | **2.13** | Era 2.7. 19 pantallas, 326 campos, 208 variables, 146 condiciones, 10 fechas con formato, 0 pendientes |
| Validador del mapeo | **8 comprobaciones** | Eran 7 |
| Fixtures | Regenerados | 205, 95 y 163 variables; la unión cubre las 208 |
 
**Estado del proyecto:** las 18 pantallas —19 con la de cónyuge fallecido— se llenaron y guardaron
en el DS-160 real con los tres fixtures. La Fase 1 quedó terminada.
 
> **Nota del 2026-09-24 — dos puntos de este documento quedaron cortos.** Se dejan como estaban,
> porque esto es la foto del 23, pero lo vigente está en el plan y en `variables_nuevas.md`:
>
> - **El pagador (§5.2, punto 2).** Al revisar el generador se vio que la web ofrece las **cinco**
>   opciones del catálogo `quienPaga`, no dos, y que el mapeo solo cubre `O`. Con `P`, `U` y `C`
>   la web no pedía nada y el DS-160 sí exige datos de la empresa. La decisión pasa a ser: dejar
>   `pagadorViaje` fijo en `"S"` y **comentar** el select y los 6 campos. Ver el punto 6 de §13.6
>   del plan y §15.3 de `variables_nuevas.md`.
> - **El cónyuge (§5.2, punto 1).** El mapeo **v2.14** ya declara la condición sobre `estadoCivil`
>   en `Spouse` y `DeceasedSpouse`, así que la web además **no** debe pedir esos datos con
>   soltero. Ver §15.6 de `variables_nuevas.md`.
>
> Con eso, las versiones vigentes son mapeo **v2.14** y plan **v5.12**, no las de la tabla de
> abajo.
 
---
 
## 1. Archivos modificados
 
### 1.1. Para sincronizar con el proyecto de Claude y con la web
 
Estos son los que viven en `docs/` y se comparten entre los tres proyectos.
 
| Archivo | Estado | Qué cambió |
|---|---|---|
| `plan_asistente_formularios_v5.md` | Modificado (5.5 → **5.11**) | §4, §6, §7, §8, §9, §10.1, §11, §12, §13, §13.6, §15, §16.3, §16.4, §16.5, §16.6, anexos A y B y la cabecera |
| `variables_nuevas.md` | Modificado | §13 actualizado; **§14 nueva** (reglas de contenido) y **§15 nueva** (pendientes de la web) |
| `inventario_ds160_parcial.md` | Modificado | Formatos de fecha, los tres radios con postback, el `maxlength` y los caracteres rechazados |
| `ejemplo_datos_cliente.json` | Regenerado | 205 variables |
| `ejemplo_cliente_minimo.json` | Regenerado | 92 → **95** variables |
| `ejemplo_cliente_jubilado.json` | Regenerado | 163 variables |
| `sincronizacion_cambios_2026-09-23.md` | **Nuevo** | Este documento |
 
### 1.2. Del repositorio de Illari
 
| Archivo | Estado | Qué cambió |
|---|---|---|
| `Illari/Modulos/Formularios/Definiciones/mapeo_ds160.json` | Modificado (2.7 → **2.13**) | Ver sección 3. **La web tiene su propia copia en `docs/`: hay que reemplazarla** |
| `Illari/Modulos/Formularios/Nucleo/LlenadorDS160.cs` | Modificado | Formato de fechas, evaluación de `condicion`, esperas de postback |
| `Illari/Modulos/Formularios/Nucleo/GeneradorScript.cs` | Modificado | Sin plan B por texto; control de `maxLength` |
| `Illari/Modulos/Formularios/Nucleo/ModelosMapeo.cs` | Modificado | `CondicionCampo`, `FormatoFecha`, `EstadoCampo.NoAplica`, `ConvertidorTextoOLista` |
| `Illari/Modulos/Formularios/Llenado/LlenadoView.xaml` | Modificado | Color de las filas "no aplica" |
| `tools/validar_mapeo.py` | Modificado | Octava comprobación y condiciones entre pantallas |
| `tools/revisar_fixture.py` | **Nuevo** | Cruza un JSON de cliente contra el mapeo |
| `tools/illari_uia.ps1` | **Nuevo** | Maneja la app por UI Automation para las pruebas |
| `CLAUDE.md` | Modificado | Versión del plan y comando del comprobador |
 
**Sin cambios:** `decisiones_alcance.md`, los 19 catálogos, `ModelosDatos.cs`, `CargadorJson.cs`,
`LlenadoViewModel.cs` y las vistas principales.
 
---
 
## 2. Cambios en la aplicación
 
1. **Fechas.** El día y el mes se escriben según el formato que declara el mapeo, porque el
   DS-160 usa tres distintos a la vez (sección 4).
2. **Campos condicionales.** `condicion` se evalúa antes de buscar el control en el DOM, y antes
   que cualquier otra cosa del campo, incluidos los checkboxes. Tres resultados posibles:
   *no aplica* (estado propio, contado aparte y con color propio), *no encontrado* con el detalle
   "aunque su rama aplica", y *omitido — sin dato disparador*, con un aviso por variable faltante.
3. **Los `select` se eligen solo por su `value`.** Se eliminó el plan B que elegía por el texto
   visible: escondía errores del mapeo. Gracias a eso se descubrió que las plataformas de redes
   sociales estaban mal (`FACEBOOK` en vez de `FCBK`).
4. **Control de `maxLength`.** Si un texto supera el máximo del campo, la app **no lo escribe** y
   lo marca como advertencia. Sin esto el DS-160 responde "Application Error" y se pierde la
   sesión.
5. **Esperas de postback** más largas: 2 s de gracia, 4 intentos, 1 s entre reintentos y tope de
   12 s. Antes eran 800 ms y 2 reintentos de 500 ms, y varias pantallas necesitaban dos pasadas.
6. **La versión del mapeo** se muestra solo en el pie de la ventana (verificado).
 
---
 
## 3. Cambios en el mapeo, versión por versión
 
| Versión | Cambio |
|---|---|
| 2.8 | `rblOTHER_PPT_IND` (pasaporte de la otra nacionalidad), fijo en "N" |
| 2.9 | `disparaPostback` en tres radios que sí recargan; `condicion` en `rblGroupTravel`; `rblVWP_DENIAL_IND` (ESTA); `value` reales de redes sociales (`FCBK`, `INST`, `LINK`); se quitan las 35 marcas `_verificar`, ya confirmadas |
| 2.10 | `formatoMes` y `formatoDia` en los campos `fecha` |
| 2.11 | La dirección de hospedaje de `Travel` deja de ser condicional; cuatro radios de `PreviousUSTravel` pasan a serlo; día con cero en las fechas de `PptVisa` |
| 2.12 | ESTA pasa a depender de `visaNegada`; día con cero en la fecha de nacimiento de `Personal1` |
| 2.13 | Pantalla **`DeceasedSpouse`** (la 19); condiciones **entre pantallas** en los cuatro radios de `Security` |
 
---
 
## 4. Hallazgos del DS-160
 
### 4.1. Formatos de fecha: tres de mes y dos de día
 
El `value` **no se deduce del texto visible**: en `WorkEducation1` el día se ve `02` y el mes
`APR`, pero sus `value` son `2` y `4`.
 
| Pantalla | Mes | Día |
|---|---|---|
| `Personal1` | `JAN`…`DEC` | `01`…`31` |
| `Travel` (las tres fechas) | numérico | numérico |
| `PreviousUSTravel` (visa y 5 visitas) | numérico | numérico |
| `PptVisa` (emisión y expiración) | `01`…`12` | `01`…`31` |
| `Relatives` (padre y madre) | `JAN`…`DEC` | `01`…`31` (madre) |
| `Spouse` | `JAN`…`DEC` | `01`…`31` |
| `WorkEducation1` y `WorkEducation2` | numérico | numérico |
 
### 4.2. Caracteres y longitudes
 
- Rechaza **acentos** en nombres y apellidos: *"Valid characters include A-Z and single spaces"*.
- Rechaza el **punto** en nombres de empresa: `Comercializadora Andina S.A.` es inválido.
- Rechaza la **barra** en explicaciones: `B1/B2` no pasa, `B1 B2` sí.
- Un texto que supera el `maxlength` **no da error de validación: rompe la sesión**, con
  "Application Error", y hay que recuperar la solicitud con su Application ID.
 
### 4.3. Campos y pantallas que faltaban en el mapeo
 
| Qué | Dónde | Cómo se resolvió |
|---|---|---|
| Pasaporte de la otra nacionalidad | `Personal2` | Fijo en "N" (v2.8) |
| Autorización ESTA denegada | `PreviousUSTravel` | Fijo en "N", condicionado a `visaNegada = Y` (v2.9 y v2.12) |
| Pantalla de cónyuge fallecido | Entre `Relatives` y `WorkEducation1`, con estado civil viudo | Mapeada reutilizando las variables del cónyuge (v2.13) |
| Tres `select` de país | `WorkEducation1` y `WorkEducation2` | **Pendiente en la web** (sección 5) |
| Dirección del pagador | `Travel` | **No se mapea**: la web emite siempre al solicitante como pagador |
 
### 4.4. Condiciones
 
- Los tres grupos marcados con `_verificar` eran **correctos**. Lo que fallaba era que sus radios
  disparadores no estaban marcados con `disparaPostback`.
- La dirección de hospedaje en EE. UU. **no** es condicional: el DS-160 la exige también cuando
  no hay planes de viaje concretos.
- Cuatro radios de `PreviousUSTravel` **sí** son condicionales y les faltaba la condición.
- Cuatro radios de `Security` dependen de `haVisitadoEEUU`, que es de **otra pantalla**. Por eso
  ahora se permiten condiciones entre pantallas.
 
### 4.5. Validaciones cruzadas del DS-160
 
- El parentesco de un familiar en EE. UU. debe ser coherente con el estado civil: no se puede
  declarar un "cónyuge" si el cliente es viudo o soltero.
- No se puede repetir un país en la lista de países visitados.
 
### 4.6. Operación
 
- **Cloudflare bloquea** si el ritmo no parece humano. Con el uso normal de la app, una persona
  revisando cada pantalla, no aparece.
- La pantalla `Spouse` aparece con estado civil **casado**; con soltero no aparece y con viudo se
  reemplaza por la de cónyuge fallecido.
 
---
 
## 5. Qué tiene que cambiar la página web
 
El detalle completo está en `variables_nuevas.md`, secciones §14 y §15.
 
### 5.1. Tres variables nuevas
 
| Variable | Paso del formulario | Ubicación | Cuándo se emite |
|---|---|---|---|
| `paisTrabajoActual` | Trabajo / estudio actual | Debajo de la dirección del empleador o institución | Con `categoriaOcupacionActual` fuera de `H`, `RT` y `N` |
| `paisTrabajoAnterior` | Trabajo anterior | Debajo de la dirección del empleador anterior | Solo con `tuvoTrabajoAnterior = "Y"` |
| `paisEducacion` | Educación | Debajo de la dirección de la institución | Solo con `asistioInstitucionEducativa = "Y"` |
 
Las tres son un `select` con el catálogo **`catalogo_paises_residencia_permanente.md`**, que la web
ya tiene (253 opciones, Ecuador es `ECUA`). No hay que volcar ningún catálogo nuevo. Viajan como
objeto `{texto, valor}`.
 
### 5.2. Cambios de comportamiento
 
1. **Cónyuge con estado civil viudo.** Hoy los campos del cónyuge solo se piden con "casado";
   deben pedirse también con **"viudo"**, con las mismas variables. El DS-160 muestra una pantalla
   propia que pide exactamente esos datos.
2. **Pagador.** Emitir siempre `pagadorViaje = "S"`, el propio solicitante. Con "otra persona" el
   DS-160 despliega un bloque de dirección que no está mapeado.
3. **Residencia permanente.** `esResidentePermanenteExtranjero` por defecto en `"N"`. La pregunta
   es si reside en un país **distinto al de su nacionalidad**, no dónde vive.
4. **Dirección de hospedaje en EE. UU.** Emitir siempre `direccionHospedajeEEUU`,
   `ciudadHospedajeEEUU` y `estadoHospedajeEEUU`, aunque no haya planes de viaje concretos.
 
### 5.3. Reglas de contenido
 
| Regla | Si no se cumple |
|---|---|
| Solo letras sin tildes, números, espacios y guiones en nombres, apellidos y empresas | El DS-160 rechaza la pantalla al guardar |
| Sin puntos en nombres de empresa (`S.A.` → `SA`) | Ídem |
| Sin barras en las explicaciones (`B1/B2` → `B1 B2`) | Ídem |
| Respetar el `maxlength` de cada campo (las direcciones son de 40) | **Rompe la sesión** del DS-160 |
 
### 5.4. Validaciones a agregar en el formulario
 
- No permitir países repetidos en la lista de países visitados.
- Filtrar las opciones de parentesco de familiares según el estado civil elegido.
 
### 5.5. Copias que hay que reemplazar en el repositorio de la web
 
`docs/mapeo_ds160.json`, `docs/plan_asistente_formularios_v5.md`, `docs/variables_nuevas.md` y los
tres `ejemplo_*.json`.
 
---
 
## 6. Pendiente
 
1. Los puntos de la sección 5, en la página web.
2. **Probar `DeceasedSpouse` con la app:** es la única pantalla del mapeo que nunca se llenó, y el
   formato de su fecha se declaró por analogía con `Spouse`, sin verificar.
3. Decidir si el generador de fixtures de la web incorpora las reglas de §14 y §15.5 del
   `variables_nuevas.md`.
 