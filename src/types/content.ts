import type {
  CourseProgressStatus,
  ExerciseType,
  ItemProgressStatus,
  Level,
} from '@/lib/database.types'

export type { Level, CourseProgressStatus, ItemProgressStatus, ExerciseType }

export type Scene =
  | 'Daily Conversation'
  | 'Travel'
  | 'Work'
  | 'Restaurant'
  | 'Shopping'
  | 'Self Introduction'

export type ExampleSentence = {
  id: string
  en: string
  ja: string
}

export type Exercise = {
  id: string
  type: ExerciseType
  promptJa: string
  answerEn: string
  choices: string[] | null
}

export type GrammarItem = {
  id: string
  title: string
  summary: string
  pattern: string
  level: Level
  status?: ItemProgressStatus
}

export type VocabularyItem = {
  id: string
  word: string
  meaningJa: string
  partOfSpeech: string
  exampleEn: string
  exampleJa: string
  level: Level
  status?: ItemProgressStatus
}

export type CourseDay = {
  id: string
  dayNumber: number
  title: string
  objective: string
  grammar: GrammarItem[]
  vocabulary: VocabularyItem[]
  examples: ExampleSentence[]
  exercises: Exercise[]
  completed: boolean
}

export type CourseSummary = {
  id: string
  title: string
  level: Level
  scene: Scene
  description: string
  durationDays: number
  progressStatus: CourseProgressStatus
  lastStudiedAt: string | null
}

export type CourseDetail = CourseSummary & {
  days: Pick<CourseDay, 'id' | 'dayNumber' | 'title' | 'completed'>[]
}
