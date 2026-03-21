import { supabase } from '@/lib/supabase'

export async function fetchCourseProgress(userId: string, courseId: string) {
  const { data } = await supabase
    .from('dc_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()
  return data
}

export async function upsertCourseProgress(
  userId: string,
  courseId: string,
  updates: {
    completed_lessons?: string[]
    current_lesson_id?: string
    completed_at?: string | null
  }
) {
  const { data } = await supabase
    .from('dc_course_progress')
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        last_accessed_at: new Date().toISOString(),
        ...updates,
      },
      { onConflict: 'user_id,course_id' }
    )
    .select()
    .single()
  return data
}

export async function fetchAllCourseProgress(userId: string) {
  const { data } = await supabase
    .from('dc_course_progress')
    .select('*')
    .eq('user_id', userId)
  return data ?? []
}

export async function markLessonComplete(
  userId: string,
  lessonId: string,
  courseId: string
) {
  const { data } = await supabase
    .from('dc_lesson_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single()
  return data
}

export async function fetchCompletedLessons(userId: string, courseId: string) {
  const { data } = await supabase
    .from('dc_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('completed', true)
  return (data ?? []).map(d => d.lesson_id)
}
