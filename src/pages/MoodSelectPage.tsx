import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMood } from '@/contexts/MoodContext'
import { moods, type MoodId } from '@/data/moods'
import { logActivity } from '@/services/activityService'
import DongchimiMood from '@/components/brand/DongchimiVariants'

export default function MoodSelectPage() {
  const { user } = useAuth()
  const { setMood } = useMood()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<MoodId | null>(null)
  const selectedMood = moods.find(m => m.id === selected)

  const handleSelect = (id: MoodId) => {
    setSelected(id)
  }

  const handleConfirm = () => {
    if (!selected) return
    setMood(selected)
    if (user) logActivity(user.id, 'mood_selected', { moodId: selected })
    navigate('/senior')
  }

  // Step 2: 응답 화면
  if (selected && selectedMood) {
    const name = user?.name || '회원'
    return (
      <div className="min-h-screen bg-dc-cream flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="animate-[floatBounce_3s_ease-in-out_infinite]">
          <DongchimiMood moodId={selected} size={200} />
        </div>

        <h2 className="text-2xl font-extrabold text-dc-text mt-4 text-center leading-relaxed">
          {name}님,<br />오늘 {selectedMood.greeting}
        </h2>
        <p className="text-xl text-dc-text-secondary mt-4 text-center leading-relaxed max-w-sm">
          {selectedMood.encouragement}
        </p>

        <p className="text-xl text-dc-green font-bold mt-8">
          오늘의 동치미가 수업을 안내할게요!
        </p>

        <button onClick={handleConfirm} className="btn-primary w-full max-w-sm text-xl mt-4 py-5">
          교실 입장
        </button>
      </div>
    )
  }

  // Step 1: 기분 선택
  return (
    <div className="min-h-screen bg-dc-cream px-4 py-8 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-dc-text text-center mb-2">
          오늘 나의 기분은?
        </h1>
        <p className="text-xl text-dc-text-secondary text-center mb-8">
          동치미로 표현해보세요!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className="card text-center hover:shadow-lg transition-all border-2 border-transparent hover:border-dc-green p-3"
            >
              <DongchimiMood moodId={mood.id} size={110} className="mx-auto" />
              <p className="text-lg font-extrabold text-dc-text mt-2">{mood.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
