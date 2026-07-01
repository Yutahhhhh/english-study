import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { CourseStatusBadge, LevelTag } from '@/components/StatusBadge'
import { fetchCourses } from './api'
import type { Level, Scene } from '@/types/content'

const LEVELS: Level[] = ['Beginner', 'Elementary', 'Intermediate']
const SCENES: Scene[] = [
  'Daily Conversation',
  'Travel',
  'Work',
  'Restaurant',
  'Shopping',
  'Self Introduction',
]

const SELECT_CLASS =
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

export function CoursesPage() {
  const { session } = useAuth()
  const userId = session!.user.id
  const { data: courses, error, isLoading, reload } = useAsyncData(
    () => fetchCourses(userId),
    [userId],
  )
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [scene, setScene] = useState<Scene | 'all'>('all')

  const filtered = useMemo(() => {
    if (!courses) return []
    return courses.filter(
      (course) =>
        (level === 'all' || course.level === level) && (scene === 'all' || course.scene === scene),
    )
  }, [courses, level, scene])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        コース一覧
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        レベルとシーンから、今日進めるコースを選ぼう。
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level | 'all')}
          className={SELECT_CLASS}
        >
          <option value="all">すべてのレベル</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={scene}
          onChange={(e) => setScene(e.target.value as Scene | 'all')}
          className={SELECT_CLASS}
        >
          <option value="all">すべてのシーン</option>
          {SCENES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock message={error} onRetry={reload} />}

      <ul className="mt-5 flex flex-col gap-3">
        {filtered.map((course) => (
          <li key={course.id}>
            <Link
              to={`/courses/${course.id}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-indigo-700"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">{course.title}</h2>
                <ChevronRight
                  size={18}
                  className="mt-0.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <LevelTag level={course.level} />
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {course.scene} ・ {course.durationDays}日間
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{course.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <CourseStatusBadge status={course.progressStatus} />
                {course.lastStudiedAt && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    最終学習日: {new Date(course.lastStudiedAt).toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            条件に一致するコースがありません。
          </p>
        )}
      </ul>
    </div>
  )
}
