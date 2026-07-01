import { supabase } from '@/lib/supabase'
import { fetchVocabularyProgressMap } from '@/features/progress/api'
import type { VocabularyItem } from '@/types/content'

export async function fetchVocabularyNotebook(userId: string): Promise<VocabularyItem[]> {
  const [{ data: items, error }, progressMap] = await Promise.all([
    supabase
      .from('vocabulary_items')
      .select('id, word, meaning_ja, part_of_speech, example_en, example_ja, level')
      .order('word', { ascending: true }),
    fetchVocabularyProgressMap(userId),
  ])
  if (error) throw error

  return items.map((item) => ({
    id: item.id,
    word: item.word,
    meaningJa: item.meaning_ja,
    partOfSpeech: item.part_of_speech,
    exampleEn: item.example_en,
    exampleJa: item.example_ja,
    level: item.level,
    status: progressMap.get(item.id) ?? 'new',
  }))
}
