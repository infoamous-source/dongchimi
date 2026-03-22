import { useState, useCallback } from 'react'
import { X, MessageCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props { onClose: () => void }

type Screen = 'welcome' | 'menu' | 'options' | 'cart' | 'payment' | 'dutch' | 'processing' | 'complete'

const LABELS: Record<Screen, string> = { welcome: '시작', menu: '메뉴 선택', options: '옵션 선택', cart: '장바구니', payment: '결제', dutch: '더치페이', processing: '결제 중', complete: '완료' }
const HELPERS: Record<Screen, string> = { welcome: '태블릿으로 음식을 주문해봐요!', menu: '먹고 싶은 메뉴를 골라주세요.', options: '찌개와 밥공기를 선택해주세요.', cart: '주문한 메뉴를 확인하세요.', payment: '결제 방법을 골라주세요.', dutch: '더치페이로 나눠서 결제할 수 있어요.', processing: '카드를 삽입해 주세요...', complete: '주문 완료! 잘 하셨어요!' }
const SCREENS: Screen[] = ['welcome', 'menu', 'options', 'cart', 'payment', 'dutch', 'processing', 'complete']

interface MenuItem { id: string; name: string; price: number; category: string; desc?: string; people?: string }

const categories = [
  { id: 'set', name: '한상가득 백반정식' },
  { id: 'meal', name: '식사류' },
  { id: 'noodle', name: '면류' },
  { id: 'side', name: '사이드' },
  { id: 'drink', name: '주류' },
]

const menuItems: MenuItem[] = [
  { id: 'set2', name: '백반정식 2인', price: 22000, category: 'set', desc: '된장찌개/김치찌개 + 제육볶음 + 계란찜 + 생선구이', people: '2인' },
  { id: 'set3', name: '백반정식 3인', price: 30000, category: 'set', desc: '된장찌개/김치찌개 + 제육볶음 + 계란찜 + 생선구이', people: '3인' },
  { id: 'set4', name: '백반정식 4인', price: 38000, category: 'set', desc: '된장찌개/김치찌개 + 제육볶음 + 계란찜 + 생선구이', people: '4인' },
  { id: 'daily', name: '오늘의 정식 1인', price: 9000, category: 'set', desc: '밥 + 국 + 반찬 제공' },
  { id: 'bulgogi', name: '불고기정식', price: 11000, category: 'meal' },
  { id: 'jeyuk', name: '제육볶음정식', price: 10000, category: 'meal' },
  { id: 'kimchi-jjigae', name: '김치찌개정식', price: 8500, category: 'meal' },
  { id: 'doenjang', name: '된장찌개정식', price: 8500, category: 'meal' },
  { id: 'galbi', name: '갈비탕', price: 13000, category: 'meal' },
  { id: 'kalguksu', name: '칼국수', price: 8000, category: 'noodle' },
  { id: 'bibim', name: '비빔냉면', price: 9000, category: 'noodle' },
  { id: 'mul', name: '물냉면', price: 9000, category: 'noodle' },
  { id: 'japchae', name: '잡채', price: 12000, category: 'side' },
  { id: 'pajeon', name: '해물파전', price: 13000, category: 'side' },
  { id: 'gyeran', name: '계란말이', price: 5000, category: 'side' },
  { id: 'soju', name: '소주', price: 4000, category: 'drink' },
  { id: 'beer', name: '맥주', price: 4000, category: 'drink' },
  { id: 'cola', name: '콜라', price: 2000, category: 'drink' },
  { id: 'cider', name: '사이다', price: 2000, category: 'drink' },
]

const stews = ['된장찌개', '김치찌개']
const rices = ['반공기', '한공기']

interface CartItem { menu: MenuItem; stew?: string; rice?: string; qty: number }

const fmt = (n: number) => n.toLocaleString('ko-KR')

export default function RestaurantKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  const [activeCat, setActiveCat] = useState('set')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedStew, setSelectedStew] = useState('')
  const [selectedRice, setSelectedRice] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [dutchTab, setDutchTab] = useState<'item' | 'people' | 'amount'>('item')
  const [dutchPeople, setDutchPeople] = useState(2)

  const setScreen = useCallback((s: Screen) => { setFade(true); setTimeout(() => { setScreenRaw(s); setShowHelper(true); setFade(false) }, 150) }, [])

  const total = cart.reduce((s, c) => s + c.menu.price * c.qty, 0)
  const stepIdx = SCREENS.indexOf(screen)
  const needsOptions = selectedItem?.category === 'set' && selectedItem?.id !== 'daily'

  const addToCart = () => {
    if (!selectedItem) return
    setCart(prev => [...prev, { menu: selectedItem, stew: needsOptions ? selectedStew : undefined, rice: selectedRice || '한공기', qty: 1 }])
    setSelectedItem(null)
    setSelectedStew('')
    setSelectedRice('')
    setScreen('menu')
  }

  const removeFromCart = (i: number) => setCart(prev => prev.filter((_, idx) => idx !== i))
  const updateQty = (i: number, d: number) => setCart(prev => prev.map((c, idx) => idx === i ? { ...c, qty: Math.max(1, c.qty + d) } : c))

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', background: '#FFF8F0' }}>
        {/* 헤더 */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#8B2500' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-200 text-base font-bold">{LABELS[screen]}</span>
              <span className="text-orange-400 text-base">{stepIdx + 1}/{SCREENS.length}</span>
            </div>
            <div className="h-2 bg-orange-900 rounded-full overflow-hidden">
              <div className="h-full bg-orange-300 rounded-full transition-all duration-300" style={{ width: `${((stepIdx + 1) / SCREENS.length) * 100}%` }} />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-orange-900 flex items-center justify-center"><X size={20} className="text-orange-200" /></button>
        </div>

        {/* 도우미 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 border-orange-200 rounded-2xl px-4 py-3 flex-1"><p className="text-lg text-orange-900 font-bold">{HELPERS[screen]}</p></div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0 mt-1"><X size={14} className="text-orange-700" /></button>
          </div>
        )}
        {!showHelper && <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-orange-200 rounded-full p-2"><MessageCircle size={18} className="text-orange-800" /></button>}

        {/* 화면 */}
        <div className="flex-1 overflow-y-auto" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>

          {screen === 'welcome' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
              <div className="text-6xl mb-6">🍚</div>
              <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#8B2500' }}>동치미 한식당</h1>
              <p className="text-xl text-orange-700 mb-10">태블릿으로 주문해보세요!</p>
              <button onClick={() => setScreen('menu')} className="w-full max-w-xs py-6 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform" style={{ background: '#CC3300' }}>주문하기</button>
            </div>
          )}

          {screen === 'menu' && (
            <div className="flex flex-col h-full">
              {/* 카테고리 */}
              <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-orange-200 bg-white">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                    className={`px-4 py-3 rounded-xl text-base font-extrabold whitespace-nowrap transition-colors ${activeCat === cat.id ? 'text-white' : 'bg-gray-100 text-gray-700'}`}
                    style={activeCat === cat.id ? { background: '#CC3300' } : {}}>
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* 메뉴 */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="flex flex-col gap-3">
                  {menuItems.filter(m => m.category === activeCat).map(item => (
                    <button key={item.id} onClick={() => { setSelectedItem(item); setScreen(item.category === 'set' && item.id !== 'daily' ? 'options' : 'options') }}
                      className="bg-white rounded-2xl p-4 text-left border border-orange-100 shadow-sm active:scale-95 transition-transform">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-extrabold text-gray-900">{item.name}</div>
                          {item.desc && <div className="text-base text-gray-500 mt-1">{item.desc}</div>}
                        </div>
                        <span className="text-xl font-extrabold shrink-0 ml-3" style={{ color: '#CC3300' }}>{fmt(item.price)}원</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* 하단 바 */}
              {cart.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-orange-300 bg-white flex gap-3">
                  <button onClick={() => setScreen('cart')} className="flex-1 py-4 border-2 border-orange-300 rounded-2xl text-xl font-extrabold text-orange-800">
                    🛒 장바구니 ({cart.reduce((s, c) => s + c.qty, 0)})
                  </button>
                  <button onClick={() => setScreen('cart')} className="flex-1 py-4 rounded-2xl text-xl font-extrabold text-white active:scale-95 transition-transform" style={{ background: '#CC3300' }}>
                    주문내역
                  </button>
                </div>
              )}
            </div>
          )}

          {screen === 'options' && selectedItem && (
            <div className="px-5 py-6">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{selectedItem.name}</h2>
              <p className="text-xl font-bold mb-6" style={{ color: '#CC3300' }}>{fmt(selectedItem.price)}원</p>

              {needsOptions && (
                <>
                  <div className="mb-6">
                    <p className="text-lg font-extrabold text-red-600 mb-3">필수 택1 (찌개 선택)</p>
                    <div className="flex gap-3">
                      {stews.map(s => (
                        <button key={s} onClick={() => setSelectedStew(s)}
                          className={`flex-1 py-5 rounded-2xl text-xl font-bold border-2 transition-colors ${selectedStew === s ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg font-extrabold text-red-600 mb-3">필수 밥공기 선택</p>
                    <div className="flex gap-3">
                      {rices.map(r => (
                        <button key={r} onClick={() => setSelectedRice(r)}
                          className={`flex-1 py-5 rounded-2xl text-xl font-bold border-2 transition-colors ${selectedRice === r ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!needsOptions && (
                <div className="mb-6">
                  <p className="text-lg font-extrabold text-red-600 mb-3">밥공기 선택</p>
                  <div className="flex gap-3">
                    {rices.map(r => (
                      <button key={r} onClick={() => setSelectedRice(r)}
                        className={`flex-1 py-5 rounded-2xl text-xl font-bold border-2 transition-colors ${selectedRice === r ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={() => { setSelectedItem(null); setScreen('menu') }} className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">닫기</button>
                <button onClick={addToCart} disabled={needsOptions && !selectedStew}
                  className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform disabled:opacity-40" style={{ background: '#CC3300' }}>
                  🛒 장바구니 담기
                </button>
              </div>
            </div>
          )}

          {screen === 'cart' && (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-orange-200" style={{ background: '#CC3300' }}>
                <h2 className="text-2xl font-extrabold text-white">🛒 장바구니</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {cart.length === 0 ? (
                  <p className="text-xl text-gray-500 text-center py-8">장바구니가 비어있어요</p>
                ) : cart.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 mb-3 border border-orange-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900">{c.menu.name}</h3>
                        {c.stew && <p className="text-lg text-gray-500">└ {c.stew} / {c.rice}</p>}
                      </div>
                      <button onClick={() => removeFromCart(i)} className="px-3 py-1 bg-red-100 text-red-500 rounded-lg text-base font-bold">삭제</button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(i, -1)} className="w-10 h-10 rounded-lg bg-gray-100 text-xl font-bold">−</button>
                        <span className="text-xl font-extrabold w-8 text-center">{c.qty}</span>
                        <button onClick={() => updateQty(i, 1)} className="w-10 h-10 rounded-lg bg-gray-100 text-xl font-bold">+</button>
                      </div>
                      <span className="text-xl font-extrabold" style={{ color: '#CC3300' }}>{fmt(c.menu.price * c.qty)}원</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-4 border-t-2 border-orange-300 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="text-xl font-extrabold">{cart.reduce((s, c) => s + c.qty, 0)}개</span>
                  <span className="text-2xl font-extrabold" style={{ color: '#CC3300' }}>{fmt(total)}원</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setScreen('menu')} className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">닫기</button>
                  <button onClick={() => setScreen('payment')} disabled={cart.length === 0}
                    className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform disabled:opacity-40" style={{ background: '#CC3300' }}>
                    ✓ 결제하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'payment' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">결제방법을 선택하세요</h2>
              <p className="text-xl mb-8" style={{ color: '#CC3300' }}>총 {fmt(total)}원</p>
              <div className="flex gap-4 w-full max-w-xs">
                <button onClick={() => setScreen('processing')} className="flex-1 py-8 rounded-2xl text-center active:scale-95 transition-transform" style={{ background: '#CC3300' }}>
                  <div className="text-4xl mb-2">💳</div>
                  <div className="text-xl font-extrabold text-white">카드결제</div>
                </button>
                <button onClick={() => setScreen('dutch')} className="flex-1 py-8 rounded-2xl text-center active:scale-95 transition-transform" style={{ background: '#CC3300' }}>
                  <div className="text-4xl mb-2">➗</div>
                  <div className="text-xl font-extrabold text-white">더치페이</div>
                </button>
              </div>
            </div>
          )}

          {screen === 'dutch' && (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3" style={{ background: '#CC3300' }}>
                <div className="flex justify-between items-center mb-2">
                  <div><p className="text-lg text-white/80">총 금액</p><p className="text-2xl font-extrabold text-white">{fmt(total)}원</p></div>
                  <div><p className="text-lg text-white/80">결제잔액</p><p className="text-2xl font-extrabold text-yellow-200">{fmt(total)}원</p></div>
                </div>
                <div className="flex gap-2">
                  {[{ id: 'item' as const, name: '상품별' }, { id: 'people' as const, name: '인원별' }, { id: 'amount' as const, name: '금액별' }].map(t => (
                    <button key={t.id} onClick={() => setDutchTab(t.id)}
                      className={`flex-1 py-3 rounded-xl text-lg font-extrabold transition-colors ${dutchTab === t.id ? 'bg-white text-red-700' : 'bg-white/20 text-white'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {dutchTab === 'item' && cart.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 mb-3 border border-orange-100">
                    <p className="text-xl font-bold text-gray-900">{c.menu.name} (x{c.qty})</p>
                    <p className="text-lg text-gray-600">{fmt(c.menu.price * c.qty)}원</p>
                    <button onClick={() => setScreen('processing')} className="mt-2 px-4 py-2 text-white rounded-xl text-lg font-bold" style={{ background: '#CC3300' }}>카드결제</button>
                  </div>
                ))}
                {dutchTab === 'people' && (
                  <div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button onClick={() => setDutchPeople(p => Math.max(2, p - 1))} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">−</button>
                      <span className="text-3xl font-extrabold">{dutchPeople}명</span>
                      <button onClick={() => setDutchPeople(p => p + 1)} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">+</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {Array.from({ length: dutchPeople }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-orange-100 flex items-center justify-between">
                          <p className="text-xl font-bold">분할금액</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-extrabold" style={{ color: '#CC3300' }}>{fmt(Math.floor(total / dutchPeople))}원</span>
                            <button onClick={() => setScreen('processing')} className="px-4 py-2 text-white rounded-xl text-lg font-bold" style={{ background: '#CC3300' }}>카드결제</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {dutchTab === 'amount' && (
                  <div className="text-center py-4">
                    <p className="text-xl text-gray-500 mb-4">직접 금액을 입력하세요</p>
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
                      {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map(n => (
                        <button key={n} className="py-4 bg-white border border-gray-200 rounded-xl text-2xl font-bold">{n}</button>
                      ))}
                      <button className="py-4 bg-white border border-gray-200 rounded-xl text-lg font-bold">00</button>
                      <button className="py-4 bg-white border border-gray-200 rounded-xl text-lg font-bold">CLR</button>
                    </div>
                    <button onClick={() => setScreen('processing')} className="px-8 py-3 text-white rounded-xl text-xl font-bold" style={{ background: '#CC3300' }}>카드결제</button>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-orange-200">
                <button onClick={() => setScreen('payment')} className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">뒤로</button>
              </div>
            </div>
          )}

          {screen === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">카드를 삽입해 주세요</h2>
              <p className="text-xl mb-2" style={{ color: '#CC3300' }}>결제금액 {fmt(total)}원</p>
              <div className="w-full max-w-xs h-2 bg-blue-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <p className="text-lg text-gray-500 mt-4">거래 중단</p>
              {(() => { setTimeout(() => setScreen('complete'), 2500); return null })()}
            </div>
          )}

          {screen === 'complete' && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              {(() => { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); return null })()}
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#8B2500' }}>주문 완료!</h2>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 my-4 w-full max-w-xs">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span className="text-lg text-gray-700">{c.menu.name} ×{c.qty}</span>
                    <span className="text-lg font-bold" style={{ color: '#CC3300' }}>{fmt(c.menu.price * c.qty)}원</span>
                  </div>
                ))}
                <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between">
                  <span className="text-xl font-extrabold">합계</span>
                  <span className="text-xl font-extrabold" style={{ color: '#CC3300' }}>{fmt(total)}원</span>
                </div>
              </div>
              <p className="text-xl text-orange-700 mb-8">잘 하셨어요! 실제 식당에서도 이렇게 하면 돼요!</p>
              <button onClick={onClose} className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform">연습 끝내기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
