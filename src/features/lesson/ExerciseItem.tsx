import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/Button'
import type { Exercise } from '@/types/content'

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/[.!?]+$/, '')
}

export function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)

  const isCorrect = checked && normalize(answer) === normalize(exercise.answerEn)

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
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
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-500/15 dark:text-red-300'
                  : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
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
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <Button
            variant="secondary"
            onClick={() => setChecked(true)}
            disabled={!answer.trim()}
            className="px-3 py-1.5 text-sm"
          >
            答え合わせ
          </Button>
        </div>
      )}

      {checked && (
        <p
          className={`mt-2 flex items-center gap-1 text-sm ${
            isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
          }`}
        >
          {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {isCorrect ? '正解です！' : `不正解。正解例: ${exercise.answerEn}`}
        </p>
      )}
    </li>
  )
}
