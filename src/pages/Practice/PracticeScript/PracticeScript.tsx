import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import { IMAGES } from '@/utils/images'
import TitleSection from '../components/TitleSection'
import MicButton from '../components/MicButton'
import type { PracticeStep } from '../components/MicButton'

const SCRIPTS = [
  `안녕하세요, 오늘은 짧지만 중요한 이야기를 해보려고 합니다. 우리는 하루에도 많은 일을 겪게 되지만, 그 일이 성취에 어떻게 영향을 끼치는지 느끼진 못하는 경우가 많습니다. 말은 단순히 내용만이 아닌 크기, 목소리의 질감, 발화 방식에 따라 분위기가 완전히 달라질 수 있습니다. 그래서 좋은 전달은 단순히 정확하게 읽는 것이 아니라, 듣는 사람이 편하게 이해할 수 있도록 말하는 것이라고 생각합니다. 적절한 호흡과 리듬으로 이야기한 내용이 훨씬 더 잘 전달됩니다. 결국 좋은 말하기는 여러 기술 이전에, 상대방을 배려하는 작은 태도에서 시작됩니다.`,
  `저희 회사는 철저한 품질 관리 시스템을 통해 소비자의 신뢰를 지속적으로 유지해왔습니다. 특히 올해에는 신제품 출시 전략을 재검토하면서 기존의 틀을 벗어난 혁신적인 접근 방식을 채택하였습니다. 시장 조사 결과를 면밀히 분석한 결과, 고객 만족도를 극대화하기 위한 새로운 방향성이 도출되었습니다. 이에 따라 전 직원이 협력하여 창의적인 솔루션을 개발하고, 지속 가능한 성장을 위한 기반을 마련하고 있습니다. 앞으로도 변화하는 시장 환경에 신속하게 대응하며 더욱 발전된 모습을 보여드리겠습니다.`,
  `오늘 발표할 내용은 현재 우리 사회가 직면한 환경 문제와 그에 대한 해결 방안입니다. 급속도로 진행되는 기후 변화는 생태계의 균형을 무너뜨리고 있으며, 이는 전 세계적으로 심각한 경제적 손실을 초래하고 있습니다. 특히 탄소 배출량 감축을 위한 국제 협약이 강화되면서 각국 정부의 정책 변화가 요구되고 있습니다. 따라서 개인과 기업 모두가 지속 가능한 미래를 위해 작은 실천부터 시작해야 할 때입니다. 우리 각자의 선택이 모여 지구의 내일을 결정짓는다는 사실을 기억해주시기 바랍니다.`,
  `상호 존중과 이해를 바탕으로 한 소통은 건강한 조직 문화를 형성하는 핵심 요소입니다. 다양한 배경을 가진 구성원들이 하나의 목표를 향해 나아가기 위해서는 서로의 관점을 인정하고 차이를 강점으로 활용하는 자세가 필요합니다. 효과적인 의사소통은 단순히 말을 전달하는 것을 넘어서, 상대방의 입장에서 생각하고 공감하는 능력에서 비롯됩니다. 이러한 소통 방식이 정착될 때 비로소 조직은 진정한 시너지를 발휘할 수 있습니다. 협력과 신뢰를 바탕으로 우리 모두가 함께 성장하는 조직이 되길 바랍니다.`,
]

const PracticeScript = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<PracticeStep>('idle')

  // 실시간 볼륨 (0~100)
  const [liveVolume, setLiveVolume] = useState(0)
  // 최종 점수
  const [finalSpeedScore, setFinalSpeedScore] = useState(0)
  const [finalPronunciationScore, setFinalPronunciationScore] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const preparingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 볼륨 수집 (평균 계산용)
  const volumeSamplesRef = useRef<number[]>([])

  const script = useMemo(() => SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)], [])

  const isFinished = step === 'finished'

  // 실시간 볼륨 분석 루프
  const startAnalysis = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    volumeSamplesRef.current = []

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      const volume = Math.min(Math.round((avg / 128) * 100), 100)
      setLiveVolume(volume)
      volumeSamplesRef.current.push(volume)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
  }

  const stopAnalysis = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
  }

  const handleStart = async () => {
    setStep('preparing')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      preparingTimerRef.current = setTimeout(() => {
        // MediaRecorder 시작
        audioChunksRef.current = []
        const recorder = new MediaRecorder(stream)
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data)
        }
        recorder.start(100)
        mediaRecorderRef.current = recorder

        // 볼륨 분석 시작
        startAnalysis(stream)
        setStep('recording')
      }, 2000)
    } catch {
      setStep('idle')
    }
  }

  const handleStop = () => {
    // MediaRecorder 중지 → 파일 저장
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `practice_script_${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
      }
      recorder.stop()
    }

    // 스트림 트랙 종료
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    // 볼륨 분석 중지 → 최종 점수 계산
    stopAnalysis()
    const samples = volumeSamplesRef.current
    const avgVolume = samples.length > 0 ? samples.reduce((a, b) => a + b, 0) / samples.length : 0

    // 볼륨 기반으로 WPM 추정 -> 그냥 인식 잘 되는지 확인하기 위함. 이후 서버랑 연결 후 내용 변경
    const estimatedWPM = Math.round(80 + (avgVolume / 100) * 100)
    // 발음 명확도도 유사.
    const variance =
      samples.length > 1
        ? samples.reduce((acc, v) => acc + Math.pow(v - avgVolume, 2), 0) / samples.length
        : 0
    const pronunciationScore = Math.max(0, Math.min(100, Math.round(100 - variance * 0.3)))

    setFinalSpeedScore(estimatedWPM)
    setFinalPronunciationScore(pronunciationScore)
    setLiveVolume(0)
    setStep('finished')
  }

  useEffect(() => {
    return () => {
      if (preparingTimerRef.current) clearTimeout(preparingTimerRef.current)
      stopAnalysis()
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // 표시용 점수: 녹음 중엔 실시간 볼륨 기반, 완료 후엔 최종 점수 //이후 삭제 예정
  const displaySpeedScore = isFinished
    ? finalSpeedScore
    : step === 'recording'
      ? Math.round(80 + (liveVolume / 100) * 100)
      : 0
  const displayPronunciationScore = isFinished
    ? finalPronunciationScore
    : step === 'recording'
      ? Math.min(100, liveVolume + 30)
      : 0
  const pronunciationLabel = isFinished
    ? displayPronunciationScore >= 80
      ? '양호'
      : displayPronunciationScore >= 60
        ? '보통'
        : '미흡'
    : ''
  const speedFeedback =
    finalSpeedScore >= 120 && finalSpeedScore <= 160
      ? '말 속도가 적정 범위에 있습니다.'
      : finalSpeedScore < 120
        ? '말 속도가 조금 느립니다. 자연스러운 속도로 읽어보세요.'
        : '말 속도가 빠른 편입니다. 천천히 읽어보세요.'
  const pronunciationFeedback =
    finalPronunciationScore >= 70 ? '발음의 고저가 일정합니다.' : '발음을 더 또렷하게 해보세요.'

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3}
        canGoPrev={true}
        canGoNext={isFinished}
        onPrev={() => navigate('/practice/breathing')}
        onNext={() => navigate('/practice/eyecontact')}
      >
        <TitleSection
          title="스크립트 읽기 연습"
          badgeText="스크립트 기반 기초 연습"
          description="아래 문장을 자연스럽게 읽어보세요. 완벽하지 않아도 괜찮습니다."
        />

        {/* 제공 문장 */}
        <div className="relative mb-3 rounded-2xl bg-white p-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="fontSB text-[16px] text-[#3B3B3B]">제공 문장</span>
            <span className="text-[13px] text-[#ABABAB]">약 1분 분량</span>
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
          <div className="w-[50%] flex-1 rounded-2xl bg-white p-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <span className="fontSB mb-4 block text-[16px] text-[#3B3B3B]">
              {isFinished ? '최종 분석' : '실시간 분석'}
            </span>
            <div className="flex flex-col gap-5">
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
                    style={{ left: '40%', width: '20%' }}
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
                <p className="mt-1 text-[12px] text-[#ABABAB]">적정 범위 (120-160 WPM)</p>
              </div>

              {/* 발음 명확도 */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="fontRegular text-[14px] text-[#3B3B3B]">발음 명확도</span>
                  <span className="text-[14px]">
                    {isFinished
                      ? pronunciationLabel
                      : displayPronunciationScore > 0
                        ? `${displayPronunciationScore}%`
                        : ''}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div
                    className="h-full rounded-full bg-[#5650FF]"
                    style={{
                      width: `${displayPronunciationScore}%`,
                      transition:
                        step === 'recording' ? 'width 0.1s ease-out' : 'width 0.7s ease-out',
                    }}
                  />
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
                    <li className="fontRegular flex items-start gap-2 text-[14px] text-[#4E4AC7]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5650FF]" />
                      {speedFeedback}
                    </li>
                    <li className="fontRegular flex items-start gap-2 text-[14px] text-[#4E4AC7]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5650FF]" />
                      {pronunciationFeedback}
                    </li>
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
                      처음엔 천천히, <br/> 또박또박 읽는 것에 집중해보세요.
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
