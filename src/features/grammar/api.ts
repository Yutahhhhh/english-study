import { supabase } from '@/lib/supabase'
import { fetchGrammarProgressMap } from '@/features/progress/api'
import type { GrammarItem } from '@/types/content'

export async function fetchGrammarNotebook(userId: string): Promise<GrammarItem[]> {
  const [{ data: items, error }, progressMap] = await Promise.all([
    supabase
      .from('grammar_items')
      .select('id, title, summary, pattern, level')
      .order('title', { ascending: true }),
    fetchGrammarProgressMap(userId),
  ])
  if (error) throw error

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    pattern: item.pattern,
    level: item.level,
    status: progressMap.get(item.id) ?? 'new',
  }))
}
