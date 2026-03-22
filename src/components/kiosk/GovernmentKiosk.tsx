import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import confetti from 'canvas-confetti'

/* ─── 타입 ─── */
type Screen = 'welcome' | 'identity' | 'documentSelect' | 'options' | 'confirm' | 'payment' | 'processing' | 'complete'

interface Document {
  id: string
  name: string
  icon: string
  price: number
}

/* ─── 데이터 ─── */
const SCREEN_ORDER: Screen[] = ['welcome', 'identity', 'documentSelect', 'options', 'confirm', 'payment', 'processing', 'complete']

const SCREEN_LABELS: Record<Screen, string> = {
  welcome: '시작',
  identity: '본인 확인',
  documentSelect: '서류 선택',
  options: '용도 선택',
  confirm: '발급 확인',
  payment: '결제',
  processing: '발급 중',
  complete: '발급 완료',
}

const HELPER_MESSAGES: Record<Screen, string> = {
  welcome: '안녕하세요! 서류 발급을 도와드릴게요.',
  identity: '본인 확인을 위해 주민번호를 입력하세요.',
  documentSelect: '필요한 서류를 선택하세요.',
  options: '서류 용도를 선택하세요.',
  confirm: '발급 내용을 확인해주세요.',
  payment: '결제 방법을 선택하세요.',
  processing: '서류를 발급하고 있어요.',
  complete: '서류가 발급되었어요!',
}

const DOCUMENTS: Document[] = [
  { id: 'resident-copy', name: '주민등록등본', icon: '📋', price: 400 },
  { id: 'resident-abstract', name: '주민등록초본', icon: '📄', price: 400 },
  { id: 'family-relation', name: '가족관계증명서', icon: '👨‍👩‍👧‍👦', price: 1000 },
  { id: 'basic-cert', name: '기본증명서', icon: '📑', price: 1000 },
  { id: 'tax-cert', name: '납세증명서', icon: '🧾', price: 0 },
  { id: 'health-insurance', name: '건강보험자격확인서', icon: '🏥', price: 0 },
]

const PURPOSES = ['일반', '금융기관 제출용', '관공서 제출용']

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR')
}

/* ─── 컴포넌트 ─── */
interface Props {
  onClose: () => void
}

export default function GovernmentKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [idFront, setIdFront] = useState('')
  const [idBack, setIdBack] = useState('')
  const [idPhase, setIdPhase] = useState<'front' | 'back'>('front')
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)

  const issueNumber = useMemo(() => `${new Date().getFullYear()}${String(Math.floor(Math.random() * 900000) + 100000)}`, [])

  const setScreen = useCallback((next: Screen) => {
    setFade(true)
    if (fadeRef.current) clearTimeout(fadeRef.current)
    fadeRef.current = setTimeout(() => {
      setScreenRaw(next)
      setShowHelper(true)
      setFade(false)
    }, 150)
  }, [])

  const stepIndex = SCREEN_ORDER.indexOf(screen)

  const currentId = idPhase === 'front' ? idFront : idBack
  const setCurrentId = idPhase === 'front' ? setIdFront : setIdBack
  const maxLen = idPhase === 'front' ? 6 : 7

  const handleNumpad = (n: string) => {
    if (currentId.length < maxLen) {
      setCurrentId(prev => prev + n)
    }
  }

  const handleDelete = () => {
    setCurrentId(prev => prev.slice(0, -1))
  }

  const handleIdConfirm = () => {
    if (idPhase === 'front' && idFront.length === 6) {
      setIdPhase('back')
    } else if (idPhase === 'back' && idBack.length === 7) {
      setScreen('documentSelect')
    }
  }

  /* ─── 화면들 ─── */

  const WelcomeView = (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <div className="text-6xl mb-6">🏛️</div>
      <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#1E293B' }}>무인 민원 발급기</h1>
      <p className="text-xl mb-10 leading-relaxed" style={{ color: '#475569' }}>
        화면을 터치해서<br />서류 발급을 시작하세요
      </p>
      <button
        onClick={() => setScreen('identity')}
        className="w-full max-w-xs py-6 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
        style={{ backgroundColor: '#1E293B' }}
      >
        서류 발급하기
      </button>
    </div>
  )

  const IdentityView = (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>본인 확인</h2>
      <p className="text-lg mb-6" style={{ color: '#475569' }}>
        {idPhase === 'front' ? '주민번호 앞자리 6자리를 입력하세요' : '주민번호 뒷자리 7자리를 입력하세요'}
      </p>

      <div className="w-full max-w-xs mb-5">
        <div className="flex items-center justify-center gap-2 mb-5">
          {/* 앞자리 */}
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`f${i}`}
                className="w-8 h-11 border-2 rounded-lg flex items-center justify-center text-xl font-extrabold"
                style={{
                  borderColor: idPhase === 'front' && i < idFront.length ? '#334155' : '#CBD5E1',
                  color: '#1E293B',
                  backgroundColor: idPhase === 'back' ? '#F1F5F9' : 'white',
                }}
              >
                {i < idFront.length ? (idPhase === 'back' ? '●' : idFront[i]) : ''}
              </div>
            ))}
          </div>
          <span className="text-2xl font-extrabold" style={{ color: '#1E293B' }}>-</span>
          {/* 뒷자리 */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={`b${i}`}
                className="w-8 h-11 border-2 rounded-lg flex items-center justify-center text-xl font-extrabold"
                style={{
                  borderColor: idPhase === 'back' && i < idBack.length ? '#334155' : '#CBD5E1',
                  color: '#1E293B',
                  backgroundColor: idPhase === 'front' ? '#F1F5F9' : 'white',
                }}
              >
                {i < idBack.length ? '●' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => handleNumpad(String(n))}
              className="py-4 bg-white border-2 rounded-2xl text-2xl font-extrabold active:scale-95 transition-transform"
              style={{ borderColor: '#CBD5E1', color: '#1E293B' }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="py-4 bg-gray-200 rounded-2xl text-xl font-extrabold text-gray-600 active:scale-95 transition-transform"
          >
            지움
          </button>
          <button
            onClick={() => handleNumpad('0')}
            className="py-4 bg-white border-2 rounded-2xl text-2xl font-extrabold active:scale-95 transition-transform"
            style={{ borderColor: '#CBD5E1', color: '#1E293B' }}
          >
            0
          </button>
          <button
            onClick={handleIdConfirm}
            className="py-4 rounded-2xl text-xl font-extrabold text-white active:scale-95 transition-transform"
            style={{ backgroundColor: currentId.length === maxLen ? '#334155' : '#CBD5E1' }}
          >
            {idPhase === 'front' ? '다음' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )

  const DocumentSelectView = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#F1F5F9' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#1E293B' }}>서류를 선택하세요</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          {DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              onClick={() => { setSelectedDoc(doc); setScreen('options') }}
              className="flex items-center gap-4 px-5 py-5 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
              style={{ borderColor: '#E2E8F0' }}
            >
              <span className="text-3xl">{doc.icon}</span>
              <div className="flex-1 text-left">
                <span className="text-xl font-extrabold block" style={{ color: '#1E293B' }}>{doc.name}</span>
              </div>
              <span className="text-xl font-extrabold" style={{ color: doc.price === 0 ? '#16A34A' : '#334155' }}>
                {doc.price === 0 ? '무료' : `${formatPrice(doc.price)}원`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const OptionsView = (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>용도를 선택하세요</h2>
      <p className="text-lg mb-8" style={{ color: '#475569' }}>
        {selectedDoc?.icon} {selectedDoc?.name}
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {PURPOSES.map(purpose => (
          <button
            key={purpose}
            onClick={() => { setSelectedPurpose(purpose); setScreen('confirm') }}
            className="flex items-center gap-5 px-6 py-6 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
            style={{ borderColor: '#E2E8F0' }}
          >
            <span className="text-3xl">📌</span>
            <span className="text-xl font-extrabold" style={{ color: '#1E293B' }}>{purpose}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => { setSelectedDoc(null); setScreen('documentSelect') }}
        className="mt-6 w-full max-w-xs py-4 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold"
      >
        뒤로
      </button>
    </div>
  )

  const ConfirmView = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#F1F5F9' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#1E293B' }}>발급 내용 확인</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-5">
          {[
            { label: '서류', value: selectedDoc ? `${selectedDoc.icon} ${selectedDoc.name}` : '' },
            { label: '용도', value: selectedPurpose || '' },
            { label: '수수료', value: selectedDoc ? (selectedDoc.price === 0 ? '무료' : `${formatPrice(selectedDoc.price)}원`) : '' },
            { label: '본인 확인', value: '✅ 완료' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-lg" style={{ color: '#475569' }}>{item.label}</span>
              <span className="text-xl font-extrabold" style={{ color: '#1E293B' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t-2" style={{ borderColor: '#E2E8F0', backgroundColor: '#F1F5F9' }}>
        <div className="flex gap-3">
          <button
            onClick={() => { setSelectedPurpose(null); setScreen('options') }}
            className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold"
          >
            뒤로
          </button>
          <button
            onClick={() => {
              if (selectedDoc && selectedDoc.price === 0) {
                setScreen('processing')
              } else {
                setScreen('payment')
              }
            }}
            className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform"
            style={{ backgroundColor: '#1E293B' }}
          >
            {selectedDoc && selectedDoc.price === 0 ? '발급하기' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  )

  const PaymentView = (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>결제 방법을 선택하세요</h2>
      <p className="text-xl mb-8" style={{ color: '#475569' }}>
        수수료: {selectedDoc ? formatPrice(selectedDoc.price) : 0}원
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {[
          { id: 'card', icon: '💳', name: '카드 결제' },
          { id: 'coin', icon: '🪙', name: '동전 투입' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setScreen('processing')}
            className="flex items-center gap-5 px-6 py-6 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
            style={{ borderColor: '#E2E8F0' }}
          >
            <span className="text-4xl">{m.icon}</span>
            <span className="text-xl font-extrabold" style={{ color: '#1E293B' }}>{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const ProcessingView = () => {
    useEffect(() => {
      const timer = setTimeout(() => setScreen('complete'), 2500)
      return () => clearTimeout(timer)
    }, [])
    return (
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#E2E8F0', borderTopColor: '#1E293B' }} />
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>서류를 발급하고 있어요</h2>
        <p className="text-xl" style={{ color: '#475569' }}>잠시만 기다려주세요...</p>
      </div>
    )
  }

  const CompleteView = () => {
    useEffect(() => {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
    }, [])
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#1E293B' }}>발급 완료!</h2>
        <p className="text-xl mb-2" style={{ color: '#475569' }}>
          {selectedDoc?.name}
        </p>

        <div className="border-2 rounded-2xl px-10 py-6 my-6" style={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }}>
          <p className="text-lg" style={{ color: '#475569' }}>발급번호</p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: '#1E293B' }}>{issueNumber}</p>
        </div>

        <p className="text-lg mb-2" style={{ color: '#475569' }}>
          📄 아래에서 서류를 가져가세요
        </p>
        <p className="text-xl mb-8" style={{ color: '#475569' }}>
          잘 하셨어요! 실제 무인발급기에서도<br />이렇게 하시면 돼요!
        </p>

        <button
          onClick={onClose}
          className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          연습 끝내기
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', backgroundColor: '#F8FAFC' }}>

        {/* 상단 바 */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#1E293B' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold" style={{ color: '#CBD5E1' }}>{SCREEN_LABELS[screen]}</span>
              <span className="text-base" style={{ color: '#94A3B8' }}>{stepIndex + 1}/{SCREEN_ORDER.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / SCREEN_ORDER.length) * 100}%`, backgroundColor: '#94A3B8' }}
              />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
            <X size={20} style={{ color: '#CBD5E1' }} />
          </button>
        </div>

        {/* 도우미 말풍선 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 rounded-2xl px-4 py-3 flex-1" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-lg font-bold" style={{ color: '#1E293B' }}>{HELPER_MESSAGES[screen]}</p>
            </div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: '#E2E8F0' }}>
              <X size={14} style={{ color: '#334155' }} />
            </button>
          </div>
        )}
        {!showHelper && (
          <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start rounded-full p-2" style={{ backgroundColor: '#E2E8F0' }}>
            <MessageCircle size={18} style={{ color: '#334155' }} />
          </button>
        )}

        {/* 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>
          {screen === 'welcome' && WelcomeView}
          {screen === 'identity' && IdentityView}
          {screen === 'documentSelect' && DocumentSelectView}
          {screen === 'options' && OptionsView}
          {screen === 'confirm' && ConfirmView}
          {screen === 'payment' && PaymentView}
          {screen === 'processing' && <ProcessingView />}
          {screen === 'complete' && <CompleteView />}
        </div>
      </div>
    </div>
  )
}
