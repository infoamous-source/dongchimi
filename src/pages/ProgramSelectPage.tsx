import { useNavigate } from 'react-router-dom'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function ProgramSelectPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dc-cream flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <DongchimiIcon size={56} />
      <h1 className="text-3xl font-extrabold text-dc-text mt-4 mb-2">동치미학교</h1>
      <p className="text-xl text-dc-text-secondary mb-10">프로그램을 선택해주세요</p>

      <div className="flex flex-col gap-5 w-full max-w-md">
        {/* 1. 초시니어 프로그램 */}
        <button
          onClick={() => navigate('/senior')}
          className="card hover:shadow-lg transition-shadow border-2 border-dc-green-pale text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-dc-green-bg flex items-center justify-center text-4xl shrink-0">
              🫙
            </div>
            <div>
              <div className="text-sm font-bold text-dc-green bg-dc-green-bg px-3 py-1 rounded-full inline-block mb-2">1</div>
              <h2 className="text-2xl font-extrabold text-dc-text">초시니어 프로그램</h2>
              <p className="text-lg text-dc-text-secondary mt-1">스마트폰, 키오스크, AI 등<br/>디지털 기초 교육</p>
            </div>
          </div>
        </button>

        {/* 2. 중장년층 프로그램 */}
        <button
          onClick={() => navigate('/career')}
          className="card hover:shadow-lg transition-shadow border-2 border-blue-200 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-4xl shrink-0">
              💼
            </div>
            <div>
              <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">2</div>
              <h2 className="text-2xl font-extrabold text-dc-text">중장년층 프로그램</h2>
              <p className="text-lg text-dc-text-secondary mt-1">이력서, 자기소개서 작성<br/>취업 정보, AI 활용</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
