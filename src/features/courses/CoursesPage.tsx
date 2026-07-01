import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { CourseStatusBadge } from '@/components/StatusBadge'
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
      <h1 className="text-lg font-bold text-slate-900">コース一覧</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level | 'all')}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
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
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
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

      <ul className="mt-4 flex flex-col gap-3">
        {filtered.map((course) => (
          <li key={course.id}>
            <Link
              to={`/courses/${course.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-slate-900">{course.title}</h2>
                <CourseStatusBadge status={course.progressStatus} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {course.level} ・ {course.scene} ・ {course.durationDays}日間
              </p>
              <p className="mt-2 text-sm text-slate-600">{course.description}</p>
              {course.lastStudiedAt && (
                <p className="mt-2 text-xs text-slate-400">
                  最終学習日: {new Date(course.lastStudiedAt).toLocaleDateString('ja-JP')}
                </p>
              )}
            </Link>
          </li>
        ))}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            条件に一致するコースがありません。
          </p>
        )}
      </ul>
    </div>
  )
}
