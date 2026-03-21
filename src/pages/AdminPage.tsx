import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Building2, Users, BarChart3 } from 'lucide-react'
import OrgManagement from '@/components/admin/OrgManagement'
import StudentList from '@/components/admin/StudentList'
import ProgressOverview from '@/components/admin/ProgressOverview'

const tabs = [
  { id: 'org', label: '기관 관리', icon: Building2 },
  { id: 'students', label: '학생 관리', icon: Users },
  { id: 'progress', label: '학습 현황', icon: BarChart3 },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('org')

  if (!user || user.role !== 'instructor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-2xl font-extrabold text-dc-text mb-4">강사 전용 페이지입니다</p>
        <p className="text-xl text-dc-text-secondary mb-6">강사 계정으로 로그인해주세요</p>
        <Link to="/" className="btn-primary inline-flex">홈으로</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary mb-4 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>홈으로</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-6">강사 대시보드</h1>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-lg font-extrabold whitespace-nowrap transition-colors ${
                active ? 'bg-dc-green text-white' : 'bg-white text-dc-text-secondary border-2 border-gray-200'
              }`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'org' && <OrgManagement />}
      {activeTab === 'students' && <StudentList />}
      {activeTab === 'progress' && <ProgressOverview />}
    </div>
  )
}
