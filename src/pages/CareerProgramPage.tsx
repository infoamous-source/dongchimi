import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const items = [
  { id: 'ai-resume', title: 'AI로 이력서 쓰기', description: 'AI가 이력서 작성을 도와드려요', icon: '🤖', path: '/career/ai-resume' },
  { id: 'ai-cover-letter', title: 'AI로 자기소개서 쓰기', description: 'AI가 자기소개서 작성을 도와드려요', icon: '🤖', path: '/career/ai-cover-letter' },
  { id: 'templates', title: '양식 다운로드', description: '이력서, 자기소개서 양식 받기', icon: '📄', path: '/career/templates' },
  { id: 'job-board', title: '채용공고 정보', description: '채용 사이트와 공고 확인', icon: '🔍', path: '/career/job-board' },
]

export default function CareerProgramPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>프로그램 선택</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">💼 중장년층 프로그램</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        이력서, 자기소개서 작성과 취업 정보
      </p>

      <div className="flex flex-col gap-4">
        {items.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className="card flex items-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-3xl shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-dc-text">{item.title}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{item.description}</p>
            </div>
            <ChevronRight size={28} className="text-dc-text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
