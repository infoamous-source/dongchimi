import type { Course } from '@/types/course'

export const courses: Course[] = [
  {
    id: 'smartphone',
    title: '스마트폰 기초',
    description: '카카오톡, 문자, 전화 등 기본 사용법을 배워요',
    icon: 'Smartphone',
    color: '#3b82f6',
    order: 1,
    modules: [
      {
        id: 'sm-basics',
        courseId: 'smartphone',
        title: '스마트폰 켜고 끄기',
        description: '전원 버튼, 화면 잠금, 기본 조작법',
        order: 1,
        lessons: [
          { id: 'sm-basics-1', moduleId: 'sm-basics', title: '전원 켜기와 끄기', content: '', type: 'text', duration: 5, order: 1 },
          { id: 'sm-basics-2', moduleId: 'sm-basics', title: '화면 잠금과 해제', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'sm-basics-3', moduleId: 'sm-basics', title: '화면 밝기와 소리 조절', content: '', type: 'text', duration: 5, order: 3 },
          { id: 'sm-basics-4', moduleId: 'sm-basics', title: '연습: 기본 조작해보기', content: '', type: 'practice', duration: 10, order: 4 },
        ],
      },
      {
        id: 'sm-call',
        courseId: 'smartphone',
        title: '전화와 문자',
        description: '전화 걸기, 받기, 문자 보내기',
        order: 2,
        lessons: [
          { id: 'sm-call-1', moduleId: 'sm-call', title: '전화 걸기', content: '', type: 'text', duration: 5, order: 1 },
          { id: 'sm-call-2', moduleId: 'sm-call', title: '전화 받기와 끊기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'sm-call-3', moduleId: 'sm-call', title: '문자 메시지 보내기', content: '', type: 'text', duration: 8, order: 3 },
          { id: 'sm-call-4', moduleId: 'sm-call', title: '연락처 저장하기', content: '', type: 'text', duration: 5, order: 4 },
        ],
      },
      {
        id: 'sm-kakao',
        courseId: 'smartphone',
        title: '카카오톡 배우기',
        description: '카카오톡 설치부터 메시지, 사진 보내기까지',
        order: 3,
        lessons: [
          { id: 'sm-kakao-1', moduleId: 'sm-kakao', title: '카카오톡 설치하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'sm-kakao-2', moduleId: 'sm-kakao', title: '친구 추가하기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'sm-kakao-3', moduleId: 'sm-kakao', title: '메시지 보내기', content: '', type: 'text', duration: 5, order: 3 },
          { id: 'sm-kakao-4', moduleId: 'sm-kakao', title: '사진과 영상 보내기', content: '', type: 'text', duration: 8, order: 4 },
        ],
      },
    ],
  },
  {
    id: 'internet',
    title: '인터넷 활용',
    description: '검색, 쇼핑, 은행 앱 사용하기',
    icon: 'Globe',
    color: '#22c55e',
    order: 2,
    modules: [
      {
        id: 'net-search',
        courseId: 'internet',
        title: '인터넷 검색하기',
        description: '네이버, 구글에서 원하는 정보 찾기',
        order: 1,
        lessons: [
          { id: 'net-search-1', moduleId: 'net-search', title: '네이버 검색하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'net-search-2', moduleId: 'net-search', title: '음성 검색 사용하기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'net-search-3', moduleId: 'net-search', title: '뉴스 읽기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
      {
        id: 'net-shopping',
        courseId: 'internet',
        title: '온라인 쇼핑',
        description: '쿠팡, 네이버쇼핑에서 물건 사기',
        order: 2,
        lessons: [
          { id: 'net-shop-1', moduleId: 'net-shopping', title: '쿠팡 앱 사용하기', content: '', type: 'text', duration: 10, order: 1 },
          { id: 'net-shop-2', moduleId: 'net-shopping', title: '상품 검색과 비교하기', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'net-shop-3', moduleId: 'net-shopping', title: '주문하고 배송 확인하기', content: '', type: 'text', duration: 8, order: 3 },
          { id: 'net-shop-4', moduleId: 'net-shopping', title: '연습: 쇼핑해보기', content: '', type: 'practice', duration: 10, order: 4 },
        ],
      },
      {
        id: 'net-bank',
        courseId: 'internet',
        title: '모바일 뱅킹',
        description: '은행 앱으로 잔액 확인, 송금하기',
        order: 3,
        lessons: [
          { id: 'net-bank-1', moduleId: 'net-bank', title: '은행 앱 설치하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'net-bank-2', moduleId: 'net-bank', title: '잔액 확인하기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'net-bank-3', moduleId: 'net-bank', title: '송금하기', content: '', type: 'text', duration: 10, order: 3 },
          { id: 'net-bank-4', moduleId: 'net-bank', title: '연습: ATM 사용하기', content: '', type: 'practice', duration: 10, order: 4 },
        ],
      },
    ],
  },
  {
    id: 'ai-basics',
    title: 'AI와 친해지기',
    description: 'AI 비서, 챗GPT 활용법 배우기',
    icon: 'Brain',
    color: '#a855f7',
    order: 3,
    modules: [
      {
        id: 'ai-intro',
        courseId: 'ai-basics',
        title: 'AI가 뭐예요?',
        description: 'AI를 쉽게 이해하기',
        order: 1,
        lessons: [
          { id: 'ai-intro-1', moduleId: 'ai-intro', title: 'AI란 무엇인가요?', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'ai-intro-2', moduleId: 'ai-intro', title: '우리 생활 속 AI', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'ai-intro-3', moduleId: 'ai-intro', title: 'AI 비서 종류 알아보기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
      {
        id: 'ai-chat',
        courseId: 'ai-basics',
        title: 'AI와 대화하기',
        description: 'AI에게 질문하고 답 받기',
        order: 2,
        lessons: [
          { id: 'ai-chat-1', moduleId: 'ai-chat', title: 'AI에게 질문하는 법', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'ai-chat-2', moduleId: 'ai-chat', title: '좋은 질문 만들기', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'ai-chat-3', moduleId: 'ai-chat', title: '연습: AI와 대화해보기', content: '', type: 'practice', duration: 15, order: 3 },
        ],
      },
      {
        id: 'ai-daily',
        courseId: 'ai-basics',
        title: 'AI 일상 활용',
        description: '번역, 요리법, 건강 정보 등',
        order: 3,
        lessons: [
          { id: 'ai-daily-1', moduleId: 'ai-daily', title: 'AI로 번역하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'ai-daily-2', moduleId: 'ai-daily', title: 'AI에게 요리법 물어보기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'ai-daily-3', moduleId: 'ai-daily', title: 'AI로 글쓰기 도움받기', content: '', type: 'text', duration: 8, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'safety',
    title: '디지털 안전',
    description: '보이스피싱, 스미싱 예방법을 배워요',
    icon: 'ShieldCheck',
    color: '#ef4444',
    order: 4,
    modules: [
      {
        id: 'safe-phishing',
        courseId: 'safety',
        title: '보이스피싱 예방',
        description: '전화 사기 알아보고 대처하기',
        order: 1,
        lessons: [
          { id: 'safe-ph-1', moduleId: 'safe-phishing', title: '보이스피싱이란?', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'safe-ph-2', moduleId: 'safe-phishing', title: '의심스러운 전화 구별하기', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'safe-ph-3', moduleId: 'safe-phishing', title: '피해 시 대처방법', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
      {
        id: 'safe-smishing',
        courseId: 'safety',
        title: '스미싱 예방',
        description: '문자 사기 알아보고 대처하기',
        order: 2,
        lessons: [
          { id: 'safe-sm-1', moduleId: 'safe-smishing', title: '스미싱이란?', content: '', type: 'text', duration: 5, order: 1 },
          { id: 'safe-sm-2', moduleId: 'safe-smishing', title: '위험한 링크 구별하기', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'safe-sm-3', moduleId: 'safe-smishing', title: '안전한 앱 설치 방법', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'camera',
    title: '사진과 영상',
    description: '사진 찍기, 편집, 공유하는 법',
    icon: 'Camera',
    color: '#f59e0b',
    order: 5,
    modules: [
      {
        id: 'cam-photo',
        courseId: 'camera',
        title: '사진 찍기',
        description: '카메라 앱 사용하기',
        order: 1,
        lessons: [
          { id: 'cam-ph-1', moduleId: 'cam-photo', title: '카메라 앱 열기', content: '', type: 'text', duration: 5, order: 1 },
          { id: 'cam-ph-2', moduleId: 'cam-photo', title: '예쁘게 사진 찍는 법', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'cam-ph-3', moduleId: 'cam-photo', title: '셀카 찍기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
      {
        id: 'cam-edit',
        courseId: 'camera',
        title: '사진 편집과 공유',
        description: '사진 꾸미기, 카톡으로 보내기',
        order: 2,
        lessons: [
          { id: 'cam-ed-1', moduleId: 'cam-edit', title: '사진 밝기 조절하기', content: '', type: 'text', duration: 5, order: 1 },
          { id: 'cam-ed-2', moduleId: 'cam-edit', title: '사진 자르기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'cam-ed-3', moduleId: 'cam-edit', title: '카카오톡으로 사진 보내기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'sns',
    title: 'SNS 배우기',
    description: '유튜브, 인스타그램, 밴드 사용법',
    icon: 'MessageCircle',
    color: '#ec4899',
    order: 6,
    modules: [
      {
        id: 'sns-youtube',
        courseId: 'sns',
        title: '유튜브 보기',
        description: '영상 검색, 구독, 저장하기',
        order: 1,
        lessons: [
          { id: 'sns-yt-1', moduleId: 'sns-youtube', title: '유튜브 앱 사용하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'sns-yt-2', moduleId: 'sns-youtube', title: '원하는 영상 찾기', content: '', type: 'text', duration: 5, order: 2 },
          { id: 'sns-yt-3', moduleId: 'sns-youtube', title: '채널 구독하기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
      {
        id: 'sns-band',
        courseId: 'sns',
        title: '네이버 밴드',
        description: '동호회, 모임 활동하기',
        order: 2,
        lessons: [
          { id: 'sns-band-1', moduleId: 'sns-band', title: '밴드 앱 시작하기', content: '', type: 'text', duration: 8, order: 1 },
          { id: 'sns-band-2', moduleId: 'sns-band', title: '밴드 가입하고 글 쓰기', content: '', type: 'text', duration: 8, order: 2 },
          { id: 'sns-band-3', moduleId: 'sns-band', title: '사진 올리고 댓글 달기', content: '', type: 'text', duration: 5, order: 3 },
        ],
      },
    ],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id)
}

export function getLessonById(lessonId: string) {
  for (const course of courses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId)
      if (lesson) return { lesson, module, course }
    }
  }
  return null
}

export function getNextLesson(currentLessonId: string) {
  for (const course of courses) {
    const allLessons = course.modules.flatMap(m => m.lessons)
    const idx = allLessons.findIndex(l => l.id === currentLessonId)
    if (idx !== -1 && idx < allLessons.length - 1) {
      return allLessons[idx + 1]
    }
  }
  return null
}
