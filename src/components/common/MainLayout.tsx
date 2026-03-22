import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'
import BottomNav from './BottomNav'
import TopHeader from './TopHeader'

export default function MainLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isStaff = user?.role === 'instructor' || user?.role === 'admin'

  return (
    <div className="min-h-screen bg-dc-cream">
      <TopHeader />
      <main className="has-bottom-nav">
        <Outlet />
      </main>
      <BottomNav />

      {/* 강사/CEO가 학생 화면을 보고 있을 때 플로팅 복귀 버튼 */}
      {isStaff && (
        <button
          onClick={() => navigate(user?.role === 'admin' ? '/ceo' : '/admin')}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-dc-green text-white rounded-full shadow-lg text-base font-bold hover:bg-dc-green-light transition-colors"
        >
          <ArrowLeft size={18} />
          {user?.role === 'admin' ? 'CEO 모드' : '강사 모드'}
        </button>
      )}
    </div>
  )
}
