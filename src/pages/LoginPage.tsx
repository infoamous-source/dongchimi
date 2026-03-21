import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
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

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6">
        <div className="mb-6">
          <DongchimiIcon size={56} />
        </div>
        <h1 className="text-3xl font-extrabold text-dc-text mb-3">
          다시 오셨네요!
        </h1>
        <p className="text-xl text-dc-text-secondary mb-10">
          이메일과 비밀번호를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              placeholder="비밀번호를 입력해주세요"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-dc-error text-lg font-bold">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? '잠시만 기다려주세요...' : '로그인'}
          </button>
        </form>

        <p className="text-center mt-10 text-xl text-dc-text-secondary">
          아직 회원이 아니신가요?{' '}
          <Link to="/register" className="text-dc-green font-extrabold">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
