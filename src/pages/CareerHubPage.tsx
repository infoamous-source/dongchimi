import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const seniorJobSites = [
  { name: '노인일자리여기', url: 'https://www.seniorro.or.kr', description: '한국노인인력개발원 운영, 시니어 일자리 검색' },
  { name: '워크넷 시니어', url: 'https://www.work.go.kr', description: '고용노동부 공식 취업 사이트' },
  { name: '대한노인회', url: 'https://www.koreapeople.co.kr', description: '시니어 복지·일자리 정보' },
  { name: '시니어클럽', url: 'https://www.silverclub.or.kr', description: '지역 시니어클럽 일자리 연결' },
  { name: '노인맞춤돌봄서비스', url: 'https://www.129.go.kr', description: '보건복지 상담센터 (129)' },
]

export default function CareerHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>홈으로</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">💼 시니어 일자리 정보</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        정부에서 운영하는 시니어 일자리<br />사이트를 확인해보세요
      </p>

      <div className="flex flex-col gap-4">
        {seniorJobSites.map(site => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-5 hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">
              🌐
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-dc-text">{site.name}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{site.description}</p>
            </div>
            <ExternalLink size={24} className="text-dc-info shrink-0" />
          </a>
        ))}
      </div>

      <div className="mt-8 card bg-dc-green-bg border-2 border-dc-green-pale">
        <h3 className="text-xl font-extrabold text-dc-green mb-2">도움이 필요하시면</h3>
        <p className="text-lg text-dc-text-secondary">
          가까운 주민센터나 복지관에 방문하시거나<br />
          <strong>전화 129</strong>로 연락하시면 안내받으실 수 있어요.
        </p>
      </div>
    </div>
  )
}
