import React from "react";

interface WorryCardProps {
  image?: string;
  text: string;
  highlightText?: string;
  rotation?: number;
}

export default function WorryCard({
  image,
  text,
  highlightText,
  rotation = 0,
}: WorryCardProps) {
  return (
    <div
      className="bg-white rounded-[30px] p-6 w-[280px] h-[360px] flex flex-col items-center justify-between shadow-lg shrink-0 transform transition-transform hover:scale-105"
      style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Avatar Image */}
      <div className="w-full h-[60%] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="User Avatar"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="w-full text-left">
        <p className="text-[18px] leading-snug font-medium text-gray-800 break-keep">
          {text.split(highlightText || "").map((part, index, array) => (
            <React.Fragment key={index}>
              {part}
              {index < array.length - 1 && (
                <span className="bg-[#FFD6A5]/50 px-1 relative inline-block">
                  <span className="relative z-10 font-bold">
                    {highlightText}
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FFD6A5] -z-0"></span>
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
