import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'english-study:theme'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', isDark)
  return isDark
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [isDark, setIsDark] = useState(() => applyTheme(readStoredTheme()))

  useEffect(() => {
    setIsDark(applyTheme(theme))
    window.localStorage.setItem(STORAGE_KEY, theme)

    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setIsDark(applyTheme('system'))
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme: setThemeState, isDark }
}
