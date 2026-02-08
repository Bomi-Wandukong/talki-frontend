import { useState } from 'react'
import StepIndicator from './components/StepIndicator'
import CameraCheckView from './components/CameraCheckView'
import SpeakerCheckView from './components/SpeakerCheckView'
import Nav from '@/components/Nav/Nav'

const GuideLine = () => {
  const [step, setStep] = useState(0)
  const TOTAL_STEPS = 2

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((prev) => prev + 1)
  }

  return (
    <div className="bg-[#F7F7F8] min-h-screen pt-[72px]"> 
      <Nav/>
      <div className="flex h-screen flex-col items-center mt-">
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
          <div className="CheckSpace mt-10 flex h-[65%] w-[97%] flex-col items-center justify-center rounded-xl bg-white p-10">
            {step === 0 && <CameraCheckView onComplete={handleNext} />}
            {step === 1 && <SpeakerCheckView onComplete={handleNext} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideLine
