import React, { useState, useRef, useEffect } from 'react'
import LiveFeedbackTracker from './components/LiveFeedbackTracker'
import type { LiveFeedbackTrackerRef } from './components/LiveFeedbackTracker'
import CountdownOverlay from './components/CountdownOverlay'
import TutorialModal from './components/TutorialModal'
import VoiceWaveIndicator from './components/VoiceWaveIndicator'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const TUTORIAL_HIDE_KEY = 'hideLiveTutorial'

export default function LiveFeedback() {
  const navigate = useNavigate()
  const trackerRef = useRef<LiveFeedbackTrackerRef>(null)

  const [showTutorial, setShowTutorial] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 토글 상태
  const [isLiveFeedbackOn, setIsLiveFeedbackOn] = useState(true)
  const [isEmergencyOn, setIsEmergencyOn] = useState(false)

  const [isVoiceActive, setIsVoiceActive] = useState(false)

  // 모달창, 카운트다운 시 비디오 일시정지/재생
  useEffect(() => {
    if (!videoRef.current) return

    if (showTutorial || showCountdown) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }, [showTutorial, showCountdown])

  useEffect(() => {
    const hideTutorial = localStorage.getItem(TUTORIAL_HIDE_KEY)

    if (hideTutorial === 'true') {
      setShowCountdown(true)
    } else {
      setShowTutorial(true)
    }
  }, [])

  // (선택) 상태 변경 확인용
  useEffect(() => {
    console.log('실시간 피드백:', isLiveFeedbackOn)
    console.log('돌발 상황:', isEmergencyOn)
  }, [isLiveFeedbackOn, isEmergencyOn])

  return (
    <>
      <LiveFeedbackTracker ref={trackerRef} />

      <div className="relative min-h-screen w-full overflow-hidden">
        {/* 튜토리얼 */}
        {showTutorial && (
          <TutorialModal
            onClose={() => {
              setShowTutorial(false)
              setShowCountdown(true)
            }}
          />
        )}

        {/* 카운트다운 */}
        {showCountdown && <CountdownOverlay onFinish={() => setShowCountdown(false)} />}

        {/* 배경 비디오 */}
        <video
          ref={videoRef}
          src="./video/LivePeople.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 h-full w-full object-cover"
        />

        {/* 비디오 위 콘텐츠 */}
        <div className="relative z-10 flex h-full min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="h-35 absolute left-0 top-0 w-full bg-gradient-to-b from-[#5650FF]/60 to-transparent" />
            <div className="h-35 absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#5650FF]/60 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-between p-4 text-white md:p-8">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <FaArrowLeftLong size={30} />
            </div>

            {/* 음성 인식 파동 & 컨트롤 */}
            <div className="flex flex-col items-end justify-between gap-6 px-2 pb-4 md:flex-row md:items-center md:px-10">
              <div className="flex w-full justify-center md:block md:w-auto">
                <VoiceWaveIndicator
                  size={112}
                  threshold={30} // 음성 감지 민감도 (낮을수록 민감)
                  onVoiceDetected={(isDetected) => {
                    console.log('음성 감지:', isDetected)
                    // 필요한 로직 추가
                  }}
                  onError={(error) => {
                    console.error(error)
                  }}
                />
              </div>

              <div className="flex w-full flex-col items-end gap-3 md:w-auto">
                {/* 실시간 피드백 */}
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm md:text-base">실시간 피드백</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isLiveFeedbackOn}
                      onChange={(e) => setIsLiveFeedbackOn(e.target.checked)}
                    />
                    <div className="peer h-5 w-10 rounded-full bg-gray-300 transition-all peer-checked:bg-[#ACA9FE] peer-focus:outline-none"></div>
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>

                {/* 돌발 상황 */}
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm md:text-base">돌발 상황</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isEmergencyOn}
                      onChange={(e) => setIsEmergencyOn(e.target.checked)}
                    />
                    <div className="peer h-5 w-10 rounded-full bg-gray-300 transition-all peer-checked:bg-[#ACA9FE] peer-focus:outline-none"></div>
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div
                  onClick={() => {
                    // 녹화 종료
                    trackerRef.current?.stopRecording()

                    // 결과 페이지 이동
                    navigate('/result')
                  }}
                  className="mt-2 w-full cursor-pointer rounded-full bg-[#5650FF] px-6 py-2 text-center text-sm text-white transition-colors hover:bg-[#4540CC] md:w-auto md:text-base"
                >
                  종료하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
