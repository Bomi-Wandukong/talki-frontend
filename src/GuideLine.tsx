import React, { useState } from "react";
import Nav from "./components/Nav.tsx";
import GuideLineCam from "./components/GuideLineCam.tsx";
import GuideLineMic from "./components/GuideLineMic.tsx";

const GuideLine = () => {
  const [isGood, setIsGood] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: 카메라, 2: 마이크

  const handleCameraComplete = () => {
    setCurrentStep(2);
    console.log("카메라 세팅 완료!");
  };

  const handleMicComplete = () => {
    console.log("마이크 세팅 완료!");
    // 다음 페이지로 이동하거나 완료 처리
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F7F8]">
      <Nav />
      <main className="flex justify-center px-6 py-10 mt-22">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center">
            <div className="mb-6">
              <p className="text-2xl font-bold text-[#3B3B3B]">
                <span className="text-[#5B4BFF]">세팅</span>을 확인해주세요!
              </p>
              <p className="mt-2 text-sm text-[#716FA4]">
                {currentStep === 1
                  ? "카메라 세팅을 가이드라인과 함께 맞춰주세요."
                  : "마이크 세팅을 확인해주세요."}
              </p>
            </div>
            <div className="gap-4 flex items-center">
              {/* 첫 번째 단계 - 카메라 */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  currentStep === 1
                    ? "bg-[#C1BFFC]"
                    : currentStep >= 2
                    ? "bg-[#FFA956]"
                    : "bg-[#E4E3F4]"
                }`}
              >
                <span className="text-white font-bold text-sm">1</span>
              </div>
              {/* 두 번째 단계 - 마이크 */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  currentStep === 2 ? "bg-[#C1BFFC]" : "bg-[#E4E3F4]"
                }`}
              >
                <span className="text-white font-bold text-sm">2</span>
              </div>
            </div>
          </div>

          {currentStep === 2 && (
            <GuideLineCam
              onStatusChange={setIsGood}
              onComplete={handleCameraComplete}
            />
          )}
          {currentStep === 1 && <GuideLineMic onComplete={handleMicComplete} />}
        </div>
      </main>
    </div>
  );
};

export default GuideLine;