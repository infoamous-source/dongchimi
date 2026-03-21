import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('[동치미] Supabase 환경변수가 설정되지 않았습니다. 오프라인 모드로 실행합니다.')
  // 오프라인 모드 - 더미 클라이언트
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key'
  )
}

export { supabase }
