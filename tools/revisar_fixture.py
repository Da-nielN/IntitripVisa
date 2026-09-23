"""
Cruza un JSON de datos de cliente contra mapeo_ds160.json, sin abrir la aplicacion.

Motivo: un dato del cliente puede abrir una rama del DS-160 que el mapeo no cubre, y eso
recien se descubre cuando el formulario no deja guardar. Esto lo muestra antes.

Comprueba:
  1. Variables del archivo que ningun campo del mapeo usa (sobran, o estan mal escritas).
  2. Campos cuya rama SI aplica y se quedarian sin dato -> quedarian omitidos.
  3. Campos con dato cuya rama NO aplica -> el dato no se va a usar; suele ser una
     contradiccion del archivo (por ejemplo, datos de acompanantes con viajaConOtros = N).
     Las variables disparadoras se marcan aparte: emitirlas igual es lo correcto, porque la
     app las necesita para evaluar otras condiciones. Tampoco se reporta una variable que
     SI usa algun otro campo cuya rama aplica: desde la v2.14 del mapeo, Spouse y
     DeceasedSpouse comparten las mismas 6 variables del conyuge y solo una de las dos
     pantallas aplica por cliente, asi que la otra daria un falso positivo.
  4. Variables disparadoras que el archivo no trae: la app no adivina la rama.
  5. Valores fijos del mapeo que abren rama ('Y'), para tenerlos a la vista.

Uso: python revisar_fixture.py <fixture.json> [mapeo.json]
Codigo de salida: 0 si no hay hallazgos de los grupos 1, 3 y 4; 1 si hay alguno.
"""

import json
import sys

MAPEO_POR_DEFECTO = "Illari/Modulos/Formularios/Definiciones/mapeo_ds160.json"


def valor_de(dato):
    """El value que la app escribiria: 'valor' si es objeto {texto, valor}, el string si es plano."""
    if isinstance(dato, dict):
        return dato.get("valor", dato.get("texto"))
    return dato


def vacio(valor):
    return valor is None or not str(valor).strip()


def cumple(condicion, valor):
    if "valor" in condicion:
        esperados = condicion["valor"]
        esperados = [esperados] if isinstance(esperados, str) else esperados
        return valor in esperados
    excepto = condicion.get("valorExcepto", [])
    excepto = [excepto] if isinstance(excepto, str) else excepto
    return valor not in excepto


def variables_de(campo):
    if "variable" in campo:
        return [campo["variable"]]
    return campo.get("variables", []) or []


def revisar(ruta_fixture, ruta_mapeo):
    datos = json.load(open(ruta_fixture, encoding="utf-8"))
    mapeo = json.load(open(ruta_mapeo, encoding="utf-8"))

    usadas = set()
    usadas_en_rama_que_aplica = set()  # para no reportar como inutil algo que otro campo si usa
    sin_dato = []        # la rama aplica y no hay dato
    dato_sin_uso = []    # hay dato y la rama no aplica
    sin_disparador = []  # falta la variable disparadora
    fijos_que_abren = []

    # Una variable disparadora se emite siempre, aunque su propio campo no aplique.
    disparadoras = {
        campo["condicion"]["variable"]
        for pantalla in mapeo["pantallas"]
        for campo in pantalla["campos"]
        if "condicion" in campo
    }

    for pantalla in mapeo["pantallas"]:
        for campo in pantalla["campos"]:
            control = campo["id"][0] if isinstance(campo["id"], list) else campo["id"]
            etq = campo.get("etiqueta") or control
            usadas.update(variables_de(campo))

            if campo.get("valor") == "Y":
                fijos_que_abren.append((pantalla["node"], etq, control))

            condicion = campo.get("condicion")
            aplica = True
            if condicion:
                disparador = valor_de(datos.get(condicion["variable"]))
                if vacio(disparador):
                    sin_disparador.append((pantalla["node"], etq, condicion["variable"]))
                    continue
                aplica = cumple(condicion, disparador)

            if campo.get("manual") or "valor" in campo:
                continue

            valores = [valor_de(datos.get(v)) for v in variables_de(campo)]
            tiene_dato = any(not vacio(v) for v in valores)

            if aplica:
                usadas_en_rama_que_aplica.update(variables_de(campo))

            if aplica and not tiene_dato:
                sin_dato.append((pantalla["node"], etq, ", ".join(variables_de(campo))))
            if not aplica and tiene_dato:
                es_disparadora = any(v in disparadoras for v in variables_de(campo))
                dato_sin_uso.append(
                    (pantalla["node"], etq, ", ".join(variables_de(campo)),
                     f"{condicion['variable']} = {valor_de(datos.get(condicion['variable']))}",
                     es_disparadora)
                )

    # Una variable que otro campo si usa en una rama que aplica no es un dato inutil.
    dato_sin_uso = [
        f for f in dato_sin_uso
        if not any(v in usadas_en_rama_que_aplica for v in f[2].split(", "))
    ]

    sobran = sorted(set(datos) - usadas)

    print(f"Fixture: {ruta_fixture}")
    print(f"Mapeo:   {ruta_mapeo} (v{mapeo.get('version')})")
    print(f"Variables en el archivo: {len(datos)} | referenciadas por el mapeo: {len(usadas)}")
    print()

    def bloque(titulo, filas, formato):
        print(f"{titulo}: {len(filas)}")
        for fila in filas:
            print("   " + formato(fila))
        print()

    bloque("1. Variables del archivo que ningun campo usa", sobran, lambda v: v)
    bloque("2. Campos que aplican y se quedarian SIN DATO (omitidos)", sin_dato,
           lambda f: f"{f[0]:22} {f[1]}  [{f[2]}]")
    bloque("3. Datos que NO se van a usar porque su rama no aplica", dato_sin_uso,
           lambda f: f"{f[0]:22} {f[1]}  [{f[2]}]  ({f[3]})"
                     + ("  <- es disparadora: correcto emitirla" if f[4] else ""))
    bloque("4. Variables disparadoras que faltan", sin_disparador,
           lambda f: f"{f[0]:22} {f[1]}  necesita '{f[2]}'")
    bloque("5. Valores fijos 'Y' del mapeo (abren rama)", fijos_que_abren,
           lambda f: f"{f[0]:22} {f[1]}  {f[2]}")

    problemas = len(sobran) + sum(1 for f in dato_sin_uso if not f[4]) + len(sin_disparador)
    print(f"HALLAZGOS QUE IMPORTAN (grupos 1, 3 y 4): {problemas}")
    return 1 if problemas else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(revisar(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else MAPEO_POR_DEFECTO))
