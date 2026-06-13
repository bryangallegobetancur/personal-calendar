import { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

export function LoginPage() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Personal Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your appointments and reminders</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-2 text-sm font-medium text-center transition-colors ${
                mode === 'login'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-2 text-sm font-medium text-center transition-colors ${
                mode === 'register'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}

          {mode === 'register' && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 underline">Terms of Service</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
