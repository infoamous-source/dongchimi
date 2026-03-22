import { supabase } from '@/lib/supabase'

export type ActivityAction =
  | 'login'
  | 'lesson_complete'
  | 'kiosk_complete'
  | 'practice_complete'
  | 'ai_question'
  | 'resume_generated'
  | 'cover_letter_generated'
  | 'mood_selected'

export async function logActivity(
  userId: string,
  action: ActivityAction,
  metadata: Record<string, unknown> = {}
) {
  await supabase.from('dc_activity_logs').insert({
    user_id: userId,
    action,
    metadata,
  })
}

export async function fetchActivityCount(userId: string, action: ActivityAction): Promise<number> {
  const { count } = await supabase
    .from('dc_activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
  return count ?? 0
}

export async function fetchLoginDays(userId: string): Promise<number> {
  const { data } = await supabase
    .from('dc_activity_logs')
    .select('created_at')
    .eq('user_id', userId)
    .eq('action', 'login')
  if (!data) return 0
  const uniqueDays = new Set(data.map(d => d.created_at.split('T')[0]))
  return uniqueDays.size
}

export async function logLoginIfNeeded(userId: string) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('dc_activity_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('action', 'login')
    .gte('created_at', today + 'T00:00:00')
    .limit(1)
  if (!data || data.length === 0) {
    await logActivity(userId, 'login')
  }
  // last_login_at 업데이트
  await supabase.from('dc_profiles').update({ last_login_at: new Date().toISOString() }).eq('id', userId)
}
