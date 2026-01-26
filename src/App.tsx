import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './pages/Test/Test'
import GuideLine from './pages/GuideLine/GuideLine'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/GuideLine" element = {<GuideLine/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
