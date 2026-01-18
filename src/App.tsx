import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Test from './pages/Test/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
