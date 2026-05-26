import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MdMonitor } from 'react-icons/md'
import { TbWindowMaximize } from 'react-icons/tb'

// 모바일 판별: UA 기반
const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// 창이 최대화되지 않은 상태로 판별하는 허용 오차 (px)
const MAXIMIZE_TOLERANCE = 50

const isWindowMaximized = () =>
  window.outerWidth >= screen.availWidth - MAXIMIZE_TOLERANCE &&
  window.outerHeight >= screen.availHeight - MAXIMIZE_TOLERANCE

export default function ActualGuard() {
  const { pathname } = useLocation()
  const modeName = pathname.startsWith('/practice') ? '연습 모드' : '실전 모드'

  const [isMobile, setIsMobile] = useState(isMobileDevice)
  const [isMaximized, setIsMaximized] = useState(isWindowMaximized)

  useEffect(() => {
    const check = () => {
      setIsMobile(isMobileDevice())
      setIsMaximized(isWindowMaximized())
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 모바일 오버레이
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-8 text-center">
        <MdMonitor size={72} className="text-[#7c6aff]" />
        <h1 className="text-2xl font-bold text-white">PC 환경에서 접속해 주세요</h1>
        <p className="leading-relaxed text-gray-400">
          {modeName}는 카메라·마이크를 활용한 발표 분석 기능이 포함되어 있어
          <br />
          모바일 환경에서는 지원되지 않습니다.
        </p>
      </div>
    )
  }

  // 창 최대화 안내 오버레이
  if (!isMaximized) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-8 text-center">
        <TbWindowMaximize size={72} className="text-[#7c6aff]" />
        <h1 className="text-2xl font-bold text-white">창을 최대화해 주세요</h1>
        <p className="leading-relaxed text-gray-400">
          {modeName}는 넓은 화면이 필요합니다.
          <br />
          브라우저 창 오른쪽 상단의 <span className="text-white">□ 버튼</span>을 눌러 최대화해 주세요.
        </p>
      </div>
    )
  }

  return <Outlet />
}
