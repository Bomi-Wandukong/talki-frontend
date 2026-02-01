import React, { ReactNode } from "react";

interface FeedbackSectionProps {
  title: string;
  highlightText: string;
  children: ReactNode;
  isVisible: boolean;
  delay?: string;
  dataIndex?: number;
  innerRef?: React.Ref<HTMLDivElement>;
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
      className={`mt-10 w-full bg-white rounded-2xl border border-[#D7D6F1] px-4 md:px-8 pt-10 pb-15 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <p className="text-[20px] fontBold">
        <span className="text-[#5650FF]">{highlightText}</span> {title}
      </p>
      {children}
    </div>
  );
}
