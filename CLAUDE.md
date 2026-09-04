# Proyecto: formulario web generador de datos DS-160

Formulario web donde el cliente ingresa sus datos. Un Google Apps Script
(`Code.gs`) los recoge y genera un archivo JSON en Google Drive, que después
descargo a mano y consume Illari, una app de escritorio WPF/.NET 10 que llena
el DS-160 real.

## Estado

Migrando el Apps Script de generar PDF a generar JSON.

Hecho:

- Diagnóstico completo en `docs/diagnostico_json_ds160.md`, verificado contra el
  código. Sus conteos y su tabla de correspondencia siguen siendo correctos, pero
  es anterior a que se volcaran los catálogos: su §5.1(d) lista 9 catálogos
  faltantes y ya no falta ninguno. Sus números de línea también quedaron corridos.
- Los 19 catálogos del DS-160 volcados en `docs/catalogo_*.md` y generados como
  TypeScript en `src/constants/catalogos/*.ts`.

Pendiente, en este orden:

1. Conectar los catálogos a los selects (`opcionesFormulario.ts`, `schema.ts`,
   `App.tsx` y los componentes que comparan contra los values viejos).
2. Eliminar del modelo las variables que salen y agregar las 39 nuevas.
3. Interfaz: topes de 5 en los repetidores, validaciones, campos huérfanos.
4. `Code.gs`: emitir JSON en vez de PDF.
5. `docs/mapeo_ds160.json`: los ajustes que se listan abajo.

**Todavía no se conectó nada**: los selects siguen usando las listas viejas de
`src/constants/opcionesFormulario.ts`, que guardan texto en español en vez del
`value` del DS-160.

## Fuente de verdad

`docs/mapeo_ds160.json` (v2.3) define los nombres canónicos de variable: 196 con
`id` relevado más 19 en `pendientes`. El resto de `docs/` documenta el alcance y
los catálogos.

## Catálogos

Los 19 `docs/catalogo_*.md` son la fuente. Formato por línea:
`value|texto en inglés (DS-160)|traducción al español`.

`scripts/generarCatalogos.mjs` los convierte en `src/constants/catalogos/*.ts`
con opciones `{ valor, texto }`. Se regenera con:

```
npm run catalogos
```

Los `.ts` generados se comitean y llevan un encabezado que dice que no se editen
a mano. El generador verifica que la cantidad de opciones coincida con la que
declara el encabezado del `.md`, así que una línea perdida al transcribir falla
en vez de pasar desapercibida.

Los catálogos viven **solo en la web**, nunca en `Code.gs`: el navegador manda el
par `{texto, valor}` ya resuelto y el script solo lo serializa.

## Restricción del Apps Script

`Code.gs` es una copia manual del script que corre en script.google.com. Tiene
que quedar en un solo archivo, pegable de una vez, sin dependencias externas y
usando solo APIs de Apps Script.

## Decisiones tomadas

No volver a preguntarlas.

- `direccionConyuge`, `direccionConyugeOtro`, `tieneVisaActiva`, `paisVisa`,
  `fechaEmisionVisa`, `cantidadViajeros`, `relacionViaje`, `telefonoEducacion`,
  `institucionBachillerato` y `otrasRedesSociales` salen del modelo.
- `telefonoDomicilio` y `codigoPostalTrabajoActual` salen de la web, y sus
  checkboxes "no aplica" pasan a `valor: true` en el mapeo.
- `idiomas` → `idioma1..5`; `lugaresPlaneadosEEUU` → `lugarPlaneadoEEUU1..5`;
  `historialViajes` → `tieneHistorialViajes` + `paisVisitado1..5`.
- `tieneIdentificacionFiscalEEUU` se queda en la web pero no se emite en el JSON.
- `estadoCivil` adopta las 8 opciones del DS-160; el "unión libre" de la web
  equivale a `C` (COMMON LAW MARRIAGE).
- `unidadDuracion` adopta las 5 opciones, incluida `H` (menos de 24 horas).
- Los tres repetidores llevan tope de 5 en la interfaz.
- `otrosFamiliaresEnEEUU` siempre visible. No abre sub-bloque: en el DS-160 el
  repetidor de familiares cuelga de `familiaresInmediatosEnEEUU`.
- Nombres y apellidos: solo letras y espacios al escribir (el DS-160 no acepta
  otra cosa), pero se permiten tildes y ñ. La normalización a ASCII ocurre al
  generar el JSON, no al escribir: "Muñoz" se escribe normal y sale "Munoz".
- El JSON va en la subcarpeta del cliente que el script ya crea, con nombre
  `primerNombre_primerApellido_cedula.json`.
- Se agregan controles para `cargoActual`, `sueldoActual`, `nombreCarrera`,
  `deportadoDePais` y `detallesDeportacion`.

## Ajustes pendientes en `docs/mapeo_ds160.json`

- `cbexAPP_MOBILE_TEL_NA` y `cbxWORK_EDUC_ADDR_POSTAL_CD_NA` a `valor: true`, y
  eliminar los campos de texto que dependían de ellos.
- Declarar los 16 ids de `familiarInmediato2..5` en `Relatives`
  (`dlUSRelatives_ctl01..ctl04`) y sacarlos de `pendientes`. Illari busca los ids
  literalmente, así que sin declararlos no se llenan. `dlUSRelatives` es el único
  repetidor de 5 slots que hoy declara solo `ctl00`.
- Agregar la clave `catalogo` a `ddlAPP_GENDER` y `ddlAPP_MARITAL_STATUS`.
- Quitar la variable `otrasRedesSociales` de `dtlSocial_ctl03_tbxSocialMediaIdent`.

## Preguntas abiertas

- El bloque de cónyuge hoy aparece solo con `estadoCivil = M`. El DS-160 también
  ofrece `C` (unión de hecho) y `P` (unión civil). ¿Se amplía?
- `cbexAPP_TAX_ID_NA` está fijo en `false` (desmarcado), así que el DS-160 va a
  exigir `identificacionFiscalEEUU` aunque el cliente no tenga una. Es el mismo
  problema que ya se resolvió para `telefonoDomicilio`.
- Falta confirmar en el DS-160 real que la segunda fila del repetidor de
  familiares es `ctl01`, antes de que Illari corra en producción.

## Reglas

- Solo comandos de git de lectura. Los commits los hago yo.
- No desplegar el Apps Script ni tocar Google Drive.
- Después de modificar código, detenerse y esperar revisión.
