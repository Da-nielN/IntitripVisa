export type ApiResponse = {
  success: boolean
  message: string
  folderId?: string
  pdfUrl?: string
}

export type FormStep = {
  id: number
  title: string
  description: string
  icon: string
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'
