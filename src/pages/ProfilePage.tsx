import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { User, LogOut, Settings, HelpCircle, BookOpen, ChevronRight, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { fetchLoginDays, fetchActivityCount } from '@/services/activityService'
import { fetchCompletedLessons } from '@/services/progressService'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [orgInfo, setOrgInfo] = useState<{ name: string; program_type: string; subscription_end: string | null } | null>(null)
  const [stats, setStats] = useState({ lessons: 0, practices: 0, days: 0 })

  useEffect(() => {
    if (!user) return

    // 기관 정보 가져오기
    if (user.orgCode) {
      supabase
        .from('dc_organizations')
        .select('name, program_type, subscription_end')
        .eq('code', user.orgCode)
        .single()
        .then(({ data }) => { if (data) setOrgInfo(data) })
    }

    // 학습 통계
    const loadStats = async () => {
      const [days, kioskCount] = await Promise.all([
        fetchLoginDays(user.id),
        fetchActivityCount(user.id, 'kiosk_complete'),
      ])
      // 전체 강좌의 완료된 수업 수 합산
      const courses = ['smartphone', 'internet', 'ai-basics', 'safety', 'camera', 'sns']
      let totalLessons = 0
      for (const c of courses) {
        const completed = await fetchCompletedLessons(user.id, c)
        totalLessons += completed.length
      }
      setStats({ lessons: totalLessons, practices: kioskCount, days })
    }
    loadStats()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="card text-center py-12">
          <User size={56} className="mx-auto text-dc-text-muted mb-5" />
          <h2 className="text-2xl font-extrabold text-dc-text mb-3">로그인이 필요해요</h2>
          <p className="text-xl text-dc-text-secondary mb-8">내 학습 기록을 확인하려면 로그인해주세요</p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <Link to="/login" className="btn-primary text-xl">로그인</Link>
            <Link to="/register" className="btn-secondary text-xl">회원가입</Link>
          </div>
        </div>
      </div>
    )
  }

  const daysLeft = orgInfo?.subscription_end
    ? Math.ceil((new Date(orgInfo.subscription_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* 프로필 카드 */}
      <div className="card mb-6">
        <div className="flex items-center gap-5">
          <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-dc-green-pale flex items-center justify-center">
            <span className="text-3xl font-extrabold text-dc-green">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-dc-text">{user.name}</h2>
            <p className="text-lg text-dc-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* 기관/구독 정보 */}
        {orgInfo && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
                orgInfo.program_type === 'senior' ? 'bg-dc-green-bg text-dc-green' : 'bg-blue-50 text-blue-600'
              }`}>
                {orgInfo.program_type === 'senior' ? '🫙 큰동치미' : '🫙 작은동치미'}
              </span>
              <span className="text-lg font-bold text-dc-text">{orgInfo.name}</span>
            </div>
            {daysLeft !== null && (
              <p className={`text-lg mt-2 font-bold ${daysLeft <= 0 ? 'text-dc-error' : daysLeft <= 30 ? 'text-amber-600' : 'text-dc-text-muted'}`}>
                {daysLeft <= 0 ? '구독이 만료되었습니다' : `구독 ${daysLeft}일 남음`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 학습 통계 */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-dc-green-bg flex items-center justify-center text-2xl shrink-0">📖</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">완료한 수업</span>
          <span className="text-2xl font-extrabold text-dc-green">{stats.lessons}개</span>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">✏️</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">연습 횟수</span>
          <span className="text-2xl font-extrabold text-dc-orange">{stats.practices}회</span>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shrink-0">📅</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">학습 일수</span>
          <span className="text-2xl font-extrabold text-dc-info">{stats.days}일</span>
        </div>
      </div>

      {/* CEO 대시보드 버튼 */}
      {user.role === 'admin' && (
        <Link to="/ceo" className="card flex items-center gap-4 mb-3 hover:shadow-lg transition-shadow bg-amber-600 text-white border-0">
          <LayoutDashboard size={28} />
          <span className="text-xl font-extrabold flex-1">CEO 대시보드</span>
          <ChevronRight size={24} />
        </Link>
      )}

      {/* 강사 대시보드 버튼 */}
      {user.role === 'instructor' && (
        <Link to="/admin" className="card flex items-center gap-4 mb-3 hover:shadow-lg transition-shadow bg-dc-green text-white border-0">
          <LayoutDashboard size={28} />
          <span className="text-xl font-extrabold flex-1">강사 대시보드</span>
          <ChevronRight size={24} />
        </Link>
      )}

      {/* 메뉴 */}
      <div className="flex flex-col gap-3 mt-3">
        <Link to="/senior/learn" className="card flex items-center gap-4 hover:shadow-lg transition-shadow">
          <BookOpen size={28} className="text-dc-green" />
          <span className="text-xl font-bold flex-1">내 학습 내역</span>
          <ChevronRight size={24} className="text-dc-text-muted" />
        </Link>
        <button className="card flex items-center gap-4 hover:shadow-lg transition-shadow w-full text-left">
          <Settings size={28} className="text-dc-text-muted" />
          <span className="text-xl font-bold flex-1">설정</span>
          <ChevronRight size={24} className="text-dc-text-muted" />
        </button>
        <button className="card flex items-center gap-4 hover:shadow-lg transition-shadow w-full text-left">
          <HelpCircle size={28} className="text-dc-text-muted" />
          <span className="text-xl font-bold flex-1">도움말</span>
          <ChevronRight size={24} className="text-dc-text-muted" />
        </button>
        <button onClick={logout} className="card flex items-center gap-4 w-full text-left bg-red-50 border-2 border-red-200 hover:shadow-lg transition-shadow">
          <LogOut size={28} className="text-dc-error" />
          <span className="text-xl font-bold text-dc-error">로그아웃</span>
        </button>
      </div>
    </div>
  )
}
