import { useState, useRef, useEffect } from 'react'
import { askTutor, type TutorMessage } from '@/services/gemini/tutorService'
import { Send, Bot, User, Loader2, RotateCcw } from 'lucide-react'
import { useMood } from '@/contexts/MoodContext'
import DongchimiMood from '@/components/brand/DongchimiVariants'
import DongchimiCharacter from '@/components/brand/DongchimiCharacter'

const quickQuestions = [
  { emoji: '☀️', text: '오늘 날씨 어때요?' },
  { emoji: '💊', text: '혈압약 먹는 시간을 알려주세요' },
  { emoji: '📱', text: '카카오톡 사진 보내는 법' },
  { emoji: '🚨', text: '보이스피싱 전화가 왔어요' },
  { emoji: '🏥', text: '가까운 병원 찾는 법' },
  { emoji: '🚌', text: '버스 시간 확인하는 법' },
]

export default function AiBiseoPage() {
  const { moodId } = useMood()
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      setMessages(prev => [...prev, {
        role: 'tutor',
        content: '죄송해요, 잠시 문제가 생겼어요. 다시 물어봐 주세요!',
        timestamp: Date.now(),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleReset = () => {
    setMessages([])
    setInput('')
  }

  // 대화 시작 전 화면
  if (messages.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in flex flex-col min-h-[calc(100vh-8rem)]">
        {/* 인사 */}
        <div className="text-center mb-8">
          {moodId ? <DongchimiMood moodId={moodId} size={130} className="mx-auto" /> : <DongchimiCharacter size="half" />}
          <h1 className="text-3xl font-extrabold text-dc-text mb-3 mt-3">AI비서</h1>
          <p className="text-xl text-dc-text-secondary leading-relaxed">
            무엇이든 물어보세요!<br />
            쉽고 친절하게 알려드려요
          </p>
        </div>

        {/* 빠른 질문 */}
        <div className="mb-8">
          <p className="text-lg text-dc-text-secondary font-bold mb-4 text-center">
            이런 것도 물어볼 수 있어요
          </p>
          <div className="flex flex-col gap-3">
            {quickQuestions.map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                className="card flex items-center gap-4 text-left hover:shadow-lg transition-shadow border-2 border-purple-100"
              >
                <span className="text-3xl">{q.emoji}</span>
                <span className="text-xl font-bold text-dc-text">{q.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 입력창 */}
        <div className="mt-auto border-t-2 border-gray-200 bg-white -mx-4 px-4 py-4">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 것을 입력해주세요..."
              className="input-field flex-1"
            />
            <button type="submit" disabled={!input.trim()} className="btn-primary px-6 shrink-0 disabled:opacity-40">
              <Send size={26} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 대화 중 화면
  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* 헤더 */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dc-green flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-dc-text">AI비서</h1>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 text-dc-text-muted text-lg font-bold px-3 py-2 rounded-xl hover:bg-gray-100">
          <RotateCcw size={20} />
          새 대화
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'tutor' ? 'bg-dc-green' : 'bg-dc-warm-dark'
              }`}>
                {msg.role === 'tutor' ? <Bot size={24} className="text-white" /> : <User size={24} className="text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-3xl px-6 py-5 ${
                msg.role === 'tutor'
                  ? 'bg-white border-2 border-dc-green-pale'
                  : 'bg-dc-green text-white'
              }`}>
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-dc-green flex items-center justify-center shrink-0">
                <Bot size={24} className="text-white" />
              </div>
              <div className="bg-white border-2 border-dc-green-pale rounded-3xl px-6 py-5">
                <div className="flex items-center gap-3">
                  <Loader2 size={24} className="text-dc-green animate-spin" />
                  <span className="text-lg text-dc-text-muted">생각하고 있어요...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력창 */}
      <div className="border-t-2 border-gray-200 bg-white px-4 py-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 것을 입력해주세요..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading} className="btn-primary px-6 shrink-0 disabled:opacity-40">
            <Send size={26} />
          </button>
        </form>
      </div>
    </div>
  )
}
