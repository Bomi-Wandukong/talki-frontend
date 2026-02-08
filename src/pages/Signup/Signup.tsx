import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImg(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 회원가입 로직 예시
    alert('회원가입이 완료되었습니다!')
    navigate('/login')
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* Background Wave */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <svg
          className="h-full w-full min-w-[1000px]"
          viewBox="0 0 1000 320"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="waveNoiseFilter" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise" />
              <feBlend mode="overlay" in="monoNoise" in2="SourceGraphic" result="blend" />
              <feComposite in="blend" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>
          <g className="animate-[wave_15s_linear_infinite]">
            <path
              className="origin-bottom animate-[undulate_8s_ease-in-out_infinite_alternate]"
              fill="#5650FF"
              fillOpacity="0.7"
              d="M0,160 C300,50 700,270 1000,160 C1300,50 1700,270 2000,160 C2300,50 2700,270 3000,160 V320 H0 Z"
              filter="url(#waveNoiseFilter)"
            ></path>
          </g>
          <g className="animate-[wave_20s_linear_infinite]">
            <path
              className="origin-bottom animate-[undulate_10s_ease-in-out_infinite_alternate-reverse]"
              fill="#5650FF"
              fillOpacity="0.9"
              d="M0,160 C350,280 650,40 1000,160 C1350,280 1650,40 2000,160 C2350,280 2650,40 3000,160 V320 H0 Z"
              filter="url(#waveNoiseFilter)"
            ></path>
          </g>
        </svg>
      </div>

      {/* Header Logo Area */}
      <header className="relative z-20 px-10 pt-4">
        <Link to="/">
          <img
            src="/img/logo/purpleLogo.png"
            alt="TALKI Logo"
            className="w-[120px] transition-transform hover:scale-105"
          />
        </Link>
      </header>

      {/* Signup Center Area - Remaining height */}
      <main className="relative z-10 flex h-full w-full flex-col items-center px-4 pb-[5vh]">
        <div className="flex h-full max-h-[900px] w-full max-w-[1000px] flex-col justify-center">
          {/* Title Section - ~10% height allocation */}
          <div className="mb-[4vh] text-center">
            <h1 className="mb-[0.5vh] text-[5vh] font-bold text-[#5650FF]">회원가입</h1>
            <p className="text-[1.7vh] text-[#989898]">토키와 함께 연습해볼까요?</p>
          </div>

          {/* Form Card */}
          <div
            className="flex w-full flex-1 flex-col justify-center rounded-[24px] bg-white px-6 py-[2.5vh] md:px-10 lg:px-12"
            style={{
              boxShadow: '0px 10px 20px rgba(0,0,0,0.1), 0px -4px 10px rgba(0,0,0,0.05)',
              maxHeight: '70vh', // Limit card height
            }}
          >
            <form className="flex h-full flex-col justify-between" onSubmit={handleSubmit}>
              <div className="flex h-full flex-col gap-[2.5%] md:flex-row md:items-start lg:gap-[5%]">
                {/* Left Side: Profile, Nickname & T&C - 35% width */}
                <div className="flex h-full flex-col justify-between md:w-[35%]">
                  <div className="flex flex-1 flex-col items-center justify-center gap-[1.5vh]">
                    <div
                      className="group relative h-[18vh] max-h-[160px] min-h-[100px] w-[18vh] min-w-[100px] max-w-[160px] cursor-pointer overflow-hidden rounded-full bg-[#E5E5E5] transition-all hover:bg-[#D9D9D9]"
                      onClick={handleImageClick}
                    >
                      {profileImg ? (
                        <img
                          src={profileImg}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-[50%] w-[50%] text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">이미지 선택</span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="flex w-full flex-col gap-[0.5vh]">
                      <label className="text-[1.8vh] text-[#575757]">닉네임</label>
                      <input
                        type="text"
                        className="h-[6.5vh] min-h-[40px] w-full rounded-xl border-2 border-[#D7D6F2] px-4 text-[2vh] focus:border-[#5650FF] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* T&C Checkboxes at the bottom */}
                  <div className="flex w-full flex-col gap-[1vh] pb-[4vh]">
                    <label className="flex cursor-pointer items-center gap-2 text-[1.6vh] font-medium text-[#575757]">
                      <input
                        type="checkbox"
                        className="h-[2vh] w-[2vh] rounded border-[#D7D6F2] text-[#5650FF] focus:ring-[#5650FF]"
                      />
                      <span>
                        [필수]{' '}
                        <span className="text-[#5650FF] underline underline-offset-2 transition-colors">
                          서비스 이용 약관
                        </span>
                        에 동의합니다.
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-[1.6vh] font-medium text-[#575757]">
                      <input
                        type="checkbox"
                        className="h-[2vh] w-[2vh] rounded border-[#D7D6F2] text-[#5650FF] focus:ring-[#5650FF]"
                      />
                      <span>
                        [필수]{' '}
                        <span className="text-[#5650FF] underline underline-offset-2 transition-colors">
                          개인정보 수집 및 이용
                        </span>
                        에 동의합니다.
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-[1.6vh] font-medium text-[#575757]">
                      <input
                        type="checkbox"
                        className="h-[2vh] w-[2vh] rounded border-[#D7D6F2] text-[#5650FF] focus:ring-[#5650FF]"
                      />
                      <span>
                        [선택]{' '}
                        <span className="text-[#5650FF] underline underline-offset-2 transition-colors">
                          마케팅 정보 수신
                        </span>
                        에 동의합니다.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Right Side: Account Info */}
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-[3vh]">
                  {/* ID */}
                  <div className="flex w-[90%] flex-col gap-[0.5vh]">
                    <label className="text-[1.8vh] text-[#575757]">아이디</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        className="h-[6.5vh] min-h-[36px] w-full rounded-xl border-2 border-[#D7D6F2] px-4 text-[2vh] focus:border-[#5650FF] focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 h-[4.5vh] min-h-[28px] -translate-y-1/2 rounded-lg bg-[#5650FF] px-4 text-[1.5vh] text-white transition-all hover:bg-[#4a45e0]"
                      >
                        중복 확인
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex w-[90%] flex-col gap-[0.5vh]">
                    <label className="text-[1.8vh] text-[#575757]">비밀번호</label>
                    <input
                      type="password"
                      className="h-[6.5vh] min-h-[36px] w-full rounded-xl border-2 border-[#D7D6F2] px-4 text-[2vh] focus:border-[#5650FF] focus:outline-none"
                    />
                  </div>

                  {/* Password Check */}
                  <div className="flex w-[90%] flex-col gap-[0.5vh]">
                    <label className="text-[1.8vh] text-[#575757]">비밀번호 확인</label>
                    <input
                      type="password"
                      className="h-[6.5vh] min-h-[36px] w-full rounded-xl border-2 border-[#D7D6F2] px-4 text-[2vh] focus:border-[#5650FF] focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex w-[90%] flex-col gap-[0.5vh]">
                    <label className="text-[1.8vh] text-[#575757]">이메일</label>
                    <input
                      type="email"
                      className="h-[6.5vh] min-h-[36px] w-full rounded-xl border-2 border-[#D7D6F2] px-4 text-[2vh] focus:border-[#5650FF] focus:outline-none"
                    />
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    className="mt-[3vh] h-[6vh] min-h-[44px] w-[80%] rounded-xl bg-[#5650FF] text-[2vh] text-white transition-all hover:bg-[#4a45e0] active:scale-[0.98]"
                  >
                    회원가입
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes wave {
          from { transform: translateX(0); }
          to { transform: translateX(-1000px); }
        }
        @keyframes undulate {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
          100% { transform: scaleY(0.95); }
        }
      `}</style>
    </div>
  )
}

export default Signup
