import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LiveFeedback from '@/pages/LiveFeedback/LiveFeedback'
import FeedbackResult from '@/pages/FeedbackResult/FeedbackResult'
import LandingMain from '@/pages/LandingPage/LandingMain'
import GuideLine from './pages/GuideLine/GuideLine'
import Login from '@/pages/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingMain />} />
        <Route path="/live" element={<LiveFeedback />} />
        <Route path="/result" element={<FeedbackResult />} />
        <Route path="/GuideLine" element={<GuideLine />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
