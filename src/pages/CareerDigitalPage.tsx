import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Smartphone, Globe, Brain, ShieldCheck, Camera, MessageCircle } from 'lucide-react'

const courses = [
  { id: 'smartphone', icon: Smartphone, title: '스마트폰 기초', description: '전화, 문자, 카카오톡', lessons: 12, iconColor: '#3b82f6', bgColor: '#eff6ff' },
  { id: 'internet', icon: Globe, title: '인터넷 활용', description: '검색, 쇼핑, 은행', lessons: 10, iconColor: '#22c55e', bgColor: '#f0fdf4' },
  { id: 'ai-basics', icon: Brain, title: 'AI와 친해지기', description: 'AI 비서 활용법', lessons: 8, iconColor: '#a855f7', bgColor: '#faf5ff' },
  { id: 'safety', icon: ShieldCheck, title: '디지털 안전', description: '사기 예방, 보안', lessons: 6, iconColor: '#ef4444', bgColor: '#fef2f2' },
  { id: 'camera', icon: Camera, title: '사진과 영상', description: '사진 찍기, 공유', lessons: 8, iconColor: '#f59e0b', bgColor: '#fffbeb' },
  { id: 'sns', icon: MessageCircle, title: 'SNS 배우기', description: '유튜브, 밴드', lessons: 10, iconColor: '#ec4899', bgColor: '#fdf2f8' },
]

export default function CareerDigitalPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>중장년층 프로그램</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">📚 디지털 교육</h1>
      <p className="text-xl text-dc-text-secondary mb-6">스마트폰, 인터넷, AI 등 디지털 기초를 배워요</p>

      {/* 키오스크 연습 */}
      <Link to="/career/digital/kiosk" className="card-highlight flex items-center gap-5 mb-4 hover:shadow-lg transition-shadow border-2 border-amber-200">
        <div className="text-4xl">📱</div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-amber-800">키오스크 연습</h2>
          <p className="text-lg text-dc-text-secondary mt-1">카페, 패스트푸드, 은행 등 9종!</p>
        </div>
        <ArrowRight size={28} className="text-amber-600 shrink-0" />
      </Link>

      {/* 강좌 목록 */}
      <h2 className="text-2xl font-extrabold text-dc-text mt-6 mb-4">강좌 목록</h2>
      <div className="flex flex-col gap-4">
        {courses.map(course => (
          <Link key={course.id} to={`/senior/learn/${course.id}`} className="card flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className="w-[4.5rem] h-[4.5rem] rounded-3xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.bgColor }}>
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
