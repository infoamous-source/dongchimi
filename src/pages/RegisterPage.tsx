import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [orgCode, setOrgCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ email, password, name, phone: phone || undefined, orgCode: orgCode || undefined })
      navigate('/')
    } catch {
      setError('회원가입 중 문제가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dc-cream flex flex-col">
      <div className="px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary text-lg font-bold">
          <ArrowLeft size={24} />
          <span>뒤로가기</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6 pb-8">
        <div className="mb-6">
          <DongchimiIcon size={56} />
        </div>
        <h1 className="text-3xl font-extrabold text-dc-text mb-3">
          동치미에 오신 걸 환영합니다
        </h1>
        <p className="text-xl text-dc-text-secondary mb-10">
          간단한 정보만 입력하면 바로 시작할 수 있어요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          <div>
            <label className="label">
              기관코드
              <span className="text-dc-text-muted font-normal ml-2">(선택)</span>
            </label>
            <input
              type="text"
              className="input-field"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
              placeholder="선생님이 알려준 코드"
              maxLength={6}
            />
          </div>

          {error && (
            <p className="text-dc-error text-lg font-bold">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? '잠시만 기다려주세요...' : '회원가입'}
          </button>
        </form>

        <p className="text-center mt-8 text-xl text-dc-text-secondary">
          이미 회원이신가요?{' '}
          <Link to="/login" className="text-dc-green font-extrabold">
            로그인
          </Link>
        </p>

        <Link to="/register/instructor" className="block text-center mt-4 text-xl text-dc-info font-extrabold">
          강사이신가요? 강사 가입하기
        </Link>
      </div>
    </div>
  )
}
