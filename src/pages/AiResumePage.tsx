import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react'
import { generateResume, type ResumeInput } from '@/services/gemini/careerService'

export default function AiResumePage() {
  const [form, setForm] = useState<ResumeInput>({
    name: '', birthYear: '', experience: '', skills: '', desiredJob: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!form.name || !form.desiredJob) return
    setLoading(true)
    try {
      const text = await generateResume(form)
      setResult(text)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const update = (key: keyof ResumeInput, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>중장년층 프로그램</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">🤖 AI로 이력서 쓰기</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        정보를 입력하면 AI가 이력서를 작성해드려요
      </p>

      {!result ? (
        <div className="flex flex-col gap-5">
          <div>
            <label className="label">이름</label>
            <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} placeholder="홍길동" />
          </div>
          <div>
            <label className="label">출생연도</label>
            <input className="input-field" value={form.birthYear} onChange={e => update('birthYear', e.target.value)} placeholder="1960" />
          </div>
          <div>
            <label className="label">경력/경험</label>
            <textarea
              className="input-field min-h-[8rem]"
              value={form.experience}
              onChange={e => update('experience', e.target.value)}
              placeholder="예: 30년간 제조업 근무, 관리직 경험"
            />
          </div>
          <div>
            <label className="label">보유 기술/자격증</label>
            <input className="input-field" value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="예: 운전면허, 컴퓨터 활용능력" />
          </div>
          <div>
            <label className="label">희망 직종</label>
            <input className="input-field" value={form.desiredJob} onChange={e => update('desiredJob', e.target.value)} placeholder="예: 건물 관리, 경비, 사무보조" />
          </div>

          <button onClick={handleGenerate} className="btn-primary w-full text-xl mt-4" disabled={loading || !form.name || !form.desiredJob}>
            {loading ? (
              '이력서를 작성하고 있어요...'
            ) : (
              <><Sparkles size={24} /> AI로 이력서 만들기</>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-dc-green">작성된 이력서</h2>
              <button onClick={handleCopy} className="btn-secondary px-4 py-2 text-lg">
                {copied ? <><Check size={20} /> 복사됨</> : <><Copy size={20} /> 복사</>}
              </button>
            </div>
            <pre className="text-lg text-dc-text leading-relaxed whitespace-pre-wrap font-[inherit]">
              {result}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => setResult('')} className="btn-secondary w-full text-xl">
              다시 작성하기
            </button>
            <Link to="/career" className="btn-primary w-full text-xl">
              중장년층 프로그램로 돌아가기
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
