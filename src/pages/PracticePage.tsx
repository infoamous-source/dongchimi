import { Link } from 'react-router-dom'
import { Landmark, ShoppingCart, Train, CreditCard } from 'lucide-react'

const practiceItems = [
  { id: 'atm', icon: Landmark, title: 'ATM 사용하기', description: '현금 인출, 송금 연습', bgColor: '#dbeafe', iconColor: '#2563eb' },
  { id: 'shopping', icon: ShoppingCart, title: '온라인 쇼핑', description: '쿠팡에서 주문하기 연습', bgColor: '#dcfce7', iconColor: '#16a34a' },
  { id: 'transport', icon: Train, title: '교통 앱 사용', description: '카카오맵, 네이버지도 연습', bgColor: '#fef3c7', iconColor: '#d97706' },
  { id: 'payment', icon: CreditCard, title: '모바일 결제', description: '카카오페이, 삼성페이 연습', bgColor: '#ede9fe', iconColor: '#7c3aed' },
]

export default function PracticePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-dc-text mb-3">연습</h2>
      <p className="text-xl text-dc-text-secondary mb-8">
        실제처럼 연습해보세요. 틀려도 괜찮아요!
      </p>

      <div className="flex flex-col gap-4">
        {practiceItems.map((item) => (
          <Link
            key={item.id}
            to={`/practice/${item.id}`}
            className="card flex items-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-[4.5rem] h-[4.5rem] rounded-3xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.bgColor }}
            >
              <item.icon size={36} style={{ color: item.iconColor }} />
            </div>
            <div>
              <h3 className="font-extrabold text-dc-text text-xl">{item.title}</h3>
              <p className="text-dc-text-secondary text-lg mt-1">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card bg-dc-green-bg border-2 border-dc-green-pale">
        <p className="text-dc-green text-center text-lg font-bold">
          더 많은 연습 콘텐츠가 곧 추가됩니다!
        </p>
      </div>
    </div>
  )
}
