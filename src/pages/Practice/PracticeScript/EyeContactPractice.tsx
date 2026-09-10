import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TitleSection from '../components/TitleSection'
import { IMAGES } from '@/utils/images'
import { RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri'
import { FaceMesh } from '@mediapipe/face_mesh'
import type { Results as FaceMeshResults } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import usePracticeRealtime from '@/hooks/usePracticeRealtime'
import RealtimeErrorBanner from '@/components/Practice/RealtimeErrorBanner'
import AnalyzingIndicator from '@/components/Practice/AnalyzingIndicator'

type Step = 'idle' | 'countdown' | 'practicing' | 'finished'

/** 서버로 보내는 얼굴 랜드마크 인덱스 (실전 탭과 동일) */
const FACE_INDICES = [468, 469, 470, 471, 473, 474, 475, 476, 33, 133, 362, 263, 159, 386, 145, 374]

/**
 * 랜드마크 전송 주기(ms).
 *
 * 실전 탭(LiveFeedbackTracker)과 SCRIPT 하위단계는 모두 오디오 1초 분량이 모일 때마다,
 * 즉 1초에 한 번씩 payload를 보낸다. 서버는 이 1초 간격을 전제로 프레임을 세기 때문에
 * 여기서만 100ms로 보내면 30프레임이 실제 3초 만에 채워져 분석이 조기 종료된다.
 * (그때 나오던 값이 gaze_hold_ratio 1.0 / avg_hold_duration_sec 30.0 / gaze_break_count 0)
 */
const FACE_SEND_INTERVAL = 1000

/**
 * 연습이 끝난 뒤 서버 result를 기다리는 상한선(ms).
 * 이 시간을 넘기면 화면 잠금을 풀어 다음 단계로 넘어갈 수 있게 한다.
 * (SCRIPT 하위단계에도 같은 성격의 상한선이 있다)
 */
const RESULT_WAIT_LIMIT_MS = 20000

/**
 * GAZE 하위단계의 raw_result 형태.
 *   { "gaze_hold_ratio": 1.0, "avg_hold_duration_sec": 30.0, "gaze_break_count": 0 }
 * gaze_hold_ratio는 0~1 비율이라 화면에 %로 쓰려면 100을 곱해야 한다.
 */
interface GazeRawResult {
  gaze_hold_ratio?: number
  avg_hold_duration_sec?: number
  gaze_break_count?: number
}

/** 숫자가 아니면 null로 떨어뜨려 화면에 '-'가 뜨게 한다. */
const num = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const SENTENCES = [
  '안녕하세요. 오늘은 짧지만 중요한 이야기를 해보려고 합니다.',
  '우리는 하루에도 많은 일을 겪게 되지만, 그 일이 성취에 어떻게 영향을 끼치는지 느끼지 못할 때가 많습니다.',
  '말은 단순히 내용만이 아닌 크기, 목소리의 질감, 발화 방식에 따라 분위기가 달라질 수 있습니다.',
  '적절한 호흡과 리듬으로 이야기한 내용이 훨씬 더 잘 전달됩니다.',
  '결국 좋은 말하기는 여러 기술 이전에, 상대방을 배려하는 작은 태도에서 시작됩니다.',
]

// 청중 얼굴 위치 (비디오 컨테이너 기준 %) — 앞줄 위주 10개
const DOT_POSITIONS = [
  { x: 27, y: 55 }, // 앞중간 왼쪽
  { x: 72, y: 41 }, // 뒷줄 오른쪽
  { x: 22, y: 46 }, // 뒷줄 왼쪽
  { x: 80, y: 66 }, // 앞줄 오른쪽
  { x: 44, y: 52 }, // 중간 중앙
  { x: 18, y: 68 }, // 앞줄 왼쪽
  { x: 81, y: 62 }, // 앞중간 오른쪽 끝
  { x: 40, y: 68 }, // 앞줄 중앙 왼쪽
  { x: 64, y: 58 }, // 앞중간 오른쪽
  { x: 22, y: 46 }, // 뒷줄 왼쪽
]

const EyeContactPractice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('idle')
  const [countdown, setCountdown] = useState(5)
  const [sentenceIdx, setSentenceIdx] = useState(0)
  const [dotIdx, setDotIdx] = useState(0)
  const [sentenceEnded, setSentenceEnded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // 카메라 권한 실패도 화면에 알린다. (WS 에러와 같은 배너를 쓴다)
  const [mediaError, setMediaError] = useState<string | null>(null)
  // 서버 result를 끝내 못 받은 경우. 화면이 '분석 중'에 갇히지 않게 풀어준다.
  const [resultTimedOut, setResultTimedOut] = useState(false)
  const resultWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sentenceEndedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentSentenceRef = useRef(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sentenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /**
   * 4단계 GAZE 하위단계 WebSocket.
   *
   * 실전 탭은 카메라를 잡은 뒤에 WebSocket을 열고, onopen 직후 곧바로 스트리밍을 시작한다.
   * 여기서도 그 순서를 그대로 따른다. 페이지에 들어오자마자 연결해두면 사용자가 "연습 시작"을
   * 누를 때까지의 공백이 서버 분석 구간(target_duration_sec = 30초)에 섞여 들어간다.
   */
  const [gazeEnabled, setGazeEnabled] = useState(false)
  const {
    status,
    result,
    errorMessage,
    sendFace,
    close: closeGazeSocket,
  } = usePracticeRealtime({
    subStep: 'GAZE',
    enabled: gazeEnabled,
  })

  const webcamVideoRef = useRef<HTMLVideoElement>(null)
  const webcamStreamRef = useRef<MediaStream | null>(null)
  const faceMeshRef = useRef<FaceMesh | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  /** 실전 탭과 동일하게 FaceMesh 결과 객체를 통째로 보관하고, 보낼 때 랜드마크를 꺼낸다. */
  const faceResultsRef = useRef<FaceMeshResults | null>(null)
  const faceSendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  /**
   * 시선 추적을 정리했는지 표시하는 깃발.
   *
   * Camera의 onFrame은 비동기라, camera.stop()을 불러도 이미 시작된 프레임 처리가 남아 있다.
   * 그 사이에 faceMesh.close()로 WASM 객체를 지우면 남은 프레임이 삭제된 객체에 접근하면서
   * "Cannot pass deleted object as a pointer of type SolutionWasm*" 오류가 난다.
   * 정리가 시작되면 이 깃발을 세워 남은 프레임이 아무 일도 하지 않게 만든다.
   */
  const gazeStoppedRef = useRef(false)
  /** 개발용 진단 카운터. 얼굴이 실제로 잡히고 있는지 확인한다. */
  const frameStatsRef = useRef({ processed: 0, detected: 0, sent: 0, sentWithFace: 0 })

  /** 카운트다운 동안 웹캠과 FaceMesh를 미리 띄워둔다. (아직 전송은 안 함) */
  const initGazeCamera = async () => {
    setMediaError(null)
    gazeStoppedRef.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      webcamStreamRef.current = stream

      const video = webcamVideoRef.current
      if (!video) return
      video.srcObject = stream

      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      })
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true, // 468번 홍채 랜드마크 사용에 필요
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      faceMesh.onResults((results) => {
        faceResultsRef.current = results

        if (import.meta.env.DEV) {
          frameStatsRef.current.processed += 1
          if (results.multiFaceLandmarks?.[0]) frameStatsRef.current.detected += 1
        }
      })
      faceMeshRef.current = faceMesh

      const camera = new Camera(video, {
        onFrame: async () => {
          // 정리가 시작됐으면 더 이상 WASM 쪽을 건드리지 않는다.
          if (gazeStoppedRef.current) return
          try {
            await faceMesh.send({ image: video })
          } catch (error) {
            // 정리 직후 남아 있던 프레임에서 나는 오류는 정상 종료 과정이라 무시한다.
            if (!gazeStoppedRef.current) console.error('FaceMesh 프레임 처리 실패:', error)
          }
        },
        width: 640,
        height: 480,
      })
      cameraRef.current = camera
      camera.start()
    } catch (error) {
      console.error('카메라 권한을 얻지 못해 시선 분석을 진행할 수 없습니다:', error)
      setMediaError('카메라를 사용할 수 없습니다. 브라우저의 카메라 권한을 확인해주세요.')
    }
  }

  /**
   * 실전 탭 buildPayload()와 같은 방식으로 face 객체를 만든다.
   * 얼굴이 안 잡힌 인덱스는 {x:0, y:0}으로 채워 키 구성이 매 프레임 동일하게 유지된다.
   */
  const buildFacePayload = () => {
    const landmarks = faceResultsRef.current?.multiFaceLandmarks?.[0]
    const face: Record<string, { x: number; y: number }> = {}
    FACE_INDICES.forEach((idx) => {
      face[String(idx)] = landmarks?.[idx]
        ? { x: Number(landmarks[idx].x.toFixed(3)), y: Number(landmarks[idx].y.toFixed(3)) }
        : { x: 0, y: 0 }
    })
    return face
  }

  /** 1초 주기로 최신 랜드마크를 서버에 전송한다. (실전 탭과 동일한 주기) */
  const startSendingFace = () => {
    if (faceSendTimerRef.current) return // 이미 돌고 있으면 중복 실행하지 않는다
    frameStatsRef.current = { processed: 0, detected: 0, sent: 0, sentWithFace: 0 }

    faceSendTimerRef.current = setInterval(() => {
      const hasFace = !!faceResultsRef.current?.multiFaceLandmarks?.[0]
      const face = buildFacePayload()
      sendFace(face)

      if (import.meta.env.DEV) {
        const stats = frameStatsRef.current
        stats.sent += 1
        if (hasFace) stats.sentWithFace += 1
        // 5초마다 한 번씩만 요약해서 남긴다
        if (stats.sent % 5 === 0) {
          const video = webcamVideoRef.current
          console.log(
            `[GAZE 진단] 전송 ${stats.sent}회 중 얼굴 포함 ${stats.sentWithFace}회 · ` +
              `FaceMesh 처리 ${stats.processed}회 중 얼굴 감지 ${stats.detected}회 · ` +
              `video ${video?.videoWidth}x${video?.videoHeight} readyState=${video?.readyState} paused=${video?.paused}`
          )
          // 서버로 실제로 나가는 좌표를 그대로 남긴다. 값 자체가 이상한지 확인용.
          console.log('[GAZE 페이로드]', JSON.stringify(face))
        }
      }
    }, FACE_SEND_INTERVAL)
  }

  const stopSendingFace = () => {
    if (faceSendTimerRef.current) clearInterval(faceSendTimerRef.current)
    faceSendTimerRef.current = null
  }

  const stopGazeTracking = () => {
    // 남아 있는 프레임이 WASM을 건드리지 않도록 깃발부터 세운다.
    gazeStoppedRef.current = true

    stopSendingFace()
    cameraRef.current?.stop()
    cameraRef.current = null

    // 진행 중이던 프레임이 끝난 뒤에 닫는다. 바로 닫으면 그 프레임이 삭제된 객체를 참조한다.
    const mesh = faceMeshRef.current
    faceMeshRef.current = null
    if (mesh) {
      setTimeout(() => {
        void Promise.resolve(mesh.close()).catch(() => {
          /* 이미 정리된 경우는 무시 */
        })
      }, 0)
    }
    webcamStreamRef.current?.getTracks().forEach((t) => t.stop())
    webcamStreamRef.current = null
    faceResultsRef.current = null
  }

  const clearAllTimers = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    if (dotTimerRef.current) clearInterval(dotTimerRef.current)
    if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current)
    if (sentenceEndedTimerRef.current) clearTimeout(sentenceEndedTimerRef.current)
    if (resultWaitTimerRef.current) clearTimeout(resultWaitTimerRef.current)
  }

  const startPracticing = () => {
    setStep('practicing')
    setDotIdx(0)
    currentSentenceRef.current = 0
    // 여기서 WebSocket을 연다. 실제 전송은 아래 useEffect가 onopen 시점에 시작한다.
    setGazeEnabled(true)

    // 문장당 점 2개: 3.5초마다 점 이동
    dotTimerRef.current = setInterval(() => {
      setDotIdx((prev) => (prev + 1) % DOT_POSITIONS.length)
    }, 3500)

    // 문장은 7초마다 교체
    sentenceTimerRef.current = setInterval(() => {
      const next = currentSentenceRef.current + 1

      if (next >= SENTENCES.length) {
        // 마지막 문장 종료: 점·영상 멈추고 15초 뒤 결과 화면
        if (dotTimerRef.current) clearInterval(dotTimerRef.current)
        if (sentenceTimerRef.current) clearInterval(sentenceTimerRef.current)
        // 전송은 멈추지 않는다. 서버는 target_duration_sec(30초)만큼 프레임이 모여야 result를
        // 내려주는데, 연결이 조금 늦게 열렸으면 문장이 끝난 시점에 아직 30초가 안 찼을 수 있다.
        // 전송은 result가 도착하거나 stopGazeTracking()이 불릴 때 멈춘다.
        videoRef.current?.pause()
        setSentenceEnded(true)
        sentenceEndedTimerRef.current = setTimeout(async () => {
          if (document.fullscreenElement) await document.exitFullscreen()
          stopGazeTracking()
          setStep('finished')
        }, 15000)
      } else {
        currentSentenceRef.current = next
        setSentenceIdx(next)
      }
    }, 7000)
  }

  const handleStart = () => {
    setStep('countdown')
    setCountdown(5)
    setSentenceIdx(0)
    currentSentenceRef.current = 0
    // 카운트다운 5초를 카메라·FaceMesh 준비 시간으로 쓴다.
    void initGazeCamera()

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

  const handleStop = async () => {
    clearAllTimers()
    stopGazeTracking()
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
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

  /**
   * 실전 탭의 `ws.onopen -> startAudioWebSocketRecording(stream)` 순서와 같다.
   * 연결이 열린 뒤부터 랜드마크를 흘려보내야 서버가 첫 프레임부터 놓치지 않고 받는다.
   */
  useEffect(() => {
    if (step === 'practicing' && status === 'open') startSendingFace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status])

  /** 결과 화면에 들어왔는데 result가 아직이면, 무한정 기다리지 않도록 상한선을 건다. */
  useEffect(() => {
    // 연습을 시작하지도 않고 끝낸 경우(gazeEnabled=false)는 기다릴 결과 자체가 없다.
    if (step !== 'finished' || result || !gazeEnabled) return
    resultWaitTimerRef.current = setTimeout(() => setResultTimedOut(true), RESULT_WAIT_LIMIT_MS)
    return () => {
      if (resultWaitTimerRef.current) clearTimeout(resultWaitTimerRef.current)
      resultWaitTimerRef.current = null
    }
  }, [step, result, gazeEnabled])

  /** 서버가 result를 내려주면 전송을 멈추고 카메라를 정리한 뒤 결과 화면으로 넘어간다. */
  useEffect(() => {
    if (!result) return
    clearAllTimers()
    stopGazeTracking()
    // 서버는 result를 준 뒤에도 연결을 먼저 끊지 않는다. FE가 직접 닫아준다.
    closeGazeSocket()
    if (document.fullscreenElement) void document.exitFullscreen()
    setStep('finished')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      clearAllTimers()
      stopGazeTracking()
    }
  }, [])

  const dot = DOT_POSITIONS[dotIdx]
  const isActive = step === 'countdown' || step === 'practicing'
  const isFinished = step === 'finished'

  /* 시선 분석 결과 -------------------------------------------------- */
  const gazeRaw = result?.raw_result as GazeRawResult | undefined

  // gaze_hold_ratio(0~1)를 %로 바꿔 쓰고, 없으면 substep 점수로 대체한다.
  const holdRatio = num(gazeRaw?.gaze_hold_ratio)
  const gazeRatio = holdRatio !== null ? Math.round(holdRatio * 100) : (result?.score ?? null)
  const avgHoldSeconds = num(gazeRaw?.avg_hold_duration_sec)
  const breakCount = num(gazeRaw?.gaze_break_count)

  // 연습은 끝났는데 서버 result가 아직 안 온 구간
  const timeoutMessage =
    resultTimedOut && !result
      ? '분석 결과를 받지 못했습니다. 다음 단계로 넘어가거나 다시 시도해주세요.'
      : null
  const bannerMessage = errorMessage ?? mediaError ?? timeoutMessage
  const isAnalyzing = isFinished && !result && !bannerMessage

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      {/*
        시선 분석용 웹캠. 화면에는 청중 영상만 보여야 하므로 1px로 숨겨둔다.
        (display:none을 쓰면 브라우저가 프레임을 그리지 않아 FaceMesh가 동작하지 않는다.)
      */}
      <video
        ref={webcamVideoRef}
        autoPlay
        muted
        playsInline
        // 1px에 opacity 0으로 두면 브라우저가 영상 갱신을 건너뛸 수 있다.
        // 실제 크기를 유지한 채 화면 밖으로 밀어내야 프레임이 계속 들어온다.
        style={{
          position: 'fixed',
          top: 0,
          left: -10000,
          width: 320,
          height: 240,
          pointerEvents: 'none',
        }}
      />
      <PracticeLayout
        currentStepIndex={3}
        canGoPrev={true}
        canGoNext={true}
        // 분석 중에 넘어가면 하위단계가 완료되지 않은 채로 다음 화면에 가게 된다.
        isLocked={isAnalyzing}
        lockedMessage={isAnalyzing ? '분석이 끝날 때까지 기다려주세요.' : undefined}
        onPrev={() => navigate('/practice/breathing')}
        onNext={() => navigate('/practice/feelresult')}
      >
        <TitleSection
          title="시선 고정 연습"
          badgeText="스크립트 기반 기초 연습"
          description="제시된 스크립트 문장을 읽으면서 점들에 시선을 고정해봐요."
        />

        <RealtimeErrorBanner message={bannerMessage} />

        {isFinished ? (
          /* 결과 화면 */
          <div>
            <div className="w-full rounded-2xl bg-white p-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <p className="fontSB mb-5 text-[16px] text-[#3B3B3B]">
                {isAnalyzing ? '시선 분석 중' : '시선 분석'}
              </p>
              {isAnalyzing && (
                <AnalyzingIndicator message="시선 데이터를 분석하고 있습니다. 잠시만 기다려주세요." />
              )}
              <div
                className={`flex w-full items-center justify-between px-5 ${isAnalyzing ? 'hidden' : ''}`}
              >
                <div className="flex w-[40%] items-center justify-center rounded-xl bg-[#F5F5F5] px-8 py-10">
                  <span className="fontRegular mr-16 text-[15px] text-[#5D5D5D]">시선 유지율</span>
                  {gazeRatio !== null ? (
                    <span className="fontBold text-[32px] text-[#3B3B3B]">{gazeRatio} %</span>
                  ) : (
                    <span className="fontBold text-[32px] text-[#3B3B3B]">- %</span>
                  )}
                </div>

                {/* 세부 수치 */}
                <div className="flex w-[55%] flex-col gap-4">
                  <div className="flex items-center justify-between gap-16">
                    <span className="fontRegular text-[15px] text-[#5D5D5D]">평균 유지 시간</span>
                    {avgHoldSeconds !== null ? (
                      <span className="fontSB text-[15px] text-[#5650FF]">
                        {avgHoldSeconds.toFixed(1)}초
                      </span>
                    ) : (
                      <span className="fontSB text-[15px] text-[#5650FF]">-</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-16">
                    {/* 서버가 주는 건 유지 횟수가 아니라 시선을 뗀 횟수(gaze_break_count)라 라벨을 맞췄다. */}
                    <span className="fontRegular text-[15px] text-[#5D5D5D]">시선 이탈 횟수</span>
                    {breakCount !== null ? (
                      <span className="fontSB text-[15px] text-[#5650FF]">{breakCount}회</span>
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
                  {result?.feedback_text ??
                    '현재 점에 집중한 것처럼, 실제 발표에서도 청중의 이마나 콧등을 보면 자연스러운 눈맞춤이 가능합니다.'}
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
                ref={videoRef}
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

              {/* 문장 종료 알림 (마지막 문장 후 15초간 유지) */}
              {sentenceEnded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="fontSB rounded-2xl bg-white/95 px-8 py-4 text-[18px] text-[#5650FF] shadow-lg">
                    문장이 끝났습니다!
                  </span>
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
