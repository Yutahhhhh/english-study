import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, RotateCcw, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/features/speech/SpeakButton'
import type { ItemProgressStatus } from '@/types/content'
import type { FlashcardData } from './types'
import { shuffle } from './shuffle'

const SESSION_SIZE_OPTIONS = [5, 10, 15, 20]

const RATINGS: {
  value: ItemProgressStatus
  label: string
  sub: string
  className: string
  summaryClassName: string
}[] = [
  {
    value: 'new',
    label: 'もう一度',
    sub: '思い出せなかった',
    className:
      'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30',
    summaryClassName: 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30',
  },
  {
    value: 'learning',
    label: 'うろ覚え',
    sub: 'なんとなく分かった',
    className:
      'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30',
    summaryClassName: 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30',
  },
  {
    value: 'learned',
    label: '覚えた',
    sub: '自信を持って分かった',
    className:
      'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30',
    summaryClassName:
      'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30',
  },
]

type Phase = 'setup' | 'active' | 'summary'

type FlashcardQuizProps = {
  title: string
  items: FlashcardData[]
  onRate: (id: string, status: ItemProgressStatus) => void | Promise<void>
  backTo: string
}

export function FlashcardQuiz({ title, items, onRate, backTo }: FlashcardQuizProps) {
  const [pool, setPool] = useState(items)
  const [phase, setPhase] = useState<Phase>('setup')
  const [sessionSize, setSessionSize] = useState(() => Math.min(10, items.length))
  const [queue, setQueue] = useState<FlashcardData[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<Map<string, ItemProgressStatus>>(new Map())

  const sizeOptions = useMemo(() => {
    const options = SESSION_SIZE_OPTIONS.filter((n) => n < pool.length)
    return [...options, pool.length]
  }, [pool.length])

  const startBatch = (size: number) => {
    setQueue(shuffle(pool).slice(0, size))
    setIndex(0)
    setRevealed(false)
    setResults(new Map())
    setPhase('active')
  }

  const handleRate = async (status: ItemProgressStatus) => {
    const card = queue[index]
    setResults((prev) => new Map(prev).set(card.id, status))
    await onRate(card.id, status)

    if (index + 1 < queue.length) {
      setIndex(index + 1)
      setRevealed(false)
    } else {
      setPhase('summary')
    }
  }

  const tally = useMemo(() => {
    const counts: Record<ItemProgressStatus, number> = { new: 0, learning: 0, learned: 0 }
    for (const status of results.values()) counts[status]++
    return counts
  }, [results])

  const remainingPool = useMemo(() => {
    const seenIds = new Set(queue.map((c) => c.id))
    const notLearnedFromBatch = queue.filter((c) => results.get(c.id) !== 'learned')
    const neverSeen = pool.filter((c) => !seenIds.has(c.id))
    return [...notLearnedFromBatch, ...neverSeen]
  }, [queue, results, pool])

  if (items.length === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center dark:bg-slate-950">
        <Sparkles size={28} className="text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          この条件で復習できる項目がありません。
        </p>
        <Link
          to={backTo}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          一覧に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            to={backTo}
            aria-label="閉じる"
            className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </Link>
          {phase === 'active' ? (
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{title}</span>
                <span>
                  {index + 1} / {queue.length}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                  style={{ width: `${((index + (revealed ? 0.5 : 0)) / queue.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</span>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
        {phase === 'setup' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30">
              <Sparkles size={26} />
            </span>
            <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              対象 {pool.length} 件からフラッシュカードで復習します。
            </p>

            <p className="mt-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              1回あたりの問題数
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSessionSize(size)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    sessionSize === size
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {size === pool.length ? `すべて (${size})` : `${size}問`}
                </button>
              ))}
            </div>

            <Button onClick={() => startBatch(sessionSize)} className="mt-8 w-full max-w-xs py-3">
              はじめる
            </Button>
          </div>
        )}

        {phase === 'active' && queue[index] && (
          <div className="flex flex-1 flex-col">
            <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-col items-center gap-2 text-center">
                {queue[index].frontSubtitle && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {queue[index].frontSubtitle}
                  </span>
                )}
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {queue[index].frontTitle}
                </p>
                {queue[index].speakFront && (
                  <SpeakButton text={queue[index].speakFront!} label="発音" />
                )}
              </div>

              {revealed && (
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  {queue[index].back.map((line, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <div>
                        {line.label && (
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            {line.label}
                          </p>
                        )}
                        <p className="text-sm text-slate-700 dark:text-slate-300">{line.text}</p>
                      </div>
                      {line.speak && <SpeakButton text={line.text} label="読み上げ" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5">
              {!revealed ? (
                <Button onClick={() => setRevealed(true)} className="w-full py-3">
                  <Eye size={16} />
                  答えを見る
                </Button>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {RATINGS.map((rating) => (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={() => handleRate(rating.value)}
                      className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition ${rating.className}`}
                    >
                      <span className="text-sm font-semibold">{rating.label}</span>
                      <span className="text-[10px] opacity-80">{rating.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'summary' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30">
              <Sparkles size={26} />
            </span>
            <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              お疲れさまでした！
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {queue.length}問に取り組みました。
            </p>

            <div className="mt-6 grid w-full max-w-xs grid-cols-3 gap-2">
              {RATINGS.map((rating) => (
                <div key={rating.value} className={`rounded-xl border px-2 py-3 ${rating.summaryClassName}`}>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {tally[rating.value]}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{rating.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
              {remainingPool.length > 0 && (
                <Button
                  onClick={() => {
                    setPool(remainingPool)
                    setSessionSize(Math.min(10, remainingPool.length))
                    setPhase('setup')
                  }}
                  className="w-full py-3"
                >
                  <RotateCcw size={16} />
                  続けて復習する (残り{remainingPool.length}件)
                </Button>
              )}
              <Link to={backTo}>
                <Button variant="secondary" className="w-full py-3">
                  一覧に戻る
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
