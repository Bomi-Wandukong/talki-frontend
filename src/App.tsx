import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LiveFeedback from '@/pages/LiveFeedback/LiveFeedback'
import FeedbackResult from '@/pages/FeedbackResult/FeedbackResult'
import LandingMain from '@/pages/LandingPage/LandingMain'
import GuideLine from '@/pages/GuideLine/GuideLine'
import Category from '@/pages/Category/Category'
import Home from '@/pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingMain />} />
        <Route path="/live" element={<LiveFeedback />} />
        <Route path="/result" element={<FeedbackResult />} />
        <Route path="/actual/guideline" element = {<GuideLine/>}/>
        <Route path="/actual/category" element = {<Category/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
