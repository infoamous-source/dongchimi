import { useState, useEffect, type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

interface Props {
  children: ReactNode
}

export default function SubscriptionCheck({ children }: Props) {
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<'loading' | 'active' | 'expired'>('loading')

  useEffect(() => {
    async function checkSubscription() {
      // 로그인 안 된 경우, orgCode 없는 경우, 강사/관리자 → 제한 없음
      if (!user || !user.orgCode || user.role === 'instructor' || user.role === 'admin') {
        setStatus('active')
        return
      }

      try {
        const { data } = await supabase
          .from('dc_organizations')
          .select('subscription_end')
          .eq('code', user.orgCode)
          .single()

        if (!data || !data.subscription_end) {
          // 구독 정보가 없으면 접근 허용
          setStatus('active')
          return
        }

        const endDate = new Date(data.subscription_end)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (endDate < today) {
          setStatus('expired')
        } else {
          setStatus('active')
        }
      } catch {
        // 오류 시 접근 허용
        setStatus('active')
      }
    }

    if (!authLoading) {
      checkSubscription()
    }
  }, [user, authLoading])

  if (authLoading || status === 'loading') {
    return null
  }

  if (status === 'expired') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
        <div className="card text-center py-16 px-8">
          <DongchimiIcon size={80} className="mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-dc-text mb-4">
            구독이 만료되었습니다
          </h2>
          <p className="text-xl text-dc-text-secondary leading-relaxed">
            선생님께 문의해주세요.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
