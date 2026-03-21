import { Link } from 'react-router-dom'
import { Smartphone, Globe, Brain, ShieldCheck, Camera, MessageCircle, ArrowRight } from 'lucide-react'

const allCourses = [
  { id: 'smartphone', icon: Smartphone, title: '스마트폰 기초', description: '전화, 문자, 카카오톡', lessons: 12, iconColor: '#3b82f6', bgColor: '#eff6ff' },
  { id: 'internet', icon: Globe, title: '인터넷 활용', description: '검색, 쇼핑, 은행', lessons: 10, iconColor: '#22c55e', bgColor: '#f0fdf4' },
  { id: 'ai-basics', icon: Brain, title: 'AI와 친해지기', description: 'AI 비서 활용법', lessons: 8, iconColor: '#a855f7', bgColor: '#faf5ff' },
  { id: 'safety', icon: ShieldCheck, title: '디지털 안전', description: '사기 예방, 보안', lessons: 6, iconColor: '#ef4444', bgColor: '#fef2f2' },
  { id: 'camera', icon: Camera, title: '사진과 영상', description: '사진 찍기, 공유', lessons: 8, iconColor: '#f59e0b', bgColor: '#fffbeb' },
  { id: 'sns', icon: MessageCircle, title: 'SNS 배우기', description: '유튜브, 밴드', lessons: 10, iconColor: '#ec4899', bgColor: '#fdf2f8' },
]

export default function CoursesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-dc-text mb-8">강좌</h2>

      <div className="flex flex-col gap-4">
        {allCourses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="card flex items-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-[4.5rem] h-[4.5rem] rounded-3xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: course.bgColor }}
            >
              <course.icon size={36} style={{ color: course.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-extrabold text-dc-text">{course.title}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{course.description}</p>
              <p className="text-lg text-dc-green font-bold mt-1">{course.lessons}개 수업</p>
            </div>
            <ArrowRight size={28} className="text-dc-text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
