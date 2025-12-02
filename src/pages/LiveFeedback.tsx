import React, { useState, useRef, useEffect } from "react";
import LiveFeedbackTracker from "../components/LiveFeedbackTracker";
import CountdownOverlay from "../components/CountdownOverlay";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function LiveFeedback() {
  const navigate = useNavigate();

  const [showCountdown, setShowCountdown] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ⭐ showCountdown 변할 때 pause/play
  useEffect(() => {
    if (!videoRef.current) return;

    if (showCountdown) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [showCountdown]);

  return (
    <>
      <LiveFeedbackTracker />

      <div className="relative h-screen w-screen overflow-hidden">
        {/* 오버레이 */}
        {showCountdown && (
          <CountdownOverlay onFinish={() => setShowCountdown(false)} />
        )}

        {/* 배경 비디오 */}
        <video
          ref={videoRef}
          src="./video/LivePeople.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 비디오 위 콘텐츠 */}
        <div className="h-full relative z-10">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-35 bg-gradient-to-b from-[#5650FF]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-35 bg-gradient-to-t from-[#5650FF]/60 to-transparent" />
          </div>

          <div className="h-full flex flex-col justify-between p-8 text-white relative z-10">
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <FaArrowLeftLong size={30} />
            </div>

            <div className="px-10 flex justify-between items-center">
              <div>
                <img src="./img/soundWave.png" className="h-28 w-28" />
              </div>

              <div className="text-right space-y-3">
                <div className="flex justify-end items-center gap-3">
                  <span>실시간 피드백</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#ACA9FE] transition-all"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex justify-end items-center gap-3">
                  <span>돌발 상황</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#ACA9FE] transition-all"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div
                  onClick={() => navigate("/result")}
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
