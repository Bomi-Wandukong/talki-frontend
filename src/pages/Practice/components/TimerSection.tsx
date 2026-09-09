import React from 'react'
import type { SubStepPhase } from '@/hooks/usePracticeSubStep'
export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

interface TimerSectionProps {
  step: PracticeStep | SubStepPhase
  prepTimeLeft: number
  recordTimeLeft: number
  isCompact?: boolean
  /** 준비 시간이 없는 하위단계(POINT)에서는 준비 박스를 숨긴다. */
  showPrep?: boolean
}

const TimerSection: React.FC<TimerSectionProps> = ({
  step,
  prepTimeLeft,
  recordTimeLeft,
  isCompact = false,
  showPrep = true,
}) => {
  // 분석 대기(analyzing) 구간은 종료 상태와 동일하게 표시한다.
  const isDone = step === 'finished' || step === 'analyzing'

  return (
    <div className={`mb-5 flex gap-4 ${isCompact ? 'h-24' : 'h-32'}`}>
      {/* 준비 시간 박스 */}
      {showPrep && (
      <div
        className={`relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl transition-all ${
          step === 'preparing'
            ? 'border-2 border-[#F29F67] bg-[#FFF2E5]'
            : step === 'recording' || isDone
              ? 'border border-transparent bg-[#E7E7E7]'
              : 'border border-transparent bg-white'
        }`}
      >
        <span
          className={`absolute left-6 top-4 text-sm font-medium ${step === 'recording' || isDone ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
        >
          준비 시간
        </span>
        <div className="flex h-full w-full items-center justify-center">
          <span
            className={`text-4xl font-bold ${step === 'recording' || isDone ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
          >
            {prepTimeLeft}초
          </span>
        </div>
      </div>
      )}

      {/* 말하기 시간 박스 */}
      <div
        className={`relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl transition-all ${
          step === 'recording'
            ? 'border-2 border-[#E57373] bg-[#FFEBEE]'
            : isDone
              ? 'border border-transparent bg-[#E7E7E7]'
              : 'border border-transparent bg-white'
        }`}
      >
        <span
          className={`absolute left-6 top-4 text-sm font-medium ${isDone ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
        >
          말하기 시간
        </span>
        <div className="flex h-full w-full items-center justify-center">
          <span
            className={`text-4xl font-bold ${isDone ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
          >
            {recordTimeLeft}초
          </span>
        </div>
      </div>
    </div>
  )
}

export default TimerSection
