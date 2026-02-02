import React, { useState, useEffect } from 'react'

interface CircleProgressProps {
  label: string
  score: number
  maxScore?: number
}

const CircleProgress: React.FC<CircleProgressProps> = ({ label, score, maxScore = 100 }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  /** 점수에 따른 색상 */
  const getStrokeColor = (score: number) => {
    if (score < 40) return '#DB1013'
    if (score < 70) return '#FFA956'
    return '#4DCB56'
  }

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps
    const scoreIncrement = score / steps
    const percentageIncrement = ((score / maxScore) * 100) / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++

      if (currentStep <= steps) {
        setAnimatedScore(Math.round(scoreIncrement * currentStep))
        setAnimatedPercentage(percentageIncrement * currentStep)
      } else {
        setAnimatedScore(score)
        setAnimatedPercentage((score / maxScore) * 100)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [score, maxScore])

  const radius = 60
  const strokeWidth = 18
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = -(circumference - (animatedPercentage / 100) * circumference)

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress circle */}
          <circle
            stroke={getStrokeColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              transition: 'stroke-dashoffset 25ms linear',
            }}
          />
        </svg>
      </div>

      {/* Label and score */}
      <div className="fontRegular mt-5 text-center text-[15px] text-[#3B3B3B]">
        <span>{label}</span>
        <span className="fontBold ml-2 text-[20px] text-[#5650FF]">{animatedScore}</span>
        <span>/{maxScore}</span>
      </div>
    </div>
  )
}

export default CircleProgress
