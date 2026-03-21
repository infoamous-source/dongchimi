import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createOrganization, fetchOrganizations, deleteOrganization, fetchStudentCount } from '@/services/adminService'
import { Plus, Copy, Trash2, Check } from 'lucide-react'

interface OrgWithCount {
  id: string
  name: string
  code: string
  created_at: string
  studentCount: number
}

export default function OrgManagement() {
  const { user } = useAuth()
  const [orgs, setOrgs] = useState<OrgWithCount[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const loadOrgs = useCallback(async () => {
    if (!user) return
    const data = await fetchOrganizations(user.id)
    const withCounts = await Promise.all(
      data.map(async (org) => ({
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
      await createOrganization(user.id, newName.trim())
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

  return (
    <div>
      {/* 강사코드 표시 */}
      <div className="card bg-dc-green-bg border-2 border-dc-green-pale mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-dc-text-secondary font-bold">내 강사코드</p>
            <p className="text-2xl font-extrabold text-dc-green mt-1">{user?.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={() => handleCopy(user?.id.slice(0, 8).toUpperCase() || '')}
            className="btn-secondary px-4 py-3 text-lg"
          >
            {copied === user?.id.slice(0, 8).toUpperCase() ? <Check size={20} /> : <Copy size={20} />}
            복사
          </button>
        </div>
        <p className="text-lg text-dc-text-muted mt-2">학생이 가입할 때 이 코드를 입력해요</p>
      </div>

      {/* 기관 생성 */}
      <div className="card mb-6">
        <h3 className="text-xl font-extrabold text-dc-text mb-4">새 기관 만들기</h3>
        <div className="flex gap-3">
          <input
            type="text"
            className="input-field flex-1"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="기관 이름 (예: 동치미 1기)"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate} disabled={loading || !newName.trim()} className="btn-primary px-6 shrink-0">
            <Plus size={22} />
            만들기
          </button>
        </div>
      </div>

      {/* 기관 목록 */}
      <h3 className="text-xl font-extrabold text-dc-text mb-4">내 기관 목록</h3>
      {orgs.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">아직 기관이 없어요. 위에서 만들어보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orgs.map(org => (
            <div key={org.id} className="card flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-extrabold text-dc-text">{org.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg font-bold text-dc-green bg-dc-green-bg px-3 py-1 rounded-lg">{org.code}</span>
                  <span className="text-lg text-dc-text-muted">학생 {org.studentCount}명</span>
                </div>
              </div>
              <button onClick={() => handleCopy(org.code)} className="p-3 rounded-xl hover:bg-gray-100">
                {copied === org.code ? <Check size={22} className="text-dc-green" /> : <Copy size={22} className="text-dc-text-muted" />}
              </button>
              <button onClick={() => handleDelete(org.id)} className="p-3 rounded-xl hover:bg-red-50">
                <Trash2 size={22} className="text-dc-error" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
