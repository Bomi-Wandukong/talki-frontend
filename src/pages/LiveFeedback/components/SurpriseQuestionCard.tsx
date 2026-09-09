export interface SurpriseQuestionCardProps {
  question: string
}

/**
 * 실전 발표 중 돌발 질문 카드.
 * 시안 기준: 499×190, #FA8D23, radius 10, glow shadow(0 0 10.7px 3px #FFA956), 화면 정중앙.
 */
export default function SurpriseQuestionCard({ question }: SurpriseQuestionCardProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 z-20 w-[499px] min-h-[190px] max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-[#FA8D23] pb-[33px] pl-[28px] pr-[37px] pt-[33px] text-white shadow-[0_0_10.7px_3px_#FFA956]"
    >
      {/* 제목 + 안내 문구 (시안상 아랫선 정렬) */}
      <div className="flex items-end gap-[7px]">
        <span className="fontSB whitespace-nowrap text-[20px] leading-[24px]">돌발 질문</span>
        <span className="fontRegular text-[13px] leading-[16px] text-[#FFE5CC]">
          3초 내로 답하세요. 답은 20초 내외
        </span>
      </div>

      <p className="fontRegular mt-[27px] text-[17px] leading-[25px]">{question}</p>
    </div>
  )
}
