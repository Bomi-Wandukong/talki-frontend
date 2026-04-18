import React, { useState, useRef, useEffect } from 'react'
import LiveFeedbackTracker from './components/LiveFeedbackTracker'
import type { LiveFeedbackTrackerRef } from './components/LiveFeedbackTracker'
import CountdownOverlay from './components/CountdownOverlay'
import TutorialModal from './components/TutorialModal'
import VoiceWaveIndicator from './components/VoiceWaveIndicator'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '@/api/fetchClient'

const TUTORIAL_HIDE_KEY = 'hideLiveTutorial'

export default function LiveFeedback() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionData = location.state as {
    originalType?: string
    presentationType?: string
    topic_summary?: string
    topic_desc?: string
    topic_tags?: string[]
    isUnexpectedEvent?: boolean
    isRealtimeFeedback?: boolean
  } | null

  console.log(sessionData)

  const trackerRef = useRef<LiveFeedbackTrackerRef>(null)

  const [showTutorial, setShowTutorial] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 토글 상태 (Category에서 설정한 값으로 초기화)
  const [isLiveFeedbackOn, setIsLiveFeedbackOn] = useState(sessionData?.isRealtimeFeedback ?? false)
  const [isEmergencyOn, setIsEmergencyOn] = useState(sessionData?.isUnexpectedEvent ?? false)

  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [presentationId, setPresentationId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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
      <LiveFeedbackTracker
        ref={trackerRef}
        presentationType={sessionData?.presentationType}
        isLiveFeedbackOn={isLiveFeedbackOn}
        isEmergencyOn={isEmergencyOn}
        onFeedbackReceived={(msg) => {
          if (isLiveFeedbackOn && msg) {
            const formattedMsg = msg
              .split('/')
              .map((part) => {
                const trimmed = part.trim()
                const dotIndex = trimmed.indexOf('.')
                return dotIndex !== -1 ? trimmed.substring(0, dotIndex + 1) : trimmed
              })
              .join('\n')

            setFeedbackMessage(formattedMsg)
            // 약간의 시간 뒤에 피드백을 지우는 로직 (선택사항)
            setTimeout(() => setFeedbackMessage(null), 3000)
          }
        }}
        onSessionStart={(id) => {
          setPresentationId(id)
        }}
      />

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
                    // console.log('음성 감지:', isDetected)
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

                <button
                  disabled={isUploading}
                  onClick={async () => {
                    if (!trackerRef.current || isUploading) return

                    try {
                      // 0. 필수 ID 확인 (추가됨)
                      if (!presentationId) {
                        alert(
                          '발표 식별 정보(Presentation ID)가 없습니다. 메인 페이지에서 다시 시작해주세요.'
                        )
                        return
                      }

                      setIsUploading(true)

                      // 1. 녹화 종료 및 Blob 획득
                      const blob = await trackerRef.current.stopRecording()

                      // 2. 업로드 URL 발급 요청
                      const filename = `record_${Date.now()}.webm`

                      // 프로필 정보를 가져와서 userId (id 필드) 세팅
                      let userId = null
                      try {
                        const profileRes = await api.get('/profile/get')
                        if (profileRes && typeof profileRes.id === 'number') {
                          userId = profileRes.id
                        }
                      } catch (err) {
                        console.error('프로필 조회를 실패했습니다.', err)
                      }

                      const resData = await api.post('/videos/upload-url', {
                        presentationId: presentationId,
                        filename: filename,
                        userId: userId,
                        presentationType: sessionData?.presentationType || 'unknown',
                        topic: sessionData?.topic_desc || 'unknown',
                      })

                      // 업로드 URL 및 키 확인 (강화됨)
                      if (!resData || !resData.uploadUrl) {
                        throw new Error('영상을 업로드하기 위한 서버 URL을 받지 못했습니다.')
                      }
                      if (!resData.key) {
                        throw new Error('서버로부터 영상 식별 키(Key)를 받지 못했습니다.')
                      }

                      console.log('✅ POST Request successful', resData)

                      // 3. S3 업로드 (Pre-signed URL 사용)
                      console.log('📤 Uploading video to S3...')
                      const uploadRes = await fetch(resData.uploadUrl, {
                        method: 'PUT',
                        body: blob,
                        headers: {
                          'Content-Type': 'video/webm',
                        },
                      })

                      if (!uploadRes.ok) {
                        throw new Error(`저장소 업로드 실패 (Status: ${uploadRes.status})`)
                      }
                      console.log('✅ Video uploaded to S3 successfully')

                      // 로딩 페이지 이동 (S3 key와 세션 정보 전달)
                      navigate('/analysis-loading', {
                        state: {
                          ...sessionData,
                          presentationId,
                          key: resData.key,
                        },
                      })
                    } catch (err: any) {
                      console.error('❌ Upload Flow Failed:', err)
                      alert(`처리 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`)
                    } finally {
                      setIsUploading(false)
                    }
                  }}
                  className="mt-2 w-full cursor-pointer rounded-full bg-[#5650FF] px-6 py-2 text-center text-sm text-white transition-colors hover:bg-[#4540CC] disabled:bg-[#ACA9FE] md:w-auto md:text-base"
                >
                  {isUploading ? '업로드 중...' : '종료하기'}
                </button>
              </div>
            </div>

            {/* 피드백 메시지 표시 (하단 중앙) */}
            {feedbackMessage && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 transform rounded-2xl bg-red-500/80 px-6 py-3 text-white shadow-lg backdrop-blur-md transition-all">
                <p className="whitespace-pre-line text-center font-semibold">{feedbackMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
