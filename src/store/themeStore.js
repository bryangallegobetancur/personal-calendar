import { create } from 'zustand'

const applyTheme = (mode) => {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.classList.toggle('theme-light', mode === 'light')
}

const getInitialMode = () => {
  const stored = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const mode = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light')
  localStorage.setItem('theme', mode)
  applyTheme(mode)
  return mode
}

export const useThemeStore = create((set) => ({
  mode: getInitialMode(),
  toggle: () =>
    set((state) => {
      const next = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      applyTheme(next)
      return { mode: next }
    }),
  setMode: (mode) => {
    const next = mode === 'dark' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    applyTheme(next)
    set({ mode: next })
  },
}))
