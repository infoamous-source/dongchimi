import { useState, useRef, useEffect } from 'react'
import { askTutor, type TutorMessage } from '@/services/gemini/tutorService'
import { Send, Bot, User, Loader2, RotateCcw, Check, Key } from 'lucide-react'
import { useMood } from '@/contexts/MoodContext'
import { useAuth } from '@/contexts/AuthContext'
import { isGeminiEnabled, setStoredApiKey, clearStoredApiKey } from '@/services/gemini/geminiClient'
import { supabase } from '@/lib/supabase'
import DongchimiMood from '@/components/brand/DongchimiVariants'
import DongchimiCharacter from '@/components/brand/DongchimiCharacter'

export default function AiBiseoPage() {
  const { moodId } = useMood()
  const { user } = useAuth()
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isRegistered, setIsRegistered] = useState(isGeminiEnabled())
  const [showKeyInput, setShowKeyInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setIsRegistered(isGeminiEnabled())
  }, [])

  const handleRegisterKey = async () => {
    if (!apiKey.trim()) return
    setStoredApiKey(apiKey.trim())
    // Supabase에도 저장
    if (user) {
      await supabase.from('dc_profiles').update({ gemini_api_key: apiKey.trim() }).eq('id', user.id)
    }
    setIsRegistered(true)
    setApiKey('')
    setShowKeyInput(false)
  }

  const handleRemoveKey = async () => {
    clearStoredApiKey()
    if (user) {
      await supabase.from('dc_profiles').update({ gemini_api_key: null }).eq('id', user.id)
    }
    setIsRegistered(false)
    setMessages([])
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: TutorMessage = { role: 'user', content: text.trim(), timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const response = await askTutor(text.trim(), undefined, updated)
      setMessages(prev => [...prev, { role: 'tutor', content: response, timestamp: Date.now() }])
    } catch {
      setMessages(prev => [...prev, { role: 'tutor', content: '잠시 문제가 생겼어요. 다시 물어봐 주세요!', timestamp: Date.now() }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleReset = () => { setMessages([]); setInput('') }

  const quickQuestions = ['오늘 날씨 어때요?', '카카오톡 사진 보내는 법', '보이스피싱 전화가 왔어요', '가까운 병원 찾는 법']

  // ===== API 미등록 화면 =====
  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          {moodId ? <DongchimiMood moodId={moodId} size={130} className="mx-auto" /> : <DongchimiCharacter size="half" />}
          <h1 className="text-3xl font-extrabold text-dc-text mt-4 mb-2">AI비서</h1>
        </div>

        <div className="card-highlight text-center py-10">
          <Key size={48} className="mx-auto text-dc-green mb-4" />
          <h2 className="text-2xl font-extrabold text-dc-text mb-6">API 등록</h2>

          <div className="max-w-sm mx-auto">
            <input
              type="text"
              className="input-field mb-4"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="API 키를 입력해주세요"
              onKeyDown={e => e.key === 'Enter' && handleRegisterKey()}
            />
            <button
              onClick={handleRegisterKey}
              disabled={!apiKey.trim()}
              className="btn-primary w-full text-xl disabled:opacity-40"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== API 등록 완료 + 대화 시작 전 =====
  if (messages.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="text-center mb-8">
          {moodId ? <DongchimiMood moodId={moodId} size={130} className="mx-auto" /> : <DongchimiCharacter size="half" />}
          <h1 className="text-3xl font-extrabold text-dc-text mb-2 mt-3">AI비서</h1>

          {/* 등록완료 배지 */}
          <div className="inline-flex items-center gap-2 bg-dc-green-bg border-2 border-dc-green-pale rounded-full px-5 py-2 mt-2">
            <Check size={20} className="text-dc-green" />
            <span className="text-lg font-bold text-dc-green">API 등록완료</span>
          </div>

          <p className="text-xl text-dc-text-secondary mt-4">무엇이든 물어보세요!</p>

          {/* 키 변경/삭제 */}
          {!showKeyInput ? (
            <button onClick={() => setShowKeyInput(true)} className="text-base text-dc-text-muted mt-3 underline">
              API 키 변경
            </button>
          ) : (
            <div className="max-w-sm mx-auto mt-4 flex gap-2">
              <input type="text" className="input-field flex-1 text-base" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="새 API 키" />
              <button onClick={handleRegisterKey} disabled={!apiKey.trim()} className="btn-primary px-4 text-base disabled:opacity-40">변경</button>
              <button onClick={handleRemoveKey} className="px-4 py-2 bg-red-100 text-dc-error rounded-xl text-base font-bold">삭제</button>
            </div>
          )}
        </div>

        {/* 빠른 질문 */}
        <div className="mb-8">
          <p className="text-lg text-dc-text-secondary font-bold mb-4 text-center">이런 것도 물어볼 수 있어요</p>
          <div className="flex flex-col gap-3">
            {quickQuestions.map(q => (
              <button key={q} onClick={() => sendMessage(q)} className="card flex items-center gap-4 text-left hover:shadow-lg transition-shadow border-2 border-purple-100">
                <span className="text-xl font-bold text-dc-text">{q}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t-2 border-gray-200 bg-white -mx-4 px-4 py-4">
          <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="궁금한 것을 입력해주세요..." className="input-field flex-1" />
            <button type="submit" disabled={!input.trim()} className="btn-primary px-6 shrink-0 disabled:opacity-40"><Send size={26} /></button>
          </form>
        </div>
      </div>
    )
  }

  // ===== 대화 중 =====
  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dc-green flex items-center justify-center"><Bot size={22} className="text-white" /></div>
          <h1 className="text-xl font-extrabold text-dc-text">AI비서</h1>
          <span className="bg-dc-green-bg text-dc-green text-base font-bold px-3 py-1 rounded-full">등록완료</span>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 text-dc-text-muted text-lg font-bold px-3 py-2 rounded-xl hover:bg-gray-100">
          <RotateCcw size={20} /> 새 대화
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'tutor' ? 'bg-dc-green' : 'bg-dc-warm-dark'}`}>
                {msg.role === 'tutor' ? <Bot size={24} className="text-white" /> : <User size={24} className="text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-3xl px-6 py-5 ${msg.role === 'tutor' ? 'bg-white border-2 border-dc-green-pale' : 'bg-dc-green text-white'}`}>
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-dc-green flex items-center justify-center shrink-0"><Bot size={24} className="text-white" /></div>
              <div className="bg-white border-2 border-dc-green-pale rounded-3xl px-6 py-5">
                <div className="flex items-center gap-3"><Loader2 size={24} className="text-dc-green animate-spin" /><span className="text-lg text-dc-text-muted">생각하고 있어요...</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t-2 border-gray-200 bg-white px-4 py-4">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="궁금한 것을 입력해주세요..." className="input-field flex-1" disabled={loading} />
          <button type="submit" disabled={!input.trim() || loading} className="btn-primary px-6 shrink-0 disabled:opacity-40"><Send size={26} /></button>
        </form>
      </div>
    </div>
  )
}
