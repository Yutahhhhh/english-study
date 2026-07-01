import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { SpeakButton } from '@/features/speech/SpeakButton'
import { ensureCourseInProgress, markDayCompleted } from '@/features/progress/api'
import { fetchCourseDay } from './api'
import { ExerciseItem } from './ExerciseItem'

export function LessonDayPage() {
  const { courseId, dayNumber } = useParams<{ courseId: string; dayNumber: string }>()
  const { session } = useAuth()
  const navigate = useNavigate()
  const userId = session!.user.id
  const dayNum = Number(dayNumber)

  const {
    data: day,
    error,
    isLoading,
    reload,
  } = useAsyncData(() => fetchCourseDay(userId, courseId!, dayNum), [userId, courseId, dayNum])
  const [isCompleting, setIsCompleting] = useState(false)

  if (isLoading) return <LoadingBlock />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!day) return <div className="p-6 text-center text-sm text-slate-500">Dayが見つかりません。</div>

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await ensureCourseInProgress(userId, courseId!)
      await markDayCompleted(userId, courseId!, dayNum)
      navigate(`/courses/${courseId}`)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to={`/courses/${courseId}`} className="text-sm text-blue-700 hover:underline">
        ← コース詳細
      </Link>

      <h1 className="mt-3 text-lg font-bold text-slate-900">
        Day {day.dayNumber}: {day.title}
      </h1>
      {day.objective && <p className="mt-1 text-sm text-slate-600">{day.objective}</p>}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">今日の文法</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {day.grammar.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-800">{item.title}</p>
                {item.pattern && <SpeakButton text={item.pattern} label="発音" />}
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
              {item.pattern && <p className="mt-1 text-sm italic text-slate-500">{item.pattern}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">今日の単語</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {day.vocabulary.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {item.word} <span className="text-xs text-slate-400">{item.partOfSpeech}</span>
                </p>
                <p className="text-xs text-slate-500">{item.meaningJa}</p>
              </div>
              <SpeakButton text={item.word} label="読み上げ" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">例文</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {day.examples.map((example) => (
            <li key={example.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-800">{example.en}</p>
                <SpeakButton text={example.en} label="読み上げ" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{example.ja}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900">練習問題</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {day.exercises.map((exercise, index) => (
            <ExerciseItem key={exercise.id} exercise={exercise} index={index} />
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={handleComplete}
        disabled={isCompleting || day.completed}
        className="mt-8 w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {day.completed ? 'この Day は完了済みです' : isCompleting ? '保存中...' : 'この Day を完了する'}
      </button>
    </div>
  )
}
