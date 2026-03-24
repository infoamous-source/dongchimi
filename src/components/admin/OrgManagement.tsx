import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createOrganization, fetchOrganizations, deleteOrganization, fetchStudentCount } from '@/services/adminService'
import { supabase } from '@/lib/supabase'
import { Plus, Copy, Trash2, Check, Calendar, UserPlus, X } from 'lucide-react'
import { createDemoAccounts, type DemoAccount } from '@/services/demoService'

interface OrgWithCount {
  id: string
  name: string
  code: string
  program_type: string
  subscription_start: string | null
  subscription_end: string | null
  is_active: boolean
  created_at: string
  studentCount: number
}

export default function OrgManagement() {
  const { user } = useAuth()
  const [orgs, setOrgs] = useState<OrgWithCount[]>([])
  const [newName, setNewName] = useState('')
  const [newProgramType, setNewProgramType] = useState<'senior' | 'career'>('senior')
  const [newSubMonths, setNewSubMonths] = useState(3)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [demoResults, setDemoResults] = useState<DemoAccount[] | null>(null)
  const [demoOrgName, setDemoOrgName] = useState('')

  const loadOrgs = useCallback(async () => {
    if (!user) return
    const data = await fetchOrganizations(user.id)
    const withCounts = await Promise.all(
      data.map(async (org: any) => ({
        ...org,
        studentCount: await fetchStudentCount(org.code),
      }))
    )
    setOrgs(withCounts)
  }, [user])

  useEffect(() => { loadOrgs() }, [loadOrgs])

  const handleCreate = async () => {
    if (!user || !newName.trim()) return
    setLoading(true)
    try {
      const org = await createOrganization(user.id, newName.trim())
      // 프로그램 타입 + 구독 기간 업데이트
      const start = new Date()
      const end = new Date()
      end.setMonth(end.getMonth() + newSubMonths)
      await supabase.from('dc_organizations').update({
        program_type: newProgramType,
        subscription_start: start.toISOString().split('T')[0],
        subscription_end: end.toISOString().split('T')[0],
      }).eq('id', org.id)
      setNewName('')
      await loadOrgs()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠어요?')) return
    await deleteOrganization(id)
    await loadOrgs()
  }

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCreateDemo = async (orgCode: string, orgName: string) => {
    setDemoLoading(orgCode)
    try {
      const accounts = await createDemoAccounts(orgCode)
      setDemoResults(accounts)
      setDemoOrgName(orgName)
      await loadOrgs()
    } finally {
      setDemoLoading(null)
    }
  }

  const getDaysLeft = (end: string | null) => {
    if (!end) return null
    const diff = Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div>
      {/* 강사코드 표시 */}
      <div className="card bg-dc-green-bg border-2 border-dc-green-pale mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-dc-text-secondary font-bold">내 강사코드</p>
            <p className="text-2xl font-extrabold text-dc-green mt-1">{user?.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={() => handleCopy(user?.id.slice(0, 8).toUpperCase() || '')} className="btn-secondary px-4 py-3 text-lg">
            {copied === user?.id.slice(0, 8).toUpperCase() ? <Check size={20} /> : <Copy size={20} />}
            복사
          </button>
        </div>
        <p className="text-lg text-dc-text-muted mt-2">학생이 가입할 때 이 코드를 입력해요</p>
      </div>

      {/* 기관 생성 */}
      <div className="card mb-6">
        <h3 className="text-xl font-extrabold text-dc-text mb-4">새 기관 만들기</h3>

        <input
          type="text"
          className="input-field mb-3"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="기관 이름 (예: OO복지관 1기)"
        />

        {/* 프로그램 타입 */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => setNewProgramType('senior')}
            className={`flex-1 py-4 rounded-2xl text-lg font-extrabold border-2 transition-colors ${
              newProgramType === 'senior' ? 'border-dc-green bg-dc-green-bg text-dc-green' : 'border-gray-200 bg-white text-dc-text-muted'
            }`}
          >
            🫙 큰동치미
          </button>
          <button
            onClick={() => setNewProgramType('career')}
            className={`flex-1 py-4 rounded-2xl text-lg font-extrabold border-2 transition-colors ${
              newProgramType === 'career' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-dc-text-muted'
            }`}
          >
            🫙 작은동치미
          </button>
        </div>

        {/* 구독 기간 */}
        <div className="flex gap-2 mb-4">
          {[1, 3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setNewSubMonths(m)}
              className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-colors ${
                newSubMonths === m ? 'border-dc-green bg-dc-green-bg text-dc-green' : 'border-gray-200 bg-white text-dc-text-muted'
              }`}
            >
              {m}개월
            </button>
          ))}
        </div>

        <button onClick={handleCreate} disabled={loading || !newName.trim()} className="btn-primary w-full text-xl">
          <Plus size={22} />
          기관 만들기
        </button>
      </div>

      {/* 기관 목록 */}
      <h3 className="text-xl font-extrabold text-dc-text mb-4">내 기관 목록</h3>
      {orgs.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">아직 기관이 없어요. 위에서 만들어보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orgs.map(org => {
            const daysLeft = getDaysLeft(org.subscription_end)
            const isExpired = daysLeft !== null && daysLeft <= 0
            return (
              <div key={org.id} className={`card ${isExpired ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-xl font-extrabold text-dc-text">{org.name}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-lg font-bold text-dc-green bg-dc-green-bg px-3 py-1 rounded-lg">{org.code}</span>
                      <span className={`text-base font-bold px-3 py-1 rounded-lg ${
                        org.program_type === 'senior' ? 'bg-dc-green-bg text-dc-green' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {org.program_type === 'senior' ? '큰동치미' : '작은동치미'}
                      </span>
                      <span className="text-lg text-dc-text-muted">학생 {org.studentCount}명</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleCopy(org.code)} className="p-3 rounded-xl hover:bg-gray-100">
                      {copied === org.code ? <Check size={22} className="text-dc-green" /> : <Copy size={22} className="text-dc-text-muted" />}
                    </button>
                    <button onClick={() => handleDelete(org.id)} className="p-3 rounded-xl hover:bg-red-50">
                      <Trash2 size={22} className="text-dc-error" />
                    </button>
                  </div>
                </div>
                {/* 구독 기간 */}
                {org.subscription_end && (
                  <div className="flex items-center gap-2 text-lg mt-2">
                    <Calendar size={18} className="text-dc-text-muted" />
                    <span className="text-dc-text-muted">
                      {org.subscription_start} ~ {org.subscription_end}
                    </span>
                    {daysLeft !== null && (
                      <span className={`font-bold ${isExpired ? 'text-dc-error' : daysLeft <= 30 ? 'text-amber-600' : 'text-dc-green'}`}>
                        {isExpired ? '만료됨' : `${daysLeft}일 남음`}
                      </span>
                    )}
                  </div>
                )}
                {/* 데모 계정 생성 */}
                <button
                  onClick={() => handleCreateDemo(org.code, org.name)}
                  disabled={demoLoading === org.code}
                  className="btn-secondary w-full text-lg mt-3 flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  <UserPlus size={20} />
                  {demoLoading === org.code ? '생성 중...' : '데모 계정 생성'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* 데모 계정 결과 모달 */}
      {demoResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-extrabold text-dc-text">데모 계정 생성 완료</h3>
              <button onClick={() => setDemoResults(null)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={24} className="text-dc-text-muted" />
              </button>
            </div>
            <p className="text-lg text-dc-text-secondary mb-4">{demoOrgName} - {demoResults.length}개 계정</p>
            <div className="flex flex-col gap-3">
              {demoResults.map((acc, i) => (
                <div key={i} className="card bg-gray-50 border-2 border-gray-200">
                  <p className="text-xl font-extrabold text-dc-text">{acc.name}</p>
                  <p className="text-lg text-dc-text-secondary mt-1">이메일: {acc.email}</p>
                  <p className="text-lg text-dc-green font-bold mt-1">비밀번호: {acc.password}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const text = demoResults.map(a => `${a.name}\n이메일: ${a.email}\n비밀번호: ${a.password}`).join('\n\n')
                navigator.clipboard.writeText(text)
              }}
              className="btn-primary w-full text-xl mt-4 py-4 flex items-center justify-center gap-2"
            >
              <Copy size={22} />
              전체 복사
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
