import React from 'react'
export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'
import { FaMicrophone, FaStop } from 'react-icons/fa'
import type { SubStepPhase } from '@/hooks/usePracticeSubStep'

interface MicButtonProps {
  step: PracticeStep | SubStepPhase
  onStart: () => void
  onStop: () => void
}

const MicButton: React.FC<MicButtonProps> = ({ step, onStart, onStop }) => {
  // 'ready'(연결 완료·대기)는 기존 'idle'과 동일하게 표시한다.
  if (step === 'finished' || step === 'error') return null

  const isIdle = step === 'idle' || step === 'ready'

  return (
    <div className="flex min-w-[120px] flex-col items-center justify-center">
      {step === 'connecting' && (
        <>
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9C7FF] text-white shadow-md">
            <FaMicrophone className="text-2xl" />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-[#9B99C7]">
            준비하는 중...
          </span>
        </>
      )}

      {isIdle && (
        <>
          <button
            onClick={onStart}
            className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#5650FF] text-white shadow-md transition-colors"
          >
            <FaMicrophone className="text-2xl" />
          </button>
          <span className="whitespace-nowrap text-xs font-medium text-[#716FA4]">
            클릭하면 녹음 시작
          </span>
        </>
      )}

      {step === 'preparing' && (
        <>
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F29F67] text-white shadow-md">
            <div className="flex gap-1">
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                style={{ animationDelay: '0s' }}
              ></span>
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                style={{ animationDelay: '0.4s' }}
              ></span>
            </div>
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-[#C76400]">준비 중...</span>
        </>
      )}

      {step === 'recording' && (
        <>
          <button
            onClick={onStop}
            className="mb-2 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#E05F5F] text-white shadow-md transition-colors hover:bg-[#EF5350]"
          >
            <FaStop className="text-xl" />
          </button>
          <span className="whitespace-nowrap text-xs font-medium text-[#E04E50]">녹음 중...</span>
        </>
      )}

      {step === 'analyzing' && (
        <>
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#5650FF] text-white shadow-md">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-[#716FA4]">분석 중...</span>
        </>
      )}
    </div>
  )
}

export default MicButton
