import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import CoachBubble from '@/components/Practice/CoachBubble'
import TitleSection from './components/TitleSection'
import KeywordCards, { type KeywordType } from './components/KeywordCards'
import KeywordAnalysis from './components/KeywordAnalysis'

export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

const INITIAL_KEYWORDS: KeywordType[] = [
  { id: 1, text: '협업', isUsed: false },
  { id: 2, text: '문제해결', isUsed: false },
  { id: 3, text: '성장', isUsed: false },
]

const KeywordPractice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<PracticeStep>('idle')
  const [prepTimeLeft, setPrepTimeLeft] = useState(10)
  const [recordTimeLeft, setRecordTimeLeft] = useState(30)
  const [keywords, setKeywords] = useState<KeywordType[]>(INITIAL_KEYWORDS)

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
        // const _audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())
      }

      setPrepTimeLeft(10)
      setRecordTimeLeft(30)
      setKeywords(INITIAL_KEYWORDS)
      setStep('preparing')
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

    // 모의 결과: 키워드 1, 3을 사용됨으로 변경 (협업, 성장)
    setKeywords((prev) => prev.map((kw, i) => (i === 0 || i === 2 ? { ...kw, isUsed: true } : kw)))
  }

  useEffect(() => {
    // cleanup on unmount
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

  const handlePrev = () => navigate('/practice/impromptu') // 이전 단계 이동 처리
  const handleNext = () => navigate('/practice/keyword') // 이후 다음 단계(있다면) 추가 수정 필요

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3} // 연습 진행 탭 활성화 유지
        canGoPrev={true}
        canGoNext={step === 'idle' || step === 'finished'}
        isLocked={step === 'preparing' || step === 'recording'}
        onPrev={handlePrev}
        onNext={handleNext}
        lockedMessage={
          step === 'idle'
            ? '건너뛰려면 다음 버튼 클릭'
            : step !== 'finished'
              ? '연습을 완료하면 다음으로 넘어갈 수 있어요.'
              : undefined
        }
      >
        <TitleSection
          title="키워드 기반 구성 연습"
          badgeText="즉흥 구성 연습"
          description="아래 3개의 키워드를 모두 포함하여 자유롭게 말해보세요."
        />

        <KeywordCards keywords={keywords} />

        {step !== 'finished' ? (
          <TimerSection step={step} prepTimeLeft={prepTimeLeft} recordTimeLeft={recordTimeLeft} />
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
                키워드를 억지로 넣기보다는{'\n'}자연스러운 흐름을 만들어보세요.
              </CoachBubble>
            ) : (
              <CoachBubble>
                <span className="mb-3 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                  <li>대부분의 키워드를 자연스럽게 사용했습니다.</li>
                  <li>키워드 간 논리적 연결이 좋습니다.</li>
                  <li>"문제해결" 키워드를 추가하면 더 완성도가 높아집니다.</li>
                </ul>
              </CoachBubble>
            )}
          </div>
        </div>
      </PracticeLayout>
    </div>
  )
}

export default KeywordPractice
