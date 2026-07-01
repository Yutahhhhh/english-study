import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Exercise } from '@/types/content'

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/[.!?]+$/, '')
}

export function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)

  const isCorrect = checked && normalize(answer) === normalize(exercise.answerEn)

  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <p className="text-sm font-medium text-slate-800">
        Q{index + 1}. {exercise.promptJa}
      </p>

      {exercise.type === 'choice' && exercise.choices ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {exercise.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => {
                setAnswer(choice)
                setChecked(true)
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                checked && choice === answer
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setChecked(false)
            }}
            placeholder="英文を入力"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={!answer.trim()}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white disabled:opacity-40"
          >
            答え合わせ
          </button>
        </div>
      )}

      {checked && (
        <p
          className={`mt-2 flex items-center gap-1 text-sm ${
            isCorrect ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {isCorrect ? '正解です！' : `不正解。正解例: ${exercise.answerEn}`}
        </p>
      )}
    </li>
  )
}
