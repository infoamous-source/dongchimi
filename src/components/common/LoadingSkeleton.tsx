import { useMood } from '@/contexts/MoodContext'
import DongchimiMood from '@/components/brand/DongchimiVariants'
import { DongchimiIcon } from '@/components/brand/DongchimiCharacter'

export default function LoadingSkeleton() {
  const { moodId } = useMood()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-[floatBounce_1.5s_ease-in-out_infinite]">
        {moodId ? <DongchimiMood moodId={moodId} size={56} /> : <DongchimiIcon size={56} />}
      </div>
      <p className="text-dc-text-secondary text-lg font-medium">잠시만 기다려주세요...</p>
    </div>
  )
}
