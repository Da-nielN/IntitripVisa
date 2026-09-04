/**
 * Una opcion de un catalogo del DS-160.
 *
 * `valor` es el `value` real del <option> en el DS-160 (por ejemplo `ECUA`,
 * `B1-B2`, `M`). Es lo que la aplicacion de escritorio escribe en el formulario:
 * no se traduce, no se normaliza y no se toca.
 *
 * `texto` es la traduccion al espanol que ve el cliente en la web, y viaja en el
 * JSON junto al valor para que el operador pueda revisar lo que se eligio.
 */
export type OpcionCatalogo = {
  valor: string
  texto: string
}

/**
 * Los `valor` de un catalogo, como tupla no vacia lista para `z.enum(...)`.
 *
 * Los catalogos generados se declaran `as const`, asi que `T[number]['valor']`
 * es la union literal de sus valores: el enum de zod queda tipado con los
 * mismos valores del DS-160 sin repetir la lista en el esquema.
 */
export const valoresDe = <T extends readonly OpcionCatalogo[]>(catalogo: T) =>
  catalogo.map((opcion) => opcion.valor) as unknown as [T[number]['valor'], ...T[number]['valor'][]]
