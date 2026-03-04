import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LiveFeedback from '@/pages/LiveFeedback/LiveFeedback'
import FeedbackResult from '@/pages/FeedbackResult/FeedbackResult'
import LandingMain from '@/pages/LandingPage/LandingMain'
import Login from '@/pages/Login/Login'
import Signup from '@/pages/Signup/Signup'
import GuideLine from '@/pages/GuideLine/GuideLine'
import Category from '@/pages/Category/Category'
import Home from '@/pages/Home/Home'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import MainLayout from '@/components/Layout/MainLayout'
import Tutorial from './pages/Tutorial/Tutorial'

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
            <Route path="/result" element={<FeedbackResult />} />

            {/* 실전 루트 */}
            <Route path="/actual">
              <Route path="tutorial" element={<Tutorial/>}/>
              <Route path="guideline" element={<GuideLine />} />
              <Route path="category" element={<Category />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
