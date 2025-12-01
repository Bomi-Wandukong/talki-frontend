import React, { useEffect, useState } from "react";

export default function CountdownOverlay({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(() => onFinish(), 400); // 부드러운 종료 시간
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center text-center text-white z-[999]">
      {/* 큰 카운트 숫자 */}
      <div className="text-4xl fontSB mb-3">{count}초 후에 시작됩니다.</div>

      {/* 안내 문구 */}
      <div className="text-lg fontRegular opacity-80">
        가이드라인으로 세팅한 환경을 유지한채로 진행해주세요!
      </div>
    </div>
  );
}
