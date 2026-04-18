import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'

const THOUGHTS = [
  '사람들이 내가 긴장한 것을 알아챌 것이다.',
  '말을 하다가 실수할 것 같다.',
  '사람들이 나를 이상하게 생각할 것이다.',
  '내가 무능해 보일 것이다.',
  '말을 하다가 머리가 하얘질 것 같다.',
  '사람들이 나를 평가하고 있을 것이다.',
]

const PracticeStart = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const handleSelect = (thought: string) => {
    setSelected(thought)
    setIsCustom(false)
  }

  const handleCustomSelect = () => {
    setSelected(null)
    setIsCustom(true)
  }

  const handleNext = () => {
    const value = isCustom ? customText : selected
    if (!value) return
    navigate('/practice/breathing')
  }

  const handleBack = () => {
    navigate('/practice/tutorial')
  }

  const canGoNext = !!(selected || (isCustom && customText))

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={0}
        canGoPrev={true}
        canGoNext={canGoNext}
        onPrev={handleBack}
        onNext={handleNext}
        coachBubble={
          <CoachBubble>
            이런 생각들은 자연스러운 반응입니다.{'\n'}지금은 선택만 해주세요!
          </CoachBubble>
        }
      >

        {/* 타이틀 */}
        <div className="mb-6 flex items-start justify-between w-full">
          <div className="w-[80%]">
            <p className="text-[25px] leading-[35px]">
              연습을 시작하기 전에,
              <br />
              <span className="fontBold">지금 떠오르는 생각</span>을 골라볼까요?
            </p>
            <p className="fontLight pt-3 text-[15px] text-[#5D5D5D]">
              발표나 면접을 앞두고 자주 떠오르는 생각 중 하나를 선택해주세요.
            </p>
          </div>
          <p className="text-center fontSB whitespace-nowrap rounded-lg bg-[#5650FF] w-[13%] py-2 text-[14px] text-white">
            자동 사고 인식
          </p>
        </div>

        {/* 선택지 그리드 */}
        <div className="mb-3 grid grid-cols-2 gap-3">
          {THOUGHTS.map((thought) => {
            const isActive = selected === thought
            return (
              <button
                key={thought}
                onClick={() => handleSelect(thought)}
                className={`flex items-center gap-3 rounded-2xl bg-white px-5 py-5 text-left text-[15px] text-[#3B3B3B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all ${
                  isActive
                    ? 'bg-[#e7e7ff] ring-2 ring-[#5650FF]'
                    : 'hover:ring-1 hover:ring-[#5650FF]/40'
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    isActive ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
                  }`}
                >
                  {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
                </span>
                {thought}
              </button>
            )
          })}
        </div>

        {/* 직접 입력하기 */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleCustomSelect}
            className={`flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-5 text-left text-[15px] text-[#3B3B3B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all ${
              isCustom
                ? 'bg-[#ECEBFF] ring-2 ring-[#5650FF]'
                : 'hover:ring-1 hover:ring-[#5650FF]/40'
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                isCustom ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
              }`}
            >
              {isCustom && <span className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
            </span>
            {isCustom ? (
              <input
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="직접 입력하기"
                className="flex-1 bg-transparent text-[15px] text-[#3B3B3B] placeholder-[#ABABAB] outline-none"
              />
            ) : (
              <span className="text-[#ABABAB]">직접 입력하기</span>
            )}
          </button>
        </div>
      </PracticeLayout>
    </div>
  )
}

export default PracticeStart
