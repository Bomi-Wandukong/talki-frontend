import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TitleSection from '../components/TitleSection'
import { IMAGES } from '@/utils/images'
import { RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri'

type Step = 'idle' | 'countdown' | 'practicing' | 'finished'

const SENTENCES = [
  '안녕하세요. 오늘은 짧지만 중요한 이야기를 해보려고 합니다.',
  '우리는 하루에도 많은 일을 겪게 되지만, 그 일이 성취에 어떻게 영향을 끼치는지 느끼지 못할 때가 많습니다.',
  '말은 단순히 내용만이 아닌 크기, 목소리의 질감, 발화 방식에 따라 분위기가 달라질 수 있습니다.',
  '적절한 호흡과 리듬으로 이야기한 내용이 훨씬 더 잘 전달됩니다.',
  '결국 좋은 말하기는 여러 기술 이전에, 상대방을 배려하는 작은 태도에서 시작됩니다.',
]

// 청중 얼굴 위치 (비디오 컨테이너 기준 %)
const DOT_POSITIONS = [
  { x: 17, y: 68 },
  { x: 42, y: 44 },
  { x: 72, y: 41 },
  { x: 29, y: 27 },
  { x: 60, y: 25 },
  { x: 84, y: 34 },
]

const EyeContactPractice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('idle')
  const [countdown, setCountdown] = useState(5)
  const [sentenceIdx, setSentenceIdx] = useState(0)
  const [dotIdx, setDotIdx] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sentenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAllTimers = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    if (dotTimerRef.current) clearInterval(dotTimerRef.current)
    if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current)
  }

  const startPracticing = () => {
    setStep('practicing')
    setDotIdx(0)

    dotTimerRef.current = setInterval(() => {
      setDotIdx((prev) => (prev + 1) % DOT_POSITIONS.length)
    }, 3500)

    sentenceTimerRef.current = setInterval(() => {
      setSentenceIdx((prev) => (prev + 1) % SENTENCES.length)
    }, 7000)
  }

  const handleStart = () => {
    setStep('countdown')
    setCountdown(5)
    setSentenceIdx(0)

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!)
          startPracticing()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleStop = () => {
    clearAllTimers()
    setStep('finished')
  }

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      clearAllTimers()
    }
  }, [])

  const dot = DOT_POSITIONS[dotIdx]
  const isActive = step === 'countdown' || step === 'practicing'
  const isFinished = step === 'finished'

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3}
        canGoPrev={true}
        canGoNext={isFinished}
        onPrev={() => navigate('/practice/breathing')}
        onNext={() => navigate('/practice/feelresult')}
      >
        <TitleSection
          title="시선 고정 훈련"
          badgeText="스크립트 기반 기초 연습"
          description="제시된 스크립트 문장을 읽으면서 점들에 시선을 고정해봐요."
        />

        {isFinished ? (
          /* 결과 화면 */
          <div>
            <div className="w-full rounded-2xl bg-white p-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <p className="fontSB mb-5 text-[16px] text-[#3B3B3B]">시선 분석</p>
              <div className="flex w-full items-center justify-between px-5">
                <div className="flex w-[40%] items-center justify-center rounded-xl bg-[#F5F5F5] px-8 py-10">
                  <span className="fontRegular mr-16 text-[15px] text-[#5D5D5D]">시선 유지율</span>
                  {true ? (
                    <span className="fontBold text-[32px] text-[#3B3B3B]">78 %</span>
                  ) : (
                    <span className="fontBold text-[32px] text-[#3B3B3B]">- %</span>
                  )}
                </div>

                {/* 세부 수치 */}
                <div className="flex w-[55%] flex-col gap-4">
                  <div className="flex items-center justify-between gap-16">
                    <span className="fontRegular text-[15px] text-[#5D5D5D]">평균 유지 시간</span>
                    {true ? (
                      <span className="fontSB text-[15px] text-[#5650FF]">3.2초</span>
                    ) : (
                      <span className="fontSB text-[15px] text-[#5650FF]">-</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-16">
                    <span className="fontRegular text-[15px] text-[#5D5D5D]">평균 유지 횟수</span>
                    {true ? (
                      <span className="fontSB text-[15px] text-[#5650FF]">4회</span>
                    ) : (
                      <span className="fontSB text-[15px] text-[#5650FF]">-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 flex w-full pb-6 pl-6">
              <img
                src={IMAGES.logo}
                alt="토끼 로고"
                className="absolute -top-7 left-10 z-10 w-[70px] object-contain drop-shadow-sm"
              />

              <div className="relative z-0 flex w-full items-center rounded-[32px] rounded-br-[0px] border border-[#5650FF] bg-white px-20 py-6 shadow-sm">
                <div className="fontRegular relative z-10 whitespace-pre-line pl-2 text-[15px] leading-relaxed text-[#4E4AC7]">
                  아주 좋습니다! 평균적으로 시선을 잘 유지하고 있습니다. <br/>현재 점에 집중한 것처럼, 실제 발표에서도 청중의 이마나 콧등을 보면 자연스러운 눈맞춤이 가능합니다.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-2xl bg-black"
              style={{ aspectRatio: '16/9' }}
            >
              <video
                src="/video/LivePeople.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />

              {/* 카운트다운 오버레이 */}
              {step === 'countdown' && (
                <div className="absolute inset-x-0 top-0 flex flex-col items-center bg-[#5650FF]/85 px-8 py-5">
                  <p className="fontSB text-[17px] text-white">{SENTENCES[sentenceIdx]}</p>
                  <p className="fontRegular mt-1 text-[13px] text-white/80">
                    {countdown}초 뒤에 점을 바라보면서 말해주세요.
                  </p>
                </div>
              )}

              {/* 연습 중 문장 오버레이 */}
              {step === 'practicing' && (
                <div className="absolute inset-x-0 top-0 flex items-center justify-center bg-[#5650FF]/85 px-8 py-4">
                  <p className="fontSB text-[16px] text-white">{SENTENCES[sentenceIdx]}</p>
                </div>
              )}

              {/* 시선 유도 점 */}
              {step === 'practicing' && (
                <div
                  className="pointer-events-none absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#5650FF]/50 transition-all duration-700"
                  style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                >
                  <div className="h-5 w-5 rounded-full bg-[#5650FF]" />
                </div>
              )}

              {/* 전체화면 버튼 */}
              <button
                onClick={toggleFullscreen}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                {isFullscreen ? (
                  <RiFullscreenExitLine className="text-lg" />
                ) : (
                  <RiFullscreenLine className="text-lg" />
                )}
              </button>

              {/* 연습 시작 버튼 */}
              {!isActive && (
                <button
                  onClick={handleStart}
                  className="fontSB absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#5650FF] px-10 py-3 text-[15px] text-white shadow-md hover:bg-[#4440DD]"
                >
                  연습 시작
                </button>
              )}

              {/* 연습 종료 버튼 */}
              {isActive && (
                <button
                  onClick={handleStop}
                  className="fontSB absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#E05F5F] px-10 py-3 text-[15px] text-white shadow-md hover:bg-[#C94F4F]"
                >
                  연습 종료
                </button>
              )}
            </div>

            {!isActive && (
              <p className="mt-3 text-center text-[13px] text-[#5650FF]">
                전체화면을 통해 진짜처럼 훈련을 진행해봐요.
              </p>
            )}
          </div>
        )}
      </PracticeLayout>
    </div>
  )
}

export default EyeContactPractice
