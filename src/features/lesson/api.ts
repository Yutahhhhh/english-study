import { supabase } from '@/lib/supabase'
import { fetchDayProgressMap } from '@/features/progress/api'
import type { CourseDay } from '@/types/content'

export async function fetchCourseDay(
  userId: string,
  courseId: string,
  dayNumber: number,
): Promise<CourseDay | null> {
  const { data: day, error: dayError } = await supabase
    .from('course_days')
    .select('id, day_number, title, objective')
    .eq('course_id', courseId)
    .eq('day_number', dayNumber)
    .maybeSingle()
  if (dayError) throw dayError
  if (!day) return null

  const [
    { data: grammarLinks, error: grammarLinksError },
    { data: vocabLinks, error: vocabLinksError },
    { data: examples, error: examplesError },
    { data: exercises, error: exercisesError },
    dayProgress,
  ] = await Promise.all([
    supabase
      .from('course_day_grammar')
      .select('grammar_id, sort_order')
      .eq('course_day_id', day.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('course_day_vocabulary')
      .select('vocabulary_id, sort_order')
      .eq('course_day_id', day.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('example_sentences')
      .select('id, sentence_en, sentence_ja')
      .eq('course_day_id', day.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('exercises')
      .select('id, type, prompt_ja, answer_en, choices')
      .eq('course_day_id', day.id)
      .order('sort_order', { ascending: true }),
    fetchDayProgressMap(userId, courseId),
  ])
  if (grammarLinksError) throw grammarLinksError
  if (vocabLinksError) throw vocabLinksError
  if (examplesError) throw examplesError
  if (exercisesError) throw exercisesError

  const grammarIds = (grammarLinks ?? []).map((link) => link.grammar_id)
  const vocabularyIds = (vocabLinks ?? []).map((link) => link.vocabulary_id)

  const [{ data: grammarItems, error: grammarItemsError }, { data: vocabularyItems, error: vocabularyItemsError }] =
    await Promise.all([
      grammarIds.length
        ? supabase.from('grammar_items').select('id, title, summary, pattern, level').in('id', grammarIds)
        : Promise.resolve({ data: [], error: null }),
      vocabularyIds.length
        ? supabase
            .from('vocabulary_items')
            .select('id, word, meaning_ja, part_of_speech, example_en, example_ja, level')
            .in('id', vocabularyIds)
        : Promise.resolve({ data: [], error: null }),
    ])
  if (grammarItemsError) throw grammarItemsError
  if (vocabularyItemsError) throw vocabularyItemsError

  const grammarById = new Map((grammarItems ?? []).map((item) => [item.id, item]))
  const vocabularyById = new Map((vocabularyItems ?? []).map((item) => [item.id, item]))

  return {
    id: day.id,
    dayNumber: day.day_number,
    title: day.title,
    objective: day.objective,
    completed: dayProgress.get(day.day_number) ?? false,
    grammar: grammarIds
      .map((id) => grammarById.get(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        pattern: item.pattern,
        level: item.level,
      })),
    vocabulary: vocabularyIds
      .map((id) => vocabularyById.get(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => ({
        id: item.id,
        word: item.word,
        meaningJa: item.meaning_ja,
        partOfSpeech: item.part_of_speech,
        exampleEn: item.example_en,
        exampleJa: item.example_ja,
        level: item.level,
      })),
    examples: (examples ?? []).map((example) => ({
      id: example.id,
      en: example.sentence_en,
      ja: example.sentence_ja,
    })),
    exercises: (exercises ?? []).map((exercise) => ({
      id: exercise.id,
      type: exercise.type,
      promptJa: exercise.prompt_ja,
      answerEn: exercise.answer_en,
      choices: exercise.choices,
    })),
  }
}
