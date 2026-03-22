export interface CareerCourse {
  id: string
  title: string
  description: string
  icon: string
  type: 'lesson' | 'tool' | 'info'
}

export const careerCourses: CareerCourse[] = [
  {
    id: 'resume-write',
    title: '이력서 쓰는 법',
    description: '기본 이력서 작성 방법을 차근차근 배워요',
    icon: '📝',
    type: 'lesson',
  },
  {
    id: 'cover-letter',
    title: '자기소개서 쓰는 법',
    description: '나를 잘 표현하는 자기소개서를 작성해요',
    icon: '✍️',
    type: 'lesson',
  },
  {
    id: 'ai-resume',
    title: 'AI로 이력서 쓰기',
    description: 'AI 도우미가 이력서 작성을 도와드려요',
    icon: '🤖',
    type: 'tool',
  },
  {
    id: 'ai-cover-letter',
    title: 'AI로 자기소개서 쓰기',
    description: 'AI 도우미가 자기소개서 작성을 도와드려요',
    icon: '🤖',
    type: 'tool',
  },
  {
    id: 'templates',
    title: '양식 다운로드',
    description: '이력서, 자기소개서 양식을 받아보세요',
    icon: '📄',
    type: 'tool',
  },
  {
    id: 'job-board',
    title: '채용공고 정보',
    description: '시니어 채용 사이트와 최신 공고를 확인해요',
    icon: '🔍',
    type: 'info',
  },
]

export interface JobSite {
  name: string
  url: string
  description: string
}

export const jobSites: JobSite[] = [
  { name: '워크넷', url: 'https://www.work.go.kr', description: '고용노동부 공식 취업 사이트' },
  { name: '시니어 잡', url: 'https://www.seniorjob.or.kr', description: '시니어 전문 채용 정보' },
  { name: '사람인', url: 'https://www.saramin.co.kr', description: '종합 채용 포털' },
  { name: '잡코리아', url: 'https://www.jobkorea.co.kr', description: '종합 채용 포털' },
  { name: '벼룩시장', url: 'https://www.findjob.co.kr', description: '지역 기반 구인구직' },
  { name: '알바천국', url: 'https://www.alba.co.kr', description: '아르바이트 전문' },
]

export interface ResumeTemplate {
  id: string
  title: string
  description: string
  format: string
}

export const resumeTemplates: ResumeTemplate[] = [
  { id: 'basic-resume', title: '기본 이력서', description: '가장 많이 쓰는 표준 이력서 양식', format: 'HWP/PDF' },
  { id: 'simple-resume', title: '간단 이력서', description: '핵심 정보만 담은 간단한 양식', format: 'HWP/PDF' },
  { id: 'basic-cover', title: '기본 자기소개서', description: '기본적인 자기소개서 양식', format: 'HWP/PDF' },
  { id: 'senior-cover', title: '시니어 자기소개서', description: '경력과 경험을 강조하는 양식', format: 'HWP/PDF' },
]
