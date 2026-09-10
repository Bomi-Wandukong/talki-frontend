import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'
import { submitBehavioralExperiment, FEEL_ID_TO_ENUM } from '@/api/practice'
import { getPracticeSessionId } from '@/utils/practiceSession'
import { selectionClass } from '@/components/Practice/selectionStyles'

/**
 * 선택지마다 다른 피드백을 보여준다.
 * description은 상황 설명, emphasis는 강조해서 남길 문장이다.
 */
const options = [
  {
    id: 'much-better',
    emoji: '😊',
    label: '예상보다 훨씬 더 나았어요.',
    description: '예상보다 나은 결과는 불안한 예측이 항상 맞지 않다는 증거입니다.',
    emphasis: '실제로 해보는 것이 중요하다는 것을 기억하세요.',
  },
  {
    id: 'little-better',
    emoji: '🙂',
    label: '예상보다 조금 나았어요.',
    description: '작은 차이라도 예상보다 나았다면, 그만큼 불안이 상황을 부풀려 보게 했다는 뜻입니다.',
    emphasis: '이런 경험이 쌓이면 예측이 점점 현실에 가까워집니다.',
  },
  {
    id: 'similar',
    emoji: '😐',
    label: '예상한 것과 비슷했어요.',
    description: '예상과 비슷했다는 것은 상황을 비교적 현실적으로 보고 있다는 뜻입니다.',
    emphasis: '예상할 수 있는 일이라면, 준비할 수도 있는 일입니다.',
  },
  {
    id: 'little-harder',
    emoji: '😐',
    label: '예상보다 조금 어려웠어요.',
    description: '어렵게 느껴졌더라도 중간에 그만두지 않고 끝까지 해냈습니다.',
    emphasis: '어려웠던 지점을 알게 된 것도 연습의 결과입니다.',
  },
  {
    id: 'much-harder',
    emoji: '😰',
    label: '예상보다 훨씬 어려웠어요.',
    description: '많이 힘들었다면, 그건 지금 이 연습이 필요한 상황이라는 뜻이기도 합니다.',
    emphasis: '한 번에 나아지지 않아도 괜찮습니다. 반복이 변화를 만듭니다.',
  },
]

const PREV_ROUTE: Record<string, string> = {
  script: '/practice/eyecontact',
  impromptu: '/practice/core',
}

const PracticeFeel = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(
    () => localStorage.getItem('practiceFeelSelected'),
  )

  const handleSelect = (id: string) => {
    setSelected(id)
    localStorage.setItem('practiceFeelSelected', id)
  }

  const practiceType = localStorage.getItem('practiceType') ?? 'script'
  const prevRoute = PREV_ROUTE[practiceType] ?? '/practice/eyecontact'

  const canGoNext = !!selected

  // 5단계: 행동실험 결과(예상 대비 실제)를 단일 선택으로 저장한다.
  const handleNext = async () => {
    if (!selected) return

    const sessionId = getPracticeSessionId()
    if (sessionId) {
      try {
        await submitBehavioralExperiment(sessionId, FEEL_ID_TO_ENUM[selected])
      } catch (error) {
        console.error('행동실험(5단계) 저장 실패:', error)
      }
    } else {
      console.error('연습 세션이 없어 5단계를 저장하지 못했습니다.')
    }

    navigate('/practice/mind')
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={4}
        canGoPrev={true}
        canGoNext={canGoNext}
        onPrev={() => navigate(prevRoute)}
        onNext={handleNext}
        coachBubble={
          <CoachBubble>
            <div>
              <p className="fontSB mb-2 text-[15px]">기억하세요.</p>
              <ul className="flex flex-col gap-1">
                {[
                  '불안은 실제 위험이 아니라 예측입니다.',
                  '실제로 경험하면 예상과 다른 경우가 많습니다.',
                  '작은 경험들이 모여 자신감이 됩니다.',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-[14px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5650FF]" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </CoachBubble>
        }
      >
        {/* 타이틀 */}
        <div className="mb-6 flex w-full items-start justify-between">
          <div className="w-[80%]">
            <p className="text-[25px] leading-[35px]">
              직접 말해보니,
              <br />
              <span className="fontBold">예상과 비교해서 어땠나요?</span>
            </p>
            <p className="fontLight pt-1 text-[15px] text-[#5D5D5D]">
              연습 전 예상했던 것과 실제 경험을 비교해보세요.
            </p>
          </div>
          <p className="fontSB w-[13%] whitespace-nowrap rounded-lg bg-[#5650FF] py-2 text-center text-[14px] text-white">
            연습 후
          </p>
        </div>

        {/* 선택지 그리드 */}
        <div className="grid grid-cols-2 items-start gap-3">
          {options.map((option) => {
            const isSelected = selected === option.id
            const isDisabled = selected !== null && !isSelected
            return (
              <div key={option.id} className="flex flex-col">
                {/* 카드 */}
                <div
                  onClick={() => handleSelect(option.id)}
                  className={`rounded-xl p-4 ${isDisabled ? 'cursor-default' : 'cursor-pointer'} ${selectionClass(
                    isSelected ? 'selected' : isDisabled ? 'disabled' : 'idle'
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
                      }`}
                    >
                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
                    </div>
                    <span className="text-lg">{option.emoji}</span>
                    <span
                      className={`text-[14px] ${isDisabled ? 'text-[#AAAAAA]' : 'text-[#333333]'}`}
                    >
                      {option.label}
                    </span>
                  </div>
                </div>
                {/* 피드백 박스 - 슬라이드 애니메이션 */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isSelected ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="rounded-b-xl bg-white p-4 text-[13px] leading-relaxed text-[#5D5D5D]">
                    {option.description}{' '}
                    <span className="fontSB">{option.emphasis}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PracticeLayout>
    </div>
  )
}

export default PracticeFeel
