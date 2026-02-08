import { useEffect, useRef, useState } from 'react'

export default function CtaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-4"
    >
      {/* Subtle Background Decoration */}
      <div
        className={`absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5650FF]/10 blur-[120px] transition-all duration-1000 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />

      <div className="relative z-10 w-full max-w-[510px] text-center">
        <h2
          className={`mb-12 text-3xl font-bold text-[#5650FF] transition-all delay-200 duration-700 md:text-5xl ${
            isVisible ? 'animate-float translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          지금 토키를 시작해보세요.
        </h2>

        <button
          className={`group relative flex w-full items-center justify-between rounded-2xl bg-[#5650FF] px-10 py-5 text-xl font-semibold text-white shadow-[0_20px_40px_rgba(86,80,255,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(86,80,255,0.4)] ${
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <span>시작하기</span>
          <svg
            className="h-6 w-16 overflow-visible"
            viewBox="0 0 64 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="arrow-mask">
                <g className="transition-transform duration-500 group-hover:translate-x-1.5">
                  <path
                    d="M0 12H60M60 12L52 4M60 12L52 20"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </mask>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Base Arrow (Faded) */}
            <g className="transition-transform duration-500 group-hover:translate-x-1.5">
              <path
                d="M0 12H60M60 12L52 4M60 12L52 20"
                stroke="white"
                strokeWidth="2.5"
                strokeOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            {/* Animated Flow Light */}
            <g
              mask="url(#arrow-mask)"
              className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              <rect
                x="-80"
                y="0"
                width="80"
                height="24"
                fill="url(#flow-gradient)"
                className="animate-[arrow-flow_2s_infinite_linear]"
              />
            </g>
          </svg>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </button>
      </div>

      <style>{`
        @keyframes arrow-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(160px); }
        }
      `}</style>
    </div>
  )
}
