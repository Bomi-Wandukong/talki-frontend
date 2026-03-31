import React from 'react'

const PracticeFeedback: React.FC = () => {
  return (
    <div className="animate-fade-in w-full">
      {/* 말하기 분석 결과 카드 */}

      <div className="rounded-[20px] border border-gray-100 bg-white px-8 py-5 text-[#3B3B3B] shadow-sm">
        <h3 className="mb-4 text-xl font-bold">말하기 분석</h3>

        <div className="mb-6 mt-2 flex justify-around px-12 text-center">
          <div>
            <h4 className="mb-2 text-2xl font-bold">3회</h4>
            <p className="text-sm text-gray-400">불필요한 추임새</p>
          </div>
          <div className="w-[1px] bg-gray-100"></div>
          <div>
            <h4 className="mb-2 text-2xl font-bold">28초</h4>
            <p className="text-sm text-gray-400">실제 말한 시간</p>
          </div>
          <div className="w-[1px] bg-gray-100"></div>
          <div>
            <h4 className="mb-2 text-2xl font-bold">양호</h4>
            <p className="text-sm text-gray-400">구성 완성도</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeFeedback
