import { supabase } from '@/lib/supabase'
import type { CourseProgressStatus, ItemProgressStatus } from '@/types/content'

export async function fetchCourseProgressMap(userId: string) {
  const { data, error } = await supabase
    .from('course_progress')
    .select('course_id, status, updated_at')
    .eq('user_id', userId)
  if (error) throw error

  const map = new Map<string, { status: CourseProgressStatus; lastStudiedAt: string }>()
  for (const row of data) {
    map.set(row.course_id, { status: row.status, lastStudiedAt: row.updated_at })
  }
  return map
}

export async function fetchDayProgressMap(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('day_progress')
    .select('day_number, completed')
    .eq('user_id', userId)
    .eq('course_id', courseId)
  if (error) throw error

  const map = new Map<number, boolean>()
  for (const row of data) {
    map.set(row.day_number, row.completed)
  }
  return map
}

export async function markDayCompleted(userId: string, courseId: string, dayNumber: number) {
  const now = new Date().toISOString()
  const { error } = await supabase.from('day_progress').upsert(
    {
      user_id: userId,
      course_id: courseId,
      day_number: dayNumber,
      completed: true,
      completed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,course_id,day_number' },
  )
  if (error) throw error
}

export async function ensureCourseInProgress(userId: string, courseId: string) {
  const now = new Date().toISOString()
  const { error } = await supabase.from('course_progress').upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: 'in_progress',
      started_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,course_id', ignoreDuplicates: true },
  )
  if (error) throw error
}

export async function markCourseCompleted(userId: string, courseId: string) {
  const now = new Date().toISOString()
  const { error } = await supabase.from('course_progress').upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: 'completed',
      completed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,course_id' },
  )
  if (error) throw error
}

export async function fetchVocabularyProgressMap(userId: string) {
  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select('vocabulary_id, status')
    .eq('user_id', userId)
  if (error) throw error

  const map = new Map<string, ItemProgressStatus>()
  for (const row of data) map.set(row.vocabulary_id, row.status)
  return map
}

export async function setVocabularyStatus(
  userId: string,
  vocabularyId: string,
  status: ItemProgressStatus,
) {
  const now = new Date().toISOString()
  const { error } = await supabase.from('vocabulary_progress').upsert(
    {
      user_id: userId,
      vocabulary_id: vocabularyId,
      status,
      last_reviewed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,vocabulary_id' },
  )
  if (error) throw error
}

export async function fetchGrammarProgressMap(userId: string) {
  const { data, error } = await supabase
    .from('grammar_progress')
    .select('grammar_id, status')
    .eq('user_id', userId)
  if (error) throw error

  const map = new Map<string, ItemProgressStatus>()
  for (const row of data) map.set(row.grammar_id, row.status)
  return map
}

export async function setGrammarStatus(
  userId: string,
  grammarId: string,
  status: ItemProgressStatus,
) {
  const now = new Date().toISOString()
  const { error } = await supabase.from('grammar_progress').upsert(
    {
      user_id: userId,
      grammar_id: grammarId,
      status,
      last_reviewed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,grammar_id' },
  )
  if (error) throw error
}
