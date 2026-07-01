export function LoadingBlock({ label = '読み込み中...' }: { label?: string }) {
  return <div className="p-6 text-center text-sm text-slate-500">{label}</div>
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-6 text-center text-sm text-red-600">
      <p>エラーが発生しました: {message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
        >
          再試行
        </button>
      )}
    </div>
  )
}
