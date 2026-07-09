import type { ChangeEvent, FocusEvent } from 'react'

export const soloNumeros = (maxLength?: number) => (event: ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.replace(/\D/g, '')
  event.target.value = maxLength ? value.slice(0, maxLength) : value
}

export const soloLetras = (event: ChangeEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.replace(/[0-9]/g, '').replace(/^\s+/, '')
}

export const recortarEspacios = (event: FocusEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.trim()
}
