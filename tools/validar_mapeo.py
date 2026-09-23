"""
Validador del mapeo DS-160 (seccion 10 del plan, subconjunto implementado aqui).

Comprueba:
  1. id duplicados dentro de una misma pantalla
  2. campos 'fecha' que no tengan exactamente 3 id
  3. campos con mas de un origen, o con ninguno (variable | variables | valor | manual)
  4. campos sin 'tipo', o con un 'tipo' desconocido
  5. 'id' que no sea texto ni lista de textos
  6. 'valor' con el tipo equivocado: booleano en checkbox, texto en el resto
  7. 'condicion' mal formada, o que apunte a una variable disparadora que no existe
     en NINGUNA pantalla del mapeo (desde 2026-09-23 puede vivir en otra: la app evalua
     la condicion contra el archivo del cliente, que no esta separado por pantallas)
  8. 'formatoMes' / 'formatoDia' con un valor desconocido, o declarados fuera de una fecha

Las tres ultimas existen porque el mapeo viaja embebido y no se valida en runtime: un
'id' numerico rompe la deserializacion al arrancar, y un 'valor' del tipo equivocado o una
'condicion' mal escrita no rompen nada pero dejan el campo sin llenar en silencio.

Uso: python3 validar_mapeo.py [ruta_al_json]
Codigo de salida: 0 si no hay errores, 1 si hay al menos uno.
"""

import json
import sys
from collections import Counter

ORIGENES = ("variable", "variables", "valor", "manual")
TIPOS_VALIDOS = {"texto", "textarea", "select", "radio", "fecha", "checkbox"}
FORMATOS_MES = {"numero", "numeroConCero", "abreviado"}
FORMATOS_DIA = {"numero", "numeroConCero"}
COMPROBACIONES = 8


def nombre_de_tipo(valor):
    """El tipo tal como se llama en JSON, que es lo que el lector del mapeo espera."""
    if isinstance(valor, bool):
        return "booleano"
    if isinstance(valor, str):
        return "texto"
    if isinstance(valor, (int, float)):
        return "numero"
    if isinstance(valor, list):
        return "lista"
    if isinstance(valor, dict):
        return "objeto"
    return "null"


def ids_de(campo, pid, etq, errores):
    """
    Devuelve la lista de id **solo con los que son texto**, y anota un error por cada
    forma invalida. Filtrar aqui es lo que evita que un id numerico llegue al Counter y
    reviente el sorted() con un TypeError de Python en vez de un mensaje util.
    """
    valor = campo.get("id")

    if valor is None:
        return []

    if isinstance(valor, str):
        return [valor]

    if isinstance(valor, list):
        buenos = [x for x in valor if isinstance(x, str)]
        malos = [x for x in valor if not isinstance(x, str)]
        if malos:
            detalle = ", ".join(f"{x!r} ({nombre_de_tipo(x)})" for x in malos)
            errores.append(
                ("id no textual", pid, f"{etq}: la lista de id contiene {detalle}")
            )
        return buenos

    errores.append(
        (
            "id no textual",
            pid,
            f"{etq}: el id es {nombre_de_tipo(valor)} ({valor!r}); debe ser texto o lista de textos",
        )
    )
    return []


def revisar_valor(campo, pid, etq, tipo, errores):
    """El 'valor' fijo es booleano en checkbox y texto en todos los demas tipos."""
    if "valor" not in campo:
        return

    valor = campo["valor"]

    # Sin un 'tipo' valido no hay contra que comparar; ese error ya se anoto aparte.
    if tipo not in TIPOS_VALIDOS:
        return

    if tipo == "checkbox":
        if not isinstance(valor, bool):
            errores.append(
                (
                    "valor no booleano",
                    pid,
                    f"{etq}: checkbox con valor {nombre_de_tipo(valor)} ({valor!r}); debe ser true o false",
                )
            )
    elif not isinstance(valor, str):
        errores.append(
            (
                "valor no textual",
                pid,
                f"{etq}: tipo '{tipo}' con valor {nombre_de_tipo(valor)} ({valor!r}); debe ser texto",
            )
        )


def texto_o_lista_de_textos(valor):
    return isinstance(valor, str) or (
        isinstance(valor, list) and valor and all(isinstance(x, str) for x in valor)
    )


def revisar_condicion(campo, pid, etq, variables_mapeo, errores):
    """
    'condicion' es opcional. Si esta, debe ser {variable, valor} o {variable, valorExcepto},
    y la variable disparadora tiene que existir en alguna pantalla del mapeo. No hace falta
    que sea la misma: la app evalua la condicion contra el diccionario del cliente, que no
    esta separado por pantallas. Lo unico que se busca aca es el nombre mal escrito, que
    dejaria el campo 'omitido - sin dato disparador' sin que nadie lo note.
    """
    if "condicion" not in campo:
        return

    cond = campo["condicion"]

    if not isinstance(cond, dict):
        errores.append(
            ("condicion no es objeto", pid, f"{etq}: es {nombre_de_tipo(cond)} ({cond!r})")
        )
        return

    var = cond.get("variable")
    if not isinstance(var, str) or not var:
        errores.append(("condicion sin variable", pid, f"{etq}: falta 'variable' o no es texto"))
        return

    if var not in variables_mapeo:
        errores.append(
            (
                "condicion con disparador ausente",
                pid,
                f"{etq}: '{var}' no es variable de ningun campo del mapeo",
            )
        )

    presentes = [k for k in ("valor", "valorExcepto") if k in cond]
    if len(presentes) != 1:
        detalle = ", ".join(presentes) if presentes else "ninguno"
        errores.append(
            (
                "condicion sin un solo criterio",
                pid,
                f"{etq}: debe llevar 'valor' o 'valorExcepto', exactamente uno; trae {detalle}",
            )
        )
        return

    clave = presentes[0]
    if not texto_o_lista_de_textos(cond[clave]):
        errores.append(
            (
                "condicion con criterio invalido",
                pid,
                f"{etq}: '{clave}' es {nombre_de_tipo(cond[clave])} ({cond[clave]!r}); "
                "debe ser texto o lista no vacia de textos",
            )
        )

    desconocidas = set(cond) - {"variable", "valor", "valorExcepto", "_verificar"}
    if desconocidas:
        errores.append(
            ("condicion con claves de mas", pid, f"{etq}: {', '.join(sorted(desconocidas))}")
        )


def revisar_formato_fecha(campo, pid, etq, tipo, errores):
    """
    'formatoMes' y 'formatoDia' son opcionales y solo valen en las fechas; sin declararlos la
    app usa 'numero'. 'abreviado' (JAN..DEC) existe solo para el mes. Un valor desconocido no
    rompe la deserializacion: .NET lo dejaria en 'numero' y la fecha se llenaria mal en
    silencio, asi que se comprueba aca.
    """
    for clave, validos in (("formatoMes", FORMATOS_MES), ("formatoDia", FORMATOS_DIA)):
        if clave not in campo:
            continue

        if tipo != "fecha":
            errores.append(
                ("formato fuera de una fecha", pid, f"{etq}: '{clave}' en un campo '{tipo}'")
            )
            continue

        if campo[clave] not in validos:
            errores.append(
                (
                    "formato de fecha invalido",
                    pid,
                    f"{etq}: {clave} = {campo[clave]!r}; validos: {', '.join(sorted(validos))}",
                )
            )


def etiqueta_de(campo, indice):
    return campo.get("etiqueta") or campo.get("variable") or f"campo #{indice}"


def validar(ruta):
    with open(ruta, encoding="utf-8") as f:
        mapeo = json.load(f)

    errores = []
    total_campos = 0
    total_pendientes = 0
    total_condicion = 0

    # Todas las variables del mapeo: una 'condicion' puede apuntar a cualquiera de ellas,
    # viva o no en su misma pantalla.
    variables_mapeo = set()
    for pantalla in mapeo.get("pantallas", []):
        for campo in pantalla.get("campos", []):
            if isinstance(campo.get("variable"), str):
                variables_mapeo.add(campo["variable"])
            for v in campo.get("variables", []) or []:
                if isinstance(v, str):
                    variables_mapeo.add(v)

    for pantalla in mapeo.get("pantallas", []):
        pid = pantalla.get("id", "(sin id de pantalla)")
        campos = pantalla.get("campos", [])
        total_campos += len(campos)
        total_pendientes += len(pantalla.get("pendientes", []))
        total_condicion += sum(1 for c in campos if "condicion" in c)

        # Los id se resuelven una sola vez: aqui se anotan las formas invalidas y lo que
        # sigue trabaja ya solo con texto.
        ids_por_campo = [
            ids_de(campo, pid, etiqueta_de(campo, i), errores)
            for i, campo in enumerate(campos)
        ]

        # 1. id duplicados dentro de la pantalla
        contador = Counter()
        for ids in ids_por_campo:
            contador.update(ids)
        for control_id, veces in sorted(contador.items()):
            if veces > 1:
                errores.append(
                    ("id duplicado", pid, f"{control_id} aparece {veces} veces")
                )

        for i, campo in enumerate(campos):
            etq = etiqueta_de(campo, i)
            ids = ids_por_campo[i]
            tipo = campo.get("tipo")

            # 4. tipo faltante o desconocido
            if not tipo:
                errores.append(("tipo faltante", pid, etq))
            elif tipo not in TIPOS_VALIDOS:
                errores.append(("tipo desconocido", pid, f"{etq}: '{tipo}'"))

            # 2. fecha con distinto de 3 id
            if tipo == "fecha" and len(ids) != 3:
                errores.append(
                    ("fecha sin 3 id", pid, f"{etq}: tiene {len(ids)} id")
                )
            # el resto de tipos debe llevar exactamente 1 id
            if tipo and tipo != "fecha" and len(ids) != 1:
                errores.append(
                    ("id no unico", pid, f"{etq}: tipo '{tipo}' con {len(ids)} id")
                )
            if not ids:
                errores.append(("sin id", pid, etq))

            # 3. origen del valor: exactamente uno
            presentes = [k for k in ORIGENES if k in campo]
            if len(presentes) == 0:
                errores.append(("sin origen", pid, etq))
            elif len(presentes) > 1:
                errores.append(
                    ("origen multiple", pid, f"{etq}: {', '.join(presentes)}")
                )

            # 6. tipo del valor fijo
            revisar_valor(campo, pid, etq, tipo, errores)

            # 7. condicion bien formada y con un disparador que exista en el mapeo
            revisar_condicion(campo, pid, etq, variables_mapeo, errores)

            # 8. formato del value de mes y dia
            revisar_formato_fecha(campo, pid, etq, tipo, errores)

    # Resumen
    print(f"Archivo:    {ruta}")
    print(f"Version:    {mapeo.get('version')}")
    print(f"Pantallas:  {len(mapeo.get('pantallas', []))}")
    print(f"Campos:     {total_campos}")
    print(f"Pendientes: {total_pendientes}")
    print(f"Con condicion: {total_condicion}")
    print()

    if not errores:
        print(f"VALIDACION OK - 0 errores en las {COMPROBACIONES} comprobaciones.")
        return 0

    print(f"VALIDACION CON {len(errores)} ERROR(ES):")
    for tipo_error, pantalla, detalle in errores:
        print(f"  [{tipo_error}] {pantalla}: {detalle}")
    return 1


if __name__ == "__main__":
    ruta = sys.argv[1] if len(sys.argv) > 1 else "mapeo_ds160.json"
    sys.exit(validar(ruta))
