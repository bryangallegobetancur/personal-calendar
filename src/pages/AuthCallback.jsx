import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeGoogleCode } from '../lib/googleCalendar'
import { exchangeMicrosoftCode } from '../lib/outlookCalendar'
import { useAuthStore } from '../store/authStore'

export function AuthCallback() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const oauthError = params.get('error')

    if (oauthError || !code) {
      setError(oauthError || 'Authorization cancelled or failed')
      setTimeout(() => navigate('/settings'), 3000)
      return
    }

    const isGoogle = window.location.pathname.includes('google')
    const isMicrosoft = window.location.pathname.includes('microsoft')

    handleCallback(code, state, isGoogle, isMicrosoft)
  }, [user, loading])

  const handleCallback = async (code, state, isGoogle, isMicrosoft) => {
    try {
      const codeVerifier = sessionStorage.getItem(`pkce_${state}`)
      sessionStorage.removeItem(`pkce_${state}`)

      if (isGoogle) {
        await exchangeGoogleCode(code, codeVerifier || undefined)
      } else if (isMicrosoft) {
        await exchangeMicrosoftCode(code, codeVerifier || undefined)
      } else {
        throw new Error('Unknown service')
      }

      navigate('/settings')
    } catch (err) {
      console.error('OAuth callback error:', err)
      setError(err.message)
      setTimeout(() => navigate('/settings'), 3000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="text-center">
        {loading ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="text-red-600 dark:text-red-400 text-lg font-medium">Connection failed</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Redirecting to settings...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Completing connection...</p>
          </div>
        )}
      </div>
    </div>
  )
}
