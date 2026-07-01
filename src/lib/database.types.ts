// Hand-maintained to mirror supabase/migrations/20260701110208_init_schema.sql.
// Regenerate with `supabase gen types typescript --linked` once the project is linked,
// and keep this file in sync if the schema changes.

export type Level = 'Beginner' | 'Elementary' | 'Intermediate'

export type CourseProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type ItemProgressStatus = 'new' | 'learning' | 'learned'
export type ExerciseType = 'translate' | 'fill_blank' | 'choice'

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          level: Level
          scene: string
          description: string
          duration_days: number
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['courses']['Row']> & {
          id: string
          title: string
          level: Level
          scene: string
        }
        Update: Partial<Database['public']['Tables']['courses']['Row']>
        Relationships: []
      }
      course_days: {
        Row: {
          id: string
          course_id: string
          day_number: number
          title: string
          objective: string
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['course_days']['Row']> & {
          course_id: string
          day_number: number
          title: string
        }
        Update: Partial<Database['public']['Tables']['course_days']['Row']>
        Relationships: []
      }
      grammar_items: {
        Row: {
          id: string
          title: string
          summary: string
          pattern: string
          level: Level
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['grammar_items']['Row']> & {
          id: string
          title: string
          summary: string
          level: Level
        }
        Update: Partial<Database['public']['Tables']['grammar_items']['Row']>
        Relationships: []
      }
      vocabulary_items: {
        Row: {
          id: string
          word: string
          meaning_ja: string
          part_of_speech: string
          example_en: string
          example_ja: string
          level: Level
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['vocabulary_items']['Row']> & {
          id: string
          word: string
          meaning_ja: string
          level: Level
        }
        Update: Partial<Database['public']['Tables']['vocabulary_items']['Row']>
        Relationships: []
      }
      example_sentences: {
        Row: {
          id: string
          course_day_id: string
          sentence_en: string
          sentence_ja: string
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['example_sentences']['Row']> & {
          course_day_id: string
          sentence_en: string
          sentence_ja: string
        }
        Update: Partial<Database['public']['Tables']['example_sentences']['Row']>
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          course_day_id: string
          type: ExerciseType
          prompt_ja: string
          answer_en: string
          choices: string[] | null
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['exercises']['Row']> & {
          course_day_id: string
          type: ExerciseType
          prompt_ja: string
          answer_en: string
        }
        Update: Partial<Database['public']['Tables']['exercises']['Row']>
        Relationships: []
      }
      course_day_grammar: {
        Row: {
          course_day_id: string
          grammar_id: string
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['course_day_grammar']['Row']> & {
          course_day_id: string
          grammar_id: string
        }
        Update: Partial<Database['public']['Tables']['course_day_grammar']['Row']>
        Relationships: []
      }
      course_day_vocabulary: {
        Row: {
          course_day_id: string
          vocabulary_id: string
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['course_day_vocabulary']['Row']> & {
          course_day_id: string
          vocabulary_id: string
        }
        Update: Partial<Database['public']['Tables']['course_day_vocabulary']['Row']>
        Relationships: []
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: CourseProgressStatus
          started_at: string | null
          completed_at: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['course_progress']['Row']> & {
          user_id: string
          course_id: string
          status: CourseProgressStatus
        }
        Update: Partial<Database['public']['Tables']['course_progress']['Row']>
        Relationships: []
      }
      day_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          day_number: number
          completed: boolean
          completed_at: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['day_progress']['Row']> & {
          user_id: string
          course_id: string
          day_number: number
        }
        Update: Partial<Database['public']['Tables']['day_progress']['Row']>
        Relationships: []
      }
      vocabulary_progress: {
        Row: {
          id: string
          user_id: string
          vocabulary_id: string
          status: ItemProgressStatus
          last_reviewed_at: string | null
          updated_at: string
          correct_count: number
          incorrect_count: number
        }
        Insert: Partial<Database['public']['Tables']['vocabulary_progress']['Row']> & {
          user_id: string
          vocabulary_id: string
          status: ItemProgressStatus
        }
        Update: Partial<Database['public']['Tables']['vocabulary_progress']['Row']>
        Relationships: []
      }
      grammar_progress: {
        Row: {
          id: string
          user_id: string
          grammar_id: string
          status: ItemProgressStatus
          last_reviewed_at: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['grammar_progress']['Row']> & {
          user_id: string
          grammar_id: string
          status: ItemProgressStatus
        }
        Update: Partial<Database['public']['Tables']['grammar_progress']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      list_vocabulary_notebook: {
        Args: {
          p_level?: Level | null
          p_status?: ItemProgressStatus | null
          p_search?: string | null
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          word: string
          meaning_ja: string
          part_of_speech: string
          example_en: string
          example_ja: string
          level: Level
          status: ItemProgressStatus
          total_count: number
        }[]
      }
      list_vocabulary_quiz_candidates: {
        Args: {
          p_level?: Level | null
          p_status?: ItemProgressStatus | null
          p_search?: string | null
          p_limit?: number
        }
        Returns: {
          id: string
          word: string
          meaning_ja: string
          part_of_speech: string
          example_en: string
          example_ja: string
          level: Level
          status: ItemProgressStatus
          correct_count: number
          incorrect_count: number
          failure_rate: number
        }[]
      }
      record_vocabulary_review: {
        Args: {
          p_vocabulary_id: string
          p_status: ItemProgressStatus
          p_was_correct: boolean
        }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
