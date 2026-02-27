import { Outlet } from 'react-router-dom'

/**
 * MainLayout 컴포넌트
 * - 내부 페이지들을 위한 공통 레이아웃을 제공합니다.
 * - 자식 라우트 컴포넌트를 렌더링하기 위한 Outlet을 포함합니다.
 */
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 
          TODO: 여기에 공통 Nav나 Header 컴포넌트를 추가하세요.
          예: <Header /> 
      */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* 
          TODO: 여기에 공통 Footer 컴포넌트를 추가하세요.
          예: <Footer /> 
      */}
    </div>
  )
}

export default MainLayout
