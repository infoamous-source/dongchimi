import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function RegisterInstructorPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code.trim()) {
      setError('강사 인증코드를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      // 1. 인증코드 확인
      const { data: codeData } = await supabase
        .from('dc_instructor_codes')
        .select('*')
        .eq('code', code.trim())
        .eq('used', false)
        .single()

      if (!codeData) {
        setError('인증코드가 올바르지 않거나 이미 사용된 코드예요')
        setLoading(false)
        return
      }

      // 2. 회원가입 (instructor role)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone: phone || undefined,
            role: 'instructor',
          },
        },
      })

      if (authError) {
        setError('회원가입 중 문제가 발생했어요. 다시 시도해주세요.')
        setLoading(false)
        return
      }

      // 3. 프로필 role 업데이트 + 인증코드 사용 처리
      if (authData.user) {
        await supabase
          .from('dc_profiles')
          .update({ role: 'instructor' })
          .eq('id', authData.user.id)

        await supabase
          .from('dc_instructor_codes')
          .update({ used: true, used_by: authData.user.id })
          .eq('id', codeData.id)
      }

      navigate('/')
    } catch {
      setError('회원가입 중 문제가 발생했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dc-cream flex flex-col">
      <div className="px-4 py-4">
        <Link to="/register" className="inline-flex items-center gap-2 text-dc-text-secondary text-lg font-bold">
          <ArrowLeft size={24} />
          <span>뒤로가기</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6 pb-8">
        <div className="mb-6">
          <DongchimiIcon size={56} />
        </div>
        <h1 className="text-3xl font-extrabold text-dc-text mb-3">
          강사 회원가입
        </h1>
        <p className="text-xl text-dc-text-secondary mb-10">
          발급받은 인증코드를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="label">강사 인증코드</label>
            <input
              type="text"
              className="input-field border-dc-green border-2 bg-dc-green-bg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="발급받은 코드 입력"
              required
            />
            <p className="text-lg text-dc-text-muted mt-2">관리자에게 받은 코드를 입력하세요</p>
          </div>

          <div>
            <label className="label">이름</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          <div>
            <label className="label">이메일</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">비밀번호</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 입력해주세요"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="label">
              전화번호
              <span className="text-dc-text-muted font-normal ml-2">(선택)</span>
            </label>
            <input
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              autoComplete="tel"
            />
          </div>

          {error && (
            <p className="text-dc-error text-lg font-bold">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? '잠시만 기다려주세요...' : '강사 가입하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
