import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Personal Calendar</h1>
          <p className="text-gray-500 mt-2">Manage your appointments and reminders</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-2 text-sm font-medium text-center ${
                mode === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-2 text-sm font-medium text-center ${
                mode === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}

          {mode === 'register' && (
            <p className="text-xs text-gray-400 mt-4 text-center">
              By creating an account you agree to our{' '}
              <a href="#" className="text-blue-600 underline">Terms of Service</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
