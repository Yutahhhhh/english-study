import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/Button'
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
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-700/20" />
      <div className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-blue-300/40 blur-3xl dark:bg-blue-700/20" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30">
          <GraduationCap size={24} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">English Study</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          メールアドレスとパスワードでログイン
        </p>

        <label className="mt-6 block text-sm font-medium text-slate-700 dark:text-slate-300">
          メールアドレス
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
          パスワード
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </div>
  )
}
