export default function FeedbackBottomBar({
  isDetail,
  onClick,
  onDownloadPDF,
}: {
  isDetail: boolean;
  onClick: () => void;
  onDownloadPDF?: () => void;
}) {
  return (
    <div>
      <div className="flex justify-end items-center gap-5 h-23 pr-25 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div
          onClick={onDownloadPDF}
          className="py-3 px-5 border-3 border-[#D7D6F1] rounded-xl text-[#716FA4] hover:bg-[#F7F7F8] transition-all duration-300 cursor-pointer">
          분석 결과 저장하기 (PDF)
        </div>

        <button
          onClick={onClick}
          className="py-3 px-5 border-3 rounded-xl bg-[#5650FF] text-white hover:bg-[#4540CC] transition-all duration-300 cursor-pointer">
          {isDetail ? "홈으로 돌아가기" : "세부 분석 보기"}
        </button>
      </div>
    </div>
  );
}
