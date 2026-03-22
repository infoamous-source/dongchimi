import { supabase } from '@/lib/supabase'

export interface DemoAccount {
  email: string
  password: string
  name: string
}

export async function createDemoAccounts(
  orgCode: string,
  count: number = 3
): Promise<DemoAccount[]> {
  const accounts: DemoAccount[] = []
  const timestamp = Date.now().toString().slice(-6)

  for (let i = 1; i <= count; i++) {
    const email = `demo-${timestamp}-${String(i).padStart(2, '0')}@dongchimi.demo`
    const password = `demo${timestamp}${i}`
    const name = `체험학생 ${i}`

    // Supabase auth로 계정 생성
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          org_code: orgCode,
          is_demo: true,
        },
      },
    })

    if (error) {
      console.error(`데모 계정 생성 실패 (${i}):`, error)
      continue
    }

    // 프로필에 데모 플래그 + org_code 세팅
    if (authData.user) {
      await supabase.from('dc_profiles').update({
        is_demo: true,
        org_code: orgCode,
        name,
      }).eq('id', authData.user.id)

      // 샘플 진도 데이터 (일부 수업 완료)
      const sampleLessons = ['sm-basics-1', 'sm-basics-2', 'sm-call-1', 'sm-kakao-1']
      const lessonsToDo = sampleLessons.slice(0, Math.floor(Math.random() * 4) + 1)
      for (const lessonId of lessonsToDo) {
        await supabase.from('dc_lesson_progress').insert({
          user_id: authData.user.id,
          lesson_id: lessonId,
          course_id: 'smartphone',
          completed: true,
          completed_at: new Date().toISOString(),
        })
      }
    }

    accounts.push({ email, password, name })
  }

  return accounts
}
