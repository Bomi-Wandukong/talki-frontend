import { useEffect, useRef, useState } from 'react'

// Reusable reveal wrapper for individual elements
function RevealOnScroll({
  children,
  threshold = 0.1,
  delay = 0,
  animationClass = 'translate-y-10 opacity-0',
  className = '',
}: {
  children: React.ReactNode
  threshold?: number
  delay?: number
  animationClass?: string
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 100px 0px', // 화면 하단 아래 100px 지점에서 미리 트리거
      }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${
        isVisible ? 'translate-y-0 scale-100 opacity-100' : animationClass
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function RequirementsSection() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="w-full max-w-[1300px] px-6">
        {/* Header */}
        <RevealOnScroll>
          <div className="mb-20 flex items-center gap-4">
            <img src="/img/logo/logo.png" alt="Talki" className="h-12 w-12" />
            <h2 className="text-2xl font-bold text-[#ACA9FE] md:text-3xl">
              TALKI를 사용할 때, <span className="text-[#5650FF]">아래의 준비물</span>이 필요해요
            </h2>
          </div>
        </RevealOnScroll>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* 카메라 */}
          <RevealOnScroll delay={0} className="h-full">
            <div className="flex h-full items-center gap-8 rounded-[32px] bg-[#F7F7F8] p-10 shadow-sm md:p-12">
              <img
                src="/img/landingPage/camera.png"
                alt="Camera"
                className="animate-floating mr-9 h-auto"
              />
              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-2xl font-bold text-[#5650FF]">카메라</h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  분석을 위해 촬영이 진행됩니다.
                  <br />
                  노트북 캠과 같은 카메라를 준비해주세요.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* 네트워크 */}
          <RevealOnScroll delay={200} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-[32px] bg-[#F7F7F8] p-10 shadow-sm md:p-12">
              <h3 className="mb-4 text-2xl font-bold leading-snug text-gray-900">
                <span className="text-[#5650FF]">안정적인 네트워크 환경</span>에서 진행해주세요.
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                다수가 사용하는 네트워크보다는
                <br />
                개인 네트워크를 추천해요
              </p>
            </div>
          </RevealOnScroll>

          {/* 마이크 */}
          <RevealOnScroll delay={400} className="h-full">
            <div className="flex h-full items-center gap-8 rounded-[32px] bg-[#F7F7F8] p-10 shadow-sm md:p-12">
              <img
                src="/img/landingPage/mic.png"
                alt="Mic"
                className="animate-floating-delayed h-auto"
              />
              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-2xl font-bold text-[#5650FF]">마이크</h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  분석을 위해 녹음이 진행됩니다.
                  <br />
                  마이크와 주변이 조용한 환경에서
                  <br />
                  진행해주세요.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* PC 환경 */}
          <RevealOnScroll delay={600} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-[32px] bg-[#F7F7F8] p-10 shadow-sm md:p-12">
              <h3 className="mb-4 text-2xl font-bold leading-snug text-gray-900">
                <span className="text-[#5650FF]">Window7 이상의 PC</span>를 사용해주세요.
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                실전과 연습은 모바일 환경에서 사용이 어려워요.
                <br />
                PC 환경에서 진행해주세요.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-floating {
          animation: float 3s ease-in-out infinite;
        }
        .animate-floating-delayed {
          animation: float 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
