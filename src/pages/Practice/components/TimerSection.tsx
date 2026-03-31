import React from 'react'
export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

interface TimerSectionProps {
  step: PracticeStep
  prepTimeLeft: number
  recordTimeLeft: number
  isCompact?: boolean
}

const TimerSection: React.FC<TimerSectionProps> = ({
  step,
  prepTimeLeft,
  recordTimeLeft,
  isCompact = false,
}) => {
  return (
    <div className={`mb-5 flex gap-4 ${isCompact ? 'h-24' : 'h-32'}`}>
      {/* 준비 시간 박스 */}
      <div
        className={`relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl transition-all ${
          step === 'preparing'
            ? 'border-2 border-[#F29F67] bg-[#FFF2E5]'
            : step === 'recording' || step === 'finished'
              ? 'border border-transparent bg-[#E7E7E7]'
              : 'border border-transparent bg-white'
        }`}
      >
        <span
          className={`absolute left-6 top-4 text-sm font-medium ${step === 'recording' || step === 'finished' ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
        >
          준비 시간
        </span>
        <div className="flex h-full w-full items-center justify-center">
          <span
            className={`text-4xl font-bold ${step === 'recording' || step === 'finished' ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
          >
            {prepTimeLeft}초
          </span>
        </div>
      </div>

      {/* 말하기 시간 박스 */}
      <div
        className={`relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl transition-all ${
          step === 'recording'
            ? 'border-2 border-[#E57373] bg-[#FFEBEE]'
            : step === 'finished'
              ? 'border border-transparent bg-[#E7E7E7]'
              : 'border border-transparent bg-white'
        }`}
      >
        <span
          className={`absolute left-6 top-4 text-sm font-medium ${step === 'finished' ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
        >
          말하기 시간
        </span>
        <div className="flex h-full w-full items-center justify-center">
          <span
            className={`text-4xl font-bold ${step === 'finished' ? 'text-[#858585]' : 'text-[#3B3B3B]'}`}
          >
            {recordTimeLeft}초
          </span>
        </div>
      </div>
    </div>
  )
}

export default TimerSection
