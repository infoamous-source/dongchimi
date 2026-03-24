import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { logActivity } from '@/services/activityService'
import CafeKiosk from '@/components/kiosk/CafeKiosk'
import FastfoodKiosk from '@/components/kiosk/FastfoodKiosk'
import BankKiosk from '@/components/kiosk/BankKiosk'
import HospitalKiosk from '@/components/kiosk/HospitalKiosk'
import GovernmentKiosk from '@/components/kiosk/GovernmentKiosk'
import CinemaKiosk from '@/components/kiosk/CinemaKiosk'
import ConvenienceKiosk from '@/components/kiosk/ConvenienceKiosk'
import AirportKiosk from '@/components/kiosk/AirportKiosk'
import RestaurantKiosk from '@/components/kiosk/RestaurantKiosk'

const seniorKioskTypes = [
  { id: 'cafe', icon: '☕', title: '카페 키오스크', description: '☕ 커피숍에서 음료를 주문하는 연습이에요. 화면을 천천히 눌러보세요!' },
  { id: 'fastfood', icon: '🍔', title: '패스트푸드 키오스크', description: '🍟 햄버거 가게에서 세트메뉴를 주문해봐요. 순서대로 따라하면 쉬워요!' },
  { id: 'bank', icon: '🏦', title: '은행 ATM', description: '💰 은행 ATM에서 돈을 찾고, 보내는 연습이에요. 비밀번호는 예시로 해볼게요!' },
  { id: 'hospital', icon: '🏥', title: '병원 접수 키오스크', description: '🏥 병원에 가면 있는 접수 기계 연습이에요. 진료과 선택부터 차근차근!' },
  { id: 'government', icon: '🏛️', title: '관공서 무인발급기', description: '📋 주민센터에서 서류를 뽑는 연습이에요. 주민등록등본도 혼자 발급할 수 있어요!' },
  { id: 'cinema', icon: '🎬', title: '영화관 키오스크', description: '🎬 영화관에서 표를 사는 연습이에요. 영화 선택하고 좌석도 골라봐요!' },
  { id: 'convenience', icon: '🏪', title: '편의점 셀프계산', description: '🛒 편의점 셀프계산대 연습이에요. 바코드 찍고 결제하는 법을 배워요!' },
  { id: 'airport', icon: '✈️', title: '공항 셀프체크인', description: '✈️ 공항에서 탑승권을 발급받는 연습이에요. 여권 정보 입력부터 해봐요!' },
  { id: 'restaurant', icon: '🍚', title: '식당 태블릿 주문', description: '🍽️ 식당에 있는 태블릿으로 음식 주문하는 연습이에요. 메뉴를 골라보세요!' },
]

const careerKioskTypes = [
  { id: 'cafe', icon: '☕', title: '카페 키오스크', description: '커피, 음료, 디저트 주문 연습' },
  { id: 'fastfood', icon: '🍔', title: '패스트푸드 키오스크', description: '햄버거, 세트메뉴 주문 연습' },
  { id: 'bank', icon: '🏦', title: '은행 ATM', description: '출금, 입금, 이체 연습' },
  { id: 'hospital', icon: '🏥', title: '병원 접수 키오스크', description: '진료 접수, 수납 연습' },
  { id: 'government', icon: '🏛️', title: '관공서 무인발급기', description: '주민등록등본 등 서류 발급' },
  { id: 'cinema', icon: '🎬', title: '영화관 키오스크', description: '영화 예매, 좌석 선택 연습' },
  { id: 'convenience', icon: '🏪', title: '편의점 셀프계산', description: '셀프 계산대 사용 연습' },
  { id: 'airport', icon: '✈️', title: '공항 셀프체크인', description: '항공편 체크인, 좌석 선택' },
  { id: 'restaurant', icon: '🍚', title: '식당 태블릿 주문', description: '한식당 태블릿 주문, 더치페이' },
]

const kioskMap: Record<string, React.FC<{ onClose: () => void }>> = {
  cafe: CafeKiosk,
  fastfood: FastfoodKiosk,
  bank: BankKiosk,
  hospital: HospitalKiosk,
  government: GovernmentKiosk,
  cinema: CinemaKiosk,
  convenience: ConvenienceKiosk,
  airport: AirportKiosk,
  restaurant: RestaurantKiosk,
}

export default function KioskPracticePage() {
  const { user } = useAuth()
  const location = useLocation()
  const isSenior = location.pathname.startsWith('/senior')
  const kioskTypes = isSenior ? seniorKioskTypes : careerKioskTypes
  const [activeKiosk, setActiveKiosk] = useState<string | null>(null)
  const ActiveComponent = activeKiosk ? kioskMap[activeKiosk] : null

  const handleKioskClose = (kioskId: string) => {
    if (user) logActivity(user.id, 'kiosk_complete', { kioskType: kioskId })
    setActiveKiosk(null)
  }

  const backLink = isSenior ? '/senior/learn' : '/career/digital'
  const backLabel = isSenior ? '배움터' : '디지털 교육'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to={backLink} className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>{backLabel}</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">📱 키오스크 연습</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        {isSenior
          ? <>실제 키오스크처럼 연습해보세요.<br />틀려도 괜찮아요! 천천히 따라해보세요 😊</>
          : <>실제 키오스크처럼 연습해보세요.<br />틀려도 괜찮아요!</>
        }
      </p>

      <div className="flex flex-col gap-4">
        {kioskTypes.map(k => (
          <button
            key={k.id}
            onClick={() => setActiveKiosk(k.id)}
            className="card flex items-center gap-5 text-left hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center text-3xl shrink-0">
              {k.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-dc-text">{k.title}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{k.description}</p>
            </div>
            <ChevronRight size={28} className="text-dc-text-muted shrink-0" />
          </button>
        ))}
      </div>

      {ActiveComponent && activeKiosk && <ActiveComponent onClose={() => handleKioskClose(activeKiosk)} />}
    </div>
  )
}
