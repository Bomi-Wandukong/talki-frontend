import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface GuideLineCamProps {
  isGood?: boolean;
  onStatusChange?: (isGood: boolean) => void;
  onComplete?: () => void;
}

const GuideLineCam: React.FC<GuideLineCamProps> = ({
  isGood: externalIsGood,
  onStatusChange,
  onComplete,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalIsGood, setInternalIsGood] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const isGood = externalIsGood !== undefined ? externalIsGood : internalIsGood;

  useEffect(() => {
    const checkFace = () => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const topY = canvas.height * 0.25;
      const width = canvas.width * 0.35;
      const height = canvas.height * 0.4;

      const startX = centerX - width / 2;
      const startY = topY;

      const imageData = ctx.getImageData(startX, startY, width, height);
      const data = imageData.data;

      let skinPixels = 0;
      let totalPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        totalPixels++;

        if (
          r > 110 &&
          g > 50 &&
          b > 30 &&
          r > g &&
          r > b &&
          Math.abs(r - g) > 20 &&
          r - b > 20 &&
          r < 250 &&
          g < 230
        ) {
          skinPixels++;
        }
      }

      const skinRatio = skinPixels / totalPixels;
      const detected = skinRatio > 0.3 && skinRatio < 0.5;

      if (externalIsGood === undefined) {
        setInternalIsGood(detected);
      }

      if (onStatusChange) {
        onStatusChange(detected);
      }
    };

    const interval = setInterval(checkFace, 200);
    return () => clearInterval(interval);
  }, [externalIsGood, onStatusChange]);

  // 5초 타이머 관리
  useEffect(() => {
    if (isGood) {
      if (holdTimerRef.current === null) {
        holdTimerRef.current = setInterval(() => {
          setHoldTime((prev) => {
            const newTime = prev + 0.1;
            if (newTime >= 5) {
              if (holdTimerRef.current) {
                clearInterval(holdTimerRef.current);
                holdTimerRef.current = null;
              }
              if (onComplete) {
                onComplete();
              }
              return 5;
            }
            return newTime;
          });
        }, 100);
      }
    } else {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      setHoldTime(0);
    }

    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, [isGood, onComplete]);

  return (
    <div className="w-full max-w-5xl">
      <section className="mt-4 rounded-3xl bg-white shadow-sm border border-gray-100 px-10 py-10 pt-15 flex justify-center flex-col items-center">
        <div className="relative w-full max-w-[620px] h-[400px]">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            className="rounded-xl border border-gray-200 w-full h-full object-cover"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
          />

          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="/imgs/guideline.png"
              alt="guideline"
              className="w-full h-[80%] mt-18 object-contain"
              style={{
                filter: isGood
                  ? "brightness(0) saturate(100%) invert(64%) sepia(98%) saturate(471%) hue-rotate(76deg) brightness(91%) contrast(86%)"
                  : "brightness(0) saturate(100%) invert(75%) sepia(36%) saturate(1373%) hue-rotate(334deg) brightness(101%) contrast(101%)",
              }}
            />
          </div>

          {/* 타이머 진행 표시 */}
          {isGood && holdTime < 5 && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#5B4BFF] text-white px-6 py-2 rounded-full shadow-lg z-10">
              <p className="text-sm">
                {Math.ceil(5 - holdTime)}초 후 완료됩니다.
              </p>
            </div>
          )}
        </div>
        {isGood && (
          <p className="pt-8">
            <span className="mr-5 text-[#4DCB56]">✓</span>
            <span className="text-[#5650FF]">잘하셨어요!</span> 5초간 해당
            위치를 유지해주세요.
          </p>
        )}
        {!isGood && (
          <p className="pt-8">
            <span className="mr-5 text-[#D9D9D9]">✓</span>얼굴이 화면의{" "}
            <span className="text-[#EE8A29]">가이드라인</span> 안에 들어오도록
            맞춰주세요.
          </p>
        )}
      </section>
    </div>
  );
};

export default GuideLineCam;