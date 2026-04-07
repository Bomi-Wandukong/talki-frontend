interface InfoGuideBoxProps {
  message: string | React.ReactNode;
}

const InfoTalki = ({ message }: InfoGuideBoxProps) => {
  return (
    <div className="relative inline-flex items-center mt-10 ml-6">
      {/* 캐릭터 아이콘 (보라색 그라데이션) */}
      <div className="absolute -left-8 bottom-2 w-16 h-16 z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#7C77FF] to-[#5650FF] rounded-full flex items-center justify-center shadow-sm" 
             style={{ borderRadius: '45% 55% 55% 45% / 55% 45% 55% 45%' }}>
          {/* 토끼 귀 모양은 이미지 에셋을 넣으시는 게 가장 정확하지만, 
              임시로 원형으로 배치했습니다. SVG 아이콘이 있다면 여기에 넣어주세요! */}
          <div className="text-white text-2xl">🐰</div> 
        </div>
      </div>

      {/* 말풍선 박스 */}
      <div className="border border-[#5650FF] rounded-tl-[40px] rounded-bl-[40px] rounded-tr-[40px] rounded-br-[4px] px-12 py-4 bg-white/50 backdrop-blur-sm">
        <div className="text-[#5650FF] text-[15px] font-medium leading-relaxed whitespace-pre-wrap ml-2">
          {message}
        </div>
      </div>
    </div>
  );
};

export default InfoTalki;