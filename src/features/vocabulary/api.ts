import { supabase } from '@/lib/supabase'
import type { ItemProgressStatus, Level, VocabularyItem } from '@/types/content'

export const VOCABULARY_PAGE_SIZE = 50
export const VOCABULARY_QUIZ_CANDIDATE_LIMIT = 200

type VocabularyNotebookParams = {
  page: number
  pageSize?: number
  level?: Level | 'all'
  status?: ItemProgressStatus | 'all'
  search?: string
}

export type VocabularyNotebookPage = {
  items: VocabularyItem[]
  total: number
  page: number
  pageSize: number
}

export async function fetchVocabularyNotebook({
  page,
  pageSize = VOCABULARY_PAGE_SIZE,
  level = 'all',
  status = 'all',
  search = '',
}: VocabularyNotebookParams): Promise<VocabularyNotebookPage> {
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, Math.min(pageSize, 100))
  const offset = (safePage - 1) * safePageSize

  const { data: items, error } = await supabase.rpc('list_vocabulary_notebook', {
    p_level: level === 'all' ? null : level,
    p_status: status === 'all' ? null : status,
    p_search: search.trim() || null,
    p_limit: safePageSize,
    p_offset: offset,
  })
  if (error) throw error

  return {
    items: items.map((item) => ({
      id: item.id,
      word: item.word,
      meaningJa: item.meaning_ja,
      partOfSpeech: item.part_of_speech,
      exampleEn: item.example_en,
      exampleJa: item.example_ja,
      level: item.level,
      status: item.status,
    })),
    total: items[0]?.total_count ?? 0,
    page: safePage,
    pageSize: safePageSize,
  }
}

type VocabularyQuizCandidateParams = {
  limit?: number
  level?: Level | 'all'
  status?: ItemProgressStatus | 'all'
  search?: string
}

export async function fetchVocabularyQuizCandidates({
  limit = VOCABULARY_QUIZ_CANDIDATE_LIMIT,
  level = 'all',
  status = 'all',
  search = '',
}: VocabularyQuizCandidateParams): Promise<VocabularyItem[]> {
  const { data: items, error } = await supabase.rpc('list_vocabulary_quiz_candidates', {
    p_level: level === 'all' ? null : level,
    p_status: status === 'all' ? null : status,
    p_search: search.trim() || null,
    p_limit: Math.max(1, Math.min(limit, VOCABULARY_QUIZ_CANDIDATE_LIMIT)),
  })
  if (error) throw error

  return items.map((item) => ({
    id: item.id,
    word: item.word,
    meaningJa: item.meaning_ja,
    partOfSpeech: item.part_of_speech,
    exampleEn: item.example_en,
    exampleJa: item.example_ja,
    level: item.level,
    status: item.status,
  }))
}
