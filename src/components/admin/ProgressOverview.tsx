import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentsByInstructor, fetchAllStudentProgress } from '@/services/adminService'
import { courses } from '@/data/courses'
import { Search, BarChart3, Download } from 'lucide-react'
import { exportStudentData, generateOrgReport, generateCertificate } from '@/services/exportService'
import { FileText, Award } from 'lucide-react'

interface StudentProgress {
  id: string
  name: string
  email: string
  completedCount: number
  totalLessons: number
  percent: number
}

export default function ProgressOverview() {
  const { user } = useAuth()
  const [data, setData] = useState<StudentProgress[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const totalLessons = courses.reduce((sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0), 0)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const students = await fetchStudentsByInstructor(user.id)
    if (students.length === 0) { setData([]); setLoading(false); return }

    const ids = students.map(s => s.id)
    const progress = await fetchAllStudentProgress(ids)

    const map = new Map<string, number>()
    progress.forEach(p => {
      map.set(p.user_id, (map.get(p.user_id) || 0) + 1)
    })

    const result: StudentProgress[] = students.map(s => {
      const completed = map.get(s.id) || 0
      return {
        id: s.id,
        name: s.name || '이름 없음',
        email: s.email || '',
        completedCount: completed,
        totalLessons,
        percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
      }
    })

    setData(result)
    setLoading(false)
  }, [user, totalLessons])

  useEffect(() => { load() }, [load])

  const filtered = data.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const avgPercent = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.percent, 0) / data.length) : 0

  return (
    <div>
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card text-center">
          <p className="text-lg text-dc-text-secondary font-bold">전체 학생</p>
          <p className="text-3xl font-extrabold text-dc-green">{data.length}명</p>
        </div>
        <div className="card text-center">
          <p className="text-lg text-dc-text-secondary font-bold">평균 진도율</p>
          <p className="text-3xl font-extrabold text-dc-info">{avgPercent}%</p>
        </div>
      </div>

      {/* 내보내기 버튼들 */}
      {data.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => exportStudentData(data.map(s => ({
              name: s.name,
              email: s.email,
              orgCode: '',
              completedLessons: s.completedCount,
              totalLessons: s.totalLessons,
              loginDays: 0,
              lastLogin: '',
            })))}
            className="btn-secondary w-full text-xl flex items-center justify-center gap-3 py-4"
          >
            <Download size={24} />
            CSV 다운로드
          </button>
          <button
            onClick={() => generateOrgReport('우리 기관', {
              totalStudents: data.length,
              avgProgress: avgPercent,
              totalLessons,
              period: new Date().toLocaleDateString('ko-KR'),
              programType: 'senior',
            })}
            className="btn-secondary w-full text-xl flex items-center justify-center gap-3 py-4"
          >
            <FileText size={24} />
            PDF 리포트
          </button>
          <button
            onClick={() => {
              const student = filtered[0]
              if (student) {
                generateCertificate(student.name, '동치미학교 교육과정', '우리 기관', new Date().toLocaleDateString('ko-KR'))
              }
            }}
            className="btn-secondary w-full text-xl flex items-center justify-center gap-3 py-4"
          >
            <Award size={24} />
            수료증 발급
          </button>
        </div>
      )}

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

      {/* 진도 목록 */}
      {loading ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">불러오는 중...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8">
          <BarChart3 size={40} className="mx-auto text-dc-text-muted mb-3" />
          <p className="text-xl text-dc-text-muted">
            {search ? '검색 결과가 없어요' : '아직 데이터가 없어요'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(s => (
            <div key={s.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xl font-bold text-dc-text">{s.name}</h4>
                  <p className="text-lg text-dc-text-muted">{s.email}</p>
                </div>
                <span className="text-2xl font-extrabold text-dc-green">{s.percent}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-dc-green rounded-full transition-all"
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
                <span className="text-lg text-dc-text-muted font-bold whitespace-nowrap">
                  {s.completedCount}/{s.totalLessons}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
