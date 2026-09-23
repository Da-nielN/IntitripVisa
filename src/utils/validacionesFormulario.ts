import type { ChangeEvent, FocusEvent } from 'react'

export const soloNumeros = (maxLength?: number) => (event: ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.replace(/\D/g, '')
  event.target.value = maxLength ? value.slice(0, maxLength) : value
}

// El DS-160 solo acepta letras y espacios en nombres y apellidos: nada de
// numeros, apostrofes ni guiones. Las tildes y la ñ si se permiten al escribir;
// la normalizacion a ASCII ocurre al generar el JSON, no aqui.
const CARACTER_NO_VALIDO_EN_NOMBRE = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g

export const soloLetras = (event: ChangeEvent<HTMLInputElement>) => {
  event.target.value = event.target.value
    .replace(CARACTER_NO_VALIDO_EN_NOMBRE, '')
    .replace(/^\s+/, '')
    .replace(/\s{2,}/g, ' ')
}

export const recortarEspacios = (event: FocusEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.trim()
}
