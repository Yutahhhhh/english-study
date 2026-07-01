import { useAuth } from '@/features/auth/AuthContext'
import { useSpeechRate, type SpeechSpeed } from '@/features/speech/useSpeechRate'
import { canSpeak, speak } from '@/features/speech/speech'

export function SettingsPage() {
  const { session, signOut } = useAuth()
  const { speed, setSpeed, rate } = useSpeechRate()

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-lg font-bold text-slate-900">設定</h1>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">読み上げ速度</h2>
        {!canSpeak() && (
          <p className="mt-1 text-sm text-amber-600">
            このブラウザは読み上げ (Web Speech API) に対応していません。
          </p>
        )}
        <div className="mt-2 flex gap-2">
          {(['normal', 'slow'] as SpeechSpeed[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSpeed(option)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                speed === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300'
              }`}
            >
              {option === 'normal' ? '通常' : 'ゆっくり'}
            </button>
          ))}
          <button
            type="button"
            disabled={!canSpeak()}
            onClick={() => speak('This is a sample sentence.', { rate })}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            試聴
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">アカウント</h2>
        <p className="mt-1 text-sm text-slate-600">{session?.user.email}</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
        >
          ログアウト
        </button>
      </section>
    </div>
  )
}
