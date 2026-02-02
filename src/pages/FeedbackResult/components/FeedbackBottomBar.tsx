export default function FeedbackBottomBar({
  isDetail,
  onClick,
  onDownloadPDF,
}: {
  isDetail: boolean
  onClick: () => void
  onDownloadPDF?: () => void
}) {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full bg-white">
      <div className="flex h-24 w-full items-center justify-end gap-5 pr-24 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div
          onClick={onDownloadPDF}
          className="cursor-pointer rounded-xl border-[3px] border-[#D7D6F1] px-5 py-3 font-bold text-[#716FA4] transition-all duration-300 hover:bg-[#F7F7F8]"
        >
          분석 결과 저장하기 (PDF)
        </div>

        <button
          onClick={onClick}
          className="cursor-pointer rounded-xl border-[3px] border-transparent bg-[#5650FF] px-5 py-3 font-bold text-white transition-all duration-300 hover:bg-[#4540CC]"
        >
          {isDetail ? '홈으로 돌아가기' : '세부 분석 보기'}
        </button>
      </div>
    </div>
  )
}
