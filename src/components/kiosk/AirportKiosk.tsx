import { useState, useCallback, useMemo } from 'react'
import { X, MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props { onClose: () => void }

type Screen = 'welcome' | 'booking' | 'flight' | 'seat' | 'baggage' | 'confirm' | 'processing' | 'complete'

const LABELS: Record<Screen, string> = { welcome: '시작', booking: '예약 확인', flight: '항공편', seat: '좌석', baggage: '수하물', confirm: '확인', processing: '발권 중', complete: '완료' }
const HELPERS: Record<Screen, string> = { welcome: '셀프 체크인을 해봐요!', booking: '예약번호를 입력해주세요.', flight: '항공편 정보를 확인하세요.', seat: '좌석을 골라주세요.', baggage: '수하물을 등록하세요.', confirm: '정보를 확인하고 발권하세요.', processing: '보딩패스를 출력하고 있어요...', complete: '체크인 완료! 잘 하셨어요!' }
const SCREENS: Screen[] = ['welcome', 'booking', 'flight', 'seat', 'baggage', 'confirm', 'processing', 'complete']

const flight = { code: 'KE1234', airline: '대한항공', from: 'ICN 인천', to: 'NRT 도쿄', date: '2026-03-22', time: '14:30', gate: 'B12', boarding: '14:00', passenger: '홍길동' }
const meals = ['선택 안함', '한식 (불고기 비빔밥)', '양식 (치킨 파스타)']
const fmt = (n: number) => n.toLocaleString('ko-KR')

export default function AirportKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const [selectedSeat, setSelectedSeat] = useState('')
  const [extraBag, setExtraBag] = useState(false)
  const [meal, setMeal] = useState(meals[0])

  const setScreen = useCallback((s: Screen) => { setFade(true); setTimeout(() => { setScreenRaw(s); setShowHelper(true); setFade(false) }, 150) }, [])

  const occupied = useMemo(() => {
    const s: string[] = []
    for (let i = 0; i < 12; i++) s.push(`${Math.floor(Math.random() * 15) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`)
    return [...new Set(s)]
  }, [])

  const stepIdx = SCREENS.indexOf(screen)

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', background: '#F0F9FF' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0C4A6E' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sky-200 text-base font-bold">{LABELS[screen]}</span>
              <span className="text-sky-400 text-base">{stepIdx + 1}/{SCREENS.length}</span>
            </div>
            <div className="h-2 bg-sky-900 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full transition-all duration-300" style={{ width: `${((stepIdx + 1) / SCREENS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center"><X size={20} className="text-sky-200" /></button>
        </div>

        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 border-sky-200 rounded-2xl px-4 py-3 flex-1"><p className="text-lg text-sky-900 font-bold">{HELPERS[screen]}</p></div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center shrink-0 mt-1"><X size={14} className="text-sky-700" /></button>
          </div>
        )}
        {!showHelper && <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-sky-200 rounded-full p-2"><MessageCircle size={18} className="text-sky-800" /></button>}

        <div className="flex-1 overflow-y-auto" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>

          {screen === 'welcome' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
              <div className="text-6xl mb-6">✈️</div>
              <h1 className="text-3xl font-extrabold text-sky-900 mb-4">셀프 체크인</h1>
              <p className="text-xl text-sky-700 mb-10">항공편 체크인을 해봐요!</p>
              <button onClick={() => setScreen('booking')} className="w-full max-w-xs py-6 bg-sky-700 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">체크인 시작</button>
            </div>
          )}

          {screen === 'booking' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center">
              <h2 className="text-2xl font-extrabold text-sky-900 mb-6">예약번호를 입력하세요</h2>
              <div className="bg-white border-2 border-sky-200 rounded-2xl px-6 py-4 mb-6 w-full max-w-xs">
                <p className="text-3xl font-extrabold text-sky-900 tracking-widest text-center">ABCD12</p>
              </div>
              <p className="text-lg text-sky-600 mb-6">(연습용: 아무 번호나 입력된 것처럼 진행해요)</p>
              <button onClick={() => setScreen('flight')} className="w-full max-w-xs py-5 bg-sky-700 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform">확인</button>
            </div>
          )}

          {screen === 'flight' && (
            <div className="px-5 py-6">
              <h2 className="text-2xl font-extrabold text-sky-900 mb-4">항공편 정보</h2>
              <div className="bg-white rounded-2xl border-2 border-sky-200 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-sky-600">{flight.airline}</span>
                  <span className="text-xl font-extrabold text-sky-900">{flight.code}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-sky-900">ICN</p>
                    <p className="text-lg text-sky-600">인천</p>
                  </div>
                  <div className="text-3xl">✈️</div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-sky-900">NRT</p>
                    <p className="text-lg text-sky-600">도쿄</p>
                  </div>
                </div>
                <div className="border-t border-sky-100 pt-3 mt-3 flex justify-between">
                  <span className="text-lg text-sky-600">출발</span>
                  <span className="text-lg font-bold text-sky-900">{flight.date} {flight.time}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-lg text-sky-600">탑승객</span>
                  <span className="text-lg font-bold text-sky-900">{flight.passenger}</span>
                </div>
              </div>
              <button onClick={() => setScreen('seat')} className="w-full py-5 bg-sky-700 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform">좌석 선택하기</button>
            </div>
          )}

          {screen === 'seat' && (
            <div className="px-4 py-4">
              <h2 className="text-xl font-extrabold text-sky-900 mb-3">좌석을 골라주세요</h2>
              <div className="flex flex-col gap-1 items-center">
                {Array.from({ length: 12 }, (_, r) => r + 1).map(row => (
                  <div key={row} className="flex gap-1 items-center">
                    <span className="w-7 text-sky-500 text-sm font-bold text-right">{row}</span>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((col, ci) => {
                      const id = `${row}${col}`
                      const occ = occupied.includes(id)
                      const sel = selectedSeat === id
                      return (
                        <>{ci === 3 && <span className="w-3" />}
                        <button key={id} disabled={occ} onClick={() => setSelectedSeat(id)}
                          className={`w-9 h-8 rounded text-sm font-bold transition-colors ${occ ? 'bg-gray-300 text-gray-400' : sel ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-800 active:bg-sky-500 active:text-white'}`}>
                          {col}
                        </button></>
                      )
                    })}
                  </div>
                ))}
              </div>
              {selectedSeat && (
                <button onClick={() => setScreen('baggage')} className="w-full mt-4 py-5 bg-sky-700 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform">
                  {selectedSeat}석 선택 완료
                </button>
              )}
            </div>
          )}

          {screen === 'baggage' && (
            <div className="px-5 py-6">
              <h2 className="text-2xl font-extrabold text-sky-900 mb-4">수하물 등록</h2>
              <div className="flex flex-col gap-4 mb-6">
                <div className="bg-white rounded-2xl border-2 border-sky-200 p-5">
                  <p className="text-xl font-bold text-sky-900">기본 수하물 1개 (23kg)</p>
                  <p className="text-lg text-sky-600">무료 포함</p>
                </div>
                <button onClick={() => setExtraBag(!extraBag)}
                  className={`rounded-2xl border-2 p-5 text-left transition-colors ${extraBag ? 'border-sky-600 bg-sky-50' : 'border-sky-200 bg-white'}`}>
                  <p className="text-xl font-bold text-sky-900">추가 수하물 1개</p>
                  <p className="text-lg text-sky-600">{fmt(50000)}원</p>
                </button>
              </div>
              <h2 className="text-xl font-extrabold text-sky-900 mb-3">기내식 선택</h2>
              <div className="flex flex-col gap-3 mb-6">
                {meals.map(m => (
                  <button key={m} onClick={() => setMeal(m)}
                    className={`px-5 py-4 rounded-2xl border-2 text-xl font-bold text-left transition-colors ${meal === m ? 'border-sky-600 bg-sky-50 text-sky-900' : 'border-sky-200 bg-white text-sky-700'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={() => setScreen('confirm')} className="w-full py-5 bg-sky-700 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform">다음</button>
            </div>
          )}

          {screen === 'confirm' && (
            <div className="px-5 py-6">
              <h2 className="text-2xl font-extrabold text-sky-900 mb-4">체크인 확인</h2>
              <div className="bg-white rounded-2xl border-2 border-sky-200 p-5 mb-6">
                <div className="flex justify-between py-2"><span className="text-lg text-sky-600">항공편</span><span className="text-lg font-bold text-sky-900">{flight.code}</span></div>
                <div className="flex justify-between py-2"><span className="text-lg text-sky-600">좌석</span><span className="text-lg font-bold text-sky-900">{selectedSeat}</span></div>
                <div className="flex justify-between py-2"><span className="text-lg text-sky-600">수하물</span><span className="text-lg font-bold text-sky-900">{extraBag ? '2개' : '1개'}</span></div>
                <div className="flex justify-between py-2"><span className="text-lg text-sky-600">기내식</span><span className="text-lg font-bold text-sky-900">{meal}</span></div>
                {extraBag && <div className="flex justify-between py-2 border-t border-sky-100 mt-2"><span className="text-lg text-sky-600">추가 요금</span><span className="text-xl font-extrabold text-sky-900">{fmt(50000)}원</span></div>}
              </div>
              <button onClick={() => setScreen('processing')} className="w-full py-5 bg-sky-700 text-white text-xl font-extrabold rounded-2xl active:scale-95 transition-transform">
                {extraBag ? '결제 및 체크인' : '체크인 완료'}
              </button>
            </div>
          )}

          {screen === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-700 rounded-full animate-spin mb-6" />
              <h2 className="text-2xl font-extrabold text-sky-900 mb-2">보딩패스 발급 중</h2>
              <p className="text-xl text-sky-700">잠시만 기다려주세요...</p>
              {(() => { setTimeout(() => setScreen('complete'), 2000); return null })()}
            </div>
          )}

          {screen === 'complete' && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              {(() => { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); return null })()}
              <div className="text-6xl mb-4">✈️</div>
              <h2 className="text-3xl font-extrabold text-sky-900 mb-3">체크인 완료!</h2>
              <div className="bg-white border-2 border-sky-200 rounded-2xl p-5 my-4 w-full max-w-xs">
                <p className="text-lg text-sky-600">{flight.code} · {flight.from} → {flight.to}</p>
                <p className="text-2xl font-extrabold text-sky-900 mt-2">좌석 {selectedSeat}</p>
                <p className="text-lg text-sky-600 mt-1">탑승구 {flight.gate} · {flight.boarding} 탑승</p>
              </div>
              <p className="text-xl text-sky-700 mb-8">잘 하셨어요! 실제 공항에서도 이렇게 하면 돼요!</p>
              <button onClick={onClose} className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">연습 끝내기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
