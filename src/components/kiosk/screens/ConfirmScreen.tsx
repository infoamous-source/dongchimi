import { formatPrice, getCartTotal, type CartItem } from '../data'

interface Props {
  cart: CartItem[]
  dineIn: boolean
  onPay: () => void
  onBack: () => void
  onRemove: (index: number) => void
}

export default function ConfirmScreen({ cart, dineIn, onPay, onBack, onRemove }: Props) {
  const total = getCartTotal(cart)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-amber-200 bg-amber-50">
        <h2 className="text-2xl font-extrabold text-amber-900">주문 확인</h2>
        <p className="text-lg text-amber-700">{dineIn ? '매장에서 먹기' : '가져가기'}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {cart.map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-amber-100">
            <div className="flex-1">
              <div className="text-xl font-extrabold text-amber-900">{item.menu.name}</div>
              {item.options.length > 0 && (
                <div className="text-lg text-amber-600 mt-1">
                  {item.options.map(o => o.name).join(', ')}
                </div>
              )}
              <div className="text-lg text-amber-700 mt-1">
                {formatPrice(
                  (item.menu.price + item.options.reduce((s, o) => s + o.priceAdd, 0)) * item.quantity
                )}원 × {item.quantity}개
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="w-12 h-12 rounded-full bg-red-100 text-red-500 text-2xl font-extrabold shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t-2 border-amber-300 bg-amber-50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold text-amber-900">총 금액</span>
          <span className="text-2xl font-extrabold text-amber-800">{formatPrice(total)}원</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">
            뒤로
          </button>
          <button onClick={onPay} className="flex-[2] py-5 bg-amber-800 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform">
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}
