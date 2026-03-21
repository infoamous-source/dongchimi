# 동치미학교 작업 보고서
> 2026-03-20 ~ 2026-03-21

---

## ✅ 완료된 작업

### 1. 프로젝트 초기 세팅
- React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Supabase + Gemini AI
- 폴더 구조, 설정 파일, 환경변수, DB 스키마(`supabase/schema.sql`)

### 2. 깍두기학교 마케팅학과 제거
- 55+ 파일 삭제 (components, pages, data, services, hooks, types)
- 9개 파일 수정 (App.tsx, enrollment.ts, track.ts 등)
- 빌드 통과 확인

### 3. 시니어 특화 UI/UX
- i18n 제거 → 한국어 직접 사용
- 폰트 크기 극대화 (본문 20px+, 제목 28px+, text-sm/xs 사용 금지)
- 1열 시원한 카드 레이아웃 (2열 그리드 제거)
- 색상 대비 강화 (#3a3a4a, #555566)
- 하단 네비 개선 (15px 굵게, 활성탭 초록 배경)
- 버튼 크기 증가 (4rem, font-weight 800, box-shadow)

### 4. 메인 구조 (4섹션)
- **학교소개** (`/about`) — 공감 섹션, 이름 유래, 약속 6가지, 추천 대상
- **배움터** (`/learn`) — 강좌 6개 + 실전 연습 4개 + 키오스크
- **일터** (`/work`) — 이력서/자소서 AI작성, 양식, 채용정보 6개 사이트
- **AI비서** (`/ai`) — 시니어 전용 대화형 AI (Gemini + mock)

### 5. 배움터 상세 페이지
- 강좌 상세 (`CourseDetailPage`) — 모듈별 수업 목록, 진도 바
- 수업 뷰어 (`LessonPage`) — 섹션별 내용, 팁 박스, AI 질문 링크
- 연습 시뮬레이터 (`PracticeDetailPage`) — 단계별 선택지, 피드백, confetti
- 진도 관리 서비스 + 훅 (`progressService`, `useCourseProgress`)

### 6. 일터 상세 페이지
- AI 이력서 작성 (`/work/ai-resume`) — 폼 입력 → Gemini 생성 → 복사
- AI 자기소개서 작성 (`/work/ai-cover-letter`) — 동일 패턴
- 양식 다운로드 (`/work/templates`) — 4개 양식 (준비 중)
- 채용공고 정보 (`/work/job-board`) — 6개 사이트 + 고용센터 안내

### 7. 동치미 캐릭터 시스템
- 하얀 무 + 초록 새싹 + 초록 머리띠 기본 디자인
- 장독대 버전 10종 + 전신 버전 10종 디자인 완료
- React 컴포넌트화 (`DongchimiCharacter.tsx`, `DongchimiVariants.tsx`)
- 앱 곳곳에 캐릭터 배치 (헤더, 홈, 학교소개, AI비서, 로딩, 로그인/회원가입)

### 8. 오늘의 기분 선택 시스템
- 기분 선택 페이지 (`/mood`) — 8종 캐릭터 카드 선택
- 응답 화면 (이름+응원문구 → 교실 입장)
- MoodContext (localStorage, 날짜 기반 리셋)
- 선택한 캐릭터 전역 반영 (헤더, 홈, AI비서, 로딩)

### 9. 카페 키오스크 시뮬레이터
- 8단계 플로우: 시작 → 매장/포장 → 메뉴 → 옵션 → 확인 → 결제 → 처리 → 완료
- 메뉴 12개 (커피/음료/디저트), 옵션 4개
- 장바구니, 수량 조절, 삭제 기능
- 도우미 말풍선 (화면별 안내 메시지)
- 진행률 바, 페이드 전환, confetti 완료
- 배움터에서 "키오스크 연습" 바로가기

---

## 🔲 미완료 / 추후 작업

### 높은 우선순위
- [ ] **Git 초기 커밋 + 배포** (Vercel)
- [ ] **Supabase 연동** — 현재 오프라인 모드, 실제 DB 연결 필요
- [ ] **수업 콘텐츠 추가** — 현재 7개 수업만 lessonContents에 내용 있음 (나머지 빈 상태)
- [ ] **양식 다운로드 파일 업로드** — 실제 HWP/PDF 양식 파일

### 키오스크 확장
- [ ] 패스트푸드 키오스크 (데이터+스크린 추가)
- [ ] 영화관 키오스크 (좌석 선택 UI)
- [ ] 병원 접수 키오스크 (서비스 선택 패턴)
- [ ] 은행 ATM 키오스크

### 기능 개선
- [ ] 프로필 페이지 — 학습 통계 실제 데이터 연동
- [ ] 수업 완료 시 confetti + 축하 화면
- [ ] AI비서 대화 기록 저장 (Supabase ai_conversations)
- [ ] 오늘의 기분 통계/기록 (Supabase 저장)
- [ ] PWA 지원 (vite-plugin-pwa Vite 8 호환 대기)

### 콘텐츠
- [ ] 강좌별 수업 콘텐츠 전체 작성 (현재 skeleton)
- [ ] 연습 시나리오 추가 (현재 4개)
- [ ] 채용공고 게시판 — 실시간 크롤링 or 수동 업데이트
- [ ] 이력서/자기소개서 쓰는 법 — 학습 콘텐츠 (현재 AI비서 연결만)

### 디자인/UX
- [ ] 캐릭터 장독대 버전 앱 내 적용 (현재 전신 버전만 적용)
- [ ] 다크모드 (시니어 눈 보호)
- [ ] 글씨 크기 조절 설정
- [ ] 캐릭터 10종 전체 React 컴포넌트화 (현재 기분 8종만)

---

## 📁 파일 구조 요약

```
dongchimi/
├── src/
│   ├── App.tsx                    # 라우터 + MoodProvider
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── MoodContext.tsx         # 오늘의 기분
│   ├── components/
│   │   ├── brand/
│   │   │   ├── DongchimiCharacter.tsx    # 기본 캐릭터
│   │   │   └── DongchimiVariants.tsx     # 기분 8종
│   │   ├── common/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopHeader.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── kiosk/
│   │       ├── CafeKiosk.tsx             # 카페 키오스크 메인
│   │       ├── data.ts                   # 메뉴/옵션/유틸
│   │       └── screens/ (8개)
│   ├── pages/ (18개)
│   │   ├── MoodSelectPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LearnHubPage.tsx
│   │   ├── KioskPracticePage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── LessonPage.tsx
│   │   ├── PracticePage/DetailPage.tsx
│   │   ├── CareerHubPage.tsx
│   │   ├── AiResumePage/AiCoverLetterPage.tsx
│   │   ├── TemplatesPage/JobBoardPage.tsx
│   │   ├── AiBiseoPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── LoginPage/RegisterPage.tsx
│   ├── data/
│   │   ├── courses.ts, lessonContents.ts, practices.ts
│   │   ├── moods.ts, careerData.ts
│   │   └── ...
│   ├── services/, hooks/, types/, lib/
│   └── assets/
│       ├── characters-10-jar.html
│       └── characters-10-nojar.html
├── supabase/schema.sql
├── preview.html, character-preview.html, mood-preview.html
└── WORK_REPORT.md
```
