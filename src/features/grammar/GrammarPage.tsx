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
      <h1 className="text-lg font-bold text-slate-900">文法帳</h1>

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
          value={status}
          onChange={(e) => setStatus(e.target.value as ItemProgressStatus | 'all')}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
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

      <ul className="mt-4 flex flex-col gap-2">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <ItemStatusBadge status={item.status ?? 'new'} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
              {item.pattern && <p className="mt-1 text-sm italic text-slate-500">{item.pattern}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              {item.pattern && <SpeakButton text={item.pattern} label="読み上げ" />}
              <select
                value={item.status ?? 'new'}
                onChange={(e) => handleStatusChange(item.id, e.target.value as ItemProgressStatus)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
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
          <p className="p-6 text-center text-sm text-slate-500">
            条件に一致する文法項目がありません。
          </p>
        )}
      </ul>
    </div>
  )
}
