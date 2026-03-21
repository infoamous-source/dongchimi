export interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  modules: Module[]
  order: number
}

export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  content: string
  type: 'text' | 'video' | 'practice' | 'quiz'
  duration?: number // minutes
  order: number
}

export interface CourseProgress {
  userId: string
  courseId: string
  completedLessons: string[]
  currentLessonId?: string
  startedAt: string
  lastAccessedAt: string
  completedAt?: string
}

export interface LessonProgress {
  userId: string
  lessonId: string
  completed: boolean
  score?: number
  completedAt?: string
}
