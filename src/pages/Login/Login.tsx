import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
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

      {/* Header Logo */}
      <div className="absolute left-10 top-10 z-20">
        <Link to="/">
          <img
            src="/img/logo/purpleLogo.png"
            alt="TALKI Logo"
            className="w-[120px] transition-transform hover:scale-105"
          />
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center px-4">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-[#5650FF]">로그인</h1>
          <p className="text-[#989898]">토키와 함께 연습해볼까요?</p>
        </div>

        {/* Form Card */}
        <div className="w-full rounded-[40px] bg-white p-12 shadow-2xl md:p-16">
          <form className="flex flex-col gap-8">
            {/* ID Input */}
            <div className="flex flex-col gap-3">
              <label className="text-lg font-bold text-[#575757]">아이디</label>
              <input
                type="text"
                placeholder=""
                className="h-[60px] w-full rounded-2xl border border-[#D9D9D9] bg-[#FCFCFC] px-6 text-lg focus:border-[#5650FF] focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-3">
              <label className="text-lg font-bold text-[#575757]">비밀번호</label>
              <input
                type="password"
                placeholder=""
                className="h-[60px] w-full rounded-2xl border border-[#D9D9D9] bg-[#FCFCFC] px-6 text-lg focus:border-[#5650FF] focus:outline-none"
              />
              <div className="mt-1 text-right">
                <button
                  type="button"
                  className="text-sm font-medium text-[#5650FF] hover:underline"
                >
                  비밀번호가 생각이 안나요!
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-4">
              <button
                type="submit"
                className="h-[65px] w-full rounded-2xl bg-[#5650FF] text-xl font-bold text-white transition-all hover:bg-[#4a45e0] active:scale-[0.98]"
              >
                로그인
              </button>
              <button
                type="button"
                className="h-[65px] w-full rounded-2xl border-2 border-[#5650FF] bg-white text-xl font-bold text-[#5650FF] transition-all hover:bg-[#f8f7ff] active:scale-[0.98]"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-1000px);
          }
        }
        @keyframes undulate {
          0% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.1);
          }
          100% {
            transform: scaleY(0.95);
          }
        }
      `}</style>
    </div>
  )
}
