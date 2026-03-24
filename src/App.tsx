import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { MoodProvider, useMood } from '@/contexts/MoodContext'
import MainLayout from '@/components/common/MainLayout'
import SubscriptionCheck from '@/components/common/SubscriptionCheck'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'

// 프로그램 선택
const ProgramSelectPage = lazy(() => import('@/pages/ProgramSelectPage'))

// 초시니어 프로그램
const MoodSelectPage = lazy(() => import('@/pages/MoodSelectPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AiBiseoPage = lazy(() => import('@/pages/AiBiseoPage'))
const LearnHubPage = lazy(() => import('@/pages/LearnHubPage'))
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'))
const LessonPage = lazy(() => import('@/pages/LessonPage'))
const PracticePage = lazy(() => import('@/pages/PracticePage'))
const PracticeDetailPage = lazy(() => import('@/pages/PracticeDetailPage'))
const KioskPracticePage = lazy(() => import('@/pages/KioskPracticePage'))
const CareerHubPage = lazy(() => import('@/pages/CareerHubPage'))

// 중장년층 프로그램
const CareerProgramPage = lazy(() => import('@/pages/CareerProgramPage'))
const CareerDigitalPage = lazy(() => import('@/pages/CareerDigitalPage'))
const CareerWorkPage = lazy(() => import('@/pages/CareerWorkPage'))
const CareerReviewsPage = lazy(() => import('@/pages/CareerReviewsPage'))
const CareerAiPage = lazy(() => import('@/pages/CareerAiPage'))
const AiResumePage = lazy(() => import('@/pages/AiResumePage'))
const AiCoverLetterPage = lazy(() => import('@/pages/AiCoverLetterPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))
const JobBoardPage = lazy(() => import('@/pages/JobBoardPage'))

// 공통
const AdminPage = lazy(() => import('@/pages/AdminPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const RegisterInstructorPage = lazy(() => import('@/pages/RegisterInstructorPage'))
const CeoDashboardPage = lazy(() => import('@/pages/CeoDashboardPage'))

// 초시니어 홈 진입 시 기분 체크
function SeniorHomeOrMood() {
  const { hasMoodToday } = useMood()
  if (!hasMoodToday) return <Navigate to="/senior/mood" replace />
  return <SubscriptionCheck><HomePage /></SubscriptionCheck>
}

// 중장년층 구독 체크 래퍼
function CareerWithSubscription() {
  return <SubscriptionCheck><CareerProgramPage /></SubscriptionCheck>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoodProvider>
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              {/* 프로그램 선택 (첫 화면) */}
              <Route path="/" element={<ProgramSelectPage />} />

              {/* ===== 1. 초시니어 프로그램 ===== */}
              <Route path="/senior/mood" element={<MoodSelectPage />} />

              <Route element={<MainLayout />}>
                <Route path="/senior" element={<SeniorHomeOrMood />} />
                <Route path="/senior/about" element={<SubscriptionCheck><AboutPage /></SubscriptionCheck>} />
                <Route path="/senior/learn" element={<SubscriptionCheck><LearnHubPage /></SubscriptionCheck>} />
                <Route path="/senior/learn/practice" element={<SubscriptionCheck><PracticePage /></SubscriptionCheck>} />
                <Route path="/senior/learn/practice/:practiceId" element={<SubscriptionCheck><PracticeDetailPage /></SubscriptionCheck>} />
                <Route path="/senior/learn/kiosk" element={<SubscriptionCheck><KioskPracticePage /></SubscriptionCheck>} />
                <Route path="/senior/learn/:courseId" element={<SubscriptionCheck><CourseDetailPage /></SubscriptionCheck>} />
                <Route path="/senior/learn/:courseId/lessons/:lessonId" element={<SubscriptionCheck><LessonPage /></SubscriptionCheck>} />
                <Route path="/senior/work" element={<SubscriptionCheck><CareerHubPage /></SubscriptionCheck>} />
                <Route path="/senior/ai" element={<SubscriptionCheck><AiBiseoPage /></SubscriptionCheck>} />
                <Route path="/senior/profile" element={<ProfilePage />} />

                {/* ===== 2. 중장년층 프로그램 ===== */}
                <Route path="/career" element={<CareerWithSubscription />} />
                <Route path="/career/digital" element={<CareerDigitalPage />} />
                <Route path="/career/digital/kiosk" element={<KioskPracticePage />} />
                <Route path="/career/work" element={<CareerWorkPage />} />
                <Route path="/career/ai-resume" element={<AiResumePage />} />
                <Route path="/career/ai-cover-letter" element={<AiCoverLetterPage />} />
                <Route path="/career/templates" element={<TemplatesPage />} />
                <Route path="/career/job-board" element={<JobBoardPage />} />
                <Route path="/career/reviews" element={<CareerReviewsPage />} />
                <Route path="/career/ai" element={<CareerAiPage />} />

                {/* 공통 */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/ceo" element={<CeoDashboardPage />} />
              </Route>

              {/* 인증 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/instructor" element={<RegisterInstructorPage />} />

              {/* 이전 라우트 호환 */}
              <Route path="/mood" element={<Navigate to="/senior/mood" replace />} />
              <Route path="/learn/*" element={<Navigate to="/senior/learn" replace />} />
              <Route path="/work" element={<Navigate to="/senior/work" replace />} />
              <Route path="/ai" element={<Navigate to="/senior/ai" replace />} />
              <Route path="/about" element={<Navigate to="/senior/about" replace />} />
            </Routes>
          </Suspense>
        </MoodProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
