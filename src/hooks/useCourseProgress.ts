import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchCompletedLessons,
  markLessonComplete,
  upsertCourseProgress,
} from '@/services/progressService'
import { logActivity } from '@/services/activityService'

export function useCourseProgress(courseId: string) {
  const { user } = useAuth()
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCompletedLessons([])
      setLoading(false)
      return
    }

    fetchCompletedLessons(user.id, courseId)
      .then(setCompletedLessons)
      .catch(() => setCompletedLessons([]))
      .finally(() => setLoading(false))
  }, [user, courseId])

  const completeLesson = useCallback(
    async (lessonId: string) => {
      if (!user) return
      await markLessonComplete(user.id, lessonId, courseId)
      logActivity(user.id, 'lesson_complete', { lessonId, courseId })
      const updated = [...completedLessons, lessonId]
      setCompletedLessons(updated)
      await upsertCourseProgress(user.id, courseId, {
        completed_lessons: updated,
        current_lesson_id: lessonId,
      })
    },
    [user, courseId, completedLessons]
  )

  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons]
  )

  return { completedLessons, loading, completeLesson, isLessonCompleted }
}
