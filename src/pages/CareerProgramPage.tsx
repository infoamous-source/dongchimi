import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function CareerProgramPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>프로그램 선택</span>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <DongchimiIcon size={44} />
        <div>
          <h1 className="text-3xl font-extrabold text-dc-text">중장년층 프로그램</h1>
          <p className="text-lg text-dc-text-secondary">재취업 준비와 디지털 교육</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Link to="/career/digital" className="card hover:shadow-lg transition-shadow border-2 border-blue-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-4xl shrink-0">📚</div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-dc-text">디지털 교육</h2>
              <p className="text-lg text-dc-text-secondary mt-1">스마트폰, 인터넷, AI 등<br />디지털 기초를 배워요</p>
            </div>
            <ArrowRight size={28} className="text-blue-500 shrink-0" />
          </div>
        </Link>

        <Link to="/career/work" className="card hover:shadow-lg transition-shadow border-2 border-emerald-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-4xl shrink-0">💼</div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-dc-text">일터</h2>
              <p className="text-lg text-dc-text-secondary mt-1">이력서, 자기소개서 작성<br />취업 정보와 재취업 후기</p>
            </div>
            <ArrowRight size={28} className="text-emerald-500 shrink-0" />
          </div>
        </Link>

        <Link to="/career/ai" className="card hover:shadow-lg transition-shadow border-2 border-purple-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center text-4xl shrink-0">🤖</div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-dc-text">AI비서</h2>
              <p className="text-lg text-dc-text-secondary mt-1">무엇이든 물어보세요!<br />취업, 디지털, 생활 상담</p>
            </div>
            <ArrowRight size={28} className="text-purple-500 shrink-0" />
          </div>
        </Link>
      </div>
    </div>
  )
}
