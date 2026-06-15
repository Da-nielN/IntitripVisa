import type { ApiResponse } from '../types'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string

/**
 * CORS workaround for Google Apps Script:
 *
 * Apps Script does NOT support CORS preflight (OPTIONS).
 * Solution: send as application/x-www-form-urlencoded with the JSON
 * payload encoded as a single field called "payload". This avoids the
 * preflight entirely (simple request). Apps Script then reads
 * e.parameter.payload and parses it back to JSON.
 *
 * On the Apps Script side, use doPost(e) and read:
 *   var data = JSON.parse(e.parameter.payload)
 *
 * See: apps-script/Code.gs
 */
export async function submitVisaForm(data: Record<string, unknown>): Promise<ApiResponse> {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      'Variable de entorno VITE_APPS_SCRIPT_URL no encontrada. Verifica tu archivo .env'
    )
  }

  const body = new URLSearchParams()
  body.append('payload', JSON.stringify(data))

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body,
    // No Content-Type header override: browser sends application/x-www-form-urlencoded.
    // This is a simple request: no preflight, no CORS error.
  })

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
  }

  const result: ApiResponse = await response.json()
  return result
}


