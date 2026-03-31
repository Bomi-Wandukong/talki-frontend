import React from 'react'

interface KeywordAnalysisProps {
  usedCount: number
  totalCount: number
  evaluation: string
  detail: string
}

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({
  usedCount,
  totalCount,
  evaluation,
  detail,
}) => {
  return (
    <div className="relative mb-10 w-full animate-fade-in rounded-[20px] bg-white p-8 pb-12 shadow-sm">
      <h3 className="mb-10 text-lg font-bold text-[#3B3B3B]">키워드 사용 분석</h3>

      <div className="flex justify-around text-center px-12">
        <div>
          <h4 className="mb-3 text-[28px] font-bold text-[#3B3B3B]">{usedCount} / {totalCount}</h4>
          <p className="text-[15px] font-medium text-[#868686]">사용된 키워드</p>
        </div>
        <div className="w-[1px] bg-[#EBEBEB]"></div>
        <div>
          <h4 className="mb-3 text-[28px] font-bold text-[#3B3B3B]">{evaluation}</h4>
          <p className="text-[15px] font-medium text-[#868686]">{detail}</p>
        </div>
      </div>
    </div>
  )
}

export default KeywordAnalysis
