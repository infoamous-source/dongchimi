import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { fields, reviews } from '@/data/reviewsData'

export default function CareerReviewsPage() {
  const [activeField, setActiveField] = useState('전체')

  const filtered = activeField === '전체' ? reviews : reviews.filter(r => r.field === activeField)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career/work" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>일터</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">💬 재취업 후기</h1>
      <p className="text-xl text-dc-text-secondary mb-6">분야별 재취업 경험담을 확인해보세요</p>

      {/* 분야 필터 */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {fields.map(f => (
          <button
            key={f}
            onClick={() => setActiveField(f)}
            className={`px-4 py-2 rounded-xl text-lg font-bold whitespace-nowrap transition-colors ${
              activeField === f ? 'bg-dc-green text-white' : 'bg-white text-dc-text-secondary border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 후기 목록 */}
      <div className="flex flex-col gap-4">
        {filtered.map(r => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-extrabold text-dc-green bg-dc-green-bg px-3 py-1 rounded-lg">{r.field}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                ))}
              </div>
            </div>

            <p className="text-xl text-dc-text leading-relaxed mb-4">"{r.review}"</p>

            <div className="grid grid-cols-2 gap-2 text-lg">
              <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-dc-text-muted">계약</span>
                <span className="font-bold text-dc-text">{r.contract}</span>
              </div>
              <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-dc-text-muted">연봉</span>
                <span className="font-bold text-dc-text">{r.avgSalary}</span>
              </div>
              <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-dc-text-muted">자격</span>
                <span className="font-bold text-dc-text">{r.requirements}</span>
              </div>
              <div className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-dc-text-muted">연령</span>
                <span className="font-bold text-dc-text">{r.age}</span>
              </div>
            </div>

            <p className="text-lg text-dc-text-muted mt-2">이전 경력: {r.experience}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
