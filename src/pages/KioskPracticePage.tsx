import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import CafeKiosk from '@/components/kiosk/CafeKiosk'

const kioskTypes = [
  { id: 'cafe', icon: '☕', title: '카페 키오스크', description: '커피, 음료, 디저트 주문 연습', available: true },
  { id: 'fastfood', icon: '🍔', title: '패스트푸드 키오스크', description: '햄버거, 세트메뉴 주문 연습', available: false },
  { id: 'cinema', icon: '🎬', title: '영화관 키오스크', description: '영화 예매, 좌석 선택 연습', available: false },
  { id: 'hospital', icon: '🏥', title: '병원 접수 키오스크', description: '진료 접수, 수납 연습', available: false },
]

export default function KioskPracticePage() {
  const [activeKiosk, setActiveKiosk] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/learn" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>배움터</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">📱 키오스크 연습</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        실제 키오스크처럼 연습해보세요.<br />틀려도 괜찮아요!
      </p>

      <div className="flex flex-col gap-4">
        {kioskTypes.map(k => (
          <button
            key={k.id}
            onClick={() => k.available && setActiveKiosk(k.id)}
            disabled={!k.available}
            className={`card flex items-center gap-5 text-left transition-shadow ${
              k.available ? 'hover:shadow-lg' : 'opacity-50'
            }`}
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center text-3xl shrink-0">
              {k.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-dc-text">{k.title}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{k.description}</p>
              {!k.available && <p className="text-lg text-dc-text-muted mt-1 font-bold">준비 중</p>}
            </div>
            {k.available && <ChevronRight size={28} className="text-dc-text-muted shrink-0" />}
          </button>
        ))}
      </div>

      {activeKiosk === 'cafe' && (
        <CafeKiosk onClose={() => setActiveKiosk(null)} />
      )}
    </div>
  )
}
