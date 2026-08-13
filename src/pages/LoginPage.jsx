import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { GoogleIcon, OutlookIcon } from '../components/ui/Icons'
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher'
import { useAuthStore } from '../store/authStore'

const BENEFITS = [
  'Vistas diaria, semanal y mensual',
  'Recordatorios por WhatsApp y email',
  'Sincroniza con Google y Outlook',
]

export function LoginPage() {
  const [mode, setMode] = useState('login')
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()

  if (!loading && user) {
    navigate('/', { replace: true })
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const tabClass = (active) =>
    `flex-1 pb-3 text-sm font-medium text-center transition-colors ${
      active
        ? 'text-primary border-b-2 border-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'var(--gradient-hero)', opacity: 0.16 }}
      />
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] items-center px-6 py-14">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* Marca (oculta en móvil) */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 mb-10">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-bold">PC</span>
              <span className="font-display text-xl font-bold tracking-[-0.02em]">Personal Calendar</span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-[-0.02em] max-w-md">
              Tu agenda, en modo enfoque total.
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Gestiona tus citas, recordatorios e integraciones desde un calendario limpio, rápido y diseñado para concentrarte.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna del formulario */}
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold">PC</span>
              <span className="font-display text-lg font-bold tracking-[-0.02em]">Personal Calendar</span>
            </div>

            <div className="panel p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'login' ? 'Accede a tu agenda personal' : 'Empieza a organizar tus días'}
              </p>

              <div className="mt-6 flex border-b border-border">
                <button onClick={() => setMode('login')} className={tabClass(mode === 'login')}>
                  Iniciar sesión
                </button>
                <button onClick={() => setMode('register')} className={tabClass(mode === 'register')}>
                  Crear cuenta
                </button>
              </div>

              <div className="mt-6">
                {mode === 'login' ? <LoginForm /> : <RegisterForm />}
              </div>

              {mode === 'login' && (
                <>
                  <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />
                    o continúa con
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold transition-colors hover:bg-accent"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      Google
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold transition-colors hover:bg-accent"
                    >
                      <OutlookIcon className="w-4 h-4" />
                      Outlook
                    </button>
                  </div>
                </>
              )}

              {mode === 'register' && (
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Al crear una cuenta aceptas nuestros{' '}
                  <a href="#" className="text-primary underline">Términos de servicio</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
