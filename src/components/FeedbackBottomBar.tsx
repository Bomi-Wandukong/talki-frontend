import React from "react";

export default function FeedbackBottomBar() {
  return (
    <div>
      <div className="flex justify-end items-center gap-5 h-23 pr-25 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="py-3 px-5 border-3 border-[#D7D6F1] rounded-xl text-[#716FA4]">
          분석 결과 저장하기
        </div>
        <div className="py-3 px-5 border-3 rounded-xl bg-[#5650FF] text-white">
          세부 분석 보기(유료)
        </div>
      </div>
    </div>
  );
}
