import { supabase } from '@/lib/supabase'
import { fetchCourseProgressMap, fetchDayProgressMap } from '@/features/progress/api'
import type { CourseDetail, CourseSummary, Scene } from '@/types/content'

export async function fetchCourses(userId: string): Promise<CourseSummary[]> {
  const [{ data: courses, error }, progressMap] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, level, scene, description, duration_days')
      .order('sort_order', { ascending: true }),
    fetchCourseProgressMap(userId),
  ])
  if (error) throw error

  return courses.map((course) => {
    const progress = progressMap.get(course.id)
    return {
      id: course.id,
      title: course.title,
      level: course.level,
      scene: course.scene as Scene,
      description: course.description,
      durationDays: course.duration_days,
      progressStatus: progress?.status ?? 'not_started',
      lastStudiedAt: progress?.lastStudiedAt ?? null,
    }
  })
}

export async function fetchCourseDetail(
  userId: string,
  courseId: string,
): Promise<CourseDetail | null> {
  const [{ data: course, error: courseError }, { data: days, error: daysError }, dayProgress] =
    await Promise.all([
      supabase
        .from('courses')
        .select('id, title, level, scene, description, duration_days')
        .eq('id', courseId)
        .maybeSingle(),
      supabase
        .from('course_days')
        .select('id, day_number, title')
        .eq('course_id', courseId)
        .order('day_number', { ascending: true }),
      fetchDayProgressMap(userId, courseId),
    ])
  if (courseError) throw courseError
  if (daysError) throw daysError
  if (!course) return null

  const progressMap = await fetchCourseProgressMap(userId)
  const progress = progressMap.get(courseId)

  return {
    id: course.id,
    title: course.title,
    level: course.level,
    scene: course.scene as Scene,
    description: course.description,
    durationDays: course.duration_days,
    progressStatus: progress?.status ?? 'not_started',
    lastStudiedAt: progress?.lastStudiedAt ?? null,
    days: (days ?? []).map((day) => ({
      id: day.id,
      dayNumber: day.day_number,
      title: day.title,
      completed: dayProgress.get(day.day_number) ?? false,
    })),
  }
}
