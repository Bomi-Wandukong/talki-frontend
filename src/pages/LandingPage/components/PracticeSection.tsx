import { useEffect, useRef, useState } from 'react'
import PracticeCard from './PracticeCard'

interface CardData {
  title: React.ReactNode
  description: React.ReactNode
  rightContent: React.ReactNode
}

// 실전 탭 카드 데이터
const realPracticeCards: CardData[] = [
  {
    title: '보다 사실적인 환경에서 \n 실전을 대비해요.',
    description:
      '당신의 상황을 카테고리 설정을 통해 구체적으로 알려주세요. 비슷한 환경에서 지속적으로 노출되며, 불안을 완화하고 부족한 점을 개선할 수 있어요.',

    rightContent: <img src="/img/practice1.png" alt="practice1" />,
  },
  {
    title: '지금 내가 잘하고 있나?',
    description: (
      <>
        <span className="font-bold">실시간 피드백 기능</span>을 사용하면 사용자의 말 속도와 몸
        움직임을 실시간으로 분석하여 문제점을 말해줍니다.{' '}
        <span className="font-bold">시작은 좋지만 점점 갈수록 무너지는 경우</span> 해당 기능을
        추천해요!
      </>
    ),
    rightContent: <img src="/img/practice2.png" alt="practice2" />,
  },
  {
    title: '주변 소리에 너무 \n 영향을 많이 받아요!',
    description: (
      <>
        <span className="font-bold">돌발 상황 기능</span>을 사용해보세요.{' '}
        <span className="font-bold">기침 소리부터 웃음소리, 돌발 질문</span>과 같은 갑작스러운
        조건들을 만들어 냅니다. <span className="font-bold">순발력이 부족했던 분들</span>에게
        추천해요!
      </>
    ),
    rightContent: <img src="/img/practice3.png" alt="practice3" />,
  },
  {
    title: '구체적인 개선점이 \n 필요해요.',
    description: (
      <>
        <span className="font-bold">실전을 종료</span>하면 진행한 내용을 바탕으로{' '}
        <span className="font-bold">리포트가 제공</span>됩니다.{' '}
        <span className="font-bold">점수부터 개선점, 또 어떤 단어를</span>
        <span className="font-bold">반복하는지, 잘하고 못한 부분 타임스탬프까지!</span> 자세한
        내용은 리포트를 확인해보세요!
      </>
    ),
    rightContent: <img src="/img/practice4.png" alt="practice4" />,
  },
]

// 연습 탭 카드 데이터
const practiceCards: CardData[] = [
  {
    title: '부담 없이 자유롭게 \n 연습해요',
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">자유 연습 모드</span>
        에서는 평가 없이 편하게 연습할 수 있어요. 원하는 만큼 반복하고 나만의 속도로 성장하세요.
      </>
    ),
    rightContent: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-8">
        <div className="rounded-2xl bg-white/90 px-8 py-6 shadow-xl backdrop-blur-md">
          <p className="text-lg font-bold text-green-600">🎤 자유롭게 말해보세요!</p>
        </div>
      </div>
    ),
  },
  {
    title: '발음과 속도를 \n 교정해보세요',
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">스피치 훈련</span>을 통해 발음, 말 속도, 톤을
        체계적으로 개선할 수 있어요.
      </>
    ),
    rightContent: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="flex gap-4">
          <span className="rounded-full bg-blue-500 px-5 py-3 font-medium text-white shadow-lg">
            발음 교정
          </span>
          <span className="rounded-full bg-purple-500 px-5 py-3 font-medium text-white shadow-lg">
            속도 조절
          </span>
        </div>
      </div>
    ),
  },
]

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
      className={`transition-all duration-1000 ${
        isVisible ? 'translate-y-0 scale-100 opacity-100' : animationClass
      } ${className}`}
    >
      {children}
    </div>
  )
}

// 헤더 컴포넌트
function PracticeHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: '실전' | '연습'
  setActiveTab: (tab: '실전' | '연습') => void
}) {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 pb-12 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" className="w-[65px]" />
          <div>
            <h2 className="text-2xl font-bold text-[#5650FF] md:text-2xl">
              완벽하지 않아도 괜찮아요
            </h2>
            <p className="mt-1 text-[#414147]">당신의 속도에 맞춰, 천천히 연습해보세요.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('실전')}
            className={`rounded-xl px-11 py-2 font-medium transition-all ${
              activeTab === '실전'
                ? 'bg-[#5650FF] text-white'
                : 'cursor-pointer bg-[#D7D6F1] text-white'
            }`}
          >
            실전
          </button>
          <button
            onClick={() => setActiveTab('연습')}
            className={`rounded-xl px-11 py-2 font-medium transition-all ${
              activeTab === '연습'
                ? 'bg-[#5650FF] text-white'
                : 'cursor-pointer bg-[#D7D6F1] text-white'
            }`}
          >
            연습
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PracticeSection() {
  const [activeTab, setActiveTab] = useState<'실전' | '연습'>('실전')

  const currentCards = activeTab === '실전' ? realPracticeCards : practiceCards

  return (
    <div className="w-full">
      {/* Header Area: White background */}
      <div className="bg-white pt-12">
        <div className="mx-auto max-w-6xl px-6">
          <RevealOnScroll animationClass="-translate-x-10 opacity-0">
            <PracticeHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          </RevealOnScroll>
        </div>
      </div>

      {/* Content Area: Light Grey background */}
      <div className="bg-[#F5F5F7] pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Feature Cards - 탭에 따라 다른 카드 표시 */}
          <div className="flex flex-col gap-12">
            {currentCards.map((card, index) => (
              <RevealOnScroll
                key={`${activeTab}-${index}`}
                delay={index * 100}
                animationClass="opacity-0"
              >
                <PracticeCard
                  title={card.title}
                  description={card.description}
                  rightContent={card.rightContent}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
