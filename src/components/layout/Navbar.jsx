import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { ThemeSwitcher } from '../ui/ThemeSwitcher'

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()
  const location = useLocation()

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
    <nav className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur shadow-sm transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <img src="/logo.png" alt="Personal Calendar" className="w-8 h-8 rounded-lg object-contain" />
            <span className="hidden sm:inline">Personal Calendar</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              to="/settings"
              className={`text-sm font-medium transition-colors ${location.pathname === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Settings
            </Link>
            <span className="hidden md:inline text-sm text-muted-foreground max-w-40 truncate">{profile?.name || user.email}</span>
            <div className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold ring-2 ring-card">
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
