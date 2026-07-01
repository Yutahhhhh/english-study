import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useAsyncData } from '@/lib/useAsyncData'
import { LoadingBlock, ErrorBlock } from '@/components/AsyncState'
import { setVocabularyStatus } from '@/features/progress/api'
import { FlashcardQuiz } from '@/features/quiz/FlashcardQuiz'
import type { FlashcardData } from '@/features/quiz/types'
import { VOCABULARY_QUIZ_CANDIDATE_LIMIT, fetchVocabularyQuizCandidates } from './api'
import type { ItemProgressStatus, Level } from '@/types/content'

export function VocabularyQuizPage() {
  const { session } = useAuth()
  const userId = session!.user.id
  const [searchParams] = useSearchParams()
  const level = searchParams.get('level') as Level | null
  const status = searchParams.get('status') as ItemProgressStatus | null
  const search = searchParams.get('search') ?? ''

  const { data, error, isLoading, reload } = useAsyncData(
    () =>
      fetchVocabularyQuizCandidates({
        limit: VOCABULARY_QUIZ_CANDIDATE_LIMIT,
        level: level ?? 'all',
        status: status ?? 'all',
        search,
      }),
    [userId, level, status, search],
  )

  const cards = useMemo<FlashcardData[]>(() => {
    if (!data) return []
    return data.map((item) => ({
      id: item.id,
      frontTitle: item.word,
      frontSubtitle: item.partOfSpeech || undefined,
      speakFront: item.word,
      status: item.status ?? 'new',
      back: [
        { label: '意味', text: item.meaningJa },
        ...(item.exampleEn ? [{ label: '例文', text: item.exampleEn, speak: true }] : []),
        ...(item.exampleJa ? [{ text: item.exampleJa }] : []),
      ],
    }))
  }, [data])

  if (isLoading) return <LoadingBlock />
  if (error) return <ErrorBlock message={error} onRetry={reload} />

  return (
    <FlashcardQuiz
      title="単語クイズ"
      items={cards}
      backTo="/vocabulary"
      onRate={(id, next, wasCorrect) =>
        setVocabularyStatus(userId, id, next, { recordAttempt: true, wasCorrect })
      }
    />
  )
}
