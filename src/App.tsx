import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LiveFeedback from '@/pages/LiveFeedback/LiveFeedback'
import FeedbackResult from '@/pages/FeedbackResult/FeedbackResult'
import LandingMain from '@/pages/LandingPage/LandingMain'
import Login from '@/pages/Login/Login'
import Signup from '@/pages/Signup/Signup'
import GuideLine from '@/pages/GuideLine/GuideLine'
import Category from '@/pages/Category/Category'
import Home from '@/pages/HomePage/Home'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import MainLayout from '@/components/Layout/MainLayout'
import Tutorial from './pages/Tutorial/Tutorial'
import PracticeTutorial from './pages/Practice/PracticeTutorial/PracticeTutorial'
import PracticeStart from './pages/Practice/PracticeStart/PracticeStart'
import BreathingPractice from './pages/Practice/PracticeStart/BreathingPractice'
import ImpromptuPractice from '@/pages/Practice/ImpromptuPractice'
import KeywordPractice from '@/pages/Practice/KeywordPractice'
import CoreUnderstandingPractice from '@/pages/Practice/CoreUnderstandingPractice'
import PracticeSelect from './pages/Practice/PracticeStart/PracticeSelect'
import PracticeScript from './pages/Practice/PracticeScript/PracticeScript'
import EyeContactPractice from './pages/Practice/PracticeScript/EyeContactPractice'
import PracticeFeel from './pages/Practice/PracticeResult/PracticeFeel'
import AnalysisLoading from '@/pages/AnalysisLoading/AnalysisLoading'
import PracticeMind from './pages/Practice/PracticeResult/PracticeMind'
import PracticeResult from './pages/Practice/PracticeResult/PracticeResult'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes 이건 로그인 해야 접근 가능한 페이지*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/live" element={<LiveFeedback />} />
            <Route path="/analysis-loading" element={<AnalysisLoading />} />
            <Route path="/result" element={<FeedbackResult />} />

            {/* 실전 루트 */}
            <Route path="/actual">
              <Route path="tutorial" element={<Tutorial />} />
              <Route path="guideline" element={<GuideLine />} />
              <Route path="category" element={<Category />} />
            </Route>

            <Route path="/practice">
              <Route path="impromptu" element={<ImpromptuPractice />} />
              <Route path="keyword" element={<KeywordPractice />} />
              <Route path="core" element={<CoreUnderstandingPractice />} />
              <Route path="tutorial" element={<PracticeTutorial />} />
              <Route path="start" element={<PracticeStart />} />
              <Route path="breathing" element={<BreathingPractice />} />
              <Route path="select" element={<PracticeSelect />} />
              <Route path="script" element={<PracticeScript />} />
              <Route path="eyecontact" element={<EyeContactPractice />} />
              <Route path="feelresult" element={<PracticeFeel />} />
              <Route path="mind" element={<PracticeMind />} />
              <Route path="complete" element={<PracticeResult />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
