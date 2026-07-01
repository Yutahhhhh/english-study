import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { CourseStatusBadge, LevelTag } from '@/components/StatusBadge'
import { fetchCourseDetail } from './api'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { session } = useAuth()
  const userId = session!.user.id
  const {
    data: course,
    error,
    isLoading,
    reload,
  } = useAsyncData(() => fetchCourseDetail(userId, courseId!), [userId, courseId])

  if (isLoading) return <LoadingBlock />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!course)
    return (
      <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        コースが見つかりません。
      </div>
    )

  const nextDay = course.days.find((day) => !day.completed) ?? course.days[0]
  const completedCount = course.days.filter((day) => day.completed).length
  const progressPercent = course.days.length
    ? Math.round((completedCount / course.days.length) * 100)
    : 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft size={14} />
        コース一覧
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {course.title}
        </h1>
        <CourseStatusBadge status={course.progressStatus} />
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <LevelTag level={course.level} />
        <span className="text-xs text-slate-400 dark:text-slate-500">{course.scene}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{course.description}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
          {completedCount}/{course.days.length} 日完了
        </span>
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {course.days.map((day) => {
          const isNext = day.id === nextDay?.id && !day.completed
          return (
            <li key={day.id}>
              <Link
                to={`/courses/${course.id}/days/${day.dayNumber}`}
                className={`group flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isNext
                    ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-500/10'
                    : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700'
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    day.completed
                      ? 'bg-emerald-500 text-white'
                      : isNext
                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {day.completed ? <Check size={16} /> : day.dayNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Day {day.dayNumber}
                    {isNext && (
                      <span className="ml-2 text-xs font-normal text-indigo-600 dark:text-indigo-400">
                        次に学ぶ
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-400">{day.title}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
