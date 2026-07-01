import type { ReactNode } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useSpeechRate, type SpeechSpeed } from '@/features/speech/useSpeechRate'
import { canSpeak, speak } from '@/features/speech/speech'
import { useTheme, type Theme } from '@/features/theme/useTheme'
import { Button } from '@/components/Button'

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'ライト', icon: Sun },
  { value: 'dark', label: 'ダーク', icon: Moon },
  { value: 'system', label: '端末に合わせる', icon: Monitor },
]

const CARD_CLASS =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
          : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

export function SettingsPage() {
  const { session, signOut } = useAuth()
  const { speed, setSpeed, rate } = useSpeechRate()
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">設定</h1>

      <section className={`mt-5 ${CARD_CLASS}`}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">表示テーマ</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {THEME_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value}
              active={theme === option.value}
              onClick={() => setTheme(option.value)}
            >
              <option.icon size={14} />
              {option.label}
            </ToggleButton>
          ))}
        </div>
      </section>

      <section className={`mt-4 ${CARD_CLASS}`}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">読み上げ速度</h2>
        {!canSpeak() && (
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
            このブラウザは読み上げ (Web Speech API) に対応していません。
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {(['normal', 'slow'] as SpeechSpeed[]).map((option) => (
            <ToggleButton key={option} active={speed === option} onClick={() => setSpeed(option)}>
              {option === 'normal' ? '通常' : 'ゆっくり'}
            </ToggleButton>
          ))}
          <Button
            variant="secondary"
            disabled={!canSpeak()}
            onClick={() => speak('This is a sample sentence.', { rate })}
            className="px-3 py-1.5 text-sm"
          >
            試聴
          </Button>
        </div>
      </section>

      <section className={`mt-4 ${CARD_CLASS}`}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">アカウント</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{session?.user.email}</p>
        <Button variant="danger" onClick={() => signOut()} className="mt-3 px-3 py-1.5 text-sm">
          ログアウト
        </Button>
      </section>
    </div>
  )
}
