import { Link } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { resumeTemplates } from '@/data/careerData'

const templateContents: Record<string, string> = {
  'basic-resume': `이 력 서

━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 인적사항
━━━━━━━━━━━━━━━━━━━━━━━━━━━
성    명:
생년월일:                     성별:
연 락 처:
주    소:
이 메 일:

━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 학력사항
━━━━━━━━━━━━━━━━━━━━━━━━━━━
기간                학교명              전공              졸업여부
──────────────────────────────────────────────



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 경력사항
━━━━━━━━━━━━━━━━━━━━━━━━━━━
기간                회사명              직위/직책          담당업무
──────────────────────────────────────────────




━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 자격/면허
━━━━━━━━━━━━━━━━━━━━━━━━━━━
취득일              자격증명             발급기관
──────────────────────────────────────────────



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 특기사항
━━━━━━━━━━━━━━━━━━━━━━━━━━━


위 내용은 사실과 다름없음을 확인합니다.

작성일:          년     월     일
성  명:                    (서명)
`,
  'simple-resume': `간 단 이 력 서

이름:
연락처:
이메일:

■ 경력 요약


■ 주요 역량


■ 희망 직종


■ 자격증


작성일:
`,
  'basic-cover': `자 기 소 개 서

━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 성장과정
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(자신의 성장과정과 가치관에 대해 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 성격의 장단점
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(자신의 강점과 보완점에 대해 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 경력 및 경험
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(주요 경력과 그 과정에서 배운 점을 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 지원동기 및 포부
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(이 직무에 지원하는 이유와 향후 계획을 작성해주세요)



작성일:          년     월     일
성  명:
`,
  'senior-cover': `자 기 소 개 서 (경력 중심)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 핵심 경력 요약
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(가장 자신 있는 경력 3가지를 중심으로 작성해주세요)

1.
2.
3.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 대표 성과
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(경력에서 가장 자랑스러운 성과를 구체적으로 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 보유 역량
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(오랜 경험에서 쌓은 전문 역량을 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 재취업 동기
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(다시 일하고자 하는 이유와 열정을 작성해주세요)



━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 건강 및 근무 가능 조건
━━━━━━━━━━━━━━━━━━━━━━━━━━━
건강상태:
희망 근무형태: (전일제 / 시간제 / 기타)
희망 근무지역:

작성일:          년     월     일
성  명:
`,
}

function downloadTemplate(templateId: string, title: string) {
  const content = templateContents[templateId] || ''
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

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
              <p className="text-lg text-dc-text-muted mt-1">형식: TXT</p>
            </div>
            <button
              onClick={() => downloadTemplate(tpl.id, tpl.title)}
              className="btn-secondary px-4 py-3 text-lg shrink-0"
            >
              <Download size={22} />
              받기
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
