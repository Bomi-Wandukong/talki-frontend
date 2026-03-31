import React from 'react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'

interface NavigationArrowsProps {
  canGoPrev: boolean
  canGoNext: boolean
  isLocked: boolean
  onPrev?: () => void
  onNext?: () => void
  lockedMessage?: string
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  canGoPrev,
  canGoNext,
  isLocked,
  onPrev,
  onNext,
  lockedMessage = '',
}) => {
  return (
    <div className="flex flex-col items-end gap-2">
      {lockedMessage && <span className="mx-auto text-xs text-[#F29F67]">{lockedMessage}</span>}
      <div className="flex h-[34px] w-[160px] overflow-hidden rounded-lg shadow-md">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`flex flex-1 items-center justify-start pl-2 transition-colors ${
            canGoPrev
              ? 'cursor-pointer bg-[#FFA956] hover:bg-[#F29F67]'
              : 'cursor-not-allowed bg-[#FFD6AF]'
          }`}
          aria-label="이전 단계"
        >
          <FaCaretLeft className="text-xl text-white" />
        </button>

        {/* 구분선 */}
        <div className="z-10 w-[1px] bg-white opacity-50" />

        <button
          onClick={onNext}
          disabled={!canGoNext || isLocked}
          className={`flex flex-1 items-center justify-end pr-2 transition-colors ${
            !isLocked && canGoNext
              ? 'cursor-pointer bg-[#FFA956] hover:bg-[#F29F67]'
              : 'cursor-not-allowed bg-[#FFD6AF]'
          }`}
          aria-label="다음 단계"
          title={isLocked ? lockedMessage : ''}
        >
          <FaCaretRight className="text-xl text-white" />
        </button>
      </div>
    </div>
  )
}

export default NavigationArrows
