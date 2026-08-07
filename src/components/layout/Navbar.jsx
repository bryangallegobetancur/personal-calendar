import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { Button } from '../ui/Button'

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const mode = useThemeStore((s) => s.mode)
  const navigate = useNavigate()
  const location = useLocation()
  const themeLabels = { light: 'Claro', dark: 'Oscuro' }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) return null

  const initials = (profile?.name || user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-primary-600 text-white text-sm shadow-sm">PC</span>
            <span className="hidden sm:inline">Personal Calendar</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Cambiar tema"
            >
              {mode === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span className="hidden sm:inline">{themeLabels[mode]}</span>
            </button>
            <Link
              to="/settings"
              className={`text-sm font-medium transition-colors ${location.pathname === '/settings' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              Settings
            </Link>
            <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 max-w-40 truncate">{profile?.name || user.email}</span>
            <div className="grid place-items-center w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold ring-2 ring-white dark:ring-gray-900">
              {initials}
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
