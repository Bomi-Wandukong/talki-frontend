import React from "react";
import CircleProgress from "./CircleProgress";
import FeedbackContent from "./FeedbackContent";

export default function AnalysisResult() {
  const progressData = [
    { label: "발화 속도", score: 50 },
    { label: "시선 집중도", score: 62 },
    { label: "주제 적절성", score: 75 },
    { label: "제스처 안정성", score: 62 },
  ];

  return (
    <>
      <div className="w-screen h-screen bg-[#F7F7F8]">
        {/* 전체 간격 프레임 */}
        <div className="w-full pt-20 px-[20%]">
          <p className="max-w-43 text-[25px] text-[#3B3B3B] pb-3 mb-13 font-bold border-b-2 border-[#D7D6F1]">
            분석 결과
          </p>

          {/* 분석 총점 그래프 */}
          <div className="flex justify-between items-center">
            <div className="text-[15px] mr-[13%]">
              <p className="">분석 총점</p>
              <p>
                <span className="text-[30px] text-[#5650FF] font-bold">
                  51.25
                </span>{" "}
                / 100
              </p>
            </div>

            <div className="flex flex-1 justify-between">
              {progressData.map((item) => (
                <CircleProgress
                  key={item.label}
                  label={item.label}
                  score={item.score}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 피드백 내용 */}
        <div className="mt-17">
          <FeedbackContent />
        </div>

        <div className="flex justify-end items-center gap-5 h-26 pr-25 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] font-bold">
          <div className="py-4 px-5 border-3 border-[#D7D6F1] rounded-xl text-[#716FA4]">
            분석 결과 저장하기
          </div>
          <div className="py-4 px-5 border-3 rounded-xl bg-[#5650FF] text-white">
            세부 분석 보기(유료)
          </div>
        </div>
      </div>
    </>
  );
}
