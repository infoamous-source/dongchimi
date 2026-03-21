import { useState } from 'react'
import { menuItems, categories, formatPrice, type MenuItem } from '../data'

interface Props {
  onSelect: (item: MenuItem) => void
  cartCount: number
  cartTotal: number
  onGoToConfirm: () => void
}

export default function MenuScreen({ onSelect, cartCount, cartTotal, onGoToConfirm }: Props) {
  const [activeCat, setActiveCat] = useState('coffee')
  const filtered = menuItems.filter(m => m.category === activeCat)

  return (
    <div className="flex flex-col h-full">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 px-4 py-3 border-b border-amber-200 bg-amber-50">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-5 py-3 rounded-xl text-lg font-extrabold transition-colors ${
              activeCat === cat.id ? 'bg-amber-800 text-white' : 'bg-white text-amber-800 border border-amber-300'
            }`}
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
              onClick={() => onSelect(item)}
              className="bg-white rounded-2xl p-5 text-center border-2 border-amber-100 shadow-sm active:scale-95 transition-transform"
            >
              {item.popular && <span className="text-sm font-bold text-red-500 mb-1 block">인기</span>}
              <div className="text-xl font-extrabold text-amber-900 mb-2">{item.name}</div>
              <div className="text-lg font-bold text-amber-700">{formatPrice(item.price)}원</div>
            </button>
          ))}
        </div>
      </div>

      {/* 장바구니 바 */}
      {cartCount > 0 && (
        <div className="px-4 py-3 border-t-2 border-amber-300 bg-amber-50">
          <button
            onClick={onGoToConfirm}
            className="w-full py-5 bg-amber-800 text-white rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span className="bg-white text-amber-800 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-lg">{cartCount}</span>
            <span className="text-xl font-extrabold">{formatPrice(cartTotal)}원 주문하기</span>
          </button>
        </div>
      )}
    </div>
  )
}
