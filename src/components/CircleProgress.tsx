import React from "react";

interface CircleProgressProps {
  label: string;
  score: number;
  maxScore?: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  label,
  score,
  maxScore = 100,
}) => {
  const percentage = (score / maxScore) * 100;
  const radius = 60;
  const strokeWidth = 18;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = -(
    circumference -
    (percentage / 100) * circumference
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
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
            stroke="#FFA855"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-out"
          />
        </svg>
      </div>

      {/* Label and score */}
      <div className="mt-5 text-center text-[15px] text-[#3B3B3B]">
        <span>{label}</span>
        <span className="ml-2 text-[#5650FF] font-bold text-[20px]">
          {score}
        </span>
        <span>/{maxScore}</span>
      </div>
    </div>
  );
};

export default CircleProgress;
