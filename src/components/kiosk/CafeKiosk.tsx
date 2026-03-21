import { useState, useCallback, useRef, useMemo } from 'react'
import { SCREEN_ORDER, SCREEN_LABELS, HELPER_MESSAGES, getCartTotal, type KioskScreen, type MenuItem, type OptionItem, type CartItem } from './data'
import WelcomeScreen from './screens/WelcomeScreen'
import DineScreen from './screens/DineScreen'
import MenuScreen from './screens/MenuScreen'
import OptionsScreen from './screens/OptionsScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import PaymentScreen from './screens/PaymentScreen'
import ProcessingScreen from './screens/ProcessingScreen'
import CompleteScreen from './screens/CompleteScreen'
import { MessageCircle, X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function CafeKiosk({ onClose }: Props) {
  const [screen, setScreenRaw] = useState<KioskScreen>('welcome')
  const [fade, setFade] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [dineIn, setDineIn] = useState(true)
  const [showHelper, setShowHelper] = useState(true)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const orderNumber = useMemo(() => Math.floor(Math.random() * 900) + 100, [])

  const setScreen = useCallback((next: KioskScreen) => {
    setFade(true)
    if (fadeRef.current) clearTimeout(fadeRef.current)
    fadeRef.current = setTimeout(() => {
      setScreenRaw(next)
      setShowHelper(true)
      setFade(false)
    }, 150)
  }, [])

  const addToCart = useCallback((options: OptionItem[], qty: number) => {
    if (!selectedItem) return
    setCart(prev => [...prev, { menu: selectedItem, options, quantity: qty }])
    setSelectedItem(null)
    setScreen('menu')
  }, [selectedItem, setScreen])

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }, [])

  const stepIndex = SCREEN_ORDER.indexOf(screen)
  const total = getCartTotal(cart)

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-amber-50 rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>

        {/* 상단 바 (진행률 + 닫기) */}
        <div className="bg-amber-900 px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-200 text-base font-bold">{SCREEN_LABELS[screen]}</span>
              <span className="text-amber-400 text-base">{stepIndex + 1}/{SCREEN_ORDER.length}</span>
            </div>
            <div className="h-2 bg-amber-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-300 rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / SCREEN_ORDER.length) * 100}%` }}
              />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center">
            <X size={20} className="text-amber-200" />
          </button>
        </div>

        {/* 도우미 말풍선 */}
        {showHelper && (
          <div className="mx-4 mt-3 flex items-start gap-2">
            <div className="bg-white border-2 border-amber-200 rounded-2xl px-4 py-3 flex-1">
              <p className="text-lg text-amber-900 font-bold">{HELPER_MESSAGES[screen]}</p>
            </div>
            <button onClick={() => setShowHelper(false)} className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-1">
              <X size={14} className="text-amber-700" />
            </button>
          </div>
        )}
        {!showHelper && (
          <button onClick={() => setShowHelper(true)} className="mx-4 mt-3 self-start bg-amber-200 rounded-full p-2">
            <MessageCircle size={18} className="text-amber-800" />
          </button>
        )}

        {/* 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden" style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.15s' }}>
          {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('dine')} />}
          {screen === 'dine' && <DineScreen onSelect={(d) => { setDineIn(d); setScreen('menu') }} />}
          {screen === 'menu' && (
            <MenuScreen
              onSelect={(item) => { setSelectedItem(item); setScreen('options') }}
              cartCount={cart.reduce((s, c) => s + c.quantity, 0)}
              cartTotal={total}
              onGoToConfirm={() => setScreen('confirm')}
            />
          )}
          {screen === 'options' && selectedItem && (
            <OptionsScreen item={selectedItem} onAdd={addToCart} onBack={() => { setSelectedItem(null); setScreen('menu') }} />
          )}
          {screen === 'confirm' && (
            <ConfirmScreen cart={cart} dineIn={dineIn} onPay={() => setScreen('payment')} onBack={() => setScreen('menu')} onRemove={removeFromCart} />
          )}
          {screen === 'payment' && <PaymentScreen total={total} onPay={() => setScreen('processing')} />}
          {screen === 'processing' && <ProcessingScreen onDone={() => setScreen('complete')} />}
          {screen === 'complete' && <CompleteScreen orderNumber={orderNumber} dineIn={dineIn} onDone={onClose} />}
        </div>
      </div>
    </div>
  )
}
