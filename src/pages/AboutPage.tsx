import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import DongchimiCharacter from '@/components/brand/DongchimiCharacter'

const frustrations = [
  { emoji: '😤', text: '키오스크 앞에서 뒷사람 눈치 보며 버벅거렸던 적' },
  { emoji: '😰', text: '병원 예약을 앱으로 하라는데 어떻게 하는지 몰랐던 적' },
  { emoji: '😥', text: '자녀에게 물어보면 "아 그것도 모르냐"는 소리가 무서웠던 적' },
  { emoji: '😟', text: '보이스피싱인지 진짜인지 구분이 안 됐던 적' },
  { emoji: '😢', text: '카카오톡 사진 보내기가 이렇게 어려운 건지 몰랐던 적' },
  { emoji: '😔', text: '세상이 너무 빨리 변해서 나만 뒤처진 것 같았던 적' },
]

const promises = [
  {
    emoji: '🐢',
    title: '천천히, 또 천천히',
    description: '빠르게 넘어가지 않아요. 이해할 때까지 천천히 기다려드려요. 100번 물어봐도 괜찮아요.',
  },
  {
    emoji: '👵',
    title: '눈높이를 맞춰요',
    description: '어려운 영어나 전문 용어 대신, 알기 쉬운 우리말로 설명해요. "와이파이"가 뭔지부터 시작해요.',
  },
  {
    emoji: '🎯',
    title: '직접 해봐야 내 것',
    description: '듣기만 하면 금방 잊어버려요. 안전한 환경에서 직접 눌러보고, 해보면서 배워요. 틀려도 아무 일도 안 생겨요!',
  },
  {
    emoji: '🤖',
    title: 'AI가 24시간 옆에',
    description: '자녀에게 물어보기 미안할 때, AI비서에게 물어보세요. 언제든 친절하게 알려드려요. 진짜예요!',
  },
  {
    emoji: '🤝',
    title: '혼자가 아니에요',
    description: '같은 고민을 가진 분들이 여기 모여 있어요. 함께 배우면 더 재밌고, 더 오래 기억나요.',
  },
  {
    emoji: '🛡️',
    title: '사기꾼을 물리쳐요',
    description: '보이스피싱, 스미싱, 가짜 문자... 어떻게 구별하는지 확실하게 알려드려요. 다시는 안 당해요!',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dc-text-secondary mb-6 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>홈으로</span>
      </Link>

      {/* 헤더 */}
      <div className="text-center mb-10">
        <DongchimiCharacter size="full" />
        <h1 className="text-3xl font-extrabold text-dc-text mb-4 mt-4 leading-tight">
          동치미학교란?
        </h1>
        <p className="text-xl text-dc-text-secondary leading-relaxed">
          너무 빨리 변하는 세상에서<br />
          <strong className="text-dc-text">답답했던 것들을 모두 알려주는 학교</strong>예요.
        </p>
      </div>

      {/* 공감 섹션 */}
      <div className="card-highlight mb-10">
        <h2 className="text-2xl font-extrabold text-dc-text mb-5 text-center">
          혹시 이런 적 있으신가요?
        </h2>
        <div className="flex flex-col gap-4">
          {frustrations.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-dc-cream rounded-2xl p-5"
            >
              <span className="text-3xl shrink-0">{item.emoji}</span>
              <p className="text-xl text-dc-text leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-2xl font-extrabold text-dc-green leading-relaxed">
            괜찮아요.<br />
            그 답답함, 동치미학교가<br />
            시원하게 풀어드릴게요!
          </p>
        </div>
      </div>

      {/* 동치미 이름 유래 */}
      <div className="card mb-10 bg-amber-50 border-2 border-amber-200">
        <h2 className="text-2xl font-extrabold text-dc-text mb-3">
          🫙 왜 "동치미"일까요?
        </h2>
        <p className="text-xl text-dc-text-secondary leading-relaxed">
          <strong>동치미</strong>는 시원한 국물이 특징인 한국 전통 김치예요.
          답답할 때 시원한 동치미 국물 한 모금이면 속이 뻥 뚫리잖아요?
        </p>
        <p className="text-xl text-dc-text-secondary leading-relaxed mt-3">
          디지털 세상에서 답답했던 마음도,
          <strong className="text-dc-green"> 동치미학교에서 시원하게 해결</strong>하세요!
        </p>
      </div>

      {/* 약속 */}
      <h2 className="text-2xl font-extrabold text-dc-text mb-5">
        동치미학교의 약속
      </h2>
      <div className="flex flex-col gap-4 mb-10">
        {promises.map((p) => (
          <div key={p.title} className="card">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="text-xl font-extrabold text-dc-text">{p.title}</h3>
            </div>
            <p className="text-lg text-dc-text-secondary leading-relaxed">
              {p.description}
            </p>
          </div>
        ))}
      </div>

      {/* 이런 분들께 추천 */}
      <div className="card mb-10 bg-dc-green-bg border-2 border-dc-green-pale">
        <h2 className="text-2xl font-extrabold text-dc-green mb-4">
          이런 분들께 추천해요
        </h2>
        <div className="flex flex-col gap-3">
          {[
            '스마트폰이 아직 어려운 분',
            '키오스크, 무인기기가 겁나는 분',
            '인터넷 쇼핑을 배워보고 싶은 분',
            '보이스피싱이 걱정되는 분',
            '다시 일자리를 구하고 싶은 분',
            '자녀에게 묻기 미안한 분',
            'AI가 뭔지 궁금한 분',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-dc-green text-xl font-extrabold">✓</span>
              <p className="text-xl text-dc-text font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 프로그램 안내 */}
      <h2 className="text-2xl font-extrabold text-dc-text mb-5">
        지금 바로 시작해보세요
      </h2>
      <div className="flex flex-col gap-4">
        <Link to="/senior/learn" className="card flex items-center gap-5 hover:shadow-lg transition-shadow border-2 border-blue-100">
          <div className="text-4xl">📚</div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-dc-text">배움터</h3>
            <p className="text-lg text-dc-text-secondary">스마트폰, 인터넷, AI, 안전</p>
          </div>
          <ArrowRight size={28} className="text-blue-500" />
        </Link>
        <Link to="/senior/work" className="card flex items-center gap-5 hover:shadow-lg transition-shadow border-2 border-emerald-100">
          <div className="text-4xl">💼</div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-dc-text">일터</h3>
            <p className="text-lg text-dc-text-secondary">시니어 일자리 정보</p>
          </div>
          <ArrowRight size={28} className="text-emerald-500" />
        </Link>
        <Link to="/senior/ai" className="card flex items-center gap-5 hover:shadow-lg transition-shadow border-2 border-purple-100">
          <div className="text-4xl">🤖</div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-dc-text">AI비서</h3>
            <p className="text-lg text-dc-text-secondary">무엇이든 물어보세요!</p>
          </div>
          <ArrowRight size={28} className="text-purple-500" />
        </Link>
      </div>

      {/* 마무리 */}
      <div className="mt-10 text-center">
        <p className="text-2xl font-extrabold text-dc-text leading-relaxed mb-6">
          늦지 않았어요.<br />
          지금 시작하면 됩니다.
        </p>
        <Link to="/senior/learn" className="btn-primary w-full text-xl py-5">
          배움터에서 시작하기
        </Link>
      </div>
    </div>
  )
}
