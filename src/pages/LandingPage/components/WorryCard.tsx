import React from 'react'

interface WorryCardProps {
  image?: string
  text: string
  highlightText?: string
  rotation?: number
}

export default function WorryCard({ image, text, highlightText, rotation = 0 }: WorryCardProps) {
  return (
    <div
      className="flex h-[330px] w-[270px] shrink-0 transform flex-col items-center justify-between rounded-[30px] bg-white px-9 py-10 shadow-[0_15px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
      style={{ transform: `rotate(${rotation}deg)` }} // 여기서 rotation 값이 그대로 적용됨
    >
      {/* Avatar Image */}
      <div className="flex h-[70%] w-full items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="User Avatar" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="w-full text-left">
        <p className="break-keep text-[20px] font-medium leading-snug text-gray-800">
          {(highlightText ? text.split(highlightText) : [text]).map((part, index, array) => (
            <React.Fragment key={index}>
              {part}
              {index < array.length - 1 && (
                <span className="relative inline-block bg-[#FFD6A5]/50 px-1">
                  <span className="relative z-10 font-bold">{highlightText}</span>
                  <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#FFD6A5]"></span>
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  )
}
