interface DongchimiCharacterProps {
  size?: 'full' | 'half' | 'icon' | 'mini'
  animated?: boolean
  className?: string
}

const sizeMap = {
  full: { width: 220, height: 286 },
  half: { width: 120, height: 156 },
  icon: { width: 56, height: 70 },
  mini: { width: 36, height: 45 },
}

export default function DongchimiCharacter({
  size = 'full',
  animated = true,
  className = '',
}: DongchimiCharacterProps) {
  const { width, height } = sizeMap[size]
  const anim = animated && (size === 'full' || size === 'half')

  return (
    <div
      className={`inline-flex items-center justify-center ${anim ? 'animate-[floatBounce_3s_ease-in-out_infinite]' : ''} ${className}`}
      style={{ width, height }}
    >
      <svg viewBox="0 0 200 260" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cheekG">
            <stop offset="0%" stopColor="#f48fb1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f48fb1" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="248" rx="45" ry="7" fill="#00000010" />

        {/* 왼팔 */}
        <g className={anim ? 'animate-[waveLeft_2s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '55px 140px' }}>
          <path d="M55 132 Q32 146 38 168 Q41 176 47 171 Q53 160 56 142 Z" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
          <circle cx="40" cy="170" r="8" fill="#a5d6a7" />
        </g>
        {/* 오른팔 */}
        <g className={anim ? 'animate-[waveRight_2.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '145px 140px' }}>
          <path d="M145 132 Q168 146 162 168 Q159 176 153 171 Q147 160 144 142 Z" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
          <circle cx="160" cy="170" r="8" fill="#a5d6a7" />
        </g>

        {/* 몸통 */}
        <ellipse cx="100" cy="148" rx="50" ry="68" fill="#fefcfa" stroke="#e8e3db" strokeWidth="2" />
        <ellipse cx="100" cy="148" rx="46" ry="64" fill="#fefefe" />
        <path d="M72 95 Q68 130 72 195 Q76 210 85 215 Q78 205 76 195 Q72 130 76 98 Z" fill="white" opacity="0.5" />

        {/* 새싹 */}
        <g className={anim ? 'animate-[wiggle_2.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '100px 84px' }}>
          <path d="M100 84 Q100 62 100 50" stroke="#43a047" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M100 58 Q80 42 74 50 Q78 64 100 62" fill="#66bb6a" stroke="#4caf50" strokeWidth="1" />
          <path d="M88 54 Q84 52 82 55" stroke="#4caf50" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M100 58 Q120 42 126 50 Q122 64 100 62" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
          <path d="M112 54 Q116 52 118 55" stroke="#388e3c" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* 머리띠 */}
        <path d="M52 98 Q100 90 148 98 Q150 110 146 114 Q100 106 54 114 Q50 110 52 98 Z" fill="#2d6a4f" />
        <path d="M60 100 Q100 94 140 100 Q100 96 60 102 Z" fill="#3a8a62" opacity="0.4" />

        {/* 눈 (고정) */}
        <ellipse cx="80" cy="138" rx="9" ry="10" fill="white" stroke="#e8e3db" strokeWidth="0.5" />
        <ellipse cx="82" cy="139" rx="5.5" ry="6.5" fill="#3e2723" />
        <circle cx="85" cy="135" r="2.8" fill="white" />
        <circle cx="83" cy="141" r="1.2" fill="white" opacity="0.4" />
        <ellipse cx="120" cy="138" rx="9" ry="10" fill="white" stroke="#e8e3db" strokeWidth="0.5" />
        <ellipse cx="118" cy="139" rx="5.5" ry="6.5" fill="#3e2723" />
        <circle cx="115" cy="135" r="2.8" fill="white" />
        <circle cx="117" cy="141" r="1.2" fill="white" opacity="0.4" />

        {/* 볼 */}
        <ellipse cx="64" cy="155" rx="14" ry="9" fill="url(#cheekG)" className={anim ? 'animate-[cheekGlow_2s_ease-in-out_infinite]' : ''} />
        <ellipse cx="136" cy="155" rx="14" ry="9" fill="url(#cheekG)" className={anim ? 'animate-[cheekGlow_2s_ease-in-out_infinite]' : ''} />

        {/* 입 */}
        <path d="M88 163 Q100 178 112 163" stroke="#8d6e63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="150" r="2" fill="#e0dbd3" />

        {/* 다리 */}
        <g className={anim ? 'animate-[stepLeft_1.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '85px 214px' }}>
          <rect x="78" y="212" width="14" height="24" rx="7" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
          <ellipse cx="85" cy="236" rx="12" ry="5.5" fill="#2d6a4f" />
        </g>
        <g className={anim ? 'animate-[stepRight_1.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '115px 214px' }}>
          <rect x="108" y="212" width="14" height="24" rx="7" fill="#faf8f5" stroke="#e0dbd3" strokeWidth="1.5" />
          <ellipse cx="115" cy="236" rx="12" ry="5.5" fill="#2d6a4f" />
        </g>
      </svg>
    </div>
  )
}

export function DongchimiIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 80" width={size} height={size * 1.25} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="42" rx="18" ry="24" fill="#fefcfa" stroke="#e8e3db" strokeWidth="1.5" />
      <path d="M32 20 Q32 12 32 8" stroke="#43a047" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M32 12 Q24 6 22 10 Q24 16 32 14" fill="#66bb6a" />
      <path d="M32 12 Q40 6 42 10 Q40 16 32 14" fill="#4caf50" />
      <path d="M16 28 Q32 25 48 28 Q49 32 47 34 Q32 31 17 34 Q15 32 16 28 Z" fill="#2d6a4f" />
      <ellipse cx="26" cy="40" rx="3.5" ry="4" fill="white" />
      <ellipse cx="27" cy="40.5" rx="2.2" ry="2.5" fill="#3e2723" />
      <circle cx="28.5" cy="38.5" r="1" fill="white" />
      <ellipse cx="38" cy="40" rx="3.5" ry="4" fill="white" />
      <ellipse cx="37" cy="40.5" rx="2.2" ry="2.5" fill="#3e2723" />
      <circle cx="35.5" cy="38.5" r="1" fill="white" />
      <ellipse cx="21" cy="46" rx="4" ry="3" fill="#f48fb1" opacity="0.5" />
      <ellipse cx="43" cy="46" rx="4" ry="3" fill="#f48fb1" opacity="0.5" />
      <path d="M28 49 Q32 55 36 49" stroke="#8d6e63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
