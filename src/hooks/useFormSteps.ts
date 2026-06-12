import { useState, useCallback } from 'react'
import { FORM_STEPS } from '@/constants'

export function useFormSteps() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = FORM_STEPS.length

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalSteps])

  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, totalSteps)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalSteps])

  const isFirst = currentStep === 1
  const isLast  = currentStep === totalSteps

  return { currentStep, totalSteps, goNext, goPrev, goTo, isFirst, isLast }
}
