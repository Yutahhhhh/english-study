import { Loader2, TriangleAlert } from 'lucide-react'
import { Button } from './Button'

export function LoadingBlock({ label = '読み込み中...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-slate-500 dark:text-slate-400">
      <Loader2 size={20} className="animate-spin text-indigo-500" />
      {label}
    </div>
  )
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-4 flex flex-col items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
      <TriangleAlert size={20} />
      <p>エラーが発生しました: {message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-1">
          再試行
        </Button>
      )}
    </div>
  )
}
