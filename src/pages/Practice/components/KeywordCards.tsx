import React from 'react'
import { FaCheck } from 'react-icons/fa'

export type KeywordType = {
  id: number
  text: string
  isUsed: boolean
}

interface KeywordCardsProps {
  keywords: KeywordType[]
}

const KeywordCards: React.FC<KeywordCardsProps> = ({ keywords }) => {
  return (
    <div className="mb-8 mt-6 grid grid-cols-3 gap-6">
      {keywords.map((kw, index) => {
        const isUsed = kw.isUsed

        return (
          <div
            key={kw.id}
            className={`relative flex min-h-[84px] items-center justify-center rounded-xl p-6 transition-all ${
              isUsed
                ? 'border border-[#5650FF] bg-[#EEECFF]'
                : 'border border-transparent bg-white shadow-sm'
            }`}
          >
            <div
              className={`absolute left-6 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                isUsed
                  ? 'bg-[#5650FF] text-white'
                  : 'border-2 border-[#EBEBEB] bg-white text-[#C4C4C4]'
              }`}
            >
              {isUsed ? <FaCheck /> : index + 1}
            </div>
            <span className={`text-[18px] text-[#3B3B3B]`}>{kw.text}</span>

            {isUsed && (
              <span className="absolute bottom-3 right-5 text-[11px] font-bold text-[#5650FF]">
                사용됨
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default KeywordCards
