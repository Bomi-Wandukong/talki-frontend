import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PracticeCard from './PracticeCard'
import { IMAGES } from '@/utils/images'

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
    rightContent: <img src={IMAGES.landing.practice.p1} alt="practice1" />,
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
    rightContent: <img src={IMAGES.landing.practice.p2} alt="practice2" />,
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
    rightContent: <img src={IMAGES.landing.practice.p3} alt="practice3" />,
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
    rightContent: <img src={IMAGES.landing.practice.p4} alt="practice4" />,
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

function PracticeHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: '실전' | '연습'
  setActiveTab: (tab: '실전' | '연습') => void
}) {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 pb-10 md:flex-row md:items-center md:pb-12">
        <div className="flex items-center gap-2">
          <img src={IMAGES.logo} className="w-[45px] md:w-[65px]" />
          <div>
            <h2 className="text-[20px] font-bold text-[#5650FF] md:text-2xl">
              완벽하지 않아도 괜찮아요
            </h2>
            <p className="mt-1 text-sm text-[#414147] md:text-base">
              당신의 속도에 맞춰, 천천히 연습해보세요.
            </p>
          </div>
        </div>
        <div className="mt-6 flex w-full gap-4 md:mt-0 md:w-auto md:gap-6">
          <button
            onClick={() => setActiveTab('실전')}
            className={`flex-1 rounded-xl py-2 text-base font-medium transition-all duration-300 md:flex-none md:px-11 ${
              activeTab === '실전'
                ? 'bg-gradient-to-r from-[#5650FF] to-[#7C77FF] text-white shadow-lg md:bg-[#5650FF] md:bg-none md:shadow-none'
                : 'bg-[#F0F0F5] text-[#9EA1B1] hover:bg-[#E5E5ED] md:cursor-pointer md:bg-[#D7D6F1] md:text-white'
            }`}
          >
            실전
          </button>
          <button
            onClick={() => setActiveTab('연습')}
            className={`flex-1 rounded-xl py-2 text-base font-medium transition-all duration-300 md:flex-none md:px-11 ${
              activeTab === '연습'
                ? 'bg-gradient-to-r from-[#5650FF] to-[#7C77FF] text-white shadow-lg md:bg-[#5650FF] md:bg-none md:shadow-none'
                : 'bg-[#F0F0F5] text-[#9EA1B1] hover:bg-[#E5E5ED] md:cursor-pointer md:bg-[#D7D6F1] md:text-white'
            }`}
          >
            연습
          </button>
        </div>
      </div>
    </div>
  )
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const PEEK_OFFSET = 48 // stacked 상태에서 카드가 삐져나오는 px
const GAP = 48

export default function PracticeSection() {
  const [activeTab, setActiveTab] = useState<'실전' | '연습'>('실전')
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [naturalPositions, setNaturalPositions] = useState<number[]>([])
  const [naturalHeight, setNaturalHeight] = useState(2400)
  const [scrollProgress, setScrollProgress] = useState(0)

  const currentCards = activeTab === '실전' ? realPracticeCards : practiceCards

  // 카드 높이 측정 → spread 위치 계산
  useLayoutEffect(() => {
    const heights = cardRefs.current.map((ref) => ref?.offsetHeight ?? 0)
    if (heights.some((h) => h === 0)) return

    const positions: number[] = []
    let y = 0
    heights.forEach((h) => {
      positions.push(y)
      y += h + GAP
    })
    setNaturalPositions(positions)
    setNaturalHeight(y - GAP)
  }, [currentCards])

  // 섹션이 뷰포트를 통과하는 동안 scrollProgress (0→1) 업데이트
  // progress = (뷰포트 아래에서 섹션 top까지의 거리) / naturalHeight
  // → 섹션이 화면에 진입할 때 0, 화면을 완전히 통과할 때 1
  useEffect(() => {
    const scrollParent = cardsContainerRef.current?.closest(
      '[class*="overflow-y"]'
    ) as HTMLElement | null
    if (!scrollParent) return

    const update = () => {
      if (!cardsContainerRef.current) return
      const { top } = cardsContainerRef.current.getBoundingClientRect()
      const vh = scrollParent.clientHeight
      // top = 0:               섹션 top이 뷰포트 top에 닿음 → p=0 (stacked)
      // top = -(nh - vh):      섹션 bottom이 뷰포트 bottom에 닿음 → p=1 (fully spread)
      const scrolled = -top
      const total = Math.max(1, naturalHeight - vh)
      setScrollProgress(Math.max(0, Math.min(1, scrolled / total)))
    }

    scrollParent.addEventListener('scroll', update, { passive: true })
    update()
    return () => scrollParent.removeEventListener('scroll', update)
  }, [naturalHeight])

  // 카드 i의 현재 top 위치 (스크롤 progress에 비례)
  const getCardStyle = (index: number) => {
    const n = currentCards.length - 1

    // 카드를 하나씩 순서대로 펼침: 카드 i는 progress의 [(i-1)/n ~ i/n] 구간에서 이동
    const cardP =
      index === 0
        ? 1
        : Math.max(0, Math.min(1, (scrollProgress - (index - 1) / n) * n))

    const eased = easeOutCubic(cardP)

    const fromTop = index * PEEK_OFFSET
    const toTop = naturalPositions[index] ?? index * 650
    const top = fromTop + (toTop - fromTop) * eased

    const scale = 1 - (1 - eased) * index * 0.02
    const opacity = index === 0 ? 1 : 0.65 + 0.35 * eased

    return { top, scale, opacity }
  }

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="bg-white pt-12">
        <div className="mx-auto max-w-6xl px-6">
          <PracticeHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* 카드 영역: naturalHeight 높이의 컨테이너 안에서 absolute 포지션으로 애니메이션 */}
      <div className="bg-[#F5F5F7] pt-12 pb-24">
        <div
          ref={cardsContainerRef}
          className="relative mx-auto max-w-6xl px-6"
          style={{ height: naturalHeight }}
        >
          {currentCards.map((card, index) => {
            const { top, scale, opacity } = getCardStyle(index)
            return (
              <div
                key={`${activeTab}-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                style={{
                  position: 'absolute',
                  top,
                  left: 0,
                  right: 0,
                  zIndex: currentCards.length - index,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  opacity,
                  willChange: 'top, transform, opacity',
                }}
              >
                <PracticeCard
                  title={card.title}
                  description={card.description}
                  rightContent={card.rightContent}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
