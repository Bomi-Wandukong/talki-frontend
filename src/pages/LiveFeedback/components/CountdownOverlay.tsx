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
          setTimeout(onFinish, 400);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 z-[999] bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center text-white">
      <div className="text-4xl font-semibold mb-3">
        {count}초 후에 시작됩니다.
      </div>
      <div className="text-lg opacity-80">
        가이드라인으로 세팅한 환경을 유지해주세요.
      </div>
    </div>
  );
}
