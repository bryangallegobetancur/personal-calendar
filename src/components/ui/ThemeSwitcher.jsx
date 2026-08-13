import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '../../store/themeStore'

const THEME_OPTIONS = [
  { id: 'aurora', name: 'Aurora', desc: 'Claro · SaaS azul', swatch: 'linear-gradient(135deg,#3d5afe,#7fb3ff)' },
  { id: 'midnight', name: 'Midnight', desc: 'Oscuro · Slate + glass', swatch: 'linear-gradient(135deg,#1e293b,#60a5fa)' },
  { id: 'dusk', name: 'Dusk', desc: 'Oscuro · Penumbra violeta', swatch: 'linear-gradient(135deg,#6d28d9,#22d3ee)' },
]

export function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const current = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title="Cambiar tema"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="w-4 h-4 rounded-full ring-1 ring-border" style={{ background: current.swatch }} />
        <span className="hidden sm:inline">{current.name}</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 panel p-2 z-50" role="listbox" aria-label="Seleccionar tema">
          {THEME_OPTIONS.map((t) => {
            const active = t.id === theme
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                  active ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                role="option"
                aria-selected={active}
              >
                <span className="w-6 h-6 rounded-full ring-1 ring-border flex-shrink-0" style={{ background: t.swatch }} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.desc}</span>
                </span>
                {active && (
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
