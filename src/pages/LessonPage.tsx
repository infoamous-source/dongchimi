import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLessonById, getNextLesson } from '@/data/courses'
import { getLessonContent } from '@/data/lessonContents'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { ArrowLeft, ArrowRight, Check, Lightbulb, MessageCircle } from 'lucide-react'

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()

  const found = getLessonById(lessonId || '')
  const content = getLessonContent(lessonId || '')
  const { isLessonCompleted, completeLesson } = useCourseProgress(courseId || '')

  if (!found) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-dc-text-secondary">수업을 찾을 수 없어요</p>
        <Link to="/learn" className="btn-primary mt-6 inline-flex">뒤로가기</Link>
      </div>
    )
  }

  const { lesson, course } = found
  const completed = isLessonCompleted(lesson.id)
  const nextLesson = getNextLesson(lesson.id)

  const handleComplete = async () => {
    await completeLesson(lesson.id)
    if (nextLesson) {
      navigate(`/learn/${course.id}/lessons/${nextLesson.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <Link
        to={`/learn/${course.id}`}
        className="inline-flex items-center gap-2 text-dc-text-secondary mb-5 text-lg font-bold"
      >
        <ArrowLeft size={24} />
        <span>{course.title}</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-8 leading-tight">{lesson.title}</h1>

      {content ? (
        <div className="flex flex-col gap-6 mb-8">
          {content.sections.map((section, i) => (
            <div key={i} className="card">
              {section.heading && (
                <h2 className="text-2xl font-extrabold text-dc-text mb-4">
                  {section.heading}
                </h2>
              )}
              <p className="text-xl text-dc-text-secondary leading-relaxed">
                {section.text}
              </p>
              {section.tip && (
                <div className="mt-5 flex items-start gap-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
                  <Lightbulb size={28} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-lg text-amber-900 font-bold leading-relaxed">{section.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card mb-8">
          <p className="text-xl text-dc-text-secondary">
            이 수업의 내용이 곧 추가됩니다. 조금만 기다려주세요!
          </p>
        </div>
      )}

      <Link
        to={`/ai?lesson=${lesson.id}&course=${course.id}`}
        className="card flex items-center gap-5 mb-6 hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50"
      >
        <div className="w-16 h-16 rounded-full bg-dc-info/20 flex items-center justify-center shrink-0">
          <MessageCircle size={32} className="text-dc-info" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-dc-info">잘 모르겠으면 물어보세요!</h3>
          <p className="text-lg text-dc-text-secondary">AI 도우미가 쉽게 알려드려요</p>
        </div>
      </Link>

      <div className="flex flex-col gap-3">
        {!completed ? (
          <button onClick={handleComplete} className="btn-primary w-full text-xl">
            <Check size={26} />
            {nextLesson ? '완료하고 다음으로' : '수업 완료하기'}
          </button>
        ) : nextLesson ? (
          <Link
            to={`/learn/${course.id}/lessons/${nextLesson.id}`}
            className="btn-primary w-full text-xl"
          >
            다음 수업으로
            <ArrowRight size={26} />
          </Link>
        ) : (
          <Link to={`/learn/${course.id}`} className="btn-primary w-full text-xl">
            <Check size={26} />
            강좌로 돌아가기
          </Link>
        )}
      </div>
    </div>
  )
}
