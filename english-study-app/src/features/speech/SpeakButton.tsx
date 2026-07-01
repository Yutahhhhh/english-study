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
      className={`inline-flex items-center gap-1 rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
