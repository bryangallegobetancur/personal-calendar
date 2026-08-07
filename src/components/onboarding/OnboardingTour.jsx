import { useState, useEffect } from 'react'

const STEPS = [
  {
    title: 'Welcome to Personal Calendar',
    description: 'Your modern, all-in-one calendar for organizing your time efficiently.',
    highlight: null,
  },
  {
    title: 'Create Events Fast',
    description: 'Click "+ New Event" or press "N" to create an event in seconds. Press "T" to go to today.',
    highlight: '[data-onboarding="new-event"]',
  },
  {
    title: 'Multiple Views',
    description: 'Switch between Day, Week, Month, and List views to see your schedule the way you prefer.',
    highlight: '[data-onboarding="view-switcher"]',
  },
  {
    title: 'Integrate Your Calendars',
    description: 'Connect Google, Outlook, and WhatsApp to sync events and get reminders.',
    highlight: '[data-onboarding="integrations"]',
  },
  {
    title: 'You\'re Ready!',
    description: 'Start organizing your time. Use keyboard shortcuts for maximum speed.',
    highlight: null,
  },
]

export function OnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('onboarding-complete')
    if (done) setDismissed(true)
  }, [])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('onboarding-complete', 'true')
    setDismissed(true)
    onComplete?.()
  }

  if (dismissed) return null

  const current = STEPS[step]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleDismiss} />
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-colors ${i <= step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            />
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {current.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {current.description}
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleDismiss}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </>
  )
}
