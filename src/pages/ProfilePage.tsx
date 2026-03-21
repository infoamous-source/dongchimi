import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { User, LogOut, Settings, HelpCircle, BookOpen, ChevronRight, LayoutDashboard } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="card text-center py-12">
          <User size={56} className="mx-auto text-dc-text-muted mb-5" />
          <h2 className="text-2xl font-extrabold text-dc-text mb-3">
            로그인이 필요해요
          </h2>
          <p className="text-xl text-dc-text-secondary mb-8">
            내 학습 기록을 확인하려면 로그인해주세요
          </p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <Link to="/login" className="btn-primary text-xl">로그인</Link>
            <Link to="/register" className="btn-secondary text-xl">회원가입</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* 프로필 카드 */}
      <div className="card mb-6">
        <div className="flex items-center gap-5">
          <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-dc-green-pale flex items-center justify-center">
            <span className="text-3xl font-extrabold text-dc-green">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-dc-text">{user.name}</h2>
            <p className="text-lg text-dc-text-secondary">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 학습 통계 - 1열 가로 카드 */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-dc-green-bg flex items-center justify-center text-2xl shrink-0">📖</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">완료한 수업</span>
          <span className="text-2xl font-extrabold text-dc-green">0개</span>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">✏️</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">연습 횟수</span>
          <span className="text-2xl font-extrabold text-dc-orange">0회</span>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shrink-0">📅</div>
          <span className="text-lg font-bold text-dc-text-secondary flex-1">학습 일수</span>
          <span className="text-2xl font-extrabold text-dc-info">0일</span>
        </div>
      </div>

      {/* 강사 대시보드 버튼 */}
      {user.role === 'instructor' && (
        <Link to="/admin" className="card flex items-center gap-4 mb-6 hover:shadow-lg transition-shadow bg-dc-green text-white border-0">
          <LayoutDashboard size={28} />
          <span className="text-xl font-extrabold flex-1">강사 대시보드</span>
          <ChevronRight size={24} />
        </Link>
      )}

      {/* 메뉴 */}
      <div className="flex flex-col gap-3">
        <Link to="/learn" className="card flex items-center gap-4 hover:shadow-lg transition-shadow">
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
        <button
          onClick={logout}
          className="card flex items-center gap-4 w-full text-left bg-red-50 border-2 border-red-200 hover:shadow-lg transition-shadow"
        >
          <LogOut size={28} className="text-dc-error" />
          <span className="text-xl font-bold text-dc-error">로그아웃</span>
        </button>
      </div>
    </div>
  )
}
