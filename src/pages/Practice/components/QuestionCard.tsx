import React from 'react'
export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

interface QuestionCardProps {
  question: string
  selectedNumber: number
  onSelect: (num: number) => void
  step: PracticeStep
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedNumber,
  onSelect,
  step,
}) => {
  const isLocked = step !== 'idle'
  const isFinished = step === 'finished'

  return (
    <div className={`mb-6 rounded-[20px] p-6 transition-colors ${isFinished ? 'bg-[#E7E7E7] pointer-events-none' : 'bg-white'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">질문</h3>
        <select
          value={selectedNumber}
          onChange={(e) => onSelect(Number(e.target.value))}
          disabled={isLocked}
          className="min-w-[100px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 outline-none disabled:opacity-50"
        >
          <option value={1}>질문 1</option>
          <option value={2}>질문 2</option>
          <option value={3}>질문 3</option>
        </select>
      </div>
      <p className="font-medium text-gray-700">{question}</p>
    </div>
  )
}

export default QuestionCard
