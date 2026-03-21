import { formatPrice } from '../data'

interface Props {
  total: number
  onPay: (method: string) => void
}

const methods = [
  { id: 'card', icon: '💳', name: '카드 결제' },
  { id: 'kakao', icon: '📱', name: '카카오페이' },
  { id: 'samsung', icon: '📱', name: '삼성페이' },
]

export default function PaymentScreen({ total, onPay }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6">
      <h2 className="text-2xl font-extrabold text-amber-900 mb-2">결제 방법을 선택하세요</h2>
      <p className="text-xl text-amber-700 mb-8">총 {formatPrice(total)}원</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => onPay(m.id)}
            className="flex items-center gap-5 px-6 py-6 bg-white border-2 border-amber-200 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <span className="text-4xl">{m.icon}</span>
            <span className="text-xl font-extrabold text-amber-900">{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
