import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Lock, Mail, UserPlus } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import { ROUTES } from '@utils/constants'
import { isSupabaseConfigured } from '@services/supabase'

function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const { user, signIn, signUp, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const title = useMemo(() => {
    if (mode === 'signup') return 'Create your account'
    if (mode === 'forgot-password') return 'Reset your password'
    return 'Sign in to HackSprint'
  }, [mode])

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password, { full_name: fullName })
        if (signUpError) throw new Error(signUpError)
        setMessage('Account created. Check your email if confirmation is enabled, then sign in.')
        navigate(ROUTES.LOGIN)
        return
      }

      if (mode === 'forgot-password') {
        const { error: resetError } = await resetPassword(email)
        if (resetError) throw new Error(resetError)
        setMessage('Password reset email sent.')
        return
      }

      const { error: signInError } = await signIn(email, password)
      if (signInError) throw new Error(signInError)
      navigate(ROUTES.DASHBOARD)
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">HackSprint</p>
          <h1 className="mt-4 text-4xl font-bold">Authenticate first, then test the real app flow.</h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
            This project now has working auth screens. Use your Supabase project URL and anon key in `.env`,
            then sign up or sign in here instead of being blocked by a placeholder page.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="font-semibold">Required env vars</div>
              <div className="mt-2 font-mono text-xs text-sky-200">VITE_SUPABASE_URL</div>
              <div className="font-mono text-xs text-sky-200">VITE_SUPABASE_ANON_KEY</div>
            </div>
            {!isSupabaseConfigured() && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
                Supabase is not configured yet. Add `.env` before testing auth.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 text-gray-900 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'signup' && 'Create a Supabase user for this app.'}
              {mode === 'login' && 'Use the email and password from your Supabase auth user.'}
              {mode === 'forgot-password' && 'Enter your email to receive a reset link.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="fullName">
                  Full name
                </label>
                <div className="relative">
                  <UserPlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="input pl-10"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input pl-10"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <button type="submit" disabled={submitting || !isSupabaseConfigured()} className="btn btn-primary w-full gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === 'signup' && 'Create account'}
              {mode === 'login' && 'Sign in'}
              {mode === 'forgot-password' && 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {mode !== 'login' && (
              <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="text-primary-600 hover:text-primary-700">
                Go to sign in
              </button>
            )}
            {mode !== 'signup' && (
              <button type="button" onClick={() => navigate(ROUTES.SIGNUP)} className="text-primary-600 hover:text-primary-700">
                Create account
              </button>
            )}
            {mode !== 'forgot-password' && (
              <button type="button" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)} className="text-primary-600 hover:text-primary-700">
                Forgot password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
