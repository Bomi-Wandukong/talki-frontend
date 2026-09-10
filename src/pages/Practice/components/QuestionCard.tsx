import React from 'react'
import type { SubStepPhase } from '@/hooks/usePracticeSubStep'
export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

interface QuestionCardProps {
  question: string
  step: PracticeStep | SubStepPhase
  isLoading?: boolean
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, step, isLoading = false }) => {
  const isFinished = step === 'finished'

  return (
    <div
      className={`mb-6 rounded-[20px] p-6 transition-colors ${isFinished ? 'pointer-events-none bg-[#E7E7E7]' : 'bg-white'}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">질문</h3>
        <span className="rounded-md bg-[#F0EFFF] px-3 py-1 text-xs font-medium text-[#5650FF]">
          TALKI가 생성한 주제
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-[#EDEDED]" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-[#EDEDED]" />
        </div>
      ) : (
        <p className="font-medium text-gray-700">{question}</p>
      )}
    </div>
  )
}

export default QuestionCard
