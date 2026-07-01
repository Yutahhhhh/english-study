import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { ItemStatusBadge } from '@/components/StatusBadge'
import { SpeakButton } from '@/features/speech/SpeakButton'
import { setGrammarStatus } from '@/features/progress/api'
import { fetchGrammarNotebook } from './api'
import type { ItemProgressStatus, Level } from '@/types/content'

const LEVELS: Level[] = ['Beginner', 'Elementary', 'Intermediate']
const STATUSES: ItemProgressStatus[] = ['new', 'learning', 'learned']

const SELECT_CLASS =
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

export function GrammarPage() {
  const { session } = useAuth()
  const userId = session!.user.id
  const { data: items, error, isLoading, reload } = useAsyncData(
    () => fetchGrammarNotebook(userId),
    [userId],
  )
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [status, setStatus] = useState<ItemProgressStatus | 'all'>('all')

  const filtered = useMemo(() => {
    if (!items) return []
    return items.filter(
      (item) =>
        (level === 'all' || item.level === level) && (status === 'all' || item.status === status),
    )
  }, [items, level, status])

  const handleStatusChange = async (grammarId: string, next: ItemProgressStatus) => {
    await setGrammarStatus(userId, grammarId, next)
    reload()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        文法帳
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        コースに登場した文法項目を復習しよう。
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
          value={status}
          onChange={(e) => setStatus(e.target.value as ItemProgressStatus | 'all')}
          className={SELECT_CLASS}
        >
          <option value="all">すべてのステータス</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock message={error} onRetry={reload} />}

      <ul className="mt-5 flex flex-col gap-2.5">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <ItemStatusBadge status={item.status ?? 'new'} />
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.summary}</p>
              {item.pattern && (
                <p className="mt-1.5 text-sm text-indigo-600 italic dark:text-indigo-400">
                  {item.pattern}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {item.pattern && <SpeakButton text={item.pattern} label="読み上げ" />}
              <select
                value={item.status ?? 'new'}
                onChange={(e) => handleStatusChange(item.id, e.target.value as ItemProgressStatus)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            条件に一致する文法項目がありません。
          </p>
        )}
      </ul>
    </div>
  )
}
