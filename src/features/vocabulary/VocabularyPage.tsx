import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { ItemStatusBadge } from '@/components/StatusBadge'
import { SpeakButton } from '@/features/speech/SpeakButton'
import { setVocabularyStatus } from '@/features/progress/api'
import { VOCABULARY_PAGE_SIZE, fetchVocabularyNotebook } from './api'
import type { ItemProgressStatus, Level } from '@/types/content'

const LEVELS: Level[] = ['Beginner', 'Elementary', 'Intermediate']
const STATUSES: ItemProgressStatus[] = ['new', 'learning', 'learned']

const SELECT_CLASS =
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
const INPUT_CLASS =
  'min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-600'

export function VocabularyPage() {
  const { session } = useAuth()
  const userId = session!.user.id
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [status, setStatus] = useState<ItemProgressStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, error, isLoading, reload } = useAsyncData(
    () => fetchVocabularyNotebook({ page, level, status, search }),
    [page, level, status, search],
  )

  useEffect(() => {
    setPage(1)
  }, [level, status, search])

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / VOCABULARY_PAGE_SIZE))
  const firstItemNumber = total === 0 ? 0 : (page - 1) * VOCABULARY_PAGE_SIZE + 1
  const lastItemNumber = Math.min(page * VOCABULARY_PAGE_SIZE, total)

  const handleStatusChange = async (vocabularyId: string, next: ItemProgressStatus) => {
    await setVocabularyStatus(userId, vocabularyId, next)
    reload()
  }

  const quizParams = new URLSearchParams()
  if (level !== 'all') quizParams.set('level', level)
  if (status !== 'all') quizParams.set('status', status)
  if (search.trim()) quizParams.set('search', search.trim())
  const quizHref = `/vocabulary/quiz${quizParams.size ? `?${quizParams}` : ''}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        単語帳
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        登録された単語をページごとに復習しよう。
      </p>

      <Link
        to={quizHref}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-900/60 dark:from-indigo-500/10 dark:to-blue-500/10"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            フラッシュカードでクイズ
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            現在の条件から最大200件を候補にして復習できます
          </p>
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="単語・意味・例文を検索"
          className={INPUT_CLASS}
        />
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

      {!isLoading && !error && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>
            {total}件中 {firstItemNumber}-{lastItemNumber}件を表示
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:enabled:hover:bg-slate-800"
            >
              前へ
            </button>
            <span className="text-xs">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:enabled:hover:bg-slate-800"
            >
              次へ
            </button>
          </div>
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.word}</p>
                {item.partOfSpeech && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {item.partOfSpeech}
                  </span>
                )}
                <ItemStatusBadge status={item.status ?? 'new'} />
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.meaningJa}</p>
              {item.exampleEn && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-500">
                  {item.exampleEn}
                  {item.exampleJa && (
                    <span className="text-slate-400 dark:text-slate-600"> / {item.exampleJa}</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <SpeakButton text={item.word} label="読み上げ" />
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
        {!isLoading && !error && items.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            条件に一致する単語がありません。
          </p>
        )}
      </ul>
    </div>
  )
}
