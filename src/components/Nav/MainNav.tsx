import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES } from '@/utils/images'
import api from '@/api/fetchClient'

interface MenuItem {
  name: string
  linkTo: string
  activePath: string
  isReady: boolean
}

interface ProfileData {
  userName: string
}

const MainNav: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const fetchProfile = async () => {
      try {
        const data = await api.get('/profile/get')
        //콘솔로그는 이후에 삭제 예정
        console.log('profile data:', data)
        setProfile({ userName: data.userName ?? data.userId })
      } catch (err) {
        console.error('프로필 조회 실패:', err)
      }
    }

    fetchProfile()
  }, [])

  const menuItems: MenuItem[] = [
    { name: '홈', linkTo: '/home', activePath: '/home', isReady: true },
    { name: '실전', linkTo: '/actual/tutorial', activePath: '/actual', isReady: true },
    { name: '연습', linkTo: '/practice/tutorial', activePath: '/practice', isReady: true },
  ]

  const requiresAuth = ['/home', '/practice']

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (!item.isReady) {
      e.preventDefault()
      alert('준비 중이에요!')
      return
    }
    if (requiresAuth.some((path) => item.activePath.startsWith(path))) {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        e.preventDefault()
        navigate('/login')
      }
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
          {profile ? (
            <>
              <div className="h-8 w-8 rounded-full bg-white/40" />
              <span className="text-[14px] font-medium text-white">{profile.userName}</span>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>
    </div>
  )
}

export default MainNav
