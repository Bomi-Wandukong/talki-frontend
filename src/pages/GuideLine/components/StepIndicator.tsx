interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
}

const StepIndicator = ({ totalSteps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-5">
      {Array.from({ length: totalSteps }).map((_, index) => {
        let bgColor = '#E4E3F4'; // 남은 단계
        if (index < currentStep) {
          bgColor = '#FFA956'; // 완료된 단계
        } else if (index === currentStep) {
          bgColor = '#C1BFFC'; // 현재 진행 중인 단계
        }
        return (
          <div
            key={index}
            className="w-6 h-6 rounded-full transition-colors duration-500 ease-in-out"
            style={{ backgroundColor: bgColor }}
          />
        );
      })}
    </div>
  )
}

export default StepIndicator
