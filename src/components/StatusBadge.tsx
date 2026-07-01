import { Circle, Clock, CheckCircle2 } from 'lucide-react'
import type { CourseProgressStatus, ItemProgressStatus, Level } from '@/types/content'

const LEVEL_STYLE: Record<Level, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Elementary: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Intermediate: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
}

export function LevelTag({ level }: { level: Level }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${LEVEL_STYLE[level]}`}>
      {level}
    </span>
  )
}

const COURSE_LABEL: Record<CourseProgressStatus, string> = {
  not_started: '未着手',
  in_progress: '学習中',
  completed: '完了',
}

const COURSE_STYLE: Record<CourseProgressStatus, string> = {
  not_started: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  in_progress: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
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
  new: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  learning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  learned: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${COURSE_STYLE[status]}`}
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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${ITEM_STYLE[status]}`}
    >
      <Icon size={12} />
      {ITEM_LABEL[status]}
    </span>
  )
}
