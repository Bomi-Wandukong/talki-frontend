import React from 'react'
import { FaCheck } from 'react-icons/fa'

export type CoreKeyword = {
  id: number
  text: string
  isUsed: boolean
}

interface CoreTextCardProps {
  originalText: string
  keywords: CoreKeyword[]
}

const CoreTextCard: React.FC<CoreTextCardProps> = ({ originalText, keywords }) => {
  return (
    <div className="relative mb-6 rounded-[20px] bg-white p-8 shadow-sm border border-transparent">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-[22px] font-bold text-[#3B3B3B]">원문</h3>
        
        <div className="flex flex-col items-end gap-2">
          <span className="text-[11px] font-medium text-[#B2B2B2]">이 단어들을 포함시켜 답변해보세요. (참고용)</span>
          <div className="flex gap-3">
            {keywords.map((kw) => (
              <div
                key={kw.id}
                className={`flex h-[32px] min-w-[84px] items-center justify-center rounded-[8px] border transition-all ${
                  kw.isUsed
                    ? 'border-[#5650FF] bg-[#EEECFF] text-[#5650FF]'
                    : 'border-[#D9D9D9] bg-white text-[#868686]'
                }`}
              >
                {kw.isUsed && <FaCheck className="mr-1.5 text-[10px]" />}
                <span className="text-[13px] font-semibold">{kw.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[15px] leading-[1.8] text-[#3B3B3B] whitespace-pre-line font-medium">
        {originalText}
      </div>
    </div>
  )
}

export default CoreTextCard
