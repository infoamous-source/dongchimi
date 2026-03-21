import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { askTutor, type TutorMessage } from '@/services/gemini/tutorService'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { getLessonById } from '@/data/courses'

export default function AiTutorPage() {
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const courseContext = lessonId ? getLessonById(lessonId) : null

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: 'tutor',
      content: courseContext
        ? `안녕하세요! "${courseContext.lesson.title}" 수업에 대해 궁금한 것이 있으시면 편하게 물어보세요.`
        : '안녕하세요! 저는 동치미 AI 도우미예요. 스마트폰이나 디지털에 대해 궁금한 것이 있으시면 편하게 물어보세요!',
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: TutorMessage = { role: 'user', content: trimmed, timestamp: Date.now() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await askTutor(
        trimmed,
        courseContext ? { lessonTitle: courseContext.lesson.title, courseTitle: courseContext.course.title } : undefined,
        [...messages, userMessage]
      )
      setMessages(prev => [...prev, { role: 'tutor', content: response, timestamp: Date.now() }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'tutor',
        content: '죄송해요, 잠시 문제가 생겼어요. 다시 한번 물어봐 주세요!',
        timestamp: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    '💬 카카오톡이 뭐예요?',
    '📶 와이파이 연결하는 법',
    '🔒 비밀번호 안전하게 만들기',
    '🚨 보이스피싱 구별하는 법',
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="px-4 py-5">
        <h1 className="text-3xl font-extrabold text-dc-text">AI 도우미</h1>
        <p className="text-lg text-dc-text-secondary mt-1">궁금한 것을 편하게 물어보세요</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'tutor' ? 'bg-dc-green' : 'bg-dc-warm-dark'
              }`}>
                {msg.role === 'tutor' ? <Bot size={28} className="text-white" /> : <User size={28} className="text-white" />}
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
              <div className="w-14 h-14 rounded-full bg-dc-green flex items-center justify-center shrink-0">
                <Bot size={28} className="text-white" />
              </div>
              <div className="bg-white border-2 border-dc-green-pale rounded-3xl px-6 py-5">
                <Loader2 size={28} className="text-dc-green animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="mt-8">
            <p className="text-lg text-dc-text-secondary font-bold mb-4">이런 것도 물어볼 수 있어요:</p>
            <div className="flex flex-col gap-3">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q.slice(2).trim())}
                  className="bg-white border-2 border-dc-green-pale text-dc-green rounded-2xl px-6 py-4 text-xl font-bold text-left hover:bg-dc-green-bg transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t-2 border-gray-200 bg-white px-4 py-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 것을 입력해주세요..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-6 shrink-0 disabled:opacity-40"
          >
            <Send size={26} />
          </button>
        </form>
      </div>
    </div>
  )
}
