import { useEffect, useRef } from 'react'

const COUNTDOWN_SECONDS = 5
/** 0 이 표시된 뒤 화면이 넘어가기까지의 여유 시간 */
const FINISH_DELAY_MS = 400
/** 숫자 한 칸의 높이(em). translate 거리 계산에 그대로 쓰인다. */
const DIGIT_HEIGHT_EM = 1.2

// 5, 4, 3, 2, 1, 0
const DIGITS = Array.from({ length: COUNTDOWN_SECONDS + 1 }, (_, i) => COUNTDOWN_SECONDS - i)

export default function CountdownOverlay({ onFinish }: { onFinish: () => void }) {
  // 부모가 인라인 콜백을 넘겨 매 렌더마다 참조가 바뀌어도 타이머가 재시작되지 않도록 ref 로 고정
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(
      () => onFinishRef.current(),
      COUNTDOWN_SECONDS * 1000 + FINISH_DELAY_MS
    )
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-[999] bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center text-white">
      {/*
        카운트다운 중 LiveFeedbackTracker 가 MediaPipe 모델을 초기화하고 매 프레임 추론을 돌려
        메인 스레드를 점유한다. 그동안 React 리렌더가 화면에 그려지지 않아 숫자가 건너뛰거나 늘어졌다.
        transform 애니메이션은 컴포지터 스레드에서 처리되므로 메인 스레드 상태와 무관하게 일정하다.
      */}
      <style>{`
        @keyframes talki-countdown-roll {
          from { transform: translateY(0); }
          to   { transform: translateY(-${COUNTDOWN_SECONDS * DIGIT_HEIGHT_EM}em); }
        }
        .talki-countdown-window {
          display: inline-block;
          height: ${DIGIT_HEIGHT_EM}em;
          overflow: hidden;
        }
        .talki-countdown-reel {
          animation: talki-countdown-roll ${COUNTDOWN_SECONDS}s steps(${COUNTDOWN_SECONDS}, end) forwards;
          will-change: transform;
        }
        .talki-countdown-digit {
          height: ${DIGIT_HEIGHT_EM}em;
          line-height: ${DIGIT_HEIGHT_EM}em;
        }
      `}</style>

      <div className="text-4xl font-semibold mb-3 flex items-start">
        <span className="talki-countdown-window">
          <span className="talki-countdown-reel block">
            {DIGITS.map((n) => (
              <span key={n} className="talki-countdown-digit block text-center">
                {n}
              </span>
            ))}
          </span>
        </span>
        <span className="talki-countdown-digit">초 후에 시작됩니다.</span>
      </div>
      <div className="text-lg opacity-80">가이드라인으로 세팅한 환경을 유지해주세요.</div>
    </div>
  )
}
