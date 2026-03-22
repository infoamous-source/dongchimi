import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react'
import { generateCoverLetter, type CoverLetterInput } from '@/services/gemini/careerService'

export default function AiCoverLetterPage() {
  const [form, setForm] = useState<CoverLetterInput>({
    name: '', experience: '', desiredJob: '', strengths: '', motivation: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!form.name || !form.desiredJob) return
    setLoading(true)
    try {
      const text = await generateCoverLetter(form)
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

  const update = (key: keyof CoverLetterInput, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>중장년층 프로그램</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">🤖 AI로 자기소개서 쓰기</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        정보를 입력하면 AI가 자기소개서를 작성해드려요
      </p>

      {!result ? (
        <div className="flex flex-col gap-5">
          <div>
            <label className="label">이름</label>
            <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} placeholder="홍길동" />
          </div>
          <div>
            <label className="label">경력/경험</label>
            <textarea
              className="input-field min-h-[8rem]"
              value={form.experience}
              onChange={e => update('experience', e.target.value)}
              placeholder="예: 30년간 제조업에서 관리직으로 근무"
            />
          </div>
          <div>
            <label className="label">희망 직종</label>
            <input className="input-field" value={form.desiredJob} onChange={e => update('desiredJob', e.target.value)} placeholder="예: 아파트 관리소장" />
          </div>
          <div>
            <label className="label">나의 강점</label>
            <input className="input-field" value={form.strengths} onChange={e => update('strengths', e.target.value)} placeholder="예: 성실함, 책임감, 소통 능력" />
          </div>
          <div>
            <label className="label">지원 동기</label>
            <textarea
              className="input-field min-h-[6rem]"
              value={form.motivation}
              onChange={e => update('motivation', e.target.value)}
              placeholder="예: 새로운 분야에서 경험을 살려 일하고 싶습니다"
            />
          </div>

          <button onClick={handleGenerate} className="btn-primary w-full text-xl mt-4" disabled={loading || !form.name || !form.desiredJob}>
            {loading ? '자기소개서를 작성하고 있어요...' : <><Sparkles size={24} /> AI로 자기소개서 만들기</>}
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-dc-green">작성된 자기소개서</h2>
              <button onClick={handleCopy} className="btn-secondary px-4 py-2 text-lg">
                {copied ? <><Check size={20} /> 복사됨</> : <><Copy size={20} /> 복사</>}
              </button>
            </div>
            <pre className="text-lg text-dc-text leading-relaxed whitespace-pre-wrap font-[inherit]">
              {result}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => setResult('')} className="btn-secondary w-full text-xl">다시 작성하기</button>
            <Link to="/career" className="btn-primary w-full text-xl">중장년층 프로그램로 돌아가기</Link>
          </div>
        </div>
      )}
    </div>
  )
}
