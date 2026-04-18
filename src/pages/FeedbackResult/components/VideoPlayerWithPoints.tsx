import React, { useRef } from 'react'

interface TimestampPoint {
  time: string // 클릭 시 이동할 시작 시간 (m:ss)
  endTime?: string // 표시용 종료 시간 (m:ss)
  description: string
}

interface VideoPlayerWithPointsProps {
  videoSrc: string
  paramPoints: {
    strengths: TimestampPoint[]
    improvements: TimestampPoint[]
    questions?: { question: string; answer: string; time: string }[]
  }
}

export default function VideoPlayerWithPoints({
  videoSrc,
  paramPoints,
}: VideoPlayerWithPointsProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(':').map(Number)
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0
  }

  const seekToTime = (timestamp: string) => {
    if (videoRef.current) {
      const timeInSeconds = parseTimestamp(timestamp)
      videoRef.current.currentTime = timeInSeconds
      videoRef.current.play()
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // 시간 포맷: m:ss → 00:ss 형태로 표시
  const formatDisplay = (time: string): string => {
    const parts = time.split(':')
    if (parts.length === 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
    }
    return time
  }

  const PointList = ({
    points,
    onSeek,
  }: {
    points: TimestampPoint[]
    onSeek: (time: string) => void
  }) => (
    <div className="mt-4 overflow-hidden rounded-xl border-2 border-[#D7D6F1] text-[14px]">
      {points.map((point, index) => (
        <div
          key={index}
          className={`flex transition-colors hover:bg-gray-50 ${
            index !== points.length - 1 ? 'border-b border-[#D7D6F1]' : ''
          }`}
        >
          {/* 설명 */}
          <div className="flex w-[80%] items-center justify-center border-r border-[#D7D6F1] px-4 py-3 text-center text-[13px]">
            {point.description}
          </div>
          {/* 타임스탬프 버튼 */}
          <button
            onClick={() => onSeek(point.time)}
            className="flex w-[20%] cursor-pointer items-center justify-center px-3 py-3 text-center text-[12px] font-bold text-[#5678FF] transition-colors hover:bg-[#5650FF] hover:text-white"
          >
            {point.endTime
              ? `${formatDisplay(point.time)}~${formatDisplay(point.endTime)}`
              : formatDisplay(point.time)}
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-5 px-2">
      {/* 영상 */}
      <div className="mx-auto w-full max-w-4xl">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="w-full rounded-lg shadow-lg"
            controls
            src={videoSrc}
            crossOrigin="anonymous"
          >
            브라우저가 비디오를 지원하지 않습니다.
          </video>
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-[13px] text-gray-400">
            영상을 불러올 수 없습니다.
          </div>
        )}
      </div>

      {/* 강점 포인트 */}
      <div className="mt-8">
        <p className="fontBold text-[16px] text-[#5650FF]">강점 포인트</p>
        <PointList points={paramPoints.strengths} onSeek={seekToTime} />
      </div>

      {/* 개선 포인트 */}
      <div className="mt-12">
        <p className="fontBold text-[16px] text-[#5650FF]">개선 포인트</p>
        <PointList points={paramPoints.improvements} onSeek={seekToTime} />
      </div>

      {/* 돌발 질문 */}
      {paramPoints.questions && paramPoints.questions.length > 0 && (
        <div className="mt-12">
          <p className="fontBold text-[16px] text-[#5650FF]">돌발 질문</p>
          <div className="mt-4 overflow-hidden rounded-xl border-2 border-[#D7D6F1] text-[14px]">
            {paramPoints.questions.map((q, i) => (
              <div
                key={i}
                className={`flex transition-colors hover:bg-gray-50 ${
                  i !== paramPoints.questions!.length - 1 ? 'border-b border-[#D7D6F1]' : ''
                }`}
              >
                <div className="flex w-[80%] flex-col border-r border-[#D7D6F1] px-4 py-3 text-[13px]">
                  <span className="mb-1 font-bold">Q. {q.question}</span>
                  <span className="text-gray-600">A. {q.answer}</span>
                </div>
                <button
                  onClick={() => seekToTime(q.time)}
                  className="flex w-[20%] cursor-pointer items-center justify-center px-3 py-3 text-center text-[12px] font-bold text-[#5678FF] transition-colors hover:bg-[#5650FF] hover:text-white"
                >
                  {formatDisplay(q.time)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
