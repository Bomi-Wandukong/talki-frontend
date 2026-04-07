import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'

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
            <p className="fontLight pt-3 text-[15px] text-[#5D5D5D]">
              연습 전 예상했던 것과 실제 경험을 비교해보세요.
            </p>
          </div>
          <p className="fontSB w-[13%] whitespace-nowrap rounded-lg bg-[#5650FF] py-2 text-center text-[14px] text-white">
            연습 후
          </p>
        </div>

      </PracticeLayout>
    </div>
  )
}

export default PracticeFeel
