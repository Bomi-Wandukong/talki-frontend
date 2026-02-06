import React from "react";

interface RepeatWordData {
  word: string;
  count: number;
}

interface RepeatWordChartProps {
  data?: RepeatWordData[];
}

const RepeatWordChart: React.FC<RepeatWordChartProps> = ({ data }) => {
  const repeatWordData = data || [
    { word: "음…", count: 16 },
    { word: "어…", count: 12 },
    { word: "그…", count: 7 },
    { word: "그러니까", count: 1 },
  ];

  const maxCount = Math.max(...repeatWordData.map((item) => item.count));
  const maxBarWidth = 100;

  return (
    <div className="w-full pt-10 px-[10%] bg-white">
      <div className="space-y-3">
        {repeatWordData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-left text-sm text-gray-700">
              {item.word}
            </div>
            <div className="flex-1 relative pr-13">
              <div
                className="h-6 bg-gradient-to-r from-[#FFA956] to-[#FFA95659] rounded-r transition-all duration-300"
                style={{
                  width: `${(item.count / maxCount) * maxBarWidth}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center border-t border-gray-300 pt-2">
        <div className="w-16" />
        <div className="flex-1 flex justify-between text-xs text-gray-500 px-1">
          {Array.from({ length: Math.ceil(maxCount) + 1 }, (_, i) => i).map(
            (num) => (
              <span key={num}>{num}</span>
            ),
          )}
        </div>
        <div className="ml-2 text-xs text-gray-500">빈도수</div>
      </div>
    </div>
  );
};

export default RepeatWordChart;
