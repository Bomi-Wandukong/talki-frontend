import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'

const options = [
  { id: 'much-better', emoji: '😊', label: '예상보다 훨씬 더 나았어요.' },
  { id: 'little-better', emoji: '🙂', label: '예상보다 조금 나았어요.' },
  { id: 'similar', emoji: '😐', label: '예상한 것과 비슷했어요.' },
  { id: 'little-harder', emoji: '😐', label: '예상보다 조금 어려웠어요.' },
  { id: 'much-harder', emoji: '😰', label: '예상보다 훨씬 어려웠어요.' },
]

const PracticeFeel = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  const canGoNext = !!selected

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={4}
        canGoPrev={true}
        canGoNext={canGoNext}
        onPrev={() => navigate('/practice/tutorial')}
        onNext={() => navigate('/practice/breathing')}
        //뭘 선택했냐에 따라 다른 뒤로(이전 연습 프로그램)으로 이동해야함. 이후에 수정 예정
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
                  onClick={() => setSelected(option.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-[#5650FF] bg-[#EEF0FF]'
                      : isDisabled
                        ? 'cursor-default border-[#E5E5E5] bg-[#F5F5F5] opacity-50'
                        : 'border-[#E5E5E5] bg-white hover:border-[#5650FF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-[#5650FF]' : 'border-[#CCCCCC]'
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
                    예상보다 나은 결과는 불안한 예측이 항상 맞지 않다는 증거입니다.{' '}
                    <span className="fontSB">실제로 해보는 것이 중요하다는 것을 기억하세요.</span>
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
