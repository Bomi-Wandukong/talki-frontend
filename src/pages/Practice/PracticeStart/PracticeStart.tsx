import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'
import PracticeGuideModal, { HIDE_KEY } from './PracticeGuideModal'
import { submitThoughtRecognition, THOUGHT_ENUM_TO_LABEL, THOUGHT_OPTIONS } from '@/api/practice'
import type { NegativeThought } from '@/api/practice'
import { getPracticeSessionId } from '@/utils/practiceSession'
import { selectionClass } from '@/components/Practice/selectionStyles'

const PracticeStart = () => {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(() => localStorage.getItem(HIDE_KEY) !== 'true')
  // 화면 문구 대신 서버 enum을 그대로 상태로 들고 있는다.
  const [selected, setSelected] = useState<NegativeThought | null>(null)
  const [customText, setCustomText] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const handleSelect = (thought: NegativeThought) => {
    setSelected(thought)
    setIsCustom(false)
  }

  const handleCustomSelect = () => {
    setSelected(null)
    setIsCustom(true)
  }

  // 1단계: 자동사고 인식.
  // 화면은 단일 선택이지만 API는 배열을 받으므로 선택 1개를 배열로 감싸서 보낸다.
  // 직접 입력을 고른 경우 enum은 OTHER, 입력한 문장은 customThought로 보낸다.
  const handleNext = async () => {
    const value = isCustom ? customText : selected
    if (!value) return

    const sessionId = getPracticeSessionId()
    if (sessionId) {
      try {
        await submitThoughtRecognition(sessionId, {
          selectedThoughts: isCustom ? ['OTHER'] : [selected!],
          customThought: isCustom ? customText : null,
        })
      } catch (error) {
        console.error('자동사고 인식(1단계) 저장 실패:', error)
      }
    } else {
      console.error('연습 세션이 없어 1단계를 저장하지 못했습니다.')
    }

    navigate('/practice/breathing')
  }

  const handleBack = () => {
    navigate('/practice/tutorial')
  }

  const canGoNext = !!(selected || (isCustom && customText))

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      {showGuide && <PracticeGuideModal onClose={() => setShowGuide(false)} />}
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

        {/*
          선택지 그리드. "직접 입력하기"까지 같은 그리드에 넣어야 6칸이 3행으로 채워져
          왼쪽 3개 / 오른쪽 3개로 나뉜다. 따로 두면 직접 입력이 새 행 왼쪽에 붙어 4:2가 된다.
        */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {THOUGHT_OPTIONS.map((thought) => {
            const isActive = selected === thought
            return (
              <button
                key={thought}
                onClick={() => handleSelect(thought)}
                className={`flex items-center gap-3 rounded-2xl px-5 py-5 text-left text-[15px] text-[#3B3B3B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] ${selectionClass(
                  isActive ? 'selected' : 'idle'
                )}`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    isActive ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
                  }`}
                >
                  {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
                </span>
                {THOUGHT_ENUM_TO_LABEL[thought]}
              </button>
            )
          })}

          {/* 직접 입력하기 */}
          <button
            onClick={handleCustomSelect}
            className={`flex w-full items-center gap-3 rounded-2xl px-5 py-5 text-left text-[15px] text-[#3B3B3B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] ${selectionClass(
              isCustom ? 'selected' : 'idle'
            )}`}
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
