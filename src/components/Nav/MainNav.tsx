import React from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '@/utils/images'

interface MenuItem {
  name: string
  linkTo: string
  activePath: string
  isReady: boolean
}

const MainNav: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: '홈', linkTo: '/home', activePath: '/home', isReady: true },
    { name: '실전', linkTo: '/actual/tutorial', activePath: '/actual', isReady: true },
    { name: '연습', linkTo: '/practice/tutorial', activePath: '/practice', isReady: true },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (!item.isReady) {
      e.preventDefault()
      alert('준비 중이에요!')
    }
  }

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <header className="flex items-center justify-between px-12 py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={IMAGES.whitelogo} alt="Logo" className="my-2 mb-3 w-[75px]" />
          </Link>

          <nav className="ml-12 flex items-center gap-10">
            {menuItems.map((item) => {
              return (
                <Link
                  key={item.activePath}
                  to={item.linkTo}
                  onClick={(e) => handleLinkClick(e, item)}
                  className="relative flex flex-col items-center py-2 pt-4"
                >
                  <span className="fontLight text-[14px] text-white transition-colors">
                    {' '}
                    {item.name}{' '}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 pr-4 pt-2">
          <Link
            to="/login"
            className="text-[14px] font-medium text-white transition-colors hover:text-white/80"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="text-[14px] font-medium text-white transition-colors hover:text-white/80"
          >
            회원가입
          </Link>
        </div>
      </header>
    </div>
  )
}

export default MainNav
