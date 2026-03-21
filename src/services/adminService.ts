import { supabase } from '@/lib/supabase'

// ===== 기관 관리 =====

function generateCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < 3; i++) code += letters[Math.floor(Math.random() * letters.length)]
  for (let i = 0; i < 3; i++) code += digits[Math.floor(Math.random() * digits.length)]
  return code
}

export async function createOrganization(instructorId: string, name: string) {
  // 코드 충돌 방지 (최대 5회 시도)
  for (let i = 0; i < 5; i++) {
    const code = generateCode()
    const { data, error } = await supabase
      .from('dc_organizations')
      .insert({ instructor_id: instructorId, name, code })
      .select()
      .single()
    if (!error) return data
    if (!error.message.includes('unique')) throw error
  }
  throw new Error('코드 생성 실패')
}

export async function fetchOrganizations(instructorId: string) {
  const { data } = await supabase
    .from('dc_organizations')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function deleteOrganization(id: string) {
  await supabase.from('dc_organizations').delete().eq('id', id)
}

// ===== 학생 조회 =====

export async function fetchStudentsByOrgCode(orgCode: string) {
  const { data } = await supabase
    .from('dc_profiles')
    .select('id, name, email, org_code, instructor_code, created_at')
    .eq('org_code', orgCode)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function fetchStudentsByInstructor(instructorId: string) {
  // 먼저 강사의 모든 기관코드를 가져옴
  const orgs = await fetchOrganizations(instructorId)
  if (orgs.length === 0) return []

  const codes = orgs.map(o => o.code)
  const { data } = await supabase
    .from('dc_profiles')
    .select('id, name, email, org_code, instructor_code, created_at')
    .in('org_code', codes)
    .order('created_at', { ascending: false })
  return data ?? []
}

// ===== 학생 수 (기관별) =====

export async function fetchStudentCount(orgCode: string): Promise<number> {
  const { count } = await supabase
    .from('dc_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('org_code', orgCode)
  return count ?? 0
}

// ===== 학습 현황 =====

export async function fetchAllStudentProgress(studentIds: string[]) {
  if (studentIds.length === 0) return []
  const { data } = await supabase
    .from('dc_lesson_progress')
    .select('user_id, lesson_id, completed')
    .in('user_id', studentIds)
    .eq('completed', true)
  return data ?? []
}
