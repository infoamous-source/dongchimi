import { Link } from 'react-router-dom'
import { useMood } from '@/contexts/MoodContext'
import DongchimiMood from '@/components/brand/DongchimiVariants'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function TopHeader() {
  const { moodId } = useMood()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          {moodId ? <DongchimiMood moodId={moodId} size={32} /> : <DongchimiIcon size={32} />}
          <h1 className="text-dc-green font-extrabold text-xl tracking-tight">
            동치미학교
          </h1>
        </Link>
      </div>
    </header>
  )
}
