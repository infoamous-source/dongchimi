import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import confetti from 'canvas-confetti'

/* ─── 타입 ─── */
type Screen = 'welcome' | 'visitType' | 'department' | 'doctor' | 'identity' | 'confirm' | 'processing' | 'complete'

interface Doctor {
  name: string
  schedule: string
}

interface Department {
  id: string
  name: string
  icon: string
  doctors: Doctor[]
}

/* ─── 데이터 ─── */
const SCREEN_ORDER: Screen[] = ['welcome', 'visitType', 'department', 'doctor', 'identity', 'confirm', 'processing', 'complete']

const SCREEN_LABELS: Record<Screen, string> = {
  welcome: '시작',
  visitType: '방문 유형',
  department: '진료과 선택',
  doctor: '의사 선택',
  identity: '본인 확인',
  confirm: '접수 확인',
  processing: '접수 중',
  complete: '접수 완료',
}

const HELPER_MESSAGES: Record<Screen, string> = {
  welcome: '안녕하세요! 병원 접수를 도와드릴게요.',
  visitType: '처음 오셨나요? 아니면 다시 오셨나요?',
  department: '어느 진료과에서 진료 받으실 건가요?',
  doctor: '원하시는 의사 선생님을 선택하세요.',
  identity: '본인 확인을 위해 주민번호 뒷자리를 입력해주세요.',
  confirm: '접수 내용을 확인해주세요.',
  processing: '접수를 진행하고 있어요.',
  complete: '접수가 완료되었어요!',
}

const DEPARTMENTS: Department[] = [
  { id: 'internal', name: '내과', icon: '🫀', doctors: [{ name: '김영수', schedule: '오전·오후' }, { name: '이정민', schedule: '오전' }] },
  { id: 'ortho', name: '정형외과', icon: '🦴', doctors: [{ name: '박상훈', schedule: '오전·오후' }, { name: '김태희', schedule: '오후' }] },
  { id: 'derma', name: '피부과', icon: '🧴', doctors: [{ name: '이수진', schedule: '오전·오후' }, { name: '박미영', schedule: '오전' }] },
  { id: 'ent', name: '이비인후과', icon: '👂', doctors: [{ name: '김준호', schedule: '오전' }, { name: '이하나', schedule: '오전·오후' }] },
  { id: 'eye', name: '안과', icon: '👁️', doctors: [{ name: '박지훈', schedule: '오전·오후' }, { name: '김소연', schedule: '오후' }] },
  { id: 'dental', name: '치과', icon: '🦷', doctors: [{ name: '이동혁', schedule: '오전·오후' }, { name: '박서연', schedule: '오전' }] },
]

/* ─── 컴포넌트 ─── */
interface Props {
  onClose: () => void
}

export default function HospitalKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [visitType, setVisitType] = useState<'초진' | '재진' | null>(null)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [idInput, setIdInput] = useState('')

  const ticketNumber = useMemo(() => Math.floor(Math.random() * 900) + 100, [])

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

  /* ─── 화면들 ─── */

  const WelcomeView = (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <div className="text-6xl mb-6">🏥</div>
      <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#0D7377' }}>동치미 병원</h1>
      <p className="text-xl mb-10 leading-relaxed" style={{ color: '#14919B' }}>
        화면을 터치해서<br />접수를 시작하세요
      </p>
      <button
        onClick={() => setScreen('visitType')}
        className="w-full max-w-xs py-6 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
        style={{ backgroundColor: '#0D7377' }}
      >
        접수하기
      </button>
    </div>
  )

  const VisitTypeView = (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-8" style={{ color: '#0D7377' }}>방문 유형을 선택하세요</h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {[
          { type: '초진' as const, icon: '🆕', desc: '처음 방문' },
          { type: '재진' as const, icon: '🔄', desc: '다시 방문' },
        ].map(v => (
          <button
            key={v.type}
            onClick={() => { setVisitType(v.type); setScreen('department') }}
            className="flex items-center gap-5 px-6 py-6 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
            style={{ borderColor: '#B2DFDB' }}
          >
            <span className="text-4xl">{v.icon}</span>
            <div className="text-left">
              <span className="text-xl font-extrabold block" style={{ color: '#0D7377' }}>{v.type}</span>
              <span className="text-lg" style={{ color: '#14919B' }}>{v.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const DepartmentView = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#B2DFDB', backgroundColor: '#E0F2F1' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#0D7377' }}>진료과를 선택하세요</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => { setSelectedDept(dept); setScreen('doctor') }}
              className="flex flex-col items-center gap-2 px-4 py-5 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
              style={{ borderColor: '#B2DFDB' }}
            >
              <span className="text-4xl">{dept.icon}</span>
              <span className="text-xl font-extrabold" style={{ color: '#0D7377' }}>{dept.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const DoctorView = selectedDept && (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#B2DFDB', backgroundColor: '#E0F2F1' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#0D7377' }}>{selectedDept.icon} {selectedDept.name}</h2>
        <p className="text-lg" style={{ color: '#14919B' }}>의사 선생님을 선택하세요</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-4">
          {selectedDept.doctors.map(doc => (
            <button
              key={doc.name}
              onClick={() => { setSelectedDoctor(doc); setScreen('identity') }}
              className="flex items-center gap-5 px-6 py-6 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
              style={{ borderColor: '#B2DFDB' }}
            >
              <span className="text-4xl">👨‍⚕️</span>
              <div className="text-left">
                <span className="text-xl font-extrabold block" style={{ color: '#0D7377' }}>{doc.name} 선생님</span>
                <span className="text-lg" style={{ color: '#14919B' }}>진료시간: {doc.schedule}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: '#B2DFDB' }}>
        <button
          onClick={() => { setSelectedDept(null); setScreen('department') }}
          className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold"
        >
          뒤로
        </button>
      </div>
    </div>
  )

  const IdentityView = (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#0D7377' }}>본인 확인</h2>
      <p className="text-lg mb-8" style={{ color: '#14919B' }}>주민번호 뒷자리 7자리를 입력하세요</p>

      <div className="w-full max-w-xs mb-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl font-extrabold" style={{ color: '#0D7377' }}>●●●●●●-</span>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-12 border-2 rounded-xl flex items-center justify-center text-2xl font-extrabold"
                style={{ borderColor: i < idInput.length ? '#14919B' : '#B2DFDB', color: '#0D7377' }}
              >
                {i < idInput.length ? '●' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => idInput.length < 7 && setIdInput(prev => prev + n)}
              className="py-4 bg-white border-2 rounded-2xl text-2xl font-extrabold active:scale-95 transition-transform"
              style={{ borderColor: '#B2DFDB', color: '#0D7377' }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setIdInput(prev => prev.slice(0, -1))}
            className="py-4 bg-gray-200 rounded-2xl text-xl font-extrabold text-gray-600 active:scale-95 transition-transform"
          >
            지움
          </button>
          <button
            onClick={() => idInput.length < 7 && setIdInput(prev => prev + '0')}
            className="py-4 bg-white border-2 rounded-2xl text-2xl font-extrabold active:scale-95 transition-transform"
            style={{ borderColor: '#B2DFDB', color: '#0D7377' }}
          >
            0
          </button>
          <button
            onClick={() => idInput.length === 7 && setScreen('confirm')}
            className="py-4 rounded-2xl text-xl font-extrabold text-white active:scale-95 transition-transform"
            style={{ backgroundColor: idInput.length === 7 ? '#14919B' : '#B2DFDB' }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )

  const ConfirmView = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#B2DFDB', backgroundColor: '#E0F2F1' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#0D7377' }}>접수 내용 확인</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-5">
          {[
            { label: '방문 유형', value: visitType === '초진' ? '🆕 초진 (처음 방문)' : '🔄 재진 (다시 방문)' },
            { label: '진료과', value: selectedDept ? `${selectedDept.icon} ${selectedDept.name}` : '' },
            { label: '담당 의사', value: selectedDoctor ? `👨‍⚕️ ${selectedDoctor.name} 선생님` : '' },
            { label: '진료 시간', value: selectedDoctor?.schedule || '' },
            { label: '본인 확인', value: '✅ 완료' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#E0F2F1' }}>
              <span className="text-lg" style={{ color: '#14919B' }}>{item.label}</span>
              <span className="text-xl font-extrabold" style={{ color: '#0D7377' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t-2" style={{ borderColor: '#B2DFDB', backgroundColor: '#E0F2F1' }}>
        <div className="flex gap-3">
          <button
            onClick={() => { setIdInput(''); setScreen('identity') }}
            className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold"
          >
            뒤로
          </button>
          <button
            onClick={() => setScreen('processing')}
            className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform"
            style={{ backgroundColor: '#0D7377' }}
          >
            접수하기
          </button>
        </div>
      </div>
    </div>
  )

  const ProcessingView = () => {
    useEffect(() => {
      const timer = setTimeout(() => setScreen('complete'), 2000)
      return () => clearTimeout(timer)
    }, [])
    return (
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#B2DFDB', borderTopColor: '#0D7377' }} />
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#0D7377' }}>접수하고 있어요</h2>
        <p className="text-xl" style={{ color: '#14919B' }}>잠시만 기다려주세요...</p>
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
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#0D7377' }}>접수 완료!</h2>
        <p className="text-xl mb-2" style={{ color: '#14919B' }}>
          {selectedDept?.name} · {selectedDoctor?.name} 선생님
        </p>

        <div className="border-2 rounded-2xl px-10 py-6 my-6" style={{ backgroundColor: '#E0F2F1', borderColor: '#B2DFDB' }}>
          <p className="text-lg" style={{ color: '#14919B' }}>대기번호</p>
          <p className="text-5xl font-extrabold mt-1" style={{ color: '#0D7377' }}>{ticketNumber}</p>
        </div>

        <p className="text-xl mb-8" style={{ color: '#14919B' }}>
          잘 하셨어요! 실제 병원에서도<br />이렇게 하시면 돼요!
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
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', backgroundColor: '#F0FAFA' }}>

        {/* 상단 바 */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#0D7377' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold" style={{ color: '#B2DFDB' }}>{SCREEN_LABELS[screen]}</span>
              <span className="text-base" style={{ color: '#80CBC4' }}>{stepIndex + 1}/{SCREEN_ORDER.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0A5C5F' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / SCREEN_ORDER.length) * 100}%`, backgroundColor: '#80CBC4' }}
              />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0A5C5F' }}>
            <X size={20} style={{ color: '#B2DFDB' }} />
          </button>
        </div>

        {/* 도우미 말풍선 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 rounded-2xl px-4 py-3 flex-1" style={{ borderColor: '#B2DFDB' }}>
              <p className="text-lg font-bold" style={{ color: '#0D7377' }}>{HELPER_MESSAGES[screen]}</p>
            </div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: '#B2DFDB' }}>
              <X size={14} style={{ color: '#0D7377' }} />
            </button>
          </div>
        )}
        {!showHelper && (
          <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start rounded-full p-2" style={{ backgroundColor: '#B2DFDB' }}>
            <MessageCircle size={18} style={{ color: '#0D7377' }} />
          </button>
        )}

        {/* 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>
          {screen === 'welcome' && WelcomeView}
          {screen === 'visitType' && VisitTypeView}
          {screen === 'department' && DepartmentView}
          {screen === 'doctor' && DoctorView}
          {screen === 'identity' && IdentityView}
          {screen === 'confirm' && ConfirmView}
          {screen === 'processing' && <ProcessingView />}
          {screen === 'complete' && <CompleteView />}
        </div>
      </div>
    </div>
  )
}
