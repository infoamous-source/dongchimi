import { useState, useCallback, useMemo } from 'react'
import { X, MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props { onClose: () => void }

type Screen = 'welcome' | 'movie' | 'time' | 'seat' | 'snack' | 'payment' | 'processing' | 'complete'

const LABELS: Record<Screen, string> = { welcome: '시작', movie: '영화 선택', time: '시간 선택', seat: '좌석 선택', snack: '스낵', payment: '결제', processing: '결제 중', complete: '완료' }
const HELPERS: Record<Screen, string> = { welcome: '영화를 예매해보세요!', movie: '보고 싶은 영화를 골라주세요.', time: '원하는 상영 시간을 골라주세요.', seat: '앉고 싶은 좌석을 터치해주세요.', snack: '팝콘이나 음료를 추가할 수 있어요.', payment: '결제 방법을 골라주세요.', processing: '잠시만 기다려주세요...', complete: '예매 완료! 잘 하셨어요!' }
const SCREENS: Screen[] = ['welcome', 'movie', 'time', 'seat', 'snack', 'payment', 'processing', 'complete']

const movies = [
  { id: 'star', title: '별빛 여행자', rating: 'ALL', genre: '애니메이션', mins: 108, color: '#3B82F6' },
  { id: 'warrior', title: '마지막 전사', rating: '15세', genre: '액션', mins: 132, color: '#EF4444' },
  { id: 'love', title: '사랑의 계절', rating: '12세', genre: '로맨스', mins: 118, color: '#EC4899' },
  { id: 'comedy', title: '웃음 특급', rating: 'ALL', genre: '코미디', mins: 98, color: '#F59E0B' },
]

const times = ['10:30', '13:00', '15:30', '18:00', '20:30']
const snacks = [
  { id: 'popcorn-m', name: '팝콘 (중)', price: 5500 },
  { id: 'popcorn-l', name: '팝콘 (대)', price: 7000 },
  { id: 'drink-m', name: '음료 (중)', price: 4000 },
  { id: 'combo', name: '커플 콤보', price: 12000 },
]
const TICKET = 13000

const fmt = (n: number) => n.toLocaleString('ko-KR')

export default function CinemaKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<typeof movies[0] | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSeat, setSelectedSeat] = useState('')
  const [selectedSnacks, setSelectedSnacks] = useState<typeof snacks>([])

  const setScreen = useCallback((s: Screen) => { setFade(true); setTimeout(() => { setScreenRaw(s); setShowHelper(true); setFade(false) }, 150) }, [])

  const total = TICKET + selectedSnacks.reduce((s, sn) => s + sn.price, 0)
  const stepIdx = SCREENS.indexOf(screen)

  const occupiedSeats = useMemo(() => {
    const seats: string[] = []
    for (let i = 0; i < 8; i++) seats.push(`${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 8) + 1}`)
    return [...new Set(seats)]
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', background: '#0F0A1A' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#1A0A2E' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-200 text-base font-bold">{LABELS[screen]}</span>
              <span className="text-purple-400 text-base">{stepIdx + 1}/{SCREENS.length}</span>
            </div>
            <div className="h-2 bg-purple-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full transition-all duration-300" style={{ width: `${((stepIdx + 1) / SCREENS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#2D1B4E' }}><X size={20} className="text-purple-200" /></button>
        </div>

        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-purple-900/50 border border-purple-700 rounded-2xl px-4 py-3 flex-1"><p className="text-lg text-purple-100 font-bold">{HELPERS[screen]}</p></div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center shrink-0 mt-1"><X size={14} className="text-purple-300" /></button>
          </div>
        )}
        {!showHelper && <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-purple-800 rounded-full p-2"><MessageCircle size={18} className="text-purple-300" /></button>}

        <div className="flex-1 overflow-y-auto" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>

          {screen === 'welcome' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
              <div className="text-6xl mb-6">🎬</div>
              <h1 className="text-3xl font-extrabold text-white mb-4">동치미 시네마</h1>
              <p className="text-xl text-purple-200 mb-10">영화를 예매해보세요!</p>
              <button onClick={() => setScreen('movie')} className="w-full max-w-xs py-6 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform" style={{ background: '#7C3AED' }}>예매 시작</button>
            </div>
          )}

          {screen === 'movie' && (
            <div className="px-4 py-4 flex flex-col gap-3">
              {movies.map(m => (
                <button key={m.id} onClick={() => { setSelectedMovie(m); setScreen('time') }} className="bg-white/10 rounded-2xl p-5 text-left flex items-center gap-4 active:scale-95 transition-transform">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-extrabold shrink-0" style={{ background: m.color }}>{m.rating}</div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{m.title}</div>
                    <div className="text-lg text-purple-300">{m.genre} · {m.mins}분</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {screen === 'time' && (
            <div className="px-4 py-6">
              <h2 className="text-2xl font-extrabold text-white mb-2">{selectedMovie?.title}</h2>
              <p className="text-lg text-purple-300 mb-6">상영 시간을 골라주세요</p>
              <div className="grid grid-cols-3 gap-3">
                {times.map(t => (
                  <button key={t} onClick={() => { setSelectedTime(t); setScreen('seat') }} className="py-5 bg-white/10 rounded-2xl text-xl font-extrabold text-white active:scale-95 transition-transform">{t}</button>
                ))}
              </div>
            </div>
          )}

          {screen === 'seat' && (
            <div className="px-4 py-6">
              <h2 className="text-xl font-extrabold text-white mb-4">좌석을 골라주세요</h2>
              <div className="bg-purple-900/50 rounded-xl py-2 text-center text-purple-300 text-lg mb-4 font-bold">스크린</div>
              <div className="flex flex-col gap-2 items-center">
                {['A', 'B', 'C', 'D', 'E', 'F'].map(row => (
                  <div key={row} className="flex gap-1 items-center">
                    <span className="w-6 text-purple-400 text-base font-bold">{row}</span>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                      const id = `${row}${col}`
                      const occupied = occupiedSeats.includes(id)
                      const selected = selectedSeat === id
                      return (
                        <button key={id} disabled={occupied} onClick={() => { setSelectedSeat(id); setScreen('snack') }}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${occupied ? 'bg-gray-700 text-gray-500' : selected ? 'bg-purple-500 text-white' : 'bg-white/20 text-white active:bg-purple-500'}`}>
                          {col}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-base">
                <span className="flex items-center gap-1"><span className="w-4 h-4 bg-white/20 rounded" /> 선택 가능</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 bg-gray-700 rounded" /> 이미 예매됨</span>
              </div>
            </div>
          )}

          {screen === 'snack' && (
            <div className="px-4 py-6">
              <h2 className="text-xl font-extrabold text-white mb-4">스낵 추가 (선택)</h2>
              <div className="flex flex-col gap-3 mb-6">
                {snacks.map(sn => {
                  const on = selectedSnacks.some(s => s.id === sn.id)
                  return (
                    <button key={sn.id} onClick={() => setSelectedSnacks(prev => on ? prev.filter(s => s.id !== sn.id) : [...prev, sn])}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xl font-bold border-2 transition-colors ${on ? 'border-purple-500 bg-purple-900/50 text-white' : 'border-white/20 bg-white/5 text-purple-200'}`}>
                      <span>{sn.name}</span>
                      <span>{fmt(sn.price)}원</span>
                    </button>
                  )
                })}
              </div>
              <button onClick={() => setScreen('payment')} className="w-full py-5 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform" style={{ background: '#7C3AED' }}>
                {selectedSnacks.length > 0 ? `${fmt(total)}원 결제하기` : `${fmt(TICKET)}원 결제하기 (스낵 없이)`}
              </button>
            </div>
          )}

          {screen === 'payment' && (
            <div className="flex flex-col items-center justify-center h-full px-5 py-6">
              <h2 className="text-2xl font-extrabold text-white mb-2">결제 방법을 선택하세요</h2>
              <p className="text-xl text-purple-300 mb-8">총 {fmt(total)}원</p>
              <div className="flex flex-col gap-4 w-full max-w-xs">
                {[{ id: 'card', icon: '💳', name: '카드 결제' }, { id: 'kakao', icon: '📱', name: '카카오페이' }].map(m => (
                  <button key={m.id} onClick={() => setScreen('processing')} className="flex items-center gap-5 px-6 py-6 bg-white/10 border-2 border-white/20 rounded-2xl active:scale-95 transition-transform">
                    <span className="text-4xl">{m.icon}</span>
                    <span className="text-xl font-extrabold text-white">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="w-16 h-16 border-4 border-purple-800 border-t-purple-400 rounded-full animate-spin mb-6" />
              <h2 className="text-2xl font-extrabold text-white mb-2">결제하고 있어요</h2>
              <p className="text-xl text-purple-300">잠시만 기다려주세요...</p>
              {(() => { setTimeout(() => setScreen('complete'), 2000); return null })()}
            </div>
          )}

          {screen === 'complete' && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              {(() => { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); return null })()}
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-3xl font-extrabold text-white mb-3">예매 완료!</h2>
              <div className="bg-purple-900/50 border border-purple-700 rounded-2xl p-5 my-4 w-full max-w-xs">
                <p className="text-xl text-purple-200">{selectedMovie?.title}</p>
                <p className="text-lg text-purple-400">{selectedTime} · {selectedSeat}</p>
              </div>
              <p className="text-xl text-purple-200 mb-8">잘 하셨어요! 실제로도 이렇게 하면 돼요!</p>
              <button onClick={onClose} className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">연습 끝내기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
