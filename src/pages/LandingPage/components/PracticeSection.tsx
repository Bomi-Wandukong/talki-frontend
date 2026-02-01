import { useEffect, useRef, useState } from 'react'

interface CardData {
  title: React.ReactNode
  description: React.ReactNode
  rightContent: React.ReactNode
  bgColor: string
}

// 실전 탭 카드 데이터
const realPracticeCards: CardData[] = [
  {
    title: '지금 내가 잘하고 있나?',
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">실시간 피드백 기능</span>
        을 사용하면 사용자의 말 속도와 몸 움직임을 실시간으로 분석하여 문제점을 알려줍니다.
        <br />
        <br />
        <span className="text-base text-gray-500">
          시작은 좋지만 점점 갈수록 무너지는 경우 해당 기능을 추천해요!
        </span>
      </>
    ),
    rightContent: (
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="absolute inset-0 bg-[url('/img/practice_feedback_bg.png')] bg-cover bg-center opacity-60" />
        <div className="relative rounded-2xl border border-white/50 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
          <p className="text-lg font-bold text-[#5650FF]">말 속도가 너무 빨라요!</p>
        </div>
      </div>
    ),
    bgColor: 'bg-white',
  },
  {
    title: (
      <>
        주변 소리에 너무
        <br />
        영향을 많이 받아요!
      </>
    ),
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">돌발 상황 기능</span>을 사용해보세요. 기침
        소리부터 콧물소리, 돌발 질문과 같은 갑작스러운 조건들을 만들어 냅니다.
        <br />
        <br />
        <span className="text-base text-gray-500">순발력이 부족했던 분들에게 추천해요!</span>
      </>
    ),
    rightContent: (
      <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 bg-gradient-to-br from-orange-50 to-rose-100 p-8">
        <span className="animate-pulse rounded-full bg-red-500 px-5 py-3 font-medium text-white shadow-lg">
          웅성웅성
        </span>
        <span className="animate-bounce rounded-full bg-blue-500 px-5 py-3 font-medium text-white shadow-lg">
          기침 소리
        </span>
        <span className="rounded-full bg-yellow-500 px-5 py-3 font-medium text-white shadow-lg">
          돌발 질문!
        </span>
      </div>
    ),
    bgColor: 'bg-white',
  },
  {
    title: (
      <>
        구체적인 개선점이
        <br />
        필요해요.
      </>
    ),
    description: (
      <>
        실전을 종료하면 진행한 내용을 바탕으로{' '}
        <span className="font-semibold text-[#5650FF]">상세한 리포트</span>가 제공됩니다.
        <br />
        <br />
        <span className="text-base text-gray-500">
          점수부터 개선점, 반복 단어, 잘한 부분 타임스탬프까지! 자세한 내용은 리포트를 확인해보세요.
        </span>
      </>
    ),
    rightContent: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-100 p-8">
        <div className="flex w-[90%] max-w-md flex-col gap-4 rounded-2xl border bg-white p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#5650FF] to-purple-400 text-xl font-bold text-white shadow-lg">
              85
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">종합 점수</div>
              <div className="text-lg font-bold text-gray-800">우수함</div>
            </div>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">말 속도</span>
              <span className="font-medium text-[#5650FF]">적절함</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">시선 처리</span>
              <span className="font-medium text-orange-500">개선 필요</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">제스처</span>
              <span className="font-medium text-[#5650FF]">훌륭함</span>
            </div>
          </div>
        </div>
      </div>
    ),
    bgColor: 'bg-white',
  },
]

// 연습 탭 카드 데이터
const practiceCards: CardData[] = [
  {
    title: '부담 없이 자유롭게 연습해요',
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">자유 연습 모드</span>
        에서는 평가 없이 편하게 연습할 수 있어요. 원하는 만큼 반복하고 나만의 속도로 성장하세요.
        <br />
        <br />
        <span className="text-base text-gray-500">처음 시작하는 분들에게 추천해요!</span>
      </>
    ),
    rightContent: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-8">
        <div className="rounded-2xl bg-white/90 px-8 py-6 shadow-xl backdrop-blur-md">
          <p className="text-lg font-bold text-green-600">🎤 자유롭게 말해보세요!</p>
        </div>
      </div>
    ),
    bgColor: 'bg-white',
  },
  {
    title: (
      <>
        발음과 속도를
        <br />
        교정해보세요
      </>
    ),
    description: (
      <>
        <span className="font-semibold text-[#5650FF]">스피치 훈련</span>을 통해 발음, 말 속도, 톤을
        체계적으로 개선할 수 있어요.
        <br />
        <br />
        <span className="text-base text-gray-500">
          기초부터 탄탄하게 다지고 싶은 분들에게 추천해요!
        </span>
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
    bgColor: 'bg-white',
  },
]

function AnimatedCard({ data, index }: { data: CardData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`${data.bgColor} flex min-h-[450px] flex-col overflow-hidden rounded-[32px] shadow-2xl transition-all duration-700 ease-out md:flex-row`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Left Content */}
      <div className="flex w-full flex-col justify-center p-10 md:w-1/2 md:p-14">
        <h3 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          {data.title}
        </h3>
        <p className="text-lg leading-relaxed text-gray-700">{data.description}</p>
      </div>

      {/* Right Content */}
      <div className="min-h-[300px] w-full md:min-h-0 md:w-1/2">{data.rightContent}</div>
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
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 pb-20 md:flex-row md:items-center">
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
    <div className="w-full bg-[#F5F5F7] py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header with Tabs */}
        <PracticeHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Feature Cards - 탭에 따라 다른 카드 표시 */}
        <div className="flex flex-col gap-12">
          {currentCards.map((card, index) => (
            <AnimatedCard key={`${activeTab}-${index}`} data={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
