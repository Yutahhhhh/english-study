import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpenText, CheckCircle2, ListChecks, PenLine, SpellCheck } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/features/speech/SpeakButton'
import { ensureCourseInProgress, markDayCompleted } from '@/features/progress/api'
import { fetchCourseDay } from './api'
import { ExerciseItem } from './ExerciseItem'

function SectionHeading({ icon: Icon, children }: { icon: typeof BookOpenText; children: string }) {
  return (
    <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
      <Icon size={16} className="text-indigo-500" />
      {children}
    </h2>
  )
}

const CARD_CLASS =
  'rounded-xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'

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
  if (!day)
    return (
      <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Dayが見つかりません。
      </div>
    )

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
      <Link
        to={`/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft size={14} />
        コース詳細
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
          {day.dayNumber}
        </span>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{day.title}</h1>
      </div>
      {day.objective && (
        <p className="mt-1 pl-11 text-sm text-slate-600 dark:text-slate-400">{day.objective}</p>
      )}

      <section className="mt-6 space-y-2">
        <SectionHeading icon={SpellCheck}>今日の文法</SectionHeading>
        <ul className="flex flex-col gap-2">
          {day.grammar.map((item) => (
            <li key={item.id} className={CARD_CLASS}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                {item.pattern && <SpeakButton text={item.pattern} label="発音" />}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.summary}</p>
              {item.pattern && (
                <p className="mt-1 text-sm text-indigo-600 italic dark:text-indigo-400">
                  {item.pattern}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-2">
        <SectionHeading icon={BookOpenText}>今日の単語</SectionHeading>
        <ul className="flex flex-wrap gap-2">
          {day.vocabulary.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {item.word}{' '}
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {item.partOfSpeech}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.meaningJa}</p>
              </div>
              <SpeakButton text={item.word} label="読み上げ" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-2">
        <SectionHeading icon={PenLine}>例文</SectionHeading>
        <ul className="flex flex-col gap-2">
          {day.examples.map((example) => (
            <li key={example.id} className={CARD_CLASS}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-800 dark:text-slate-100">{example.en}</p>
                <SpeakButton text={example.en} label="読み上げ" />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{example.ja}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-2">
        <SectionHeading icon={ListChecks}>練習問題</SectionHeading>
        <ul className="flex flex-col gap-2">
          {day.exercises.map((exercise, index) => (
            <ExerciseItem key={exercise.id} exercise={exercise} index={index} />
          ))}
        </ul>
      </section>

      <Button
        onClick={handleComplete}
        disabled={isCompleting || day.completed}
        className="mt-8 w-full py-3"
      >
        {day.completed ? (
          <>
            <CheckCircle2 size={16} />
            この Day は完了済みです
          </>
        ) : isCompleting ? (
          '保存中...'
        ) : (
          'この Day を完了する'
        )}
      </Button>
    </div>
  )
}
