import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface Props {
  orderNumber: number
  dineIn: boolean
  onDone: () => void
}

export default function CompleteScreen({ orderNumber, dineIn, onDone }: Props) {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-extrabold text-amber-900 mb-3">주문 완료!</h2>
      <p className="text-xl text-amber-700 mb-2">{dineIn ? '매장' : '포장'} 주문</p>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-10 py-6 my-6">
        <p className="text-lg text-amber-700">주문번호</p>
        <p className="text-5xl font-extrabold text-amber-900 mt-1">{orderNumber}</p>
      </div>

      <p className="text-xl text-amber-700 mb-8">
        잘 하셨어요! 실제 카페에서도<br />이렇게 하시면 돼요!
      </p>

      <button
        onClick={onDone}
        className="w-full max-w-xs py-5 bg-dc-green text-white text-xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        연습 끝내기
      </button>
    </div>
  )
}
