import { useParams, Link } from 'react-router-dom'
import { getCourseById } from '@/data/courses'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { ArrowLeft, Check, ChevronRight, Clock } from 'lucide-react'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = getCourseById(courseId || '')
  const { isLessonCompleted } = useCourseProgress(courseId || '')

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-dc-text-secondary">강좌를 찾을 수 없어요</p>
        <Link to="/learn" className="btn-primary mt-6 inline-flex">뒤로가기</Link>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedCount = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter(l => isLessonCompleted(l.id)).length, 0
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <Link to="/learn" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>뒤로가기</span>
      </Link>

      <div className="card-highlight mb-8">
        <h1 className="text-3xl font-extrabold text-dc-text mb-3">{course.title}</h1>
        <p className="text-xl text-dc-text-secondary mb-5">{course.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-dc-green rounded-full transition-all duration-500"
              style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xl font-extrabold text-dc-green whitespace-nowrap">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {course.modules.map((module) => (
          <div key={module.id}>
            <h2 className="text-2xl font-extrabold text-dc-text mb-2">{module.title}</h2>
            <p className="text-lg text-dc-text-secondary mb-4">{module.description}</p>

            <div className="flex flex-col gap-3">
              {module.lessons.map((lesson) => {
                const completed = isLessonCompleted(lesson.id)
                return (
                  <Link
                    key={lesson.id}
                    to={`/learn/${course.id}/lessons/${lesson.id}`}
                    className={`card flex items-center gap-4 hover:shadow-lg transition-shadow ${
                      completed ? 'border-dc-green-pale bg-dc-green-bg border-2' : ''
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                      completed ? 'bg-dc-green text-white' : 'bg-gray-100 text-dc-text-muted'
                    }`}>
                      {completed ? <Check size={28} /> : <span className="text-xl font-extrabold">{lesson.order}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-dc-text">{lesson.title}</h3>
                      {lesson.duration && (
                        <div className="flex items-center gap-2 text-dc-text-muted text-lg mt-1">
                          <Clock size={20} />
                          <span>{lesson.duration}분</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight size={28} className="text-dc-text-muted shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
