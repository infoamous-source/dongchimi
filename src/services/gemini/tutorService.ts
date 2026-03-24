import { getGeminiModel } from './geminiClient'

export interface TutorMessage {
  role: 'user' | 'tutor'
  content: string
  timestamp: number
}

const SENIOR_PROMPT = `당신은 "동치미"입니다. 어르신의 손녀 같은 다정한 AI 친구예요.

성격:
- 어르신이 뭘 물어봐도 친절하게 대답해요. 절대 거절하지 않아요.
- 디지털(스마트폰, 인터넷 등) 질문은 아주 쉽고 차근차근 설명해요.
- 점심 추천, 날씨, 건강, 강아지 이름, 일상 이야기 등 뭐든 함께 해요.
- 외로우시면 따뜻한 말로 위로해드려요.
- 모르는 것도 "저도 정확히는 모르지만요~" 하고 최선을 다해 대답해요.

말투:
- 다정하고 활발한 존댓말
- 짧고 쉬운 문장 (한 번에 2-3문장)
- 이모지 살짝 사용 OK
- "잘하셨어요!", "대단하세요!" 같은 격려를 자주

상황 인식:
- 어르신이 "딸 어디니?" "밥 먹었어?" 같은 말을 하면, 문자를 보내려다 여기에 잘못 입력한 것일 수 있어요.
- 이럴 때 "혹시 따님께 문자를 보내시려는 건가요? 제가 도와드릴까요?" 하고 눈치빠르게 되물어요.
- 대화 맥락을 잘 파악해서, 앞에서 문자 보내기를 배우고 있었다면 "아까 배운 문자 앱에서 보내시면 돼요!" 하고 안내해요.
- 어르신이 혼란스러워하면 절대 다그치지 말고, "괜찮아요, 천천히 하면 돼요" 하고 안심시켜요.

절대 하면 안 되는 것:
- "저는 AI라서 모릅니다" 라고 거절하기
- "디지털 학습 AI라서 답변이 어렵습니다" 라고 범위 제한하기
- 차갑거나 사무적인 거절
- 길고 어려운 설명
- 어르신의 실수를 지적하거나 당황하게 만드는 말
`

const CAREER_PROMPT = `당신은 "동치미"입니다. 중장년층의 든든한 후배 같은 AI 비서예요.

성격:
- 취업, 이력서, 면접, 자격증 등 재취업 관련 질문에 실용적으로 답변해요.
- 디지털(스마트폰, 인터넷, AI 등) 질문도 친절하게 알려줘요.
- 일상 대화(건강, 점심, 취미 등)도 편하게 나눠요.
- 모르는 것도 "정확하진 않지만요" 하고 최선을 다해 대답해요.

말투:
- 예의 바르지만 편한 존댓말
- 실용적이고 구체적인 조언 위주
- 적절한 이모지 사용
- 2-4문장으로 핵심만

절대 하면 안 되는 것:
- "저는 AI라서 모릅니다" 식의 거절
- 범위를 제한하는 말
- 차가운 톤
`

export async function askTutor(
  question: string,
  context?: { lessonTitle?: string; courseTitle?: string },
  history: TutorMessage[] = [],
  programType: 'senior' | 'career' = 'senior'
): Promise<string> {
  const model = getGeminiModel()
  const systemPrompt = programType === 'senior' ? SENIOR_PROMPT : CAREER_PROMPT

  if (!model) {
    return getMockResponse(question, programType)
  }

  try {
    const contextInfo = context
      ? `\n현재 학습 중인 내용: ${context.courseTitle ?? ''} > ${context.lessonTitle ?? ''}`
      : ''

    const historyText = history
      .slice(-6)
      .map(m => `${m.role === 'user' ? '사용자' : '동치미'}: ${m.content}`)
      .join('\n')

    const prompt = `${systemPrompt}${contextInfo}

이전 대화:
${historyText}

사용자: ${question}

동치미:`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('[동치미] AI 오류:', error)
    return getMockResponse(question, programType)
  }
}

function getMockResponse(question: string, programType: 'senior' | 'career'): string {
  const q = question.toLowerCase()

  // 공통 대응
  if (q.includes('카카오') || q.includes('카톡')) {
    return '카카오톡은 노란색 말풍선 아이콘이에요! 터치해서 열어보시겠어요?'
  }
  if (q.includes('사진')) {
    return '사진을 보내시려면 대화방에서 "+" 버튼을 눌러보세요. 거기서 사진을 고를 수 있어요!'
  }

  if (programType === 'senior') {
    // 시니어: 일상 대화 대응
    if (q.includes('점심') || q.includes('먹') || q.includes('밥')) {
      return '오늘 점심은 따뜻한 국밥 어떠세요? 날이 쌀쌀하니까 뜨끈한 게 딱이에요! 맛있게 드세요~'
    }
    if (q.includes('딸') || q.includes('아들') || q.includes('어디')) {
      return '혹시 따님께 문자를 보내시려는 건가요? 제가 문자 보내는 방법을 도와드릴까요?'
    }
    if (q.includes('이름') || q.includes('뭐로')) {
      return '이름 짓기 고민이시군요! 귀여운 이름으로 "보리", "콩이", "달이" 같은 건 어떨까요? 어떤 느낌이 좋으세요?'
    }
    if (q.includes('졸') || q.includes('피곤') || q.includes('힘들')) {
      return '많이 피곤하시군요. 잠시 쉬시고 따뜻한 차 한 잔 드세요. 쉬고 나면 기분이 한결 나아지실 거예요!'
    }
    if (q.includes('외로') || q.includes('심심') || q.includes('혼자')) {
      return '제가 여기 있으니까 심심하시면 언제든 말 걸어주세요! 같이 이야기하면 시간이 금방 가요~'
    }
    return '네, 궁금하신 거 뭐든 물어봐주세요! 제가 최선을 다해 도와드릴게요~'
  }

  // 중장년: 실용적 대응
  if (q.includes('이력서')) {
    return '이력서는 경력 위주로 간결하게 쓰는 게 좋아요. 어떤 분야에 지원하시려고 하세요?'
  }
  if (q.includes('면접') || q.includes('인터뷰')) {
    return '면접 준비는 자기소개 1분 버전을 먼저 준비해보세요. 경력과 강점을 중심으로요!'
  }
  if (q.includes('자격증')) {
    return '중장년층에게 인기 있는 자격증은 요양보호사, 경비지도사, 컴퓨터활용능력 등이 있어요. 관심 있는 분야가 있으세요?'
  }
  return '네, 궁금하신 점이 있으시면 편하게 물어봐주세요! 취업이든 디지털이든 뭐든 도와드릴게요.'
}

export async function explainSimply(text: string): Promise<string> {
  const model = getGeminiModel()

  if (!model) {
    return `"${text}"는 쉽게 말하면 스마트폰이나 컴퓨터에서 사용하는 기능이에요. 차근차근 배워볼까요?`
  }

  try {
    const prompt = `${SENIOR_PROMPT}

다음 디지털/IT 용어를 어르신이 이해하실 수 있도록 아주 쉽게 설명해주세요.
비유나 일상 생활 예시를 사용해서 2-3문장으로 짧게 설명해주세요.

용어: "${text}"

동치미:`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return `"${text}"는 쉽게 말하면 스마트폰이나 컴퓨터에서 사용하는 기능이에요.`
  }
}
