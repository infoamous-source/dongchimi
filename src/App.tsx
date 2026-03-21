import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { MoodProvider, useMood } from '@/contexts/MoodContext'
import MainLayout from '@/components/common/MainLayout'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'

// 기분 선택
const MoodSelectPage = lazy(() => import('@/pages/MoodSelectPage'))

// 메인 섹션
const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AiBiseoPage = lazy(() => import('@/pages/AiBiseoPage'))

// 배움터
const LearnHubPage = lazy(() => import('@/pages/LearnHubPage'))
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'))
const LessonPage = lazy(() => import('@/pages/LessonPage'))
const PracticePage = lazy(() => import('@/pages/PracticePage'))
const PracticeDetailPage = lazy(() => import('@/pages/PracticeDetailPage'))
const KioskPracticePage = lazy(() => import('@/pages/KioskPracticePage'))

// 일터
const CareerHubPage = lazy(() => import('@/pages/CareerHubPage'))
const AiResumePage = lazy(() => import('@/pages/AiResumePage'))
const AiCoverLetterPage = lazy(() => import('@/pages/AiCoverLetterPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))
const JobBoardPage = lazy(() => import('@/pages/JobBoardPage'))

// 기타
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))

// 홈 진입 시 기분 체크
function HomeOrMood() {
  const { hasMoodToday } = useMood()
  if (!hasMoodToday) return <Navigate to="/mood" replace />
  return <HomePage />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoodProvider>
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              {/* 기분 선택 (독립 페이지, 네비 없음) */}
              <Route path="/mood" element={<MoodSelectPage />} />

              <Route element={<MainLayout />}>
                <Route path="/" element={<HomeOrMood />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/learn" element={<LearnHubPage />} />
                <Route path="/learn/practice" element={<PracticePage />} />
                <Route path="/learn/practice/:practiceId" element={<PracticeDetailPage />} />
                <Route path="/learn/kiosk" element={<KioskPracticePage />} />
              <Route path="/learn/:courseId" element={<CourseDetailPage />} />
                <Route path="/learn/:courseId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/work" element={<CareerHubPage />} />
                <Route path="/work/ai-resume" element={<AiResumePage />} />
                <Route path="/work/ai-cover-letter" element={<AiCoverLetterPage />} />
                <Route path="/work/templates" element={<TemplatesPage />} />
                <Route path="/work/job-board" element={<JobBoardPage />} />
                <Route path="/ai" element={<AiBiseoPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/courses" element={<Navigate to="/learn" replace />} />
                <Route path="/career" element={<Navigate to="/work" replace />} />
                <Route path="/tutor" element={<Navigate to="/ai" replace />} />
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </MoodProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
