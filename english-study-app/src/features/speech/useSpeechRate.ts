import { useEffect, useState } from 'react'

export type SpeechSpeed = 'normal' | 'slow'

const STORAGE_KEY = 'english-study:speech-speed'
const RATE_BY_SPEED: Record<SpeechSpeed, number> = {
  normal: 1,
  slow: 0.6,
}

function readStoredSpeed(): SpeechSpeed {
  if (typeof window === 'undefined') return 'normal'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'slow' ? 'slow' : 'normal'
}

export function useSpeechRate() {
  const [speed, setSpeed] = useState<SpeechSpeed>(readStoredSpeed)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, speed)
  }, [speed])

  return { speed, setSpeed, rate: RATE_BY_SPEED[speed] }
}
