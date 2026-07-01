import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { setGrammarStatus } from '@/features/progress/api'
import { FlashcardQuiz } from '@/features/quiz/FlashcardQuiz'
import type { FlashcardData } from '@/features/quiz/types'
import { fetchGrammarNotebook } from './api'
import type { ItemProgressStatus, Level } from '@/types/content'

export function GrammarQuizPage() {
  const { session } = useAuth()
  const userId = session!.user.id
  const [searchParams] = useSearchParams()
  const level = searchParams.get('level') as Level | null
  const status = searchParams.get('status') as ItemProgressStatus | null

  const { data: items, error, isLoading, reload } = useAsyncData(
    () => fetchGrammarNotebook(userId),
    [userId],
  )

  const cards = useMemo<FlashcardData[]>(() => {
    if (!items) return []
    return items
      .filter((item) => (!level || item.level === level) && (!status || item.status === status))
      .map((item) => ({
        id: item.id,
        frontTitle: item.title,
        speakFront: item.pattern || undefined,
        status: item.status ?? 'new',
        back: [
          { label: '説明', text: item.summary },
          ...(item.pattern ? [{ label: '例文パターン', text: item.pattern, speak: true }] : []),
        ],
      }))
  }, [items, level, status])

  if (isLoading) return <LoadingBlock />
  if (error) return <ErrorBlock message={error} onRetry={reload} />

  return (
    <FlashcardQuiz
      title="文法クイズ"
      items={cards}
      backTo="/grammar"
      onRate={(id, next) => setGrammarStatus(userId, id, next)}
    />
  )
}
