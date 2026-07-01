import { Volume2, VolumeX } from 'lucide-react'
import { canSpeak, speak } from './speech'
import { useSpeechRate } from './useSpeechRate'

type SpeakButtonProps = {
  text: string
  label?: string
  className?: string
}

export function SpeakButton({ text, label = '読み上げ', className = '' }: SpeakButtonProps) {
  const { rate } = useSpeechRate()
  const supported = canSpeak()
  const Icon = supported ? Volume2 : VolumeX

  return (
    <button
      type="button"
      disabled={!supported}
      onClick={() => speak(text, { rate })}
      aria-label={`${label}: ${text}`}
      title={supported ? label : 'このブラウザは読み上げに対応していません'}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 ${className}`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
