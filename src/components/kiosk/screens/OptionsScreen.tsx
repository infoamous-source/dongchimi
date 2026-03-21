import { useState } from 'react'
import { optionItems, formatPrice, type MenuItem, type OptionItem } from '../data'

interface Props {
  item: MenuItem
  onAdd: (options: OptionItem[], qty: number) => void
  onBack: () => void
}

export default function OptionsScreen({ item, onAdd, onBack }: Props) {
  const [selected, setSelected] = useState<OptionItem[]>([])
  const [qty, setQty] = useState(1)

  // 커피가 아닌 디저트는 옵션 없이 바로 담기
  const showOptions = item.category === 'coffee' || item.category === 'drink'

  const toggleOption = (opt: OptionItem) => {
    setSelected(prev =>
      prev.find(o => o.id === opt.id)
        ? prev.filter(o => o.id !== opt.id)
        : [...prev, opt]
    )
  }

  const optionPrice = selected.reduce((s, o) => s + o.priceAdd, 0)
  const totalPrice = (item.price + optionPrice) * qty

  return (
    <div className="flex flex-col h-full px-5 py-6">
      {/* 선택한 메뉴 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-amber-900">{item.name}</h2>
        <p className="text-xl text-amber-700 mt-1">{formatPrice(item.price)}원</p>
      </div>

      {/* 옵션 선택 */}
      {showOptions && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xl font-extrabold text-amber-900 mb-3">옵션 선택</h3>
          <div className="flex flex-col gap-3">
            {optionItems.map(opt => {
              const isOn = selected.some(o => o.id === opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xl font-bold border-2 transition-colors ${
                    isOn ? 'border-amber-800 bg-amber-50 text-amber-900' : 'border-amber-200 bg-white text-amber-700'
                  }`}
                >
                  <span>{opt.name}</span>
                  <span>{opt.priceAdd > 0 ? `+${formatPrice(opt.priceAdd)}원` : ''}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 수량 */}
      <div className="flex items-center justify-center gap-6 my-6">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 text-3xl font-extrabold">−</button>
        <span className="text-3xl font-extrabold text-amber-900 w-12 text-center">{qty}</span>
        <button onClick={() => setQty(q => q + 1)} className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 text-3xl font-extrabold">+</button>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-5 bg-gray-200 text-gray-700 rounded-2xl text-xl font-extrabold">
          뒤로
        </button>
        <button
          onClick={() => onAdd(selected, qty)}
          className="flex-[2] py-5 bg-amber-800 text-white rounded-2xl text-xl font-extrabold active:scale-95 transition-transform"
        >
          {formatPrice(totalPrice)}원 담기
        </button>
      </div>
    </div>
  )
}
