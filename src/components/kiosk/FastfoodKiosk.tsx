import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import confetti from 'canvas-confetti'

// ─── Types ──────────────────────────────────────────────────
type Screen = 'welcome' | 'dine' | 'menu' | 'options' | 'confirm' | 'payment' | 'processing' | 'complete'

interface MenuItem {
  id: string
  name: string
  price: number
  category: 'burger' | 'set' | 'side' | 'drink'
  popular?: boolean
}

interface OptionItem {
  id: string
  name: string
  priceAdd: number
}

interface CartItem {
  menu: MenuItem
  options: OptionItem[]
  quantity: number
}

// ─── Data ───────────────────────────────────────────────────
const SCREEN_ORDER: Screen[] = ['welcome', 'dine', 'menu', 'options', 'confirm', 'payment', 'processing', 'complete']

const SCREEN_LABELS: Record<Screen, string> = {
  welcome: '시작',
  dine: '매장/포장',
  menu: '메뉴 선택',
  options: '옵션 선택',
  confirm: '주문 확인',
  payment: '결제',
  processing: '결제 중',
  complete: '완료',
}

const HELPER_MESSAGES: Record<Screen, string> = {
  welcome: '화면을 터치해서 주문을 시작해보세요!',
  dine: '매장에서 드실 건지, 가져가실 건지 골라주세요.',
  menu: '원하는 메뉴를 눌러보세요. 여러 개 담을 수 있어요!',
  options: '옵션을 골라주세요. 다 고르면 "담기"를 누르세요.',
  confirm: '주문한 메뉴가 맞는지 확인하고 "결제하기"를 누르세요.',
  payment: '결제 방법을 골라주세요.',
  processing: '잠시만 기다려주세요. 결제하고 있어요.',
  complete: '주문이 끝났어요! 잘 하셨습니다!',
}

const categories = [
  { id: 'burger', name: '버거' },
  { id: 'set', name: '세트' },
  { id: 'side', name: '사이드' },
  { id: 'drink', name: '음료' },
]

const menuItems: MenuItem[] = [
  { id: 'classic-cheese', name: '클래식치즈버거', price: 5500, category: 'burger', popular: true },
  { id: 'double-cheese', name: '더블치즈버거', price: 7800, category: 'burger', popular: true },
  { id: 'chicken-burger', name: '치킨버거', price: 6200, category: 'burger' },
  { id: 'bulgogi-burger', name: '불고기버거', price: 5800, category: 'burger' },
  { id: 'classic-set', name: '클래식세트', price: 8500, category: 'set', popular: true },
  { id: 'double-set', name: '더블세트', price: 10800, category: 'set' },
  { id: 'chicken-set', name: '치킨세트', price: 9200, category: 'set' },
  { id: 'fries-m', name: '감자튀김M', price: 2500, category: 'side', popular: true },
  { id: 'fries-l', name: '감자튀김L', price: 3200, category: 'side' },
  { id: 'cheese-stick', name: '치즈스틱', price: 3000, category: 'side' },
  { id: 'nugget-6', name: '너겟6pc', price: 3500, category: 'side' },
  { id: 'cola-m', name: '콜라M', price: 2000, category: 'drink', popular: true },
  { id: 'cola-l', name: '콜라L', price: 2500, category: 'drink' },
  { id: 'cider-m', name: '사이다M', price: 2000, category: 'drink' },
  { id: 'orange-juice', name: '오렌지주스', price: 2800, category: 'drink' },
]

const optionItems: OptionItem[] = [
  { id: 'size-up', name: '사이즈업', priceAdd: 800 },
  { id: 'add-cheese', name: '치즈추가', priceAdd: 500 },
  { id: 'add-patty', name: '패티추가', priceAdd: 2500 },
]

const paymentMethods = [
  { id: 'card', icon: '💳', name: '카드 결제' },
  { id: 'kakao', icon: '📱', name: '카카오페이' },
  { id: 'samsung', icon: '📱', name: '삼성페이' },
]

// ─── Helpers ────────────────────────────────────────────────
function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => {
    const optionPrice = item.options.reduce((s, o) => s + o.priceAdd, 0)
    return sum + (item.menu.price + optionPrice) * item.quantity
  }, 0)
}

// ─── Component ──────────────────────────────────────────────
interface Props {
  onClose: () => void
}

export default function FastfoodKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<Screen>('welcome')
  const [fade, setFade] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [dineIn, setDineIn] = useState(true)
  const [showHelper, setShowHelper] = useState(true)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const orderNumber = useMemo(() => Math.floor(Math.random() * 900) + 100, [])

  // Options screen state
  const [selectedOptions, setSelectedOptions] = useState<OptionItem[]>([])
  const [qty, setQty] = useState(1)
  // Menu screen state
  const [activeCat, setActiveCat] = useState('burger')

  const setScreen = useCallback((next: Screen) => {
    setFade(true)
    if (fadeRef.current) clearTimeout(fadeRef.current)
    fadeRef.current = setTimeout(() => {
      setScreenRaw(next)
      setShowHelper(true)
      setFade(false)
    }, 150)
  }, [])

  const addToCart = useCallback((options: OptionItem[], quantity: number) => {
    if (!selectedItem) return
    setCart(prev => [...prev, { menu: selectedItem, options, quantity }])
    setSelectedItem(null)
    setSelectedOptions([])
    setQty(1)
    setScreen('menu')
  }, [selectedItem, setScreen])

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }, [])

  const toggleOption = (opt: OptionItem) => {
    setSelectedOptions(prev =>
      prev.find(o => o.id === opt.id)
        ? prev.filter(o => o.id !== opt.id)
        : [...prev, opt]
    )
  }

  const stepIndex = SCREEN_ORDER.indexOf(screen)
  const total = getCartTotal(cart)

  // Processing screen auto-advance
  useEffect(() => {
    if (screen !== 'processing') return
    const timer = setTimeout(() => setScreen('complete'), 2000)
    return () => clearTimeout(timer)
  }, [screen, setScreen])

  // Complete screen confetti
  useEffect(() => {
    if (screen !== 'complete') return
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
  }, [screen])

  // ─── Inline screens ────────────────────────────────────────

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <div className="text-6xl mb-6">🍔</div>
      <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#8B0000' }}>동치미 버거</h1>
      <p className="text-xl mb-10 leading-relaxed" style={{ color: '#A0522D' }}>
        화면을 터치해서<br />주문을 시작하세요
      </p>
      <button
        onClick={() => setScreen('dine')}
        className="w-full max-w-xs py-6 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
        style={{ backgroundColor: '#CC0000' }}
      >
        주문하기
      </button>
    </div>
  )

  const renderDine = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <h2 className="text-2xl font-extrabold mb-8" style={{ color: '#8B0000' }}>어디서 드시겠어요?</h2>
      <div className="flex flex-col gap-5 w-full max-w-xs">
        <button
          onClick={() => { setDineIn(true); setScreen('menu') }}
          className="py-8 bg-white border-3 rounded-2xl text-center shadow-md active:scale-95 transition-transform"
          style={{ borderColor: '#E8B4B4' }}
        >
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-2xl font-extrabold" style={{ color: '#8B0000' }}>매장에서 먹기</div>
        </button>
        <button
          onClick={() => { setDineIn(false); setScreen('menu') }}
          className="py-8 bg-white border-3 rounded-2xl text-center shadow-md active:scale-95 transition-transform"
          style={{ borderColor: '#E8B4B4' }}
        >
          <div className="text-4xl mb-2">🥤</div>
          <div className="text-2xl font-extrabold" style={{ color: '#8B0000' }}>가져가기</div>
        </button>
      </div>
    </div>
  )

  const renderMenu = () => {
    const filtered = menuItems.filter(m => m.category === activeCat)
    const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

    return (
      <div className="flex flex-col h-full">
        {/* 카테고리 탭 */}
        <div className="flex gap-2 px-4 py-3 border-b" style={{ borderColor: '#E8B4B4', backgroundColor: '#FFF9F0' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-3 rounded-xl text-lg font-extrabold transition-colors ${
                activeCat === cat.id ? 'text-white' : 'bg-white border'
              }`}
              style={
                activeCat === cat.id
                  ? { backgroundColor: '#8B0000' }
                  : { color: '#8B0000', borderColor: '#E8B4B4' }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 메뉴 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item)
                  setSelectedOptions([])
                  setQty(1)
                  setScreen('options')
                }}
                className="bg-white rounded-2xl p-5 text-center border-2 shadow-sm active:scale-95 transition-transform"
                style={{ borderColor: '#F5D5D5' }}
              >
                {item.popular && <span className="text-sm font-bold text-red-500 mb-1 block">인기</span>}
                <div className="text-xl font-extrabold mb-2" style={{ color: '#8B0000' }}>{item.name}</div>
                <div className="text-lg font-bold" style={{ color: '#A0522D' }}>{formatPrice(item.price)}원</div>
              </button>
            ))}
          </div>
        </div>

        {/* 장바구니 바 */}
        {cartCount > 0 && (
          <div className="px-4 py-3 border-t-2" style={{ borderColor: '#E8B4B4', backgroundColor: '#FFF9F0' }}>
            <button
              onClick={() => setScreen('confirm')}
              className="w-full py-5 text-white rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              style={{ backgroundColor: '#CC0000' }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-lg" style={{ backgroundColor: 'white', color: '#CC0000' }}>{cartCount}</span>
              <span className="text-xl font-extrabold">{formatPrice(total)}원 주문하기</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderOptions = () => {
    if (!selectedItem) return null
    // 버거, 세트에만 옵션 표시 (사이드, 음료는 옵션 없음)
    const showOptions = selectedItem.category === 'burger' || selectedItem.category === 'set'
    const optionPrice = selectedOptions.reduce((s, o) => s + o.priceAdd, 0)
    const totalPrice = (selectedItem.price + optionPrice) * qty

    return (
      <div className="flex flex-col h-full px-5 py-6">
        {/* 선택한 메뉴 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold" style={{ color: '#8B0000' }}>{selectedItem.name}</h2>
          <p className="text-xl mt-1" style={{ color: '#A0522D' }}>{formatPrice(selectedItem.price)}원</p>
        </div>

        {/* 옵션 선택 */}
        {showOptions && (
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xl font-extrabold mb-3" style={{ color: '#8B0000' }}>옵션 선택</h3>
            <div className="flex flex-col gap-3">
              {optionItems.map(opt => {
                const isOn = selectedOptions.some(o => o.id === opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt)}
                    className="flex items-center justify-between px-5 py-4 rounded-2xl text-xl font-bold border-2 transition-colors"
                    style={
                      isOn
                        ? { borderColor: '#8B0000', backgroundColor: '#FFF0F0', color: '#8B0000' }
                        : { borderColor: '#E8B4B4', backgroundColor: 'white', color: '#A0522D' }
                    }
                  >
                    <span>{opt.name}</span>
                    <span>+{formatPrice(opt.priceAdd)}원</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 수량 */}
        <div className="flex items-center justify-center gap-6 my-6">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-14 h-14 rounded-full text-3xl font-extrabold"
            style={{ backgroundColor: '#FFE0E0', color: '#8B0000' }}
          >
            −
          </button>
          <span className="text-3xl font-extrabold w-12 text-center" style={{ color: '#8B0000' }}>{qty}</span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="w-14 h-14 rounded-full text-3xl font-extrabold"
            style={{ backgroundColor: '#FFE0E0', color: '#8B0000' }}
          >
            +
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => { setSelectedItem(null); setSelectedOptions([]); setQty(1); setScreen('menu') }}
            className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold"
          >
            뒤로
          </button>
          <button
            onClick={() => addToCart(selectedOptions, qty)}
            className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform"
            style={{ backgroundColor: '#CC0000' }}
          >
            {formatPrice(totalPrice)}원 담기
          </button>
        </div>
      </div>
    )
  }

  const renderConfirm = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b" style={{ borderColor: '#E8B4B4', backgroundColor: '#FFF9F0' }}>
        <h2 className="text-2xl font-extrabold" style={{ color: '#8B0000' }}>주문 확인</h2>
        <p className="text-lg" style={{ color: '#A0522D' }}>{dineIn ? '매장에서 먹기' : '가져가기'}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {cart.map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b" style={{ borderColor: '#F5D5D5' }}>
            <div className="flex-1">
              <div className="text-xl font-extrabold" style={{ color: '#8B0000' }}>{item.menu.name}</div>
              {item.options.length > 0 && (
                <div className="text-lg mt-1" style={{ color: '#A0522D' }}>
                  {item.options.map(o => o.name).join(', ')}
                </div>
              )}
              <div className="text-lg mt-1" style={{ color: '#A0522D' }}>
                {formatPrice(
                  (item.menu.price + item.options.reduce((s, o) => s + o.priceAdd, 0)) * item.quantity
                )}원 × {item.quantity}개
              </div>
            </div>
            <button
              onClick={() => removeFromCart(i)}
              className="w-12 h-12 rounded-full bg-red-100 text-red-500 text-2xl font-extrabold shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t-2" style={{ borderColor: '#E8B4B4', backgroundColor: '#FFF9F0' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold" style={{ color: '#8B0000' }}>총 금액</span>
          <span className="text-2xl font-extrabold" style={{ color: '#CC0000' }}>{formatPrice(total)}원</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setScreen('menu')} className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">
            뒤로
          </button>
          <button
            onClick={() => setScreen('payment')}
            className="flex-[2] py-5 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform"
            style={{ backgroundColor: '#CC0000' }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  )

  const renderPayment = () => (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#8B0000' }}>결제 방법을 선택하세요</h2>
      <p className="text-xl mb-8" style={{ color: '#A0522D' }}>총 {formatPrice(total)}원</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {paymentMethods.map(m => (
          <button
            key={m.id}
            onClick={() => setScreen('processing')}
            className="flex items-center gap-5 px-6 py-6 bg-white border-2 rounded-2xl shadow-sm active:scale-95 transition-transform"
            style={{ borderColor: '#E8B4B4' }}
          >
            <span className="text-4xl">{m.icon}</span>
            <span className="text-xl font-extrabold" style={{ color: '#8B0000' }}>{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderProcessing = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#E8B4B4', borderTopColor: '#CC0000' }} />
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#8B0000' }}>결제하고 있어요</h2>
        <p className="text-xl" style={{ color: '#A0522D' }}>잠시만 기다려주세요...</p>
      </div>
    )
  }

  const renderComplete = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#8B0000' }}>주문 완료!</h2>
        <p className="text-xl mb-2" style={{ color: '#A0522D' }}>{dineIn ? '매장' : '포장'} 주문</p>

        <div className="border-2 rounded-2xl px-10 py-6 my-6" style={{ backgroundColor: '#FFF9F0', borderColor: '#E8B4B4' }}>
          <p className="text-lg" style={{ color: '#A0522D' }}>주문번호</p>
          <p className="text-5xl font-extrabold mt-1" style={{ color: '#8B0000' }}>{orderNumber}</p>
        </div>

        <p className="text-xl mb-8" style={{ color: '#A0522D' }}>
          잘 하셨어요! 실제 매장에서도<br />이렇게 하시면 돼요!
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

  // ─── Render ─────────────────────────────────────────────────

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return renderWelcome()
      case 'dine': return renderDine()
      case 'menu': return renderMenu()
      case 'options': return renderOptions()
      case 'confirm': return renderConfirm()
      case 'payment': return renderPayment()
      case 'processing': return renderProcessing()
      case 'complete': return renderComplete()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh', backgroundColor: '#FFF9F0' }}>

        {/* 상단 바 (진행률 + 닫기) */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#8B0000' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold" style={{ color: '#FFB4B4' }}>{SCREEN_LABELS[screen]}</span>
              <span className="text-base" style={{ color: '#FF8888' }}>{stepIndex + 1}/{SCREEN_ORDER.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#660000' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / SCREEN_ORDER.length) * 100}%`, backgroundColor: '#FF6666' }}
              />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#660000' }}>
            <X size={20} style={{ color: '#FFB4B4' }} />
          </button>
        </div>

        {/* 도우미 말풍선 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 rounded-2xl px-4 py-3 flex-1" style={{ borderColor: '#E8B4B4' }}>
              <p className="text-lg font-bold" style={{ color: '#8B0000' }}>{HELPER_MESSAGES[screen]}</p>
            </div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: '#FFE0E0' }}>
              <X size={14} style={{ color: '#8B0000' }} />
            </button>
          </div>
        )}
        {!showHelper && (
          <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start rounded-full p-2" style={{ backgroundColor: '#FFE0E0' }}>
            <MessageCircle size={18} style={{ color: '#8B0000' }} />
          </button>
        )}

        {/* 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>
          {renderScreen()}
        </div>
      </div>
    </div>
  )
}
