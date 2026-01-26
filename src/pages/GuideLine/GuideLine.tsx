import { useState } from 'react'
import StepIndicator from './components/StepIndicator'
import CameraCheckView from './components/CameraCheckView'
import LightCheckView from './components/LightCheckView'
import SpeakerCheckView from './components/SpeakerCheckView'

const GuideLine = () => {
  const [step, setStep] = useState(0)
  const TOTAL_STEPS = 3

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((prev) => prev + 1)
  }

  return (
    <div className="flex h-screen flex-col items-center bg-[#F7F7F8]">
      <div className="flex h-full w-[75%] flex-col items-center">
        <div className="GuideLineTitle mt-20 flex w-full items-center justify-between">
          <div>
            <p className="fontSB mb-3 text-[28px]">
              <span className="text-[#5650FF]">세팅</span>을 확인해주세요!
            </p>
            <p className="fontRegular text-[#716FA4]">
              카메라, 마이크 세팅을 가이드라인과 함께 맞춰봐요.
            </p>
          </div>
          <StepIndicator totalSteps={TOTAL_STEPS} currentStep={step} />
        </div>
        <div className="CheckSpace mt-10 h-[65%] w-[97%] rounded-xl bg-white p-10 flex flex-col justify-center items-center">
          {step === 0 && <CameraCheckView onComplete={handleNext} />}
          {step === 1 && <LightCheckView onComplete={handleNext} />}
          {step === 2 && <SpeakerCheckView onComplete={handleNext} />}
        </div>
      </div>
    </div>
  )
}

export default GuideLine
