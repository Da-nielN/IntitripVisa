export type ApiResponse = {
  success: boolean
  message: string
  folderId?: string
  // Lo que consume Illari. Si la respuesta no lo trae, el script desplegado
  // todavia es el que generaba PDF.
  jsonUrl?: string
  pdfUrl?: string
}

export type FormStep = {
  id: number
  title: string
  description: string
  icon: string
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

