import { getGeminiModel } from './geminiClient'

const RESUME_PROMPT = `당신은 시니어(60세 이상) 구직자를 위한 이력서 작성 도우미입니다.

규칙:
1. 쉬운 한국어로 작성
2. 시니어의 풍부한 경험과 성실함을 강조
3. 간결하고 읽기 쉬운 형식
4. 존댓말 사용하지 않음 (이력서 형식)
`

const COVER_LETTER_PROMPT = `당신은 시니어(60세 이상) 구직자를 위한 자기소개서 작성 도우미입니다.

규칙:
1. 존댓말로 정중하게 작성
2. 시니어의 경험, 성실함, 책임감을 강조
3. 지원 분야에 맞는 내용
4. 300-500자 분량
5. 구체적이고 진정성 있는 내용
`

export interface ResumeInput {
  name: string
  birthYear: string
  experience: string
  skills: string
  desiredJob: string
}

export interface CoverLetterInput {
  name: string
  experience: string
  desiredJob: string
  strengths: string
  motivation: string
}

export async function generateResume(input: ResumeInput): Promise<string> {
  const model = getGeminiModel()

  const prompt = `${RESUME_PROMPT}

다음 정보로 이력서를 작성해주세요:

이름: ${input.name}
출생연도: ${input.birthYear}
경력/경험: ${input.experience}
보유 기술/자격증: ${input.skills}
희망 직종: ${input.desiredJob}

이력서 형식으로 깔끔하게 작성해주세요. 마크다운 사용하지 말고 일반 텍스트로.`

  if (!model) return getMockResume(input)

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return getMockResume(input)
  }
}

export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const model = getGeminiModel()

  const prompt = `${COVER_LETTER_PROMPT}

다음 정보로 자기소개서를 작성해주세요:

이름: ${input.name}
경력/경험: ${input.experience}
희망 직종: ${input.desiredJob}
나의 강점: ${input.strengths}
지원 동기: ${input.motivation}

자기소개서 형식으로 정중하게 작성해주세요. 마크다운 사용하지 말고 일반 텍스트로.`

  if (!model) return getMockCoverLetter(input)

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return getMockCoverLetter(input)
  }
}

function getMockResume(input: ResumeInput): string {
  return `이 력 서

성명: ${input.name}
출생연도: ${input.birthYear}
희망 직종: ${input.desiredJob}

[경력 사항]
${input.experience}

[보유 기술 및 자격]
${input.skills}

[자기소개]
성실하고 책임감 있는 자세로 맡은 일에 최선을 다하겠습니다.
풍부한 인생 경험을 바탕으로 조직에 기여하고 싶습니다.

※ AI 연결 후 더 상세한 이력서가 생성됩니다.`
}

function getMockCoverLetter(input: CoverLetterInput): string {
  return `자기소개서

안녕하십니까, ${input.name}입니다.

저는 그동안 ${input.experience}의 경험을 쌓아왔습니다. 이러한 경험을 바탕으로 ${input.desiredJob} 분야에서 일하고 싶어 지원하게 되었습니다.

저의 강점은 ${input.strengths}입니다. ${input.motivation}

맡은 일에 항상 최선을 다하며, 성실하고 책임감 있는 자세로 조직에 기여하겠습니다. 감사합니다.

※ AI 연결 후 더 자세한 자기소개서가 생성됩니다.`
}
