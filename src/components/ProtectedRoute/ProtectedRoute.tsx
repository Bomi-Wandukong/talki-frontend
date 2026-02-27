import { /* Navigate, */ Outlet } from 'react-router-dom'

/**
 * ProtectedRoute 컴포넌트
 * - localStorage에 'token'이 존재하는지 확인합니다.
 * - 토큰이 없으면 랜딩 페이지('/')로 리다이렉트합니다.
 * - 토큰이 있으면 자식 컴포넌트들을 렌더링합니다(Outlet 이용).
 */
const ProtectedRoute = () => {
  // const token = localStorage.getItem('token');

  // if (!token) {
  //   // 인증되지 않은 경우 랜딩 페이지로 리다이렉트
  //   return <Navigate to="/" replace />;
  // }

  // 인증된 경우 자식 요소 렌더링
  return <Outlet />
}

export default ProtectedRoute
