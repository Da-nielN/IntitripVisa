import type { VisaFormData } from '@/lib/schema'
import type { ApiResponse } from '@/types'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string

if (!APPS_SCRIPT_URL) {
  console.warn('[API] VITE_APPS_SCRIPT_URL not set. Form submission will fail.')
}

/**
 * Submits the visa form data to Google Apps Script Web App.
 * Apps Script will create the Drive folder, copy the Doc template,
 * replace variables, convert to PDF and save it.
 */
export async function submitVisaForm(data: VisaFormData): Promise<ApiResponse> {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      'La URL del servicio no está configurada. Contacta al administrador.'
    )
  }

  // Google Apps Script requires a no-cors POST with URLSearchParams
  // OR a CORS-enabled fetch if the script sets the right headers.
  // We use a JSONP-style GET for simplicity with Apps Script CORS quirks,
  // but send via POST body as JSON for better data handling.
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
  }

  const result = (await response.json()) as ApiResponse

  if (!result.success) {
    throw new Error(result.message || 'Error desconocido al procesar el formulario')
  }

  return result
}
