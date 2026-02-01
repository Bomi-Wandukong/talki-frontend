import React, { useRef } from 'react'

interface TimestampPoint {
  time: string
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
    const [minutes, seconds] = timestamp.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const seekToTime = (timestamp: string) => {
    if (videoRef.current) {
      const timeInSeconds = parseTimestamp(timestamp)
      videoRef.current.currentTime = timeInSeconds
      videoRef.current.play()
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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
          <div className="flex w-[80%] items-center justify-center border-r border-[#D7D6F1] px-4 py-3 text-center">
            {point.description}
          </div>
          <button
            onClick={() => onSeek(point.time)}
            className="flex w-[20%] cursor-pointer items-center justify-center px-4 py-3 text-[#5678FF] transition-colors hover:bg-[#5650FF] hover:text-white"
          >
            {point.time}
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-5 px-2">
      <div className="mx-auto w-full max-w-4xl">
        <video ref={videoRef} className="w-full rounded-lg shadow-lg" controls src={videoSrc}>
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-8">
        <p className="fontBold text-[16px] text-[#5650FF]">강점 포인트</p>
        <PointList points={paramPoints.strengths} onSeek={seekToTime} />
      </div>

      <div className="mt-12">
        <p className="fontBold text-[16px] text-[#5650FF]">개선 포인트</p>
        <PointList points={paramPoints.improvements} onSeek={seekToTime} />
      </div>

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
                <div className="flex w-[80%] flex-col items-center justify-center border-r border-[#D7D6F1] px-4 py-3 text-center">
                  <span className="mb-1 font-bold">Q. {q.question}</span>
                  <span>A. {q.answer}</span>
                </div>
                <button
                  onClick={() => seekToTime(q.time)}
                  className="flex w-[20%] cursor-pointer items-center justify-center px-4 py-3 text-[#5678FF] transition-colors hover:bg-[#5650FF] hover:text-white"
                >
                  {q.time}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
