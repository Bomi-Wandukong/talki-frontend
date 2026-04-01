interface SideStepIndicatorProps {
  currentStep: number
}

const GROUPS = [
  { steps: [{ id: 1, title: '자동 사고 인식' }, { id: 2, title: '호흡 조절' }] },
  { steps: [{ id: 3, title: '연습 선택' }, { id: 4, title: '연습 진행' }] },
  { steps: [{ id: 5, title: '행동실험 결과' }, { id: 6, title: '대체 사고 추천' }] },
]

const SideStepIndicator = ({ currentStep }: SideStepIndicatorProps) => {
  return (
    <div className="flex min-h-screen w-[20%] flex-col border-r bg-white p-10 pb-6 pt-[130px]">
      <div className="mb-10">
        <p className="text-[18px] fontBold"><span className="text-[#EE8A29]">발표/면접</span> 불안 훈련</p>
        <p className="text-[12px] text-[#EE8A29] pt-1">인지행동치료(CBT) 기반 연습 프로그램</p>
      </div>

      <div className="flex flex-col gap-4 text-[15px]">
        {GROUPS.map((group) => {
          const isGroupActive = group.steps.some((s) => s.id === currentStep)
          return (
            <div
              key={group.steps[0].id}
              className={`relative flex flex-col gap-6 rounded-2xl px-6 py-8 transition-all ${
                isGroupActive
                  ? 'bg-[#FFF2E7]'
                  : 'bg-gray-50'
              }`}
              style={isGroupActive ? { boxShadow: '6px 0 1px 0 #FFD4AB' } : undefined}
            >
              {group.steps.map((step) => {
                const isActive = step.id === currentStep
                return (
                  <div key={step.id} className="flex items-center gap-6">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full fontBold ${
                        isActive
                          ? 'bg-orange-400 text-white'
                          : isGroupActive
                          ? 'border-2 border-orange-300 bg-transparent text-orange-300'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span
                      className={`fontSB ${
                        isActive
                          ? 'text-[#D97706]'
                          : isGroupActive
                          ? 'text-orange-300'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default SideStepIndicator
