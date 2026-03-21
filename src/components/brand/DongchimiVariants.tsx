import type { MoodId } from '@/data/moods'

interface VariantProps {
  size?: number
  className?: string
}

// 공통 SVG 래퍼
function Wrap({ size, className, children }: VariantProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size! * 1.1} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ck">
          <stop offset="0%" stopColor="#f48fb1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f48fb1" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  )
}

// 공통 몸통+새싹+머리띠 (headbandColor로 색 변경 가능)
function Body({ headbandColor = '#2d6a4f' }: { headbandColor?: string }) {
  return (
    <>
      <ellipse cx="100" cy="110" rx="38" ry="48" fill="#fefcfa" stroke="#e8e3db" strokeWidth="2" />
      <ellipse cx="100" cy="110" rx="34" ry="44" fill="#fefefe" />
      <path d="M76 72 Q73 95 76 145 Q78 151 84 155 Q80 149 78 145 Q74 95 78 74 Z" fill="white" opacity="0.5" />
      {/* 새싹 */}
      <path d="M100 66 Q100 46 100 34" stroke="#43a047" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M100 40 Q82 24 76 32 Q80 46 100 42" fill="#66bb6a" stroke="#4caf50" strokeWidth="1" />
      <path d="M100 40 Q118 24 124 32 Q120 46 100 42" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
      {/* 머리띠 */}
      <path d={`M64 74 Q100 66 136 74 Q138 84 134 88 Q100 80 66 88 Q62 84 64 74 Z`} fill={headbandColor} />
    </>
  )
}

function Legs() {
  return (
    <>
      <rect x="82" y="155" width="12" height="20" rx="6" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
      <ellipse cx="88" cy="175" rx="10" ry="5" fill="#2d6a4f" />
      <rect x="106" y="155" width="12" height="20" rx="6" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
      <ellipse cx="112" cy="175" rx="10" ry="5" fill="#2d6a4f" />
    </>
  )
}

function Eyes() {
  return (
    <>
      <ellipse cx="86" cy="102" rx="7" ry="8" fill="white" /><ellipse cx="88" cy="103" rx="4.5" ry="5.5" fill="#3e2723" /><circle cx="90" cy="100" r="2" fill="white" />
      <ellipse cx="114" cy="102" rx="7" ry="8" fill="white" /><ellipse cx="112" cy="103" rx="4.5" ry="5.5" fill="#3e2723" /><circle cx="110" cy="100" r="2" fill="white" />
    </>
  )
}

function Cheeks() {
  return (
    <>
      <ellipse cx="73" cy="116" rx="9" ry="6" fill="url(#ck)" />
      <ellipse cx="127" cy="116" rx="9" ry="6" fill="url(#ck)" />
    </>
  )
}

function Smile() {
  return <path d="M91 122 Q100 133 109 122" stroke="#8d6e63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
}

function Arm({ side, x, y }: { side: 'L' | 'R'; x: number; y: number }) {
  return (
    <>
      <path d={side === 'L' ? `M62 100 Q${x - 10} ${y - 10} ${x} ${y}` : `M138 100 Q${x + 10} ${y - 10} ${x} ${y}`} stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx={x} cy={y} r="8" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
    </>
  )
}

// ===== 8종 변형 =====

// 1. 감사해요 (두 손 모으고 꾸벅 인사)
function MoodThankful({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      {/* 두 손 모음 (앞에서 합장) */}
      <path d="M70 105 Q85 118 100 115" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <path d="M130 105 Q115 118 100 115" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="95" cy="116" r="7" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <circle cx="105" cy="116" r="7" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <Body /><Legs />
      {/* ^^ 눈 (감은 눈, 꾸벅 느낌) */}
      <path d="M80 102 Q86 96 92 102" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 102 Q114 96 120 102" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Cheeks /><Smile />
    </Wrap>
  )
}

// 2. 사랑해요 (하트눈)
function MoodLove({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={44} y={128} /><Arm side="R" x={156} y={128} />
      <Body /><Legs />
      <path d="M86 120 L76 111 C72 107 72 100 77 97 C82 94 86 96 86 102 C86 96 90 94 95 97 C100 100 100 107 96 111 Z" fill="#e91e63" />
      <path d="M114 120 L104 111 C100 107 100 100 105 97 C110 94 114 96 114 102 C114 96 118 94 123 97 C128 100 128 107 124 111 Z" fill="#e91e63" />
      <Cheeks /><Smile />
    </Wrap>
  )
}

// 3. 궁금해요 (안경 + 턱괴기)
function MoodCurious({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={48} y={138} />
      {/* 오른손 턱 */}
      <path d="M138 100 Q148 110 140 125" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="132" cy="126" r="8" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <Body /><Legs />
      <circle cx="86" cy="102" r="11" fill="none" stroke="#5d4037" strokeWidth="2.5" />
      <circle cx="114" cy="102" r="11" fill="none" stroke="#5d4037" strokeWidth="2.5" />
      <line x1="97" y1="102" x2="103" y2="102" stroke="#5d4037" strokeWidth="2.5" />
      <Eyes /><Cheeks />
      <path d="M93 122 Q100 128 107 122" stroke="#8d6e63" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Wrap>
  )
}

// 4. 심심해요 (한손 뺨 괴고 멍~)
function MoodBored({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={48} y={138} />
      {/* 오른손 뺨 괴기 */}
      <path d="M138 100 Q148 110 140 120" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="132" cy="120" r="8" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <Body /><Legs /><Eyes /><Cheeks />
      {/* 무표정 일자 입 */}
      <line x1="92" y1="122" x2="108" y2="122" stroke="#8d6e63" strokeWidth="2.5" strokeLinecap="round" />
    </Wrap>
  )
}

// 5. 속상해요 (양손 볼 + 축 처진 눈 + 처진 새싹)
function MoodSad({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      {/* 양손 볼 */}
      <path d="M62 95 Q48 105 55 115" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="58" cy="116" r="8" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <path d="M138 95 Q152 105 145 115" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="142" cy="116" r="8" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      {/* 몸통 */}
      <ellipse cx="100" cy="110" rx="38" ry="48" fill="#fefcfa" stroke="#e8e3db" strokeWidth="2" />
      <ellipse cx="100" cy="110" rx="34" ry="44" fill="#fefefe" />
      <path d="M76 72 Q73 95 76 145 Q78 151 84 155 Q80 149 78 145 Q74 95 78 74 Z" fill="white" opacity="0.5" />
      {/* 처진 새싹 (잎 크기 유지, 아래로 처짐) */}
      <path d="M100 66 Q98 50 96 40" stroke="#43a047" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M96 44 Q78 44 72 52 Q80 50 96 46" fill="#66bb6a" stroke="#4caf50" strokeWidth="1" />
      <path d="M96 44 Q96 58 88 66 Q92 56 96 46" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
      {/* 머리띠 */}
      <path d="M64 74 Q100 66 136 74 Q138 84 134 88 Q100 80 66 88 Q62 84 64 74 Z" fill="#2d6a4f" />
      <Legs />
      {/* 슬픈 눈 (축 처진) */}
      <ellipse cx="86" cy="102" rx="7" ry="8" fill="white" /><ellipse cx="88" cy="104" rx="4.5" ry="5" fill="#3e2723" /><circle cx="90" cy="101" r="2" fill="white" />
      <ellipse cx="114" cy="102" rx="7" ry="8" fill="white" /><ellipse cx="112" cy="104" rx="4.5" ry="5" fill="#3e2723" /><circle cx="110" cy="101" r="2" fill="white" />
      {/* 처진 눈썹 */}
      <line x1="80" y1="94" x2="92" y2="92" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="94" x2="108" y2="92" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
      <Cheeks />
      {/* 삐죽 입 */}
      <path d="M92 124 Q100 118 108 124" stroke="#8d6e63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Wrap>
  )
}

// 6. 졸려요 (축 늘어진 팔 + Zzz)
function MoodSleepy({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={50} y={145} /><Arm side="R" x={150} y={145} />
      <Body /><Legs />
      <path d="M80 104 Q86 100 92 104" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 104 Q114 100 120 104" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Cheeks />
      <path d="M94 122 Q100 118 106 122" stroke="#8d6e63" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="140" y="70" fill="#aaa" fontSize="16" fontWeight="800" fontFamily="sans-serif">Z</text>
      <text x="150" y="58" fill="#ccc" fontSize="11" fontWeight="800" fontFamily="sans-serif">z</text>
    </Wrap>
  )
}

// 7. 화나요 (화난 눈썹 + 볼 부풀림)
function MoodAngry({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={48} y={135} /><Arm side="R" x={152} y={135} />
      <Body /><Legs />
      {/* 화난 눈썹 */}
      <line x1="78" y1="90" x2="92" y2="94" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="122" y1="90" x2="108" y2="94" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
      <Eyes />
      {/* 부풀린 볼 */}
      <ellipse cx="71" cy="116" rx="11" ry="8" fill="#f48fb1" opacity="0.6" />
      <ellipse cx="129" cy="116" rx="11" ry="8" fill="#f48fb1" opacity="0.6" />
      {/* 삐죽 입 -->  */}
      <path d="M92 124 Q100 118 108 124" stroke="#8d6e63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Wrap>
  )
}

// 8. 신나요 (왼팔 흔들기 + 오른손 꽃)
function MoodExcited({ size = 140, className }: VariantProps) {
  return (
    <Wrap size={size} className={className}>
      <Arm side="L" x={38} y={110} />
      {/* 오른손 꽃 */}
      <path d="M138 95 Q155 75 150 55" stroke="#e0dbd3" strokeWidth="1.5" fill="#faf8f5" />
      <circle cx="150" cy="53" r="7" fill="#fefcfa" stroke="#e0dbd3" strokeWidth="1.5" />
      <circle cx="150" cy="38" r="4" fill="#ffeb3b" /><circle cx="145" cy="34" r="3.5" fill="#fff176" /><circle cx="155" cy="34" r="3.5" fill="#fff176" /><circle cx="145" cy="42" r="3.5" fill="#fff176" /><circle cx="155" cy="42" r="3.5" fill="#fff176" />
      <line x1="150" y1="42" x2="150" y2="51" stroke="#66bb6a" strokeWidth="2" />
      <Body /><Legs /><Eyes /><Cheeks /><Smile />
    </Wrap>
  )
}

// ===== 매핑 =====
const variantMap: Record<MoodId, (props: VariantProps) => React.JSX.Element> = {
  thankful: MoodThankful,
  love: MoodLove,
  curious: MoodCurious,
  bored: MoodBored,
  sad: MoodSad,
  sleepy: MoodSleepy,
  angry: MoodAngry,
  excited: MoodExcited,
}

export default function DongchimiMood({
  moodId,
  size = 140,
  className = '',
}: {
  moodId: MoodId
  size?: number
  className?: string
}) {
  const Component = variantMap[moodId]
  return <Component size={size} className={className} />
}
