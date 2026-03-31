import { useEffect, useRef, useState } from 'react'
import { IMAGES } from '@/utils/images'

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
    <div className="flex w-full flex-col items-center bg-white py-12 md:min-h-screen md:justify-center md:py-0">
      <div className="w-full max-w-[1040px] px-6">
        {/* Header */}
        <RevealOnScroll>
          <div className="mb-6 flex flex-row items-center gap-2 md:mb-16 md:gap-4 md:text-left">
            <img src={IMAGES.logo} alt="Talki" className="h-6 w-6 md:h-10 md:w-10" />
            <h2 className="text-[14px] font-bold text-[#ACA9FE] md:text-2xl">
              TALKI를 사용할 때, <span className="text-[#5650FF]">아래의 준비물</span>이 필요해요
            </h2>
          </div>
        </RevealOnScroll>

        {/* Requirements Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-8">
          {/* 카메라 */}
          <RevealOnScroll delay={0} className="h-full">
            <div className="flex h-full min-h-[150px] flex-col items-start gap-4 rounded-[20px] bg-[#F7F7F8] px-4 py-10 shadow-sm md:min-h-0 md:flex-row md:items-center md:gap-6 md:rounded-[24px] md:p-10">
              <img
                src={IMAGES.landing.camera}
                alt="Camera"
                className="animate-floating h-10 w-auto md:h-auto md:w-auto"
              />
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 text-base font-bold text-[#5650FF] md:mb-3 md:text-xl">
                  카메라
                </h3>
                <p className="text-[10px] leading-relaxed text-gray-600 md:text-base">
                  분석을 위해 촬영이 진행됩니다.
                  <br />
                  노트북 캠과 같은 카메라를 준비해주세요.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* 네트워크 */}
          <RevealOnScroll delay={200} className="h-full">
            <div className="flex h-full min-h-[180px] flex-col justify-center rounded-[20px] bg-[#F7F7F8] px-4 py-10 shadow-sm md:min-h-0 md:rounded-[24px] md:p-10">
              <h3 className="mb-2 text-[12px] font-bold leading-snug text-gray-900 md:mb-3 md:text-xl">
                <span className="text-[#5650FF]">
                  안정적인 <br className="md:hidden" /> 네트워크 환경
                </span>
                에서 <br className="md:hidden" /> 진행해주세요.
              </h3>
              <p className="text-[10px] leading-relaxed text-gray-600 md:text-base">
                다수가 사용하는 네트워크보다는
                <br />
                개인 네트워크를 추천해요
              </p>
            </div>
          </RevealOnScroll>

          {/* 마이크 */}
          <RevealOnScroll delay={400} className="h-full">
            <div className="flex h-full min-h-[150px] flex-col items-start gap-4 rounded-[20px] bg-[#F7F7F8] px-4 py-10 shadow-sm md:min-h-0 md:flex-row md:items-center md:gap-6 md:rounded-[24px] md:p-10">
              <img
                src={IMAGES.landing.mic}
                alt="Mic"
                className="animate-floating-delayed h-10 w-auto md:h-auto md:w-auto"
              />
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 text-base font-bold text-[#5650FF] md:mb-3 md:text-xl">
                  마이크
                </h3>
                <p className="text-[10px] leading-relaxed text-gray-600 md:text-base">
                  분석을 위해 녹음이 진행됩니다.
                  <br />
                  마이크와 주변이 조용한 환경에서 진행해주세요.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* PC 환경 */}
          <RevealOnScroll delay={600} className="h-full">
            <div className="flex h-full min-h-[180px] flex-col justify-center rounded-[20px] bg-[#F7F7F8] px-4 py-10 shadow-sm md:min-h-0 md:rounded-[24px] md:p-10">
              <h3 className="mb-2 text-[12px] font-bold leading-snug text-gray-900 md:mb-3 md:text-xl">
                <span className="text-[#5650FF]">
                  Window7 이상의 <br className="md:hidden" /> PC
                </span>
                를 사용해주세요.
              </h3>
              <p className="text-[10px] leading-relaxed text-gray-600 md:text-base">
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
