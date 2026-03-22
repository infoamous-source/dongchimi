import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMood } from '@/contexts/MoodContext'
import { supabase } from '@/lib/supabase'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function ProgramSelectPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { hasMoodToday } = useMood()

  // 로그인된 학생은 기관의 프로그램 타입에 따라 자동 분기
  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') { navigate('/ceo', { replace: true }); return }
    if (user.role === 'instructor') { navigate('/admin', { replace: true }); return }

    // 학생: orgCode로 프로그램 타입 확인
    if (user.orgCode) {
      const checkProgram = async () => {
        try {
          const { data } = await supabase
            .from('dc_organizations')
            .select('program_type')
            .eq('code', user.orgCode)
            .single()
          if (data?.program_type === 'career') {
            navigate('/career', { replace: true })
          } else {
            navigate(hasMoodToday ? '/senior' : '/senior/mood', { replace: true })
          }
        } catch {
          navigate(hasMoodToday ? '/senior' : '/senior/mood', { replace: true })
        }
      }
      checkProgram()
    }
    // orgCode 없으면 선택 화면 그대로 표시
  }, [user, navigate, hasMoodToday])

  // 로그인 안 했거나 orgCode 없는 경우: 선택 화면
  return (
    <div className="min-h-screen bg-dc-cream flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <DongchimiIcon size={56} />
      <h1 className="text-3xl font-extrabold text-dc-text mt-4 mb-2">동치미학교</h1>
      <p className="text-xl text-dc-text-secondary mb-10">프로그램을 선택해주세요</p>

      <div className="flex flex-col gap-5 w-full max-w-md">
        <button
          onClick={() => navigate('/senior')}
          className="card hover:shadow-lg transition-shadow border-2 border-dc-green-pale text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-dc-green-bg flex items-center justify-center text-5xl shrink-0">🫙</div>
            <div>
              <h2 className="text-2xl font-extrabold text-dc-text">큰동치미</h2>
              <p className="text-lg text-dc-text-secondary mt-1">스마트폰, 키오스크, AI 등<br />디지털 기초 교육</p>
              <p className="text-base text-dc-green font-bold mt-2">양로원 · 복지관 · 시니어센터</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/career')}
          className="card hover:shadow-lg transition-shadow border-2 border-blue-200 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-4xl shrink-0">🫙</div>
            <div>
              <h2 className="text-2xl font-extrabold text-dc-text">작은동치미</h2>
              <p className="text-lg text-dc-text-secondary mt-1">이력서, 자기소개서 작성<br />취업 정보, AI 활용</p>
              <p className="text-base text-blue-600 font-bold mt-2">재취업센터 · 평생학습원</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
