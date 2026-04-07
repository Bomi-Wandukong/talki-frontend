import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IMAGES } from '@/utils/images'
import api from '@/api/fetchClient'
import ProfileModal from './ProfileModal'

interface MenuItem {
  name: string
  linkTo: string
  activePath: string
  isReady: boolean
}

interface ProfileData {
  userName: string
}

const Nav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // 로그아웃 실패해도 로컬 처리
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const fetchProfile = async () => {
      try {
        const data = await api.get('/profile/get')
        console.log('profile data:', data)
        setProfile({ userName: data.userName ?? data.userId })
        //username없으면 id라도 띄워주기. 그냥 제대로 받아오는지 확인하기 위해 넣은 부분. 이후 수정 예정.
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (!item.isReady) {
      e.preventDefault()
      alert('준비 중이에요!')
    }
  }

  return (
    <div className="fixed left-0 top-0 z-[100] w-full">
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-12">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={IMAGES.purplelogo} alt="Logo" className="my-2 mb-3 w-[75px]" />
          </Link>

          <nav className="ml-12 flex items-center gap-10">
            {menuItems.map((item) => {
              const isActive =
                item.activePath === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.activePath)
              return (
                <Link
                  key={item.activePath}
                  to={item.linkTo}
                  onClick={(e) => handleLinkClick(e, item)}
                  className="relative flex flex-col items-center py-2 pt-3"
                >
                  <span
                    className={`fontRegular text-[14px] transition-colors ${
                      isActive ? 'text-[#5650FF]' : 'text-[#ACA9FE]'
                    }`}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-[1px] h-[2px] w-full bg-[#5650FF]" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => setShowDropdown((prev) => !prev)}
          >
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            {profile && (
              <span className="text-[13px] z-100 font-medium text-[#3B3B3B]">{profile.userName}</span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 z-50 min-w-[120px] overflow-hidden rounded-xl bg-black/60 shadow-lg">
              <button
                className="w-full px-5 py-2 pt-4 text-left text-[14px] text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <button
                className="w-full px-5 py-2 pb-4 text-left text-[14px] text-white hover:bg-white/10"
                onClick={() => { setShowDropdown(false); setShowProfileModal(true) }}
              >
                내 정보
              </button>
            </div>
          )}
        </div>
      </header>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  )
}

export default Nav
