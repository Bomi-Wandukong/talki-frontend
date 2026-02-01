import React, { type ReactNode } from 'react'

interface FeedbackSectionProps {
  title: string
  highlightText: string
  children: ReactNode
  isVisible: boolean
  delay?: string
  dataIndex?: number
  innerRef?: React.Ref<HTMLDivElement>
}

export default function FeedbackSection({
  title,
  highlightText,
  children,
  isVisible,
  dataIndex,
  innerRef,
}: FeedbackSectionProps) {
  return (
    <div
      ref={innerRef}
      data-index={dataIndex}
      className={`mt-10 w-full rounded-2xl border border-[#D7D6F1] bg-white px-4 pb-14 pt-10 transition-all duration-700 md:px-8 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <p className="fontBold text-[20px]">
        <span className="text-[#5650FF]">{highlightText}</span> {title}
      </p>
      {children}
    </div>
  )
}
