import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { CourseStatusBadge } from '@/components/StatusBadge'
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
  if (!course) return <div className="p-6 text-center text-sm text-slate-500">コースが見つかりません。</div>

  const nextDay = course.days.find((day) => !day.completed) ?? course.days[0]

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/courses" className="text-sm text-blue-700 hover:underline">
        ← コース一覧
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h1 className="text-lg font-bold text-slate-900">{course.title}</h1>
        <CourseStatusBadge status={course.progressStatus} />
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {course.level} ・ {course.scene}
      </p>
      <p className="mt-2 text-sm text-slate-600">{course.description}</p>

      <ul className="mt-6 flex flex-col gap-2">
        {course.days.map((day) => {
          const isNext = day.id === nextDay?.id && !day.completed
          return (
            <li key={day.id}>
              <Link
                to={`/courses/${course.id}/days/${day.dayNumber}`}
                className={`flex items-center justify-between rounded-xl border p-4 shadow-sm transition hover:shadow ${
                  isNext
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Day {day.dayNumber}
                    {isNext && <span className="ml-2 text-xs font-normal text-blue-700">次に学ぶ</span>}
                  </p>
                  <p className="text-sm text-slate-600">{day.title}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {day.completed ? '完了' : '未完了'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
