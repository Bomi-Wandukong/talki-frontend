import React from 'react'

interface PracticeSidebarProps {
  currentStepIndex: number
}

const groups = [
  { id: 'A', steps: [{ index: 0, label: '자동 사고 인식' }, { index: 1, label: '호흡 조절' }] },
  { id: 'B', steps: [{ index: 2, label: '연습 선택' }, { index: 3, label: '연습 진행' }] },
  { id: 'C', steps: [{ index: 4, label: '행동실험 결과' }, { index: 5, label: '대체 사고 추천' }] },
]

const PracticeSidebar: React.FC<PracticeSidebarProps> = ({ currentStepIndex }) => {
  // 그룹 인덱스는 단계 인덱스를 2로 나눈 몫으로 간단히 계산 (0,1 -> 0 / 2,3 -> 1 / 4,5 -> 2)
  const activeGroupIndex = Math.floor(currentStepIndex / 2)

  return (
    <aside className="w-[300px] flex flex-col flex-shrink-0 border-r border-[`#EBEBEB`] bg-white py-10 h-full relative z-20">
      <div className="w-full pt-5">
        <div className="pl-10 pr-6 mb-8">
        <h2 className="text-[20px] font-bold text-[#3B3B3B]">
          <span className="text-[#EE8A29]">발표/면접</span> 불안 훈련
        </h2>
        <p className="text-[13px] text-[#EE8A29] mt-2 font-medium">인지행동치료(CBT) 기반 연습 프로그램</p>
      </div>

        <div className="relative pl-10 pr-6 flex flex-col gap-5 short:gap-3 tall:gap-10">
          {/* 뒤를 이어주는 세로 타임라인 */}
          <div className="absolute left-[56px] top-6 bottom-6 w-[1px] bg-[#EBEBEB] z-0"></div>

        {groups.map((group, gIdx) => {
          const isActiveGroup = gIdx === activeGroupIndex

          return (
            <div
              key={group.id}
              className={`relative z-10 rounded-2xl py-6 pl-4 flex flex-col gap-6 transition-all duration-300 ${
                isActiveGroup
                  ? 'bg-[#FFF1E3] w-[calc(100%+32px)] shadow-[8px_0_0_#FFA95680]'
                  : 'bg-[#F7F7F8] w-full'
              }`}
            >
              {group.steps.map((step) => {
                const isCurrentStep = step.index === currentStepIndex

                // 상태에 따른 컬러 변수 세팅
                let circleBg = '#D9D9D9'
                let circleText = '#868686'
                let labelStyle = 'text-[#868686] fontMedium'

                if (isActiveGroup) {
                  if (isCurrentStep) {
                    circleBg = '#FFA956'
                    circleText = '#FFFFFF'
                    labelStyle = 'text-[#E17100] fontBold'
                  } else {
                    circleBg = '#FFD6AF'
                    circleText = '#FFFFFF'
                    labelStyle = 'text-[#52525C] fontSB'
                  }
                }

                return (
                  <div key={step.index} className="flex items-center gap-4 relative">
                    <div
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-full text-sm font-bold shadow-sm"
                      style={{ backgroundColor: circleBg, color: circleText }}
                    >
                      {step.index + 1}
                    </div>
                    <span className={`text-[15px] ${labelStyle}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
        </div>
      </div>
    </aside>
  )
}

export default PracticeSidebar
