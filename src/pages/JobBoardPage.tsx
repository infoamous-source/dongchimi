import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { jobSites } from '@/data/careerData'

export default function JobBoardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>중장년층 프로그램</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">🔍 채용공고 정보</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        시니어 채용 사이트와 취업 정보를 확인해보세요
      </p>

      <div className="flex flex-col gap-4">
        {jobSites.map((site) => (
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
        <h3 className="text-xl font-extrabold text-dc-green mb-2">취업 도움 받기</h3>
        <p className="text-lg text-dc-text-secondary">
          가까운 고용센터(국번 없이 1350)에 전화하시면 취업 상담을 무료로 받으실 수 있어요.
        </p>
      </div>
    </div>
  )
}
