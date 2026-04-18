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
      className={`mt-8 w-full rounded-2xl border border-[#D7D6F1] bg-white px-4 pb-10 pt-8 transition-all duration-700 md:px-6 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <p className="fontBold text-[17px]">
        <span className="text-[#5650FF]">{highlightText}</span> {title}
      </p>
      {children}
    </div>
  )
}
