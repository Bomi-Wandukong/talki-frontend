// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// WebSocket 관련 작업이 다 끝나면 main.tsx에 <StrictMode>를 다시 넣는 것을 권장합니다.
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// )

createRoot(document.getElementById('root')!).render(<App />)
