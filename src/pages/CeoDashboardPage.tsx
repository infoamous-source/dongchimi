import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  Eye, Users, Building2, BarChart3, Settings, UserPlus,
  Trash2, Search, Copy, Check, Plus, GraduationCap,
} from 'lucide-react'

// ===== Types =====

interface Instructor {
  id: string
  name: string
  email: string
  created_at: string
  orgCount: number
  studentCount: number
}

interface Org {
  id: string
  name: string
  code: string
  program_type: string
  instructor_id: string
  instructorName: string
  studentCount: number
  subscription_start: string | null
  subscription_end: string | null
  is_active: boolean
  created_at: string
}

interface Student {
  id: string
  name: string
  email: string
  org_code: string
  orgName: string
  instructor_code: string
  created_at: string
  last_sign_in_at: string | null
}

interface InstructorCode {
  id: string
  code: string
  label: string | null
  used: boolean
  used_by: string | null
  created_at: string
}

// ===== Tabs =====

const tabs = [
  { id: 'instructors', label: '강사 관리', icon: GraduationCap },
  { id: 'orgs', label: '기관 관리', icon: Building2 },
  { id: 'students', label: '학생 관리', icon: Users },
  { id: 'stats', label: '학습 데이터', icon: BarChart3 },
  { id: 'settings', label: '설정', icon: Settings },
]

// ===== Fruit/vegetable names for codes =====

const CODE_LABELS = [
  '사과', '배', '포도', '딸기', '수박', '참외', '복숭아', '감', '귤', '오렌지',
  '당근', '감자', '고구마', '양파', '토마토', '오이', '호박', '무', '배추', '시금치',
  '바나나', '키위', '망고', '자두', '살구', '파인애플', '레몬', '체리', '블루베리', '브로콜리',
]

function generateInstructorCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DC-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ===== Main Component =====

export default function CeoDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('instructors')

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-2xl font-extrabold text-dc-text mb-4">CEO 전용 페이지입니다</p>
        <p className="text-xl text-dc-text-secondary mb-6">관리자 계정으로 로그인해주세요</p>
        <Link to="/" className="btn-primary inline-flex">홈으로</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 상단 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-dc-text">CEO 대시보드</h1>
        <button
          onClick={() => navigate('/senior')}
          className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl text-lg font-bold hover:bg-blue-100 transition-colors"
        >
          <Eye size={20} />
          학생 모드
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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
      {activeTab === 'instructors' && <InstructorTab />}
      {activeTab === 'orgs' && <OrgTab />}
      {activeTab === 'students' && <StudentTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  )
}

// ===================================================================
// Tab 1: 강사 관리
// ===================================================================

function InstructorTab() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [codes, setCodes] = useState<InstructorCode[]>([])
  const [loading, setLoading] = useState(true)
  const [codeLoading, setCodeLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    // Fetch instructors
    const { data: profiles } = await supabase
      .from('dc_profiles')
      .select('id, name, email, created_at')
      .eq('role', 'instructor')
      .order('created_at', { ascending: false })

    // Fetch all orgs for counts
    const { data: allOrgs } = await supabase
      .from('dc_organizations')
      .select('id, instructor_id, code')

    // Fetch all students (non-instructor, non-admin) for counts
    const { data: allStudents } = await supabase
      .from('dc_profiles')
      .select('id, org_code')
      .eq('role', 'student')

    const orgsByInstructor: Record<string, string[]> = {}
    ;(allOrgs ?? []).forEach(o => {
      if (!orgsByInstructor[o.instructor_id]) orgsByInstructor[o.instructor_id] = []
      orgsByInstructor[o.instructor_id].push(o.code)
    })

    const studentsByOrgCode: Record<string, number> = {}
    ;(allStudents ?? []).forEach(s => {
      if (s.org_code) studentsByOrgCode[s.org_code] = (studentsByOrgCode[s.org_code] || 0) + 1
    })

    const mapped: Instructor[] = (profiles ?? []).map(p => {
      const codes = orgsByInstructor[p.id] || []
      const studentCount = codes.reduce((sum, code) => sum + (studentsByOrgCode[code] || 0), 0)
      return { ...p, orgCount: codes.length, studentCount }
    })

    setInstructors(mapped)

    // Fetch instructor codes
    const { data: codeData } = await supabase
      .from('dc_instructor_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(codeData ?? [])

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreateCode = async () => {
    setCodeLoading(true)
    const code = generateInstructorCode()
    const label = CODE_LABELS[Math.floor(Math.random() * CODE_LABELS.length)]
    await supabase.from('dc_instructor_codes').insert({ code, label, used: false })
    await load()
    setCodeLoading(false)
  }

  const handleDeleteCode = async (id: string) => {
    if (!confirm('이 코드를 삭제하시겠어요?')) return
    await supabase.from('dc_instructor_codes').delete().eq('id', id)
    await load()
  }

  const [copied, setCopied] = useState<string | null>(null)
  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return <div className="card text-center py-8"><p className="text-xl text-dc-text-muted">불러오는 중...</p></div>
  }

  return (
    <div>
      {/* 강사 코드 관리 */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-dc-text">강사 인증코드</h3>
          <button
            onClick={handleCreateCode}
            disabled={codeLoading}
            className="flex items-center gap-2 px-4 py-3 bg-dc-green text-white rounded-2xl text-lg font-bold hover:bg-dc-green/90 transition-colors disabled:opacity-50"
          >
            <Plus size={20} />
            코드 생성
          </button>
        </div>

        {codes.length === 0 ? (
          <p className="text-lg text-dc-text-muted text-center py-4">생성된 코드가 없어요</p>
        ) : (
          <div className="flex flex-col gap-2">
            {codes.map(c => (
              <div key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${c.used ? 'bg-gray-50 border-gray-200' : 'bg-dc-green-bg border-dc-green-pale'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-dc-green">{c.code}</span>
                  {c.label && <span className="text-lg text-dc-text-muted">({c.label})</span>}
                  {c.used && <span className="text-base font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-lg">사용됨</span>}
                </div>
                <div className="flex gap-1">
                  {!c.used && (
                    <button onClick={() => handleCopy(c.code)} className="p-3 rounded-xl hover:bg-gray-100">
                      {copied === c.code ? <Check size={20} className="text-dc-green" /> : <Copy size={20} className="text-dc-text-muted" />}
                    </button>
                  )}
                  <button onClick={() => handleDeleteCode(c.id)} className="p-3 rounded-xl hover:bg-red-50">
                    <Trash2 size={20} className="text-dc-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 강사 목록 */}
      <h3 className="text-xl font-extrabold text-dc-text mb-4">전체 강사 ({instructors.length}명)</h3>
      {instructors.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">아직 강사가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {instructors.map(inst => (
            <div key={inst.id} className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-xl font-extrabold text-purple-600">{inst.name?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-dc-text truncate">{inst.name || '이름 없음'}</h4>
                <p className="text-lg text-dc-text-muted truncate">{inst.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-dc-green">기관 {inst.orgCount}개</p>
                <p className="text-lg text-dc-text-muted">학생 {inst.studentCount}명</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================================================================
// Tab 2: 기관 관리
// ===================================================================

function OrgTab() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'senior' | 'career'>('all')

  const load = useCallback(async () => {
    setLoading(true)

    const { data: allOrgs } = await supabase
      .from('dc_organizations')
      .select('*')
      .order('created_at', { ascending: false })

    // Instructor names
    const instructorIds = [...new Set((allOrgs ?? []).map(o => o.instructor_id))]
    const { data: instructorProfiles } = await supabase
      .from('dc_profiles')
      .select('id, name')
      .in('id', instructorIds.length > 0 ? instructorIds : ['__none__'])

    const nameMap: Record<string, string> = {}
    ;(instructorProfiles ?? []).forEach(p => { nameMap[p.id] = p.name || '이름 없음' })

    // Student counts per org code
    const { data: allStudents } = await supabase
      .from('dc_profiles')
      .select('org_code')
      .eq('role', 'student')

    const countMap: Record<string, number> = {}
    ;(allStudents ?? []).forEach(s => {
      if (s.org_code) countMap[s.org_code] = (countMap[s.org_code] || 0) + 1
    })

    const mapped: Org[] = (allOrgs ?? []).map(o => ({
      ...o,
      instructorName: nameMap[o.instructor_id] || '알 수 없음',
      studentCount: countMap[o.code] || 0,
    }))

    setOrgs(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 기관을 삭제하시겠어요?')) return
    await supabase.from('dc_organizations').delete().eq('id', id)
    await load()
  }

  const getDaysLeft = (end: string | null) => {
    if (!end) return null
    return Math.ceil((new Date(end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const filtered = filter === 'all' ? orgs : orgs.filter(o => o.program_type === filter)

  if (loading) {
    return <div className="card text-center py-8"><p className="text-xl text-dc-text-muted">불러오는 중...</p></div>
  }

  return (
    <div>
      {/* 통계 */}
      <div className="card bg-dc-green-bg border-2 border-dc-green-pale mb-6 flex items-center gap-4">
        <Building2 size={32} className="text-dc-green" />
        <div>
          <p className="text-lg text-dc-text-secondary font-bold">전체 기관</p>
          <p className="text-3xl font-extrabold text-dc-green">{orgs.length}개</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'all' as const, label: '전체' },
          { id: 'senior' as const, label: '큰동치미' },
          { id: 'career' as const, label: '작은동치미' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-3 rounded-2xl text-lg font-bold transition-colors ${
              filter === f.id ? 'bg-dc-green text-white' : 'bg-white text-dc-text-secondary border-2 border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 기관 목록 */}
      {filtered.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">기관이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(org => {
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
                    </div>
                    <p className="text-lg text-dc-text-muted mt-1">강사: {org.instructorName} | 학생 {org.studentCount}명</p>
                  </div>
                  <button onClick={() => handleDelete(org.id)} className="p-3 rounded-xl hover:bg-red-50">
                    <Trash2 size={22} className="text-dc-error" />
                  </button>
                </div>
                {org.subscription_end && (
                  <div className="flex items-center gap-2 text-lg mt-1">
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
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-base font-bold px-3 py-1 rounded-lg ${org.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {org.is_active ? '활성' : '비활성'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ===================================================================
// Tab 3: 학생 관리
// ===================================================================

function StudentTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterInstructor, setFilterInstructor] = useState('all')
  const [filterProgram, setFilterProgram] = useState<'all' | 'senior' | 'career'>('all')
  const [instructorList, setInstructorList] = useState<{ id: string; name: string }[]>([])
  const [orgMap, setOrgMap] = useState<Record<string, { name: string; program_type: string; instructor_id: string }>>({})

  const load = useCallback(async () => {
    setLoading(true)

    // Fetch all students
    const { data: allStudents } = await supabase
      .from('dc_profiles')
      .select('id, name, email, org_code, instructor_code, created_at, last_sign_in_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    // Fetch all orgs
    const { data: allOrgs } = await supabase
      .from('dc_organizations')
      .select('code, name, program_type, instructor_id')

    const oMap: Record<string, { name: string; program_type: string; instructor_id: string }> = {}
    ;(allOrgs ?? []).forEach(o => { oMap[o.code] = { name: o.name, program_type: o.program_type, instructor_id: o.instructor_id } })
    setOrgMap(oMap)

    // Fetch instructors
    const { data: instructors } = await supabase
      .from('dc_profiles')
      .select('id, name')
      .eq('role', 'instructor')
    setInstructorList(instructors ?? [])

    const mapped: Student[] = (allStudents ?? []).map(s => ({
      ...s,
      orgName: s.org_code ? (oMap[s.org_code]?.name || s.org_code) : '없음',
      last_sign_in_at: s.last_sign_in_at || null,
    }))

    setStudents(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = students.filter(s => {
    // Search
    if (search) {
      const q = search.toLowerCase()
      if (!s.name?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) return false
    }
    // Instructor filter
    if (filterInstructor !== 'all') {
      const orgInfo = s.org_code ? orgMap[s.org_code] : null
      if (!orgInfo || orgInfo.instructor_id !== filterInstructor) return false
    }
    // Program filter
    if (filterProgram !== 'all') {
      const orgInfo = s.org_code ? orgMap[s.org_code] : null
      if (!orgInfo || orgInfo.program_type !== filterProgram) return false
    }
    return true
  })

  if (loading) {
    return <div className="card text-center py-8"><p className="text-xl text-dc-text-muted">불러오는 중...</p></div>
  }

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
      <div className="relative mb-4">
        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-dc-text-muted" />
        <input
          type="text"
          className="input-field pl-12"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
        />
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {[
          { id: 'all' as const, label: '전체' },
          { id: 'senior' as const, label: '큰동치미' },
          { id: 'career' as const, label: '작은동치미' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterProgram(f.id)}
            className={`px-4 py-2 rounded-2xl text-lg font-bold transition-colors whitespace-nowrap ${
              filterProgram === f.id ? 'bg-dc-green text-white' : 'bg-white text-dc-text-secondary border-2 border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {instructorList.length > 0 && (
        <div className="mb-6">
          <select
            value={filterInstructor}
            onChange={e => setFilterInstructor(e.target.value)}
            className="input-field text-lg"
          >
            <option value="all">전체 강사</option>
            {instructorList.map(i => (
              <option key={i.id} value={i.id}>{i.name || i.id.slice(0, 8)}</option>
            ))}
          </select>
        </div>
      )}

      {/* 학생 목록 */}
      <p className="text-lg font-bold text-dc-text-muted mb-3">검색 결과: {filtered.length}명</p>
      {filtered.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-xl text-dc-text-muted">
            {search || filterInstructor !== 'all' || filterProgram !== 'all' ? '검색 결과가 없어요' : '아직 학생이 없어요'}
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
                <p className="text-base text-dc-text-muted">{s.orgName}</p>
              </div>
              <div className="text-right shrink-0">
                {s.org_code && (
                  <span className="text-base font-bold text-dc-green bg-dc-green-bg px-3 py-1 rounded-lg">{s.org_code}</span>
                )}
                <p className="text-base text-dc-text-muted mt-1">
                  {s.last_sign_in_at
                    ? `최근 ${new Date(s.last_sign_in_at).toLocaleDateString('ko-KR')}`
                    : '미접속'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================================================================
// Tab 4: 학습 데이터
// ===================================================================

function StatsTab() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalOrgs: 0,
    avgProgress: 0,
    seniorStudents: 0,
    careerStudents: 0,
    seniorOrgs: 0,
    careerOrgs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      // Counts
      const { count: studentCount } = await supabase
        .from('dc_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      const { count: instructorCount } = await supabase
        .from('dc_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor')

      const { data: allOrgs } = await supabase
        .from('dc_organizations')
        .select('code, program_type')

      const seniorOrgs = (allOrgs ?? []).filter(o => o.program_type === 'senior')
      const careerOrgs = (allOrgs ?? []).filter(o => o.program_type === 'career')

      const seniorCodes = seniorOrgs.map(o => o.code)
      const careerCodes = careerOrgs.map(o => o.code)

      // Student counts per program type
      const { count: seniorStudentCount } = seniorCodes.length > 0
        ? await supabase
            .from('dc_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .in('org_code', seniorCodes)
        : { count: 0 }

      const { count: careerStudentCount } = careerCodes.length > 0
        ? await supabase
            .from('dc_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .in('org_code', careerCodes)
        : { count: 0 }

      // Average progress
      const { data: allStudents } = await supabase
        .from('dc_profiles')
        .select('id')
        .eq('role', 'student')

      let avgProgress = 0
      if (allStudents && allStudents.length > 0) {
        const { count: completedCount } = await supabase
          .from('dc_lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('completed', true)
          .in('user_id', allStudents.map(s => s.id))

        // Assuming ~20 total lessons per student as a rough denominator
        const totalPossible = allStudents.length * 20
        avgProgress = totalPossible > 0 ? Math.round(((completedCount ?? 0) / totalPossible) * 100) : 0
      }

      setStats({
        totalStudents: studentCount ?? 0,
        totalInstructors: instructorCount ?? 0,
        totalOrgs: (allOrgs ?? []).length,
        avgProgress,
        seniorStudents: seniorStudentCount ?? 0,
        careerStudents: careerStudentCount ?? 0,
        seniorOrgs: seniorOrgs.length,
        careerOrgs: careerOrgs.length,
      })
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return <div className="card text-center py-8"><p className="text-xl text-dc-text-muted">불러오는 중...</p></div>
  }

  return (
    <div>
      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card bg-dc-green-bg border-2 border-dc-green-pale text-center">
          <p className="text-lg text-dc-text-secondary font-bold">전체 학생</p>
          <p className="text-3xl font-extrabold text-dc-green mt-1">{stats.totalStudents}명</p>
        </div>
        <div className="card bg-purple-50 border-2 border-purple-200 text-center">
          <p className="text-lg text-dc-text-secondary font-bold">전체 강사</p>
          <p className="text-3xl font-extrabold text-purple-600 mt-1">{stats.totalInstructors}명</p>
        </div>
        <div className="card bg-blue-50 border-2 border-blue-200 text-center">
          <p className="text-lg text-dc-text-secondary font-bold">전체 기관</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{stats.totalOrgs}개</p>
        </div>
        <div className="card bg-amber-50 border-2 border-amber-200 text-center">
          <p className="text-lg text-dc-text-secondary font-bold">평균 진도율</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.avgProgress}%</p>
        </div>
      </div>

      {/* 프로그램별 현황 */}
      <h3 className="text-xl font-extrabold text-dc-text mb-4">프로그램별 현황</h3>

      <div className="card mb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🫙</span>
          <h4 className="text-xl font-extrabold text-dc-green">큰동치미 (시니어)</h4>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg text-dc-text-muted">기관</p>
            <p className="text-2xl font-extrabold text-dc-text">{stats.seniorOrgs}개</p>
          </div>
          <div>
            <p className="text-lg text-dc-text-muted">학생</p>
            <p className="text-2xl font-extrabold text-dc-text">{stats.seniorStudents}명</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🫙</span>
          <h4 className="text-xl font-extrabold text-blue-600">작은동치미 (중장년)</h4>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg text-dc-text-muted">기관</p>
            <p className="text-2xl font-extrabold text-dc-text">{stats.careerOrgs}개</p>
          </div>
          <div>
            <p className="text-lg text-dc-text-muted">학생</p>
            <p className="text-2xl font-extrabold text-dc-text">{stats.careerStudents}명</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Tab 5: 설정
// ===================================================================

function SettingsTab() {
  const [codes, setCodes] = useState<InstructorCode[]>([])
  const [loading, setLoading] = useState(true)
  const [codeLoading, setCodeLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('dc_instructor_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreateCode = async () => {
    setCodeLoading(true)
    const code = generateInstructorCode()
    const label = newLabel.trim() || CODE_LABELS[Math.floor(Math.random() * CODE_LABELS.length)]
    await supabase.from('dc_instructor_codes').insert({ code, label, used: false })
    setNewLabel('')
    await load()
    setCodeLoading(false)
  }

  const handleDeleteCode = async (id: string) => {
    if (!confirm('이 코드를 삭제하시겠어요?')) return
    await supabase.from('dc_instructor_codes').delete().eq('id', id)
    await load()
  }

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return <div className="card text-center py-8"><p className="text-xl text-dc-text-muted">불러오는 중...</p></div>
  }

  return (
    <div>
      {/* 강사 코드 생성 */}
      <div className="card mb-6">
        <h3 className="text-xl font-extrabold text-dc-text mb-4">강사 인증코드 생성</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="input-field flex-1"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="코드 이름 (예: 사과, 당근) - 비우면 자동 생성"
          />
          <button
            onClick={handleCreateCode}
            disabled={codeLoading}
            className="flex items-center gap-2 px-5 py-3 bg-dc-green text-white rounded-2xl text-lg font-bold hover:bg-dc-green/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <UserPlus size={20} />
            생성
          </button>
        </div>

        {/* 코드 목록 */}
        <h4 className="text-lg font-bold text-dc-text mb-3">전체 코드 ({codes.length}개)</h4>
        {codes.length === 0 ? (
          <p className="text-lg text-dc-text-muted text-center py-4">생성된 코드가 없어요</p>
        ) : (
          <div className="flex flex-col gap-2">
            {codes.map(c => (
              <div key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${c.used ? 'bg-gray-50 border-gray-200' : 'bg-dc-green-bg border-dc-green-pale'}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-extrabold text-dc-green">{c.code}</span>
                  {c.label && <span className="text-lg text-dc-text-muted">({c.label})</span>}
                  {c.used ? (
                    <span className="text-base font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-lg">사용됨</span>
                  ) : (
                    <span className="text-base font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-lg">미사용</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!c.used && (
                    <button onClick={() => handleCopy(c.code)} className="p-3 rounded-xl hover:bg-gray-100">
                      {copied === c.code ? <Check size={20} className="text-dc-green" /> : <Copy size={20} className="text-dc-text-muted" />}
                    </button>
                  )}
                  <button onClick={() => handleDeleteCode(c.id)} className="p-3 rounded-xl hover:bg-red-50">
                    <Trash2 size={20} className="text-dc-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 앱 정보 */}
      <div className="card">
        <h3 className="text-xl font-extrabold text-dc-text mb-4">앱 정보</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-lg">
            <span className="text-dc-text-muted">앱 이름</span>
            <span className="font-bold text-dc-text">동치미</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-dc-text-muted">버전</span>
            <span className="font-bold text-dc-text">1.0.0</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-dc-text-muted">프로그램</span>
            <span className="font-bold text-dc-text">큰동치미 / 작은동치미</span>
          </div>
        </div>
      </div>
    </div>
  )
}
