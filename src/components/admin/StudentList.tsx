import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentsByInstructor } from '@/services/adminService'
import { Search, Users } from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  org_code: string
  created_at: string
}

export default function StudentList() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await fetchStudentsByInstructor(user.id)
    setStudents(data as Student[])
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* 통계 */}
      <div className="card bg-dc-green-bg border-2 border-dc-green-pale mb-6 flex items-center gap-4">
        <Users size={32} className="text-dc-green" />
        <div>
          <p className="text-lg text-dc-text-secondary font-bold">전체 학생</p>
          <p className="text-3xl font-extrabold text-dc-green">{students.length}명</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="relative mb-6">
        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-dc-text-muted" />
        <input
          type="text"
          className="input-field pl-12"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
        />
      </div>

      {/* 학생 목록 */}
      {loading ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">불러오는 중...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">
            {search ? '검색 결과가 없어요' : '아직 학생이 없어요'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(s => (
            <div key={s.id} className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-dc-green-pale flex items-center justify-center shrink-0">
                <span className="text-xl font-extrabold text-dc-green">{s.name?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-dc-text truncate">{s.name || '이름 없음'}</h4>
                <p className="text-lg text-dc-text-muted truncate">{s.email}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-dc-green bg-dc-green-bg px-3 py-1 rounded-lg">{s.org_code}</span>
                <p className="text-base text-dc-text-muted mt-1">{new Date(s.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
