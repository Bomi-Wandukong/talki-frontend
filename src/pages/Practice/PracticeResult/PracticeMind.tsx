import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import { IMAGES } from '@/utils/images'
import {
  submitAlternativeThought,
  ALTERNATIVE_THOUGHT_LABEL,
  ALTERNATIVE_THOUGHT_OPTIONS,
} from '@/api/practice'
import type { AlternativeThoughtOption } from '@/api/practice'
import { getPracticeSessionId } from '@/utils/practiceSession'
import { selectionClass } from '@/components/Practice/selectionStyles'

const PracticeMind = () => {
  const navigate = useNavigate()
  // 화면 문구 대신 서버 enum을 그대로 상태로 들고 있는다.
  const [selected, setSelected] = useState<AlternativeThoughtOption | null>(null)
  const [customText, setCustomText] = useState('')
  const isCustom = selected === 'CUSTOM'
  const canGoNext = !!selected && (!isCustom || customText.trim().length > 0)

  // 6단계: 대체 사고 선택.
  // 선택지가 enum과 1:1이라 변환 없이 그대로 보낸다. CUSTOM일 때만 입력 문장을 함께 담는다.
  const handleNext = async () => {
    if (!canGoNext) return

    const sessionId = getPracticeSessionId()
    if (sessionId) {
      try {
        await submitAlternativeThought(sessionId, {
          selectedThought: selected!,
          customThought: isCustom ? customText.trim() : null,
        })
      } catch (error) {
        console.error('대체 사고(6단계) 저장 실패:', error)
      }
    } else {
      console.error('연습 세션이 없어 6단계를 저장하지 못했습니다.')
    }

    navigate('/practice/complete')
  }

  return (
    <div>
      <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
        <Nav />
        <PracticeLayout
          currentStepIndex={5}
          canGoPrev={true}
          canGoNext={canGoNext}
          onPrev={() => navigate('/practice/feelresult')}
          onNext={handleNext}
        >
          {/* 타이틀 */}
          <div className="mb-6 flex w-full items-start justify-between">
            <div className="w-[80%]">
              <p className="text-[25px] leading-[35px]">
                오늘 연습을 마무리하는
                <br />
                <span className="fontBold">마음가짐 문장</span>을 골라볼까요?
              </p>
              <p className="fontLight pt-1 text-[15px] text-[#5D5D5D]">
                연습 경험을 토대로 더 균형 잡힌 생각을 선택해보세요.
              </p>
            </div>
            <p className="fontSB w-[13%] whitespace-nowrap rounded-lg bg-[#5650FF] py-2 text-center text-[14px] text-white">
              마무리
            </p>
          </div>

          {/* 선택지 */}
          <div className="flex flex-col gap-3">
            {ALTERNATIVE_THOUGHT_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-left shadow-sm ${selectionClass(
                  selected === option ? 'selected' : 'idle'
                )}`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  selected === option ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
                }`}>
                  {selected === option && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />
                  )}
                </div>
                <span className="fontRegular text-[15px] text-[#3B3B3B]">
                  {ALTERNATIVE_THOUGHT_LABEL[option]}
                </span>
              </button>
            ))}

            {/* 직접 입력 */}
            <button
              onClick={() => setSelected('CUSTOM')}
              className={`flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-left shadow-sm ${selectionClass(
                isCustom ? 'selected' : 'idle'
              )}`}
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isCustom ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
              }`}>
                {isCustom && <div className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
              </div>
              {isCustom ? (
                <input
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="나만의 마음가짐 문장을 입력해주세요."
                  className="w-full bg-transparent text-[15px] text-[#3B3B3B] outline-none placeholder:text-gray-300"
                />
              ) : (
                <span className="fontRegular text-[15px] text-[#b6b6b6]">직접 입력하기</span>
              )}
            </button>
          </div>

          {/* 대체사고란 버블 */}
          <div className="relative mt-8 w-full pb-2 pl-6">
            <img
              src={IMAGES.logo}
              alt="토끼 로고"
              className="absolute -top-7 left-10 z-10 w-[70px] object-contain drop-shadow-sm"
            />
            <div className="relative z-0 w-full rounded-[32px] rounded-br-[0px] border border-[#5650FF] bg-white px-10 py-6 pl-20 shadow-sm">
              <p className="fontBold mb-2 text-[15px] text-[#5650FF]">대체사고란?</p>
              <p className="fontRegular text-[14px] leading-relaxed text-[#4E4AC7]">
                자동사고(부정적 예측)를 대체하는 균형 잡힌 생각입니다. 무조건 긍정적인 것이 아니라, 실제 경험에 기반한 현실적인 관점입니다.{' '}
                연습을 통해 이런 사고가 자연스러워집니다.
              </p>
            </div>
          </div>
        </PracticeLayout>
      </div>
    </div>
  )
}

export default PracticeMind;