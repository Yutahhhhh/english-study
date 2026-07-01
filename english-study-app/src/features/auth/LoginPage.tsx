import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { session, signInWithPassword } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (session) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/courses'
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const { error: signInError } = await signInWithPassword(email, password)
    setIsSubmitting(false)
    if (signInError) {
      setError(signInError)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-slate-900">English Study</h1>
        <p className="mt-1 text-sm text-slate-500">メールアドレスとパスワードでログイン</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          メールアドレス
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          パスワード
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-blue-700 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  )
}
