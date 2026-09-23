import { useCallback, useState } from 'react'
import type { Path, PathValue, UseFormReturn } from 'react-hook-form'
import type { VisaFormSchema } from '../lib/schema'

// Los repetidores del DS-160 no son arreglos: son slots numerados fijos
// (ctl00..ctl04) que el modelo guarda como campos sueltos, porque el mapeo
// busca cada id literalmente. Este gancho los muestra de a uno y deja añadir
// los siguientes, sin cambiar la forma del modelo.
//
// Quitar un slot corre los que siguen hacia arriba en vez de vaciarlo en su
// lugar: la app llena las filas en orden, así que un hueco intermedio dejaría
// una fila vacía en medio del DS-160.
export function useSlotsRepetidor<T extends Path<VisaFormSchema>>(
  form: UseFormReturn<VisaFormSchema>,
  campos: readonly T[],
) {
  const { getValues, setValue } = form

  const [visibles, setVisibles] = useState(() =>
    Math.max(1, campos.filter((campo) => getValues(campo)).length),
  )

  const escribir = useCallback(
    (campo: T, valor: string, validar: boolean) => {
      setValue(campo, valor as PathValue<VisaFormSchema, T>, { shouldValidate: validar })
    },
    [setValue],
  )

  const agregar = useCallback(() => {
    setVisibles((cantidad) => Math.min(campos.length, cantidad + 1))
  }, [campos.length])

  const quitar = useCallback(
    (indice: number) => {
      const valores = campos.map((campo) => String(getValues(campo) ?? ''))
      valores.splice(indice, 1)
      valores.push('')
      campos.forEach((campo, posicion) => escribir(campo, valores[posicion], true))
      setVisibles((cantidad) => Math.max(1, cantidad - 1))
    },
    [campos, escribir, getValues],
  )

  // Para cuando el bloque entero deja de aplicar (el radio que lo abre pasa a "no").
  const reiniciar = useCallback(() => {
    campos.forEach((campo) => escribir(campo, '', false))
    setVisibles(1)
  }, [campos, escribir])

  return {
    visibles,
    agregar,
    quitar,
    reiniciar,
    puedeAgregar: visibles < campos.length,
  }
}
