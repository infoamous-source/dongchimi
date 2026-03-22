import { useState, useCallback } from 'react'
import { X, MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props { onClose: () => void }

type Screen = 'welcome' | 'scan' | 'age' | 'bag' | 'review' | 'payment' | 'processing' | 'complete'

const LABELS: Record<Screen, string> = { welcome: '시작', scan: '상품 스캔', age: '나이 확인', bag: '봉투', review: '주문 확인', payment: '결제', processing: '결제 중', complete: '완료' }
const HELPERS: Record<Screen, string> = { welcome: '편의점 셀프 계산을 해봐요!', scan: '바코드를 찍듯이 상품을 터치해주세요.', age: '주류 구매 시 나이 확인이 필요해요.', bag: '봉투가 필요하신가요?', review: '상품이 맞는지 확인하세요.', payment: '결제 방법을 골라주세요.', processing: '잠시만 기다려주세요...', complete: '결제 완료! 잘 하셨어요!' }
const SCREENS: Screen[] = ['welcome', 'scan', 'age', 'bag', 'review', 'payment', 'processing', 'complete']

const items = [
  { id: 'kimbap', name: '삼각김밥 참치마요', price: 1200, category: 'food' },
  { id: 'ramen', name: '컵라면 신라면', price: 1500, category: 'food' },
  { id: 'lunch', name: '도시락 불고기', price: 4500, category: 'food' },
  { id: 'sandwich', name: '샌드위치 에그', price: 2800, category: 'food' },
  { id: 'water', name: '생수 500ml', price: 800, category: 'drink' },
  { id: 'coffee', name: '아이스 아메리카노', price: 1500, category: 'drink' },
  { id: 'banana', name: '바나나우유', price: 1200, category: 'drink' },
  { id: 'choco', name: '초코파이', price: 3000, category: 'snack' },
  { id: 'chip', name: '감자칩', price: 2000, category: 'snack' },
  { id: 'soju', name: '소주', price: 1800, category: 'alcohol' },
  { id: 'beer', name: '맥주 500ml', price: 2500, category: 'alcohol' },
]

const bags = [
  { id: 'none', name: '필요 없어요', price: 0 },
  { id: 'small', name: '일반 봉투', price: 100 },
  { id: 'large', name: '대형 봉투', price: 200 },
]

const fmt = (n: number) => n.toLocaleString('ko-KR')

interface CartItem { item: typeof items[0]; qty: number }

export default function ConvenienceKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [bagChoice, setBagChoice] = useState(bags[0])
  const [hasAlcohol, setHasAlcohol] = useState(false)

  const setScreen = useCallback((s: Screen) => { setFade(true); setTimeout(() => { setScreenRaw(s); setShowHelper(true); setFade(false) }, 150) }, [])

  const addItem = (item: typeof items[0]) => {
    if (item.category === 'alcohol') setHasAlcohol(true)
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1 }]
    })
  }

  const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0) + bagChoice.price
  const stepIdx = SCREENS.indexOf(screen)

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', background: '#ECFDF5' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#065F46' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-200 text-base font-bold">{LABELS[screen]}</span>
              <span className="text-emerald-400 text-base">{stepIdx + 1}/{SCREENS.length}</span>
            </div>
            <div className="h-2 bg-emerald-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${((stepIdx + 1) / SCREENS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center"><X size={20} className="text-emerald-200" /></button>
        </div>

        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 border-emerald-200 rounded-2xl px-4 py-3 flex-1"><p className="text-lg text-emerald-900 font-bold">{HELPERS[screen]}</p></div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 mt-1"><X size={14} className="text-emerald-700" /></button>
          </div>
        )}
        {!showHelper && <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-emerald-200 rounded-full p-2"><MessageCircle size={18} className="text-emerald-800" /></button>}

        <div className="flex-1 overflow-y-auto" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>

          {screen === 'welcome' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
              <div className="text-6xl mb-6">🏪</div>
              <h1 className="text-3xl font-extrabold text-emerald-900 mb-4">동치미 편의점</h1>
              <p className="text-xl text-emerald-700 mb-10">셀프 계산을 해볼까요?</p>
              <button onClick={() => setScreen('scan')} className="w-full max-w-xs py-6 bg-emerald-700 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">계산 시작</button>
            </div>
          )}

          {screen === 'scan' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-2">
                  {items.map(item => (
                    <button key={item.id} onClick={() => addItem(item)} className="flex items-center justify-between px-4 py-4 bg-white rounded-2xl border border-emerald-100 active:scale-95 transition-transform">
                      <div>
                        <span className="text-xl font-bold text-emerald-900">{item.name}</span>
                        {item.category === 'alcohol' && <span className="ml-2 text-base text-red-500 font-bold">19+</span>}
                      </div>
                      <span className="text-lg font-bold text-emerald-700">{fmt(item.price)}원</span>
                    </button>
                  ))}
                </div>
              </div>
              {cart.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-emerald-300 bg-white">
                  <div className="text-lg text-emerald-700 mb-2">{cart.map(c => `${c.item.name}×${c.qty}`).join(', ')}</div>
                  <button onClick={() => setScreen(hasAlcohol ? 'age' : 'bag')} className="w-full py-5 bg-emerald-700 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform">
                    {fmt(cart.reduce((s, c) => s + c.item.price * c.qty, 0))}원 · 다음
                  </button>
                </div>
              )}
            </div>
          )}

          {screen === 'age' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center">
              <div className="text-5xl mb-4">🔞</div>
              <h2 className="text-2xl font-extrabold text-emerald-900 mb-4">나이 확인이 필요해요</h2>
              <p className="text-xl text-emerald-700 mb-8">주류 구매는 만 19세 이상만 가능해요</p>
              <button onClick={() => setScreen('bag')} className="w-full max-w-xs py-6 bg-emerald-700 text-white text-2xl font-extrabold rounded-2xl active:scale-95 transition-transform">확인 완료</button>
            </div>
          )}

          {screen === 'bag' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-8">
              <h2 className="text-2xl font-extrabold text-emerald-900 mb-6">봉투가 필요하신가요?</h2>
              <div className="flex flex-col gap-4 w-full max-w-xs">
                {bags.map(b => (
                  <button key={b.id} onClick={() => { setBagChoice(b); setScreen('review') }} className="py-6 bg-white border-2 border-emerald-200 rounded-2xl text-center active:scale-95 transition-transform">
                    <div className="text-xl font-extrabold text-emerald-900">{b.name}</div>
                    {b.price > 0 && <div className="text-lg text-emerald-600">{b.price}원</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'review' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <h2 className="text-2xl font-extrabold text-emerald-900 mb-4">주문 확인</h2>
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-emerald-100">
                    <span className="text-xl text-emerald-900">{c.item.name} ×{c.qty}</span>
                    <span className="text-xl font-bold text-emerald-700">{fmt(c.item.price * c.qty)}원</span>
                  </div>
                ))}
                {bagChoice.price > 0 && (
                  <div className="flex justify-between py-3 border-b border-emerald-100">
                    <span className="text-xl text-emerald-900">{bagChoice.name}</span>
                    <span className="text-xl font-bold text-emerald-700">{bagChoice.price}원</span>
                  </div>
                )}
              </div>
              <div className="px-5 py-4 border-t-2 border-emerald-300 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="text-xl font-extrabold text-emerald-900">총 금액</span>
                  <span className="text-2xl font-extrabold text-emerald-700">{fmt(total)}원</span>
                </div>
                <button onClick={() => setScreen('payment')} className="w-full py-5 bg-emerald-700 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform">결제하기</button>
              </div>
            </div>
          )}

          {screen === 'payment' && (
            <div className="flex flex-col items-center justify-center h-full px-5 py-6">
              <h2 className="text-2xl font-extrabold text-emerald-900 mb-2">결제 방법</h2>
              <p className="text-xl text-emerald-700 mb-8">총 {fmt(total)}원</p>
              <div className="flex flex-col gap-4 w-full max-w-xs">
                {[{ icon: '💳', name: '카드 결제' }, { icon: '📱', name: '카카오페이' }].map(m => (
                  <button key={m.name} onClick={() => setScreen('processing')} className="flex items-center gap-5 px-6 py-6 bg-white border-2 border-emerald-200 rounded-2xl active:scale-95 transition-transform">
                    <span className="text-4xl">{m.icon}</span>
                    <span className="text-xl font-extrabold text-emerald-900">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-6" />
              <h2 className="text-2xl font-extrabold text-emerald-900 mb-2">결제하고 있어요</h2>
              <p className="text-xl text-emerald-700">잠시만 기다려주세요...</p>
              {(() => { setTimeout(() => setScreen('complete'), 2000); return null })()}
            </div>
          )}

          {screen === 'complete' && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              {(() => { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); return null })()}
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-extrabold text-emerald-900 mb-3">결제 완료!</h2>
              <p className="text-xl text-emerald-700 mb-8">잘 하셨어요! 편의점 셀프 계산 성공!</p>
              <button onClick={onClose} className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">연습 끝내기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
