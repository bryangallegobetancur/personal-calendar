import { useState, useMemo } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

function getPasswordStrength(password) {
  if (!password) return null
  if (password.length < 8) return { label: 'Débil', level: 0, color: 'bg-red-500', textColor: 'text-red-600' }
  let categories = 0
  if (/[a-z]/.test(password)) categories++
  if (/[A-Z]/.test(password)) categories++
  if (/[0-9]/.test(password)) categories++
  if (/[^a-zA-Z0-9]/.test(password)) categories++
  if (password.length >= 12 && categories >= 2) return { label: 'Fuerte', level: 2, color: 'bg-green-500', textColor: 'text-green-600' }
  if (categories >= 3) return { label: 'Fuerte', level: 2, color: 'bg-green-500', textColor: 'text-green-600' }
  if (categories >= 2) return { label: 'Media', level: 1, color: 'bg-yellow-500', textColor: 'text-yellow-600' }
  return { label: 'Débil', level: 0, color: 'bg-red-500', textColor: 'text-red-600' }
}

function PasswordStrengthBar({ password }) {
  const strength = useMemo(() => getPasswordStrength(password), [password])
  if (!strength) return null
  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              level <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength.textColor}`}>{strength.label}</p>
    </div>
  )
}

function PasswordInput({ label, id, value, onChange, onBlur, showPassword, onToggleShow, error }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const signUp = useAuthStore((s) => s.signUp)

  const checkMismatch = () => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true)
    } else {
      setPasswordMismatch(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (passwordMismatch && e.target.value === confirmPassword) {
      setPasswordMismatch(false)
    }
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    if (passwordMismatch && password === e.target.value) {
      setPasswordMismatch(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }

    setLoading(true)
    try {
      const result = await signUp(email, password, name)
      if (result?.user?.identities?.length === 0) {
        setError('Este correo ya está registrado. Inicia sesión.')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Revisa tu correo</h2>
        <p className="text-sm text-gray-500">
          Te enviamos un enlace de confirmación a <strong>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        id="reg-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email"
        id="reg-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PasswordInput
        label="Password"
        id="reg-password"
        value={password}
        onChange={handlePasswordChange}
        showPassword={showPassword}
        onToggleShow={() => setShowPassword(!showPassword)}
      />
      <PasswordStrengthBar password={password} />
      <PasswordInput
        label="Confirm Password"
        id="reg-confirm-password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onBlur={checkMismatch}
        showPassword={showConfirmPassword}
        onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
        error={passwordMismatch ? 'Las contraseñas no coinciden' : ''}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
