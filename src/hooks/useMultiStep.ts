import { useState } from 'react'

export function useMultiStep(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1))
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0))
  const goTo = (step: number) => setCurrentStep(step)

  return {
    currentStep,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    next,
    prev,
    goTo,
  }
}
