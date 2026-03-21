export type MoodId = 'thankful' | 'love' | 'curious' | 'bored' | 'sad' | 'sleepy' | 'angry' | 'excited'

export interface MoodData {
  id: MoodId
  emoji: string
  label: string
  greeting: string
  encouragement: string
}

export const moods: MoodData[] = [
  {
    id: 'thankful',
    emoji: '🙏',
    label: '감사해요',
    greeting: '감사한 마음이시군요!',
    encouragement: '감사한 마음은 가장 큰 힘이에요. 오늘도 좋은 하루 보내세요!',
  },
  {
    id: 'love',
    emoji: '❤️',
    label: '사랑해요',
    greeting: '사랑이 가득하시군요!',
    encouragement: '사랑이 가득한 하루! 오늘도 멋진 하루 되세요~',
  },
  {
    id: 'curious',
    emoji: '🤔',
    label: '궁금해요',
    greeting: '궁금한 게 있으시군요!',
    encouragement: '궁금한 게 있으시군요? 동치미가 다 알려드릴게요!',
  },
  {
    id: 'bored',
    emoji: '😐',
    label: '심심해요',
    greeting: '심심하시군요!',
    encouragement: '심심할 땐 배움이 최고예요! 수업 듣고 신나게 놀러가요~',
  },
  {
    id: 'sad',
    emoji: '😢',
    label: '속상해요',
    greeting: '속상하셨군요.',
    encouragement: '괜찮아요, 동치미가 옆에 있을게요. 오늘 하루도 힘내봐요!',
  },
  {
    id: 'sleepy',
    emoji: '😴',
    label: '피곤해요',
    greeting: '피곤하시군요~',
    encouragement: '괜찮아요, 천천히 시작해요. 동치미가 기다릴게요~',
  },
  {
    id: 'angry',
    emoji: '😤',
    label: '화나요',
    greeting: '속상한 일이 있으셨군요.',
    encouragement: '속상한 일이 있으셨군요. 동치미가 시원하게 풀어드릴게요!',
  },
  {
    id: 'excited',
    emoji: '🎉',
    label: '신나요',
    greeting: '신이 나셨군요!',
    encouragement: '신나는 하루! 오늘 배움도 신나게 해봐요~',
  },
]

export function getMoodById(id: MoodId): MoodData | undefined {
  return moods.find(m => m.id === id)
}
