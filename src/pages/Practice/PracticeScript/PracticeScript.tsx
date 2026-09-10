import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import { IMAGES } from '@/utils/images'
import TitleSection from '../components/TitleSection'
import MicButton from '../components/MicButton'
import type { PracticeStep } from '../components/MicButton'
import usePracticeRealtime from '@/hooks/usePracticeRealtime'
import RealtimeErrorBanner from '@/components/Practice/RealtimeErrorBanner'
import AnalyzingIndicator from '@/components/Practice/AnalyzingIndicator'
import {
  arrayBufferToBase64,
  downsampleTo16k,
  float32ToInt16,
  TARGET_SAMPLE_RATE,
} from '@/utils/audioEncode'

/**
 * 무음 감지 기준.
 *
 * 서버는 음성 인식이 아무것도 잡지 못하면 result를 보내지 않고 그대로 멈춰 있는다.
 * (실제로 무음 90초를 보냈을 때 응답이 없고 하위단계도 완료되지 않는 것을 확인)
 * 그대로 두면 사용자는 끝나지 않는 화면을 계속 보게 되므로 프론트에서 끊고 재시도를 안내한다.
 */
const SILENCE_VOLUME = 5 // liveVolume(0~100) 이 값 이하이면 소리가 없다고 본다
const SILENCE_LIMIT_MS = 10000 // 이만큼 연속으로 조용하면 중단
const RESULT_WAIT_BUFFER_SEC = 45 // 낭독 예정 시간을 이만큼 넘겨도 결과가 없으면 중단

/** 서버가 내려주는 발음 명확도 라벨을 게이지용 점수로 환산 */
const ARTICULATION_SCORE: Record<string, number> = {
  우수: 95,
  양호: 85,
  보통: 65,
  미흡: 35,
}

const SCRIPTS = [
  `안녕하세요, 오늘은 짧지만 중요한 이야기를 해보려고 합니다. 우리는 하루에도 많은 일을 겪게 되지만, 그 일이 성취에 어떻게 영향을 끼치는지 느끼진 못하는 경우가 많습니다. 말은 단순히 내용만이 아닌 크기, 목소리의 질감, 발화 방식에 따라 분위기가 완전히 달라질 수 있습니다. 그래서 좋은 전달은 단순히 정확하게 읽는 것이 아니라, 듣는 사람이 편하게 이해할 수 있도록 말하는 것이라고 생각합니다. 적절한 호흡과 리듬으로 이야기한 내용이 훨씬 더 잘 전달됩니다. 결국 좋은 말하기는 여러 기술 이전에, 상대방을 배려하는 작은 태도에서 시작됩니다.`,
  `저희 회사는 철저한 품질 관리 시스템을 통해 소비자의 신뢰를 지속적으로 유지해왔습니다. 특히 올해에는 신제품 출시 전략을 재검토하면서 기존의 틀을 벗어난 혁신적인 접근 방식을 채택하였습니다. 시장 조사 결과를 면밀히 분석한 결과, 고객 만족도를 극대화하기 위한 새로운 방향성이 도출되었습니다. 이에 따라 전 직원이 협력하여 창의적인 솔루션을 개발하고, 지속 가능한 성장을 위한 기반을 마련하고 있습니다. 앞으로도 변화하는 시장 환경에 신속하게 대응하며 더욱 발전된 모습을 보여드리겠습니다.`,
  `오늘 발표할 내용은 현재 우리 사회가 직면한 환경 문제와 그에 대한 해결 방안입니다. 급속도로 진행되는 기후 변화는 생태계의 균형을 무너뜨리고 있으며, 이는 전 세계적으로 심각한 경제적 손실을 초래하고 있습니다. 특히 탄소 배출량 감축을 위한 국제 협약이 강화되면서 각국 정부의 정책 변화가 요구되고 있습니다. 따라서 개인과 기업 모두가 지속 가능한 미래를 위해 작은 실천부터 시작해야 할 때입니다. 우리 각자의 선택이 모여 지구의 내일을 결정짓는다는 사실을 기억해주시기 바랍니다.`,
  `상호 존중과 이해를 바탕으로 한 소통은 건강한 조직 문화를 형성하는 핵심 요소입니다. 다양한 배경을 가진 구성원들이 하나의 목표를 향해 나아가기 위해서는 서로의 관점을 인정하고 차이를 강점으로 활용하는 자세가 필요합니다. 효과적인 의사소통은 단순히 말을 전달하는 것을 넘어서, 상대방의 입장에서 생각하고 공감하는 능력에서 비롯됩니다. 이러한 소통 방식이 정착될 때 비로소 조직은 진정한 시너지를 발휘할 수 있습니다. 협력과 신뢰를 바탕으로 우리 모두가 함께 성장하는 조직이 되길 바랍니다.`,
]

const PracticeScript = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<PracticeStep>('idle')

  // 실시간 볼륨 (0~100) — 녹음 중 게이지를 움직이기 위한 로컬 값
  const [liveVolume, setLiveVolume] = useState(0)
  // 마이크 권한 실패도 화면에 알린다. (WS 에러와 같은 배너를 쓴다)
  const [mediaError, setMediaError] = useState<string | null>(null)
  // 무음/응답없음으로 중단했을 때 재시도를 안내하는 문구
  const [retryMessage, setRetryMessage] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const preparingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 마지막으로 소리가 감지된 시각. 무음이 얼마나 이어졌는지 재는 기준점이다.
  const lastSoundAtRef = useRef<number>(0)
  const resultWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 4단계 SCRIPT 하위단계 실시간 분석 WebSocket
  const { sessionStart, liveFeedback, result, errorMessage, sendAudio } = usePracticeRealtime({
    subStep: 'SCRIPT',
  })

  // 서버가 내려준 스크립트를 쓰고, 아직 못 받았으면 로컬 문장으로 대체한다.
  const [fallbackScript] = useState(() => SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)])
  const script = sessionStart?.script_text ?? fallbackScript
  const speakSeconds = sessionStart?.speak_seconds ?? 60
  const wpmMin = sessionStart?.reference_range?.wpm_min ?? 120
  const wpmMax = sessionStart?.reference_range?.wpm_max ?? 160

  // 사용자가 정지 버튼을 누르지 않아도 서버 result가 오면 결과 화면으로 본다.
  const isFinished = step === 'finished' || !!result

  /**
   * 마이크 스트림 하나로 두 가지를 동시에 처리한다.
   *  - analyser: 화면 게이지용 실시간 볼륨
   *  - processor: 1초 단위로 모은 PCM을 base64로 변환해 WebSocket 전송
   */
  const startAudioPipeline = (stream: MediaStream) => {
    // 가능하면 브라우저가 직접 16kHz로 뽑게 한다. 거부하는 브라우저에서는
    // 기본 샘플레이트로 열고 아래에서 직접 다운샘플링한다.
    let audioContext: AudioContext
    try {
      audioContext = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE })
    } catch {
      audioContext = new AudioContext()
    }
    const source = audioContext.createMediaStreamSource(stream)

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)

    const targetSamples = audioContext.sampleRate // 1초 분량
    const accumulator: Float32Array[] = []
    let totalSamples = 0

    const processor = audioContext.createScriptProcessor(4096, 1, 1)
    source.connect(processor)
    processor.connect(audioContext.destination)

    processor.onaudioprocess = (e) => {
      const chunk = new Float32Array(e.inputBuffer.getChannelData(0))
      accumulator.push(chunk)
      totalSamples += chunk.length
      if (totalSamples < targetSamples) return

      const merged = new Float32Array(totalSamples)
      let offset = 0
      for (const c of accumulator) {
        merged.set(c, offset)
        offset += c.length
      }
      accumulator.length = 0
      totalSamples = 0

      // 서버는 16kHz로 가정하고 읽으므로 보내기 전에 반드시 맞춰준다.
      const resampled = downsampleTo16k(merged, audioContext.sampleRate)
      const int16 = float32ToInt16(resampled)
      sendAudio(arrayBufferToBase64(int16.buffer as ArrayBuffer))
    }

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    processorRef.current = processor

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    lastSoundAtRef.current = 0 // 첫 tick에서 현재 시각으로 채운다

    const tick = () => {
      if (lastSoundAtRef.current === 0) lastSoundAtRef.current = Date.now()

      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      const volume = Math.min(Math.round((avg / 128) * 100), 100)
      setLiveVolume(volume)

      // 목소리가 계속 안 잡히면 서버는 영영 결과를 주지 않는다. 그 전에 끊는다.
      if (volume > SILENCE_VOLUME) {
        lastSoundAtRef.current = Date.now()
      } else if (Date.now() - lastSoundAtRef.current > SILENCE_LIMIT_MS) {
        abortRecording(
          '목소리가 감지되지 않아 녹음을 중단했습니다. 마이크를 확인하고 다시 시도해주세요.'
        )
        return
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)

    // 소리는 들어오는데 서버가 결과를 안 주는 경우에 대비한 상한선
    resultWaitTimerRef.current = setTimeout(
      () => abortRecording('분석 결과를 받지 못했습니다. 잠시 후 다시 시도해주세요.'),
      (speakSeconds + RESULT_WAIT_BUFFER_SEC) * 1000
    )
  }

  const stopAudioPipeline = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = null
    if (resultWaitTimerRef.current) clearTimeout(resultWaitTimerRef.current)
    resultWaitTimerRef.current = null
    processorRef.current?.disconnect()
    processorRef.current = null
    audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
  }

  const releaseMic = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  /**
   * 분석을 진행할 수 없다고 판단해 녹음을 끊는다.
   * 결과 화면으로 넘기지 않고 'idle'로 되돌려 마이크 버튼이 다시 나오게 한다. (재시도)
   */
  const abortRecording = (message: string) => {
    stopAudioPipeline()
    releaseMic()
    setLiveVolume(0)
    setRetryMessage(message)
    setStep('idle')
  }

  const handleStart = async () => {
    setStep('preparing')
    setMediaError(null)
    setRetryMessage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      preparingTimerRef.current = setTimeout(() => {
        startAudioPipeline(stream)
        setStep('recording')
      }, 2000)
    } catch (error) {
      console.error('마이크 권한을 얻지 못했습니다:', error)
      setMediaError('마이크를 사용할 수 없습니다. 브라우저의 마이크 권한을 확인해주세요.')
      setStep('idle')
    }
  }

  const handleStop = () => {
    stopAudioPipeline()
    releaseMic()
    setLiveVolume(0)
    // 최종 점수는 서버가 보내주는 result 메시지로 채워진다.
    setStep('finished')
  }

  useEffect(() => {
    return () => {
      if (preparingTimerRef.current) clearTimeout(preparingTimerRef.current)
      stopAudioPipeline()
      releaseMic()
    }
  }, [])

  // result가 도착하면 마이크와 오디오 파이프라인을 정리한다.
  // (결과 화면 전환 자체는 isFinished에서 파생되므로 여기서 setState 하지 않는다.)
  useEffect(() => {
    if (!result) return
    stopAudioPipeline()
    releaseMic()
  }, [result])

  /* 표시용 값 ---------------------------------------------------------- */
  const rawResult = result?.raw_result as
    | { wpm?: number; articulation_label?: string }
    | undefined
  const finalWpm = Math.round(Number(rawResult?.wpm ?? 0))
  const articulationLabel = rawResult?.articulation_label ?? ''

  // 녹음 중엔 볼륨 기반 추정치로 게이지를 움직이고, 끝나면 서버 수치로 대체한다.
  const displaySpeedScore = isFinished
    ? finalWpm
    : step === 'recording'
      ? Math.round(80 + (liveVolume / 100) * 100)
      : 0
  // 발음 명확도는 음성을 글자로 옮겨야 판정할 수 있어서 서버가 최종 result에만 담아준다.
  // 그래서 녹음 중에는 아예 보여주지 않고, 끝난 뒤 라벨을 게이지 값으로 환산해 채운다.
  const displayPronunciationScore =
    ARTICULATION_SCORE[articulationLabel] ?? result?.score ?? 0
  const pronunciationLabel = articulationLabel

  // 배너 우선순위: 연결 실패 > 마이크 권한 > 재시도 안내.
  // 결과가 나온 뒤에는 재시도 안내를 띄우지 않는다.
  const bannerMessage = errorMessage ?? mediaError ?? (isFinished ? null : retryMessage)

  // 녹음은 끝났지만 서버 result가 아직 안 온 구간. 이 동안 로딩을 보여준다.
  // 서버는 음성 인식을 마쳐야 결과를 주므로 수 초에서 수십 초가 걸릴 수 있다.
  const isAnalyzing = isFinished && !result && !bannerMessage

  // 녹음 준비 중 / 녹음 중 / 분석 중에는 다음 단계로 넘어가지 못하게 막는다.
  // 도중에 이동하면 오디오 전송이 끊겨 서버가 하위단계를 완료 처리하지 못한다.
  const isRecording = step === 'preparing' || step === 'recording'

  /*
   * 분석 카드 높이.
   * 말 속도만 있을 때(실시간 / 분석 중)는 1행 크기로 두고,
   * 결과가 오면 발음 명확도가 붙으면서 2행 크기로 늘어난다.
   * height는 auto로 두면 애니메이션이 안 걸려서 두 값을 명시한다.
   */
  const showTwoRows = isFinished && !isAnalyzing
  const panelHeight = showTwoRows ? 214 : 150
  const lockedMessage = isRecording
    ? '녹음이 끝나면 이동할 수 있습니다.'
    : isAnalyzing
      ? '분석이 끝날 때까지 기다려주세요.'
      : undefined

  // 완료 후 코치버블 문구: 서버 피드백이 있으면 그대로, 없으면 로컬 기준으로 대체
  const feedbackBullets = result?.feedback_text
    ? [result.feedback_text]
    : isAnalyzing
      ? ['분석이 끝나면 피드백을 보여드릴게요.']
      : [
          finalWpm >= wpmMin && finalWpm <= wpmMax
            ? '말 속도가 적정 범위에 있습니다.'
            : finalWpm < wpmMin
              ? '말 속도가 조금 느립니다. 자연스러운 속도로 읽어보세요.'
              : '말 속도가 빠른 편입니다. 천천히 읽어보세요.',
          '분석 결과를 받지 못했습니다. 연결 상태를 확인해주세요.',
        ]

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3}
        canGoPrev={!isRecording}
        canGoNext={true}
        isLocked={isRecording || isAnalyzing}
        lockedMessage={lockedMessage}
        onPrev={() => navigate('/practice/breathing')}
        onNext={() => navigate('/practice/eyecontact')}
      >
        <TitleSection
          title="스크립트 읽기 연습"
          badgeText="스크립트 기반 기초 연습"
          description="아래 문장을 자연스럽게 읽어보세요. 완벽하지 않아도 괜찮습니다."
        />

        <RealtimeErrorBanner
          message={bannerMessage}
          detail={
            bannerMessage === retryMessage
              ? '마이크 버튼을 다시 눌러 진행할 수 있습니다.'
              : undefined
          }
        />

        {/* 제공 문장 */}
        <div className="relative mb-3 rounded-2xl bg-white p-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="fontSB text-[16px] text-[#3B3B3B]">제공 문장</span>
            <span className="text-[13px] text-[#ABABAB]">약 {Math.round(speakSeconds / 60)}분 분량</span>
          </div>
          <p className="fontRegular text-[15px] leading-relaxed text-[#5D5D5D]">{script}</p>

          {isFinished && <div className="absolute inset-0 rounded-2xl bg-black/10" />}

          {/* 마이크 버튼 */}
          {!isFinished && (
            <div className="absolute -bottom-16 right-5 z-10">
              <MicButton step={step} onStart={handleStart} onStop={handleStop} />
            </div>
          )}
        </div>

        {/* 실시간 분석 + 코치버블 */}
        <div className="flex w-full justify-between py-4 pb-6 h-[240px]">
          <div
            className="w-[50%] flex-1 self-start overflow-hidden rounded-2xl bg-white p-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-[height] duration-500 ease-out"
            style={{ height: panelHeight }}
          >
            <span className="fontSB mb-4 block text-[16px] text-[#3B3B3B]">
              {isAnalyzing ? '분석 중' : isFinished ? '최종 분석' : '실시간 분석'}
            </span>
            {isAnalyzing && (
              <AnalyzingIndicator
                message="음성을 분석하고 있습니다. 잠시만 기다려주세요."
                minHeight={78}
              />
            )}
            <div className={`flex flex-col gap-5 ${isAnalyzing ? 'hidden' : ''}`}>
              {/* 말 속도 */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="fontRegular text-[14px] text-[#3B3B3B]">말 속도</span>
                  <span className="text-[14px]">
                    {displaySpeedScore > 0
                      ? `${displaySpeedScore} WPM`
                      : ''}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div
                    className="absolute top-0 h-full bg-[#C7C5FF]"
                    style={{ left: `${(wpmMin / 200) * 100}%`, width: `${((wpmMax - wpmMin) / 200) * 100}%` }}
                  />
                  <div
                    className="absolute top-0 h-full rounded-full bg-[#5650FF]"
                    style={{
                      width: `${Math.min((displaySpeedScore / 200) * 100, 100)}%`,
                      transition:
                        step === 'recording' ? 'width 0.1s ease-out' : 'width 0.7s ease-out',
                    }}
                  />
                </div>
                <p className="mt-1 text-[12px] text-[#ABABAB]">
                  적정 범위 ({wpmMin}-{wpmMax} WPM)
                </p>
              </div>

              {/*
                발음 명확도 — 최종 결과에서만 나온다.
                항상 렌더링해 두고, 카드가 1행 높이일 때는 overflow-hidden으로 잘려서 안 보인다.
                결과가 오면 카드가 커지면서 이 줄이 드러나고 동시에 서서히 나타난다.
              */}
              <div
                style={{
                  opacity: showTwoRows ? 1 : 0,
                  transition: 'opacity 400ms ease-out 150ms',
                }}
              >
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="fontRegular text-[14px] text-[#3B3B3B]">발음 명확도</span>
                    <span className="fontSB text-[14px] text-[#5650FF]">{pronunciationLabel}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-[#5650FF]"
                      style={{
                        width: `${displayPronunciationScore}%`,
                        transition: 'width 0.7s ease-out',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 코치버블 */}
          {isFinished ? (
            <div
              className={`relative flex h-full w-[50%] max-w-xl pb-6 pl-6 ${isFinished ? 'mt-4' : 'h-20 items-end'}`}
            >
              <img
                src={IMAGES.logo}
                alt="토끼 로고"
                className="absolute -top-7 left-10 z-10 w-[70px] object-contain drop-shadow-sm"
              />
              <div className="relative z-0 flex min-h-[64px] w-full items-center rounded-[32px] rounded-br-[0px] border border-[#5650FF] bg-white px-10 py-5 shadow-sm">
                <div className="relative z-10 pl-8 pb-3">
                  <p className="fontBold mb-3 text-[16px] text-[#4E4AC7] pb-2">TALKI의 간단 피드백</p>
                  <ul className="flex flex-col gap-1.5">
                    {feedbackBullets.map((text) => (
                      <li
                        key={text}
                        className="fontRegular flex items-start gap-2 text-[14px] text-[#4E4AC7]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5650FF]" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex w-[50%] h-full items-end justify-end max-w-xl pl-6">
                  <img
                    src={IMAGES.logo}
                    alt="토끼 로고"
                    className="absolute bottom-12 left-10 z-10 w-[70px] object-contain drop-shadow-sm"
                  />
            
                  <div className="relative h-24 z-0 flex w-full items-center rounded-[32px] rounded-br-[0px] border border-[#5650FF] bg-white px-20 shadow-sm">
                    <div className="relative z-10 whitespace-pre-line text-[15px] fontRegular pl-2 leading-relaxed text-[#4E4AC7]">
                      {liveFeedback.length > 0
                        ? liveFeedback.join('\n')
                        : '처음엔 천천히,\n또박또박 읽는 것에 집중해보세요.'}
                    </div>
                  </div>
                </div>
          )}
        </div>
      </PracticeLayout>
    </div>
  )
}

export default PracticeScript
