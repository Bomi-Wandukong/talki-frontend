import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import CoachBubble from '@/components/Practice/CoachBubble'
import TitleSection from './components/TitleSection'
import CoreTextCard, { type CoreKeyword } from './components/CoreTextCard'
import KeywordAnalysis from './components/KeywordAnalysis'

export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

const TEXT_DATA = [
  {
    id: 1,
    text: `효과적인 팀워크를 위해서는 무엇보다도 명확하고 원활한 의사소통이 필수적입니다. 단순히 정보를 전달하는 데 그치는 것이 아니라, 서로의 생각과 의도를 정확히 이해하고 공감하는 과정이 함께 이루어져야 합니다. 이를 위해 각 팀원은 자신의 의견을 솔직하고 구체적으로 표현할 수 있어야 하며, 동시에 다른 사람의 의견을 존중하는 태도로 경청하는 자세가 중요합니다. 상대방의 말을 끝까지 듣고, 그 의미를 충분히 이해한 뒤 자신의 생각을 덧붙이는 과정은 팀 내 신뢰를 형성하는 데 큰 역할을 합니다.

또한 팀워크는 개인의 역량만으로 완성되는 것이 아니라, 공동의 목표를 향해 함께 나아가려는 협력 정신 속에서 더욱 빛을 발합니다. 각자의 역할과 책임을 성실히 수행하면서도, 필요할 때는 서로를 도와주고 부족한 부분을 보완해 주는 자세가 필요합니다. 이러한 상호 보완적인 협력과 지속적인 소통이 이루어질 때, 팀은 단순한 개인의 집합을 넘어 하나의 유기적인 조직으로 성장할 수 있습니다.`,
    keywords: [
      { id: 1, text: '의사소통', isUsed: false },
      { id: 2, text: '경청', isUsed: false },
      { id: 3, text: '협업', isUsed: false },
    ],
  },
]

const CoreUnderstandingPractice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<PracticeStep>('idle')
  const [prepTimeLeft, setPrepTimeLeft] = useState(10)
  const [recordTimeLeft, setRecordTimeLeft] = useState(30)

  // 랜덤 선택 로직 (현시점에서는 1개 데이터 사용)
  const [currentData] = useState(TEXT_DATA[0])
  const [keywords, setKeywords] = useState<CoreKeyword[]>(currentData.keywords)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const startPractice = async () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      mediaRecorderRef.current.onstop = () => {
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())
      }

      setPrepTimeLeft(10)
      setRecordTimeLeft(30)
      setStep('preparing')
      setKeywords(currentData.keywords)
    } catch (err) {
      console.error('마이크 접근 오류:', err)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      chunksRef.current = []
      mediaRecorderRef.current.start()
    }
  }

  const stopPractice = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setStep('finished')

    // 모의 결과: 키워드 1, 2를 사용됨으로 변경 (의사소통, 경청)
    setKeywords((prev) => prev.map((kw, i) => (i === 0 || i === 1 ? { ...kw, isUsed: true } : kw)))
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    let timer: number | undefined
    if (step === 'preparing' && prepTimeLeft > 0) {
      timer = setTimeout(() => setPrepTimeLeft((prev) => prev - 1), 1000)
    } else if (step === 'preparing' && prepTimeLeft === 0) {
      setStep('recording')
      startRecording()
    } else if (step === 'recording' && recordTimeLeft > 0) {
      timer = setTimeout(() => setRecordTimeLeft((prev) => prev - 1), 1000)
    } else if (step === 'recording' && recordTimeLeft === 0) {
      stopPractice()
    }
    return () => clearTimeout(timer)
  }, [step, prepTimeLeft, recordTimeLeft])

  const handlePrev = () => navigate('/practice/keyword')
  const handleNext = () => {} // 다음 단계 정의 시 추가

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3}
        canGoPrev={true}
        canGoNext={step === 'idle' || step === 'finished'}
        isLocked={step === 'preparing' || step === 'recording'}
        onPrev={handlePrev}
        onNext={handleNext}
        lockedMessage={
          step === 'idle' ? '건너뛰려면 다음 버튼 클릭' : step !== 'finished' ? '' : undefined
        }
      >
        <TitleSection
          title="핵심 파악 연습"
          badgeText="즉흥 구성 연습"
          description="아래 글을 읽고 핵심 내용을 요약하여 말해보세요."
        />

        <CoreTextCard originalText={currentData.text} keywords={keywords} />

        {step !== 'finished' ? (
          <TimerSection
            step={step}
            prepTimeLeft={prepTimeLeft}
            recordTimeLeft={recordTimeLeft}
            isCompact={true}
          />
        ) : (
          <KeywordAnalysis
            usedCount={keywords.filter((k) => k.isUsed).length}
            totalCount={keywords.length}
            evaluation="양호"
            detail="연결 자연스러움"
          />
        )}

        {/* 하단 영역: 마이크 버튼 & 툴팁 */}
        <div className="relative flex w-full items-center justify-between">
          <div className="flex w-[120px] shrink-0 justify-center">
            <MicButton step={step} onStart={startPractice} onStop={stopPractice} />
          </div>

          <div className="mb-auto pb-4">
            {step !== 'finished' ? (
              <CoachBubble>
                <span className="mb-2 block font-bold text-[#4E4AC7]">요약 가이드</span>
                <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                  <li>원문의 핵심 메세지를 파악하세요.</li>
                  <li>중요한 키워드를 포함하세요.</li>
                  <li>간결하고 명확하게 표현하세요.</li>
                </ul>
              </CoachBubble>
            ) : (
              <CoachBubble>
                <span className="mb-3 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                  <li>원문의 핵심을 잘 파악했습니다.</li>
                  <li>중요한 키워드를 대부분 포함했습니다.</li>
                  <li>"협력" 내용을 추가하면 더 완벽합니다.</li>
                </ul>
              </CoachBubble>
            )}
          </div>
        </div>
      </PracticeLayout>
    </div>
  )
}

export default CoreUnderstandingPractice
