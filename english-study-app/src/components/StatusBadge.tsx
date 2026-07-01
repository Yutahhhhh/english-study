import { Circle, Clock, CheckCircle2 } from 'lucide-react'
import type { CourseProgressStatus, ItemProgressStatus } from '@/types/content'

const COURSE_LABEL: Record<CourseProgressStatus, string> = {
  not_started: '未着手',
  in_progress: '学習中',
  completed: '完了',
}

const COURSE_STYLE: Record<CourseProgressStatus, string> = {
  not_started: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

const COURSE_ICON: Record<CourseProgressStatus, typeof Circle> = {
  not_started: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
}

const ITEM_LABEL: Record<ItemProgressStatus, string> = {
  new: 'new',
  learning: 'learning',
  learned: 'learned',
}

const ITEM_STYLE: Record<ItemProgressStatus, string> = {
  new: 'bg-slate-100 text-slate-600',
  learning: 'bg-amber-100 text-amber-700',
  learned: 'bg-emerald-100 text-emerald-700',
}

const ITEM_ICON: Record<ItemProgressStatus, typeof Circle> = {
  new: Circle,
  learning: Clock,
  learned: CheckCircle2,
}

export function CourseStatusBadge({ status }: { status: CourseProgressStatus }) {
  const Icon = COURSE_ICON[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${COURSE_STYLE[status]}`}
    >
      <Icon size={12} />
      {COURSE_LABEL[status]}
    </span>
  )
}

export function ItemStatusBadge({ status }: { status: ItemProgressStatus }) {
  const Icon = ITEM_ICON[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${ITEM_STYLE[status]}`}
    >
      <Icon size={12} />
      {ITEM_LABEL[status]}
    </span>
  )
}
