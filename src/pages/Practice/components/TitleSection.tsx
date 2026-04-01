import React from 'react'

interface TitleSectionProps {
  title: string
  badgeText: string
  description: string
}

const TitleSection: React.FC<TitleSectionProps> = ({ title, badgeText, description }) => {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl fontSB text-[#3B3B3B]">{title}</h1>

        <div className="cursor-default select-none rounded-lg bg-[#5650FF] px-10 py-2 text-sm text-white shadow-sm">
          {badgeText}
        </div>
      </div>
      <p className="text-[#5D5D5D]">{description}</p>
    </div>
  )
}

export default TitleSection
