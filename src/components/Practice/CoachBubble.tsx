import React from 'react'
import { IMAGES } from '@/utils/images'

interface CoachBubbleProps {
  children: React.ReactNode
}

const CoachBubble: React.FC<CoachBubbleProps> = ({ children }) => {
  return (
    <div className="relative mt-8 flex w-fit max-w-xl pb-6 pl-6">
      <img
        src={IMAGES.logo}
        alt="토끼 로고"
        className="absolute -top-7 left-10 z-10 w-[70px] object-contain drop-shadow-sm"
      />

      <div className="relative z-0 flex min-h-[64px] w-fit items-center rounded-[32px] rounded-br-[0px] border border-[#5650FF] bg-white px-20 py-4 shadow-sm">
        <div className="relative z-10 whitespace-pre-line text-[15px] fontRegular pl-2 leading-relaxed text-[#4E4AC7]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CoachBubble
