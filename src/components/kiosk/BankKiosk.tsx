import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

/* ───────── Types & Data (inline) ───────── */

type BankScreen = 'welcome' | 'serviceSelect' | 'accountVerify' | 'transaction' | 'confirm' | 'processing' | 'complete'
type ServiceType = 'queue' | 'deposit' | 'withdraw' | 'transfer'

const SCREEN_ORDER: BankScreen[] = ['welcome', 'serviceSelect', 'accountVerify', 'transaction', 'confirm', 'processing', 'complete']

const SCREEN_LABELS: Record<BankScreen, string> = {
  welcome: '시작',
  serviceSelect: '서비스 선택',
  accountVerify: '본인 확인',
  transaction: '거래 입력',
  confirm: '거래 확인',
  processing: '처리 중',
  complete: '완료',
}

const HELPER_MESSAGES: Record<BankScreen, string> = {
  welcome: '화면을 터치해서 은행 서비스를 시작하세요!',
  serviceSelect: '원하시는 서비스를 선택해주세요.',
  accountVerify: '비밀번호 6자리를 눌러주세요.',
  transaction: '금액을 입력해주세요.',
  confirm: '내용이 맞는지 확인하고 "확인"을 눌러주세요.',
  processing: '잠시만 기다려주세요. 처리 중이에요.',
  complete: '거래가 끝났어요! 잘 하셨습니다!',
}

const SERVICES: { type: ServiceType; name: string; icon: string; desc: string }[] = [
  { type: 'queue', name: '번호표 뽑기', icon: '🎫', desc: '창구 대기 번호표' },
  { type: 'deposit', name: '입금', icon: '💰', desc: '내 계좌에 입금' },
  { type: 'withdraw', name: '출금', icon: '💵', desc: '내 계좌에서 출금' },
  { type: 'transfer', name: '이체', icon: '🔄', desc: '다른 계좌로 보내기' },
]

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000, 1000000]

function formatAmount(n: number): string {
  return n.toLocaleString('ko-KR')
}

/* ───────── Component ───────── */

interface Props {
  onClose: () => void
}

export default function BankKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<BankScreen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // State
  const [service, setService] = useState<ServiceType | null>(null)
  const [pin, setPin] = useState('')
  const [amount, setAmount] = useState(0)
  const [targetAccount, setTargetAccount] = useState('')

  const queueNumber = useMemo(() => Math.floor(Math.random() * 900) + 100, [])
  const myAccount = '110-***-456789'

  const setScreen = useCallback((next: BankScreen) => {
    setFade(true)
    if (fadeRef.current) clearTimeout(fadeRef.current)
    fadeRef.current = setTimeout(() => {
      setScreenRaw(next)
      setShowHelper(true)
      setFade(false)
    }, 150)
  }, [])

  const reset = useCallback(() => {
    setService(null)
    setPin('')
    setAmount(0)
    setTargetAccount('')
    setScreen('welcome')
  }, [setScreen])

  const stepIndex = SCREEN_ORDER.indexOf(screen)
  const serviceName = service ? SERVICES.find(s => s.type === service)?.name ?? '' : ''

  /* ───── Screen: Welcome ───── */
  function WelcomeContent() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="text-6xl mb-6">🏦</div>
        <h1 className="text-3xl font-black text-[#1A365D] mb-3 text-center">동치미 은행</h1>
        <p className="text-xl text-[#2B6CB0] mb-10 text-center">안녕하세요! 환영합니다</p>
        <button
          onClick={() => setScreen('serviceSelect')}
          className="w-full bg-[#2B6CB0] text-white text-2xl font-bold py-6 rounded-2xl active:scale-95 transition-transform"
        >
          화면을 터치하세요
        </button>
      </div>
    )
  }

  /* ───── Screen: Service Select ───── */
  function ServiceSelectContent() {
    const handleSelect = (type: ServiceType) => {
      setService(type)
      if (type === 'queue') {
        // 번호표는 바로 완료로
        setScreen('processing')
      } else {
        setScreen('accountVerify')
      }
    }

    return (
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">어떤 서비스를 원하세요?</h2>
        <div className="grid grid-cols-2 gap-4">
          {SERVICES.map(s => (
            <button
              key={s.type}
              onClick={() => handleSelect(s.type)}
              className="bg-white border-2 border-[#2B6CB0]/30 rounded-2xl p-6 flex flex-col items-center gap-3 active:scale-95 active:border-[#2B6CB0] transition-all"
            >
              <span className="text-5xl">{s.icon}</span>
              <span className="text-xl font-bold text-[#1A365D]">{s.name}</span>
              <span className="text-base text-[#2B6CB0]">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* ───── Screen: Account Verify (PIN) ───── */
  function AccountVerifyContent() {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←']

    const handleDigit = (d: string) => {
      if (d === '←') {
        setPin(prev => prev.slice(0, -1))
      } else if (d && pin.length < 6) {
        const next = pin + d
        setPin(next)
        if (next.length === 6) {
          // Auto-proceed after small delay
          setTimeout(() => setScreen('transaction'), 400)
        }
      }
    }

    return (
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#1A365D] mb-2 text-center">비밀번호 입력</h2>
        <p className="text-lg text-[#2B6CB0] mb-6">비밀번호 6자리를 눌러주세요</p>

        {/* PIN dots */}
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-2xl font-bold transition-all ${
                i < pin.length
                  ? 'bg-[#2B6CB0] border-[#2B6CB0] text-white'
                  : 'bg-white border-[#2B6CB0]/30'
              }`}
              style={{ borderWidth: 3 }}
            >
              {i < pin.length ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {digits.map((d, i) => (
            <button
              key={i}
              onClick={() => d && handleDigit(d)}
              disabled={!d}
              className={`py-5 rounded-2xl text-2xl font-bold transition-all ${
                !d
                  ? 'invisible'
                  : d === '←'
                  ? 'bg-[#1A365D]/10 text-[#1A365D] active:bg-[#1A365D]/20'
                  : 'bg-white border-2 border-[#2B6CB0]/20 text-[#1A365D] active:bg-[#2B6CB0] active:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* ───── Screen: Transaction (Amount + Target) ───── */
  function TransactionContent() {
    const needsTarget = service === 'transfer'

    const handleQuickAmount = (a: number) => {
      setAmount(prev => prev + a)
    }

    const clearAmount = () => setAmount(0)

    const handleNext = () => {
      if (amount <= 0) return
      if (needsTarget && targetAccount.length < 6) return
      setScreen('confirm')
    }

    return (
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">
          {serviceName}
        </h2>

        {/* 내 계좌 */}
        <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-[#2B6CB0]/20">
          <p className="text-base text-[#2B6CB0] mb-1">내 계좌</p>
          <p className="text-xl font-bold text-[#1A365D]">{myAccount}</p>
        </div>

        {/* 이체 대상 계좌 */}
        {needsTarget && (
          <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-[#2B6CB0]/20">
            <p className="text-base text-[#2B6CB0] mb-2">받는 계좌번호</p>
            <input
              type="text"
              inputMode="numeric"
              value={targetAccount}
              onChange={e => setTargetAccount(e.target.value.replace(/[^0-9-]/g, ''))}
              placeholder="계좌번호를 입력하세요"
              className="w-full text-xl font-bold text-[#1A365D] bg-[#EBF4FF] rounded-xl px-4 py-4 outline-none border-2 border-transparent focus:border-[#2B6CB0]"
            />
          </div>
        )}

        {/* 금액 표시 */}
        <div className="bg-white rounded-2xl p-5 mb-4 border-2 border-[#2B6CB0]/20 text-center">
          <p className="text-base text-[#2B6CB0] mb-1">
            {service === 'deposit' ? '입금할 금액' : service === 'withdraw' ? '출금할 금액' : '보낼 금액'}
          </p>
          <p className="text-3xl font-black text-[#1A365D]">
            {amount > 0 ? `${formatAmount(amount)}원` : '0원'}
          </p>
        </div>

        {/* 빠른 금액 버튼 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_AMOUNTS.map(a => (
            <button
              key={a}
              onClick={() => handleQuickAmount(a)}
              className="flex-1 min-w-[30%] bg-white border-2 border-[#2B6CB0]/20 rounded-xl py-3 text-lg font-bold text-[#2B6CB0] active:bg-[#2B6CB0] active:text-white transition-all"
            >
              +{formatAmount(a)}
            </button>
          ))}
          <button
            onClick={clearAmount}
            className="flex-1 min-w-[30%] bg-[#1A365D]/10 rounded-xl py-3 text-lg font-bold text-[#1A365D] active:bg-[#1A365D]/20 transition-all"
          >
            초기화
          </button>
        </div>

        {/* 다음 */}
        <button
          onClick={handleNext}
          disabled={amount <= 0 || (needsTarget && targetAccount.length < 6)}
          className="w-full bg-[#2B6CB0] text-white text-2xl font-bold py-6 rounded-2xl active:scale-95 transition-transform disabled:opacity-40 disabled:active:scale-100"
        >
          다음
        </button>
      </div>
    )
  }

  /* ───── Screen: Confirm ───── */
  function ConfirmContent() {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">거래 확인</h2>

        <div className="bg-white rounded-2xl p-5 mb-6 border-2 border-[#2B6CB0]/20 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-[#2B6CB0]">서비스</span>
            <span className="text-xl font-bold text-[#1A365D]">{serviceName}</span>
          </div>
          <hr className="border-[#EBF4FF]" />
          <div className="flex justify-between items-center">
            <span className="text-lg text-[#2B6CB0]">내 계좌</span>
            <span className="text-lg font-bold text-[#1A365D]">{myAccount}</span>
          </div>
          {service === 'transfer' && (
            <>
              <hr className="border-[#EBF4FF]" />
              <div className="flex justify-between items-center">
                <span className="text-lg text-[#2B6CB0]">받는 계좌</span>
                <span className="text-lg font-bold text-[#1A365D]">{targetAccount}</span>
              </div>
            </>
          )}
          <hr className="border-[#EBF4FF]" />
          <div className="flex justify-between items-center">
            <span className="text-lg text-[#2B6CB0]">금액</span>
            <span className="text-2xl font-black text-[#1A365D]">{formatAmount(amount)}원</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setScreen('transaction')}
            className="flex-1 bg-[#1A365D]/10 text-[#1A365D] text-xl font-bold py-6 rounded-2xl active:scale-95 transition-transform"
          >
            이전
          </button>
          <button
            onClick={() => setScreen('processing')}
            className="flex-[2] bg-[#2B6CB0] text-white text-xl font-bold py-6 rounded-2xl active:scale-95 transition-transform"
          >
            확인
          </button>
        </div>
      </div>
    )
  }

  /* ───── Screen: Processing ───── */
  function ProcessingContent() {
    useEffect(() => {
      const timer = setTimeout(() => setScreen('complete'), 2000)
      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-20 h-20 border-4 border-[#2B6CB0]/30 border-t-[#2B6CB0] rounded-full animate-spin mb-8" />
        <p className="text-2xl font-bold text-[#1A365D] text-center">
          {service === 'queue' ? '번호표를 발급하고 있어요...' : '처리 중입니다...'}
        </p>
        <p className="text-lg text-[#2B6CB0] mt-3">잠시만 기다려주세요</p>
      </div>
    )
  }

  /* ───── Screen: Complete ───── */
  function CompleteContent() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="text-6xl mb-6">✅</div>

        {service === 'queue' ? (
          <>
            <h2 className="text-2xl font-bold text-[#1A365D] mb-2">번호표 발급 완료</h2>
            <p className="text-lg text-[#2B6CB0] mb-6">대기 번호</p>
            <div className="bg-white rounded-2xl px-12 py-8 border-2 border-[#2B6CB0]/20 mb-8">
              <p className="text-6xl font-black text-[#2B6CB0]">{queueNumber}</p>
            </div>
            <p className="text-lg text-[#1A365D] text-center">번호가 호출되면 창구로 와주세요</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1A365D] mb-2">{serviceName} 완료</h2>
            <div className="bg-white rounded-2xl p-5 w-full border-2 border-[#2B6CB0]/20 mb-8 space-y-3">
              <div className="flex justify-between">
                <span className="text-lg text-[#2B6CB0]">거래 종류</span>
                <span className="text-lg font-bold text-[#1A365D]">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-[#2B6CB0]">금액</span>
                <span className="text-xl font-black text-[#1A365D]">{formatAmount(amount)}원</span>
              </div>
              {service === 'transfer' && (
                <div className="flex justify-between">
                  <span className="text-lg text-[#2B6CB0]">받는 계좌</span>
                  <span className="text-lg font-bold text-[#1A365D]">{targetAccount}</span>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={reset}
          className="w-full bg-[#2B6CB0] text-white text-2xl font-bold py-6 rounded-2xl active:scale-95 transition-transform"
        >
          처음으로
        </button>
      </div>
    )
  }

  /* ───── Render ───── */
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#EBF4FF] rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>

        {/* 상단 바 (진행률 + 닫기) */}
        <div className="bg-[#1A365D] px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-200 text-base font-bold">{SCREEN_LABELS[screen]}</span>
              <span className="text-blue-400 text-base">{stepIndex + 1}/{SCREEN_ORDER.length}</span>
            </div>
            <div className="h-2 bg-[#1A365D]/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-300 rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / SCREEN_ORDER.length) * 100}%` }}
              />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#2B6CB0] flex items-center justify-center">
            <X size={20} className="text-blue-200" />
          </button>
        </div>

        {/* 도우미 말풍선 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 border-blue-200 rounded-2xl px-4 py-3 flex-1">
              <p className="text-lg text-[#1A365D] font-bold">{HELPER_MESSAGES[screen]}</p>
            </div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0 mt-1">
              <X size={14} className="text-[#1A365D]" />
            </button>
          </div>
        )}
        {!showHelper && (
          <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-blue-200 rounded-full p-2">
            <MessageCircle size={18} className="text-[#1A365D]" />
          </button>
        )}

        {/* 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>
          {screen === 'welcome' && <WelcomeContent />}
          {screen === 'serviceSelect' && <ServiceSelectContent />}
          {screen === 'accountVerify' && <AccountVerifyContent />}
          {screen === 'transaction' && <TransactionContent />}
          {screen === 'confirm' && <ConfirmContent />}
          {screen === 'processing' && <ProcessingContent />}
          {screen === 'complete' && <CompleteContent />}
        </div>
      </div>
    </div>
  )
}
