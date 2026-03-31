import React from 'react'

interface WorryCardProps {
  image?: string
  text: string
  highlightText?: string
  rotation?: number
  altText?: string
}

export default function WorryCard({
  image,
  text,
  highlightText,
  rotation = 0,
  altText,
}: WorryCardProps) {
  return (
    <div className="shrink-0 transition-transform" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="flex h-[192px] w-[144px] flex-col items-center justify-between rounded-[20px] bg-white px-4 py-5 shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 md:h-[264px] md:w-[216px] md:px-7 md:py-8">
        {/* Avatar Image */}
        <div className="flex h-[70%] w-full items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={altText ?? `${text} illustration`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400 md:h-26 md:w-26">
              No Image
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="w-full text-left">
          <p className="break-keep text-[13px] font-medium leading-snug text-gray-800 md:text-[16px]">
            {(highlightText ? text.split(highlightText) : [text]).map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="relative inline-block bg-[#FFD6A5]/50 px-1">
                    <span className="relative z-10 font-bold">{highlightText}</span>
                    <span className="absolute bottom-1 left-0 -z-0 h-2.5 w-full bg-[#FFD6A5]"></span>
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
