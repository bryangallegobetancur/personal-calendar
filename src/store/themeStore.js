import { create } from 'zustand'

export const THEME_IDS = ['aurora', 'midnight', 'dusk']

const applyTheme = (theme) => {
  const root = document.documentElement
  root.classList.remove('theme-aurora', 'theme-midnight', 'theme-dusk', 'theme-light', 'dark')
  root.classList.add(`theme-${theme}`)
  if (theme === 'midnight' || theme === 'dusk') root.classList.add('dark')
}

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme')
  let theme = THEME_IDS.includes(stored) ? stored : null
  if (!theme) {
    theme = stored === 'dark' ? 'midnight' : stored === 'light' ? 'aurora' : null
  }
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'aurora'
  }
  localStorage.setItem('theme', theme)
  applyTheme(theme)
  return theme
}

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (!THEME_IDS.includes(theme)) return
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    set({ theme })
  },
}))
