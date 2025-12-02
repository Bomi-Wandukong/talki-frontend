import React, { useState } from "react";
import LiveFeedbackTracker from "../components/LiveFeedbackTracker";
import CountdownOverlay from "../components/CountdownOverlay";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function LiveFeedback() {
  const navigate = useNavigate();

  const [showCountdown, setShowCountdown] = useState(true);

  return (
    <>
      <LiveFeedbackTracker />

      {/* 전체 화면을 덮는 비디오 배경 */}
      <div className="relative h-screen w-screen overflow-hidden">
        {/* 5초 카운트다운 오버레이 */}
        {showCountdown && (
          <CountdownOverlay onFinish={() => setShowCountdown(false)} />
        )}

        <video
          src="./video/LivePeople.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 비디오 위에 올 내용 */}
        <div className="h-full relative z-10 ">
          {/* 파동(그라데이션 오버레이) */}
          <div className="pointer-events-none absolute inset-0 z-0">
            {/* 상단 */}
            <div className="absolute top-0 left-0 w-full h-35 bg-gradient-to-b from-[#5650FF]/60 to-transparent" />
            {/* 하단 */}
            <div className="absolute bottom-0 left-0 w-full h-35 bg-gradient-to-t from-[#5650FF]/60 to-transparent" />
          </div>

          {/* 상호작용 가능한 옵션 */}
          <div className="h-full flex flex-col justify-between p-8 text-white relative z-10">
            {/* 이전버튼 */}
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <FaArrowLeftLong size={30} />
            </div>

            {/* 음파 및 토글 설정 */}
            <div className="px-10 flex justify-between items-center">
              <div>
                <img src="./img/soundWave.png" className="h-28 w-28" />
              </div>

              <div className="text-right space-y-3">
                {/* 옵션 */}
                <div className="flex justify-end items-center gap-3">
                  <span>실시간 피드백</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div
                      className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer 
                      peer-checked:bg-[#ACA9FE] transition-all"
                    ></div>
                    <div
                      className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full 
                      transition-all peer-checked:translate-x-5"
                    ></div>
                  </label>
                </div>

                {/* 돌발 상황 */}
                <div className="flex justify-end items-center gap-3">
                  <span>돌발 상황</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div
                      className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer 
                      peer-checked:bg-[#ACA9FE] transition-all"
                    ></div>
                    <div
                      className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full 
                      transition-all peer-checked:translate-x-5"
                    ></div>
                  </label>
                </div>

                <div
                  onClick={() => navigate("/live")}
                  className="cursor-pointer"
                >
                  종료하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
