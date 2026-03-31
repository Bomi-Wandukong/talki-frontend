import { useEffect, useRef, useState } from 'react'
import WorryCard from './WorryCard'
import { IMAGES } from '@/utils/images'

interface WorryItem {
  id: number
  text: string
  highlightText: string
  rotation: number
  image: string
}

const worryData: WorryItem[] = [
  {
    id: 1,
    text: '발표 실력이 나아지고 있는지 확인하고 싶어요',
    highlightText: '나아지고 있는지',
    rotation: -14,
    image: IMAGES.landing.worry.w1,
  },
  {
    id: 2,
    text: '발표만 하면 항상 머리가 새하얘져요',
    highlightText: '머리가 새하얘져요',
    rotation: 12,
    image: IMAGES.landing.worry.w2,
  },
  {
    id: 3,
    text: '면접할 때 말 속도 조절이 어려워요',
    highlightText: '말 속도 조절',
    rotation: -12,
    image: IMAGES.landing.worry.w3,
  },
  {
    id: 4,
    text: '혼자 연습하니까 제가 잘하고 있는지 모르겠어요',
    highlightText: '혼자 연습',
    rotation: 16,
    image: IMAGES.landing.worry.w4,
  },
  {
    id: 5,
    text: '남들 앞에서 말할 때 목소리가 자꾸 떨려요',
    highlightText: '목소리가 자꾸 떨려요',
    rotation: -10,
    image: IMAGES.landing.worry.w1,
  },
  {
    id: 6,
    text: '시선 처리를 어떻게 해야 할지 모르겠어요',
    highlightText: '시선 처리',
    rotation: 14,
    image: IMAGES.landing.worry.w2,
  },
  {
    id: 7,
    text: '준비한 내용을 자꾸 까먹어서 당황스러워요',
    highlightText: '자꾸 까먹어서',
    rotation: -15,
    image: IMAGES.landing.worry.w3,
  },
  {
    id: 8,
    text: '질의응답 시간에 대답을 잘 못할까 봐 무서워요',
    highlightText: '대답을 잘 못할까 봐',
    rotation: 16,
    image: IMAGES.landing.worry.w4,
  },
]

// Reusable reveal wrapper for individual elements
function RevealOnScroll({
  children,
  threshold = 0.2,
  delay = 0,
  animationClass = 'translate-y-10 opacity-0',
}: {
  children: React.ReactNode
  threshold?: number
  delay?: number
  animationClass?: string
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
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`w-full transition-all duration-1000 ${
        isVisible ? 'translate-y-0 scale-100 opacity-100' : animationClass
      }`}
    >
      {children}
    </div>
  )
}

export default function WorrySection() {
  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden bg-[#5650FF] pt-16">
      {/* Header Text */}
      <div className="z-10 mb-10 px-6 text-center text-white lg:mb-16">
        <RevealOnScroll>
          <p className="mb-4 text-sm font-medium opacity-90 md:text-lg lg:mb-6">
            발표, 면접...내가 지금 잘 하고 있나?
          </p>
          <h2 className="text-[18px] font-bold leading-[1.4] md:text-3xl">
            말하는 순간이 두렵다면,{' '}
            <span className="mt-2 inline-block bg-white px-2 py-0.5 text-[#5650FF] md:mt-0">
              TALKI가 함께해요.
            </span>
          </h2>
        </RevealOnScroll>
      </div>

      {/* Infinite Card Slider */}
      <div className="relative mb-16 w-full overflow-hidden">
        <RevealOnScroll threshold={0.1} animationClass="scale-95 opacity-0">
          {/* Left Fade Overlay */}
          <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-[15%] bg-gradient-to-r from-[#5650FF] to-transparent"></div>
          {/* Right Fade Overlay */}
          <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-[15%] bg-gradient-to-l from-[#5650FF] to-transparent"></div>

          <div className="animate-scroll flex w-max items-center gap-2 pb-6 pt-6">
            {/* First set of cards */}
            {worryData.map((item) => (
              <div
                key={`original-${item.id}`}
                className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              >
                <WorryCard
                  text={item.text}
                  highlightText={item.highlightText}
                  rotation={0}
                  image={item.image}
                />
              </div>
            ))}
            {/* Duplicate set for loop */}
            {worryData.map((item) => (
              <div
                key={`duplicate-${item.id}`}
                className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              >
                <WorryCard
                  text={item.text}
                  highlightText={item.highlightText}
                  rotation={0}
                  image={item.image}
                />
              </div>
            ))}
            {/* Triplicate set for smoother loop */}
            {worryData.map((item) => (
              <div
                key={`triplicate-${item.id}`}
                className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              >
                <WorryCard
                  text={item.text}
                  highlightText={item.highlightText}
                  rotation={0}
                  image={item.image}
                />
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>

      {/* Bottom Features */}
      <div className="z-10 flex w-full max-w-[480px] flex-col gap-4 px-6 md:grid md:max-w-6xl md:grid-cols-3 md:gap-6">
        <RevealOnScroll delay={0}>
          <FeatureBox
            imgURL={IMAGES.landing.micIcon}
            title="실제같은 상황에서 말해보기"
            desc="본인에게 맞는 디테일을 직접 설정해서 진짜처럼 함께 연습하고 개선점을 찾아봐요."
          />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <FeatureBox
            imgURL={IMAGES.landing.reportIcon}
            title="리포트 및 피드백 생성"
            desc="어떤 점이 부족했고 좋았는지가 적힌 리포트를 확인하고 지속적으로 나아지는 것을 확인해요."
          />
        </RevealOnScroll>
        <RevealOnScroll delay={400}>
          <FeatureBox
            imgURL={IMAGES.landing.checklistIcon}
            title="맞춤형 연습 시스템"
            desc="불안을 직면하고 함께 완화하는 방법을 연습하면서 전체적인 실력을 향상시켜요."
          />
        </RevealOnScroll>
      </div>

      {/* Tagline with Rounded Bottom */}
      <div className="mt-10 w-full bg-white lg:mt-20">
        <div className="w-full bg-[#5650FF] pb-12 pt-16 lg:pb-20 lg:pt-22">
          <RevealOnScroll threshold={0.4}>
            <p className="px-6 text-center text-[16px] font-medium leading-relaxed text-white md:text-xl">
              실전 같은 환경, AI 피드백으로
              <br className="md:hidden" />{' '}
              <span className="font-bold">지금 말하기 실력을 성장시키세요</span>
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* Move 1/3 since we have 3 sets */
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

function FeatureBox({ imgURL, title, desc }: { imgURL: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/20 p-5 text-white backdrop-blur-md transition-all hover:bg-white/30 md:gap-5 lg:p-6">
      <img src={imgURL} alt="icon" className="h-8 w-8 md:h-10 md:w-10" />
      <div>
        <h3 className="mb-1 text-[14px] font-bold lg:text-lg">{title}</h3>
        <p className="text-[11px] font-light leading-relaxed opacity-90 lg:text-[13px]">{desc}</p>
      </div>
    </div>
  )
}
