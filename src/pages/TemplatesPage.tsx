import { Link } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { resumeTemplates } from '@/data/careerData'

export default function TemplatesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/career" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>중장년층 프로그램</span>
      </Link>

      <h1 className="text-3xl font-extrabold text-dc-text mb-3">📄 양식 다운로드</h1>
      <p className="text-xl text-dc-text-secondary mb-8">
        이력서와 자기소개서 양식을 받아보세요
      </p>

      <div className="flex flex-col gap-4">
        {resumeTemplates.map((tpl) => (
          <div key={tpl.id} className="card flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
              📄
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-dc-text">{tpl.title}</h3>
              <p className="text-lg text-dc-text-secondary mt-1">{tpl.description}</p>
              <p className="text-lg text-dc-text-muted mt-1">형식: {tpl.format}</p>
            </div>
            <button className="btn-secondary px-4 py-3 text-lg shrink-0">
              <Download size={22} />
              받기
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 card bg-amber-50 border-2 border-amber-200">
        <p className="text-lg text-amber-900 font-bold text-center">
          양식 파일은 곧 업로드됩니다. 조금만 기다려주세요!
        </p>
      </div>
    </div>
  )
}
