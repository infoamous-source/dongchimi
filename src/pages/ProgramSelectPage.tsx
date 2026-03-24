import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMood } from '@/contexts/MoodContext'
import { supabase } from '@/lib/supabase'
import DongchimiMood from '@/components/brand/DongchimiVariants'
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
      <h1 className="text-3xl font-extrabold text-dc-text mb-10">동치미학교</h1>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        {/* 큰동치미 */}
        <button
          onClick={() => navigate('/senior')}
          className="bg-dc-green-bg hover:bg-[#e0f2e8] rounded-3xl py-8 px-6 text-center transition-colors shadow-sm"
        >
          <DongchimiMood moodId="excited" size={120} className="mx-auto" />
          <h2 className="text-3xl font-extrabold text-dc-text mt-4">큰동치미</h2>
          <p className="text-xl font-bold text-dc-green mt-1">(시니어반)</p>
        </button>

        {/* 작은동치미 */}
        <button
          onClick={() => navigate('/career')}
          className="bg-blue-50 hover:bg-blue-100 rounded-3xl py-6 px-6 text-center transition-colors shadow-sm"
        >
          <DongchimiIcon size={70} className="mx-auto" />
          <h2 className="text-3xl font-extrabold text-dc-text mt-3">작은동치미</h2>
          <p className="text-xl font-bold text-blue-600 mt-1">(중장년반)</p>
        </button>
      </div>
    </div>
  )
}
