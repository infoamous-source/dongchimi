import { useAuth } from '@/contexts/AuthContext'
import { useMood } from '@/contexts/MoodContext'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DongchimiMood from '@/components/brand/DongchimiVariants'
import DongchimiCharacter from '@/components/brand/DongchimiCharacter'

const sections = [
  { to: '/about', emoji: '🏫', title: '동치미학교란?', description: '동치미학교를 소개합니다', border: 'border-amber-200' },
  { to: '/learn', emoji: '📚', title: '배움터', description: '스마트폰, 인터넷, AI 등\n디지털 기초를 배워요', border: 'border-blue-200' },
  { to: '/work', emoji: '💼', title: '일터', description: '이력서, 자기소개서 작성과\n취업 정보를 알아봐요', border: 'border-emerald-200' },
  { to: '/ai', emoji: '🤖', title: 'AI비서', description: '무엇이든 물어보세요!\n쉽고 친절하게 알려드려요', border: 'border-purple-200' },
]

export default function HomePage() {
  const { user } = useAuth()
  const { moodId } = useMood()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* 환영 + 오늘의 기분 캐릭터 */}
      <section className="mb-10 text-center">
        {moodId ? <DongchimiMood moodId={moodId} size={130} className="mx-auto" /> : <DongchimiCharacter size="half" />}
        <h1 className="text-3xl font-extrabold text-dc-text mb-3 leading-tight mt-4">
          {user ? `${user.name}님, 반갑습니다!` : '동치미학교'}
        </h1>
        <p className="text-xl text-dc-text-secondary">
          시니어를 위한 쉽고 즐거운 배움터
        </p>
      </section>

      {/* 오늘의 학습 */}
      {user && (
        <section className="mb-10">
          <div className="card-highlight">
            <h3 className="text-xl font-extrabold text-dc-green mb-3">오늘의 학습</h3>
            <p className="text-lg text-dc-text-secondary mb-5">스마트폰 기초 &gt; 카카오톡 보내기</p>
            <Link to="/learn/smartphone" className="btn-primary w-full text-xl py-5">
              이어서 배우기 <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      )}

      {/* 4개 메인 섹션 */}
      <section className="flex flex-col gap-5">
        {sections.map((sec) => (
          <Link key={sec.to} to={sec.to} className={`card hover:shadow-lg transition-shadow border-2 ${sec.border}`}>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-4xl shrink-0">
                {sec.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-dc-text">{sec.title}</h2>
                <p className="text-lg text-dc-text-secondary mt-1 whitespace-pre-line">{sec.description}</p>
              </div>
              <ArrowRight size={28} className="text-dc-text-muted shrink-0" />
            </div>
          </Link>
        ))}
      </section>

      {!user && (
        <section className="mt-10 flex flex-col gap-3">
          <Link to="/register" className="btn-primary w-full text-xl py-5">회원가입</Link>
          <Link to="/login" className="btn-secondary w-full text-xl">로그인</Link>
        </section>
      )}
    </div>
  )
}
