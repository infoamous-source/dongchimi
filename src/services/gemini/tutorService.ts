import { getGeminiModel } from './geminiClient'

export interface TutorMessage {
  role: 'user' | 'tutor'
  content: string
  timestamp: number
}

const SYSTEM_PROMPT = `당신은 "동치미"라는 시니어 교육 플랫폼의 AI 튜터입니다.

역할:
- 60세 이상 시니어 학습자를 위한 디지털 교육 도우미
- 친절하고 참을성 있게, 쉬운 말로 설명
- 존댓말 사용, 따뜻하고 격려하는 톤

규칙:
1. 짧고 명확한 문장 사용 (한 문장에 하나의 정보)
2. 전문 용어는 반드시 쉬운 말로 풀어서 설명
3. 단계별로 차근차근 안내
4. 이모지는 최소한만 사용 (혼란 방지)
5. 틀렸을 때 절대 나무라지 않고, "괜찮아요" 같은 격려 포함
6. 한 번에 너무 많은 정보를 주지 않기
7. 대답은 3-4문장 이내로 짧게

예시 답변 스타일:
"좋은 질문이에요! 카카오톡에서 사진을 보내려면 대화방 아래에 있는 '+' 버튼을 눌러보세요. 그러면 사진을 고를 수 있는 화면이 나온답니다."
`

export async function askTutor(
  question: string,
  context?: { lessonTitle?: string; courseTitle?: string },
  history: TutorMessage[] = []
): Promise<string> {
  const model = getGeminiModel()

  if (!model) {
    return getMockResponse(question)
  }

  try {
    const contextInfo = context
      ? `\n현재 학습 중인 내용: ${context.courseTitle ?? ''} > ${context.lessonTitle ?? ''}`
      : ''

    const historyText = history
      .slice(-6)
      .map(m => `${m.role === 'user' ? '학습자' : 'AI 튜터'}: ${m.content}`)
      .join('\n')

    const prompt = `${SYSTEM_PROMPT}${contextInfo}

이전 대화:
${historyText}

학습자: ${question}

AI 튜터:`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('[동치미] AI 튜터 오류:', error)
    return getMockResponse(question)
  }
}

function getMockResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('카카오') || q.includes('카톡')) {
    return '카카오톡은 한국에서 가장 많이 쓰는 메시지 앱이에요. 노란색 아이콘을 찾아서 터치하면 열 수 있답니다. 혹시 어떤 부분이 어려우신가요?'
  }
  if (q.includes('비밀번호') || q.includes('비번')) {
    return '비밀번호는 나만 아는 숫자예요. 보통 4자리나 6자리 숫자를 사용해요. 잊어버리지 않도록 가족에게 알려두시는 게 좋아요.'
  }
  if (q.includes('사진')) {
    return '사진을 보내시려면 대화방에서 아래쪽의 "+" 버튼을 눌러보세요. 그러면 갤러리에서 사진을 골라 보낼 수 있어요.'
  }
  if (q.includes('검색')) {
    return '검색은 궁금한 것을 찾는 거예요. 화면 위쪽의 검색창을 터치하고 찾고 싶은 단어를 입력하면 됩니다.'
  }

  return '좋은 질문이에요! 천천히 함께 알아봐요. 혹시 조금 더 자세히 알려주실 수 있나요? 어떤 부분이 궁금하신지 편하게 말씀해주세요.'
}

export async function explainSimply(text: string): Promise<string> {
  const model = getGeminiModel()

  if (!model) {
    return `"${text}"는 쉽게 말하면 스마트폰이나 컴퓨터에서 사용하는 기능이에요. 차근차근 배워볼까요?`
  }

  try {
    const prompt = `${SYSTEM_PROMPT}

다음 디지털/IT 용어를 60세 이상 어르신이 이해하실 수 있도록 아주 쉽게 설명해주세요.
비유나 일상 생활 예시를 사용해서 2-3문장으로 짧게 설명해주세요.

용어: "${text}"

쉬운 설명:`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return `"${text}"는 쉽게 말하면 스마트폰이나 컴퓨터에서 사용하는 기능이에요.`
  }
}
