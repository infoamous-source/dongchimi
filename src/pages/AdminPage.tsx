import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Building2, Users, BarChart3, Eye, Key } from 'lucide-react'
import { isGeminiEnabled, setStoredApiKey } from '@/services/gemini/geminiClient'
import { supabase } from '@/lib/supabase'
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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('org')
  const [showApiPopup, setShowApiPopup] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')

  // 강사: API 키 미등록 시 팝업
  useEffect(() => {
    if (user?.role === 'instructor' && !isGeminiEnabled()) {
      setShowApiPopup(true)
    }
  }, [user])

  const handleApiRegister = async () => {
    if (!apiKeyInput.trim() || !user) return
    setStoredApiKey(apiKeyInput.trim())
    await supabase.from('dc_profiles').update({ gemini_api_key: apiKeyInput.trim() }).eq('id', user.id)
    setShowApiPopup(false)
    setApiKeyInput('')
  }

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
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
      {/* 상단 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-dc-text">강사 대시보드</h1>
        <button
          onClick={() => navigate('/senior')}
          className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl text-lg font-bold hover:bg-blue-100 transition-colors"
        >
          <Eye size={20} />
          학생 모드
        </button>
      </div>

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

      {/* API 키 등록 팝업 (강사 첫 로그인 시) */}
      {showApiPopup && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <Key size={40} className="text-dc-green mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-dc-text text-center mb-2">AI API 키 등록</h2>
            <p className="text-lg text-dc-text-secondary text-center mb-6">학생 모드에서 AI비서를 사용하려면<br />API 키를 등록해주세요</p>
            <input
              type="text"
              className="input-field mb-3"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="API 키를 입력해주세요"
            />
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="block text-lg text-dc-info font-bold mb-4 underline text-center">
              Google API 키 발급받기 →
            </a>
            <div className="flex gap-3">
              <button onClick={() => setShowApiPopup(false)} className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl text-lg font-bold">나중에</button>
              <button onClick={handleApiRegister} disabled={!apiKeyInput.trim()} className="flex-[2] btn-primary text-lg disabled:opacity-40">등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
