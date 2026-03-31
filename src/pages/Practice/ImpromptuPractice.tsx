import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'
import TitleSection from './components/TitleSection'
import QuestionCard from './components/QuestionCard'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import PracticeFeedback from './components/PracticeFeedback'

export type PracticeStep = 'idle' | 'preparing' | 'recording' | 'finished'

const questions = [
  { id: 1, text: '최근에 배운 것 중 가장 유용했던 것은 무엇인가요?' },
  { id: 2, text: '가장 기억에 남는 여행지와 그 이유는 무엇인가요?' },
  { id: 3, text: '살면서 겪었던 가장 큰 도전과 이를 어떻게 극복했는지 말씀해 주세요.' },
]

const ImpromptuPractice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<PracticeStep>('idle')
  const [selectedNum, setSelectedNum] = useState<number>(1)
  const [prepTimeLeft, setPrepTimeLeft] = useState(10)
  const [recordTimeLeft, setRecordTimeLeft] = useState(30)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // 진입 시 랜덤 퀘스천 할당
  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 3) + 1
    setSelectedNum(randomNum)
  }, [])

  // 준비 카운트다운
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (step === 'preparing') {
      if (prepTimeLeft > 0) {
        timer = setInterval(() => setPrepTimeLeft((prev) => prev - 1), 1000)
      } else {
        startRecording()
      }
    }
    return () => clearInterval(timer)
  }, [step, prepTimeLeft])

  // 녹음 카운트다운
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (step === 'recording') {
      if (recordTimeLeft > 0) {
        timer = setInterval(() => setRecordTimeLeft((prev) => prev - 1), 1000)
      } else {
        stopPractice()
      }
    }
    return () => clearInterval(timer)
  }, [step, recordTimeLeft])

  const startPractice = async () => {
    try {
      // 마이크 권한 요청 및 MediaRecorder 셋업
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = [] // 초기화
        stream.getTracks().forEach((track) => track.stop())
        console.log('Recording stopped. Blob size:', blob.size)
      }

      setStep('preparing')
      setPrepTimeLeft(10)
    } catch (err) {
      console.error('마이크 권한을 가져오는데 실패했습니다.', err)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  const startRecording = () => {
    setStep('recording')
    setRecordTimeLeft(30)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start()
    }
  }

  const stopPractice = () => {
    setStep('finished')
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleNext = () => {
    alert('다음 단계로 이동합니다.')
  }

  const handlePrev = () => {
    alert('이전 단계로 이동합니다.')
  }

  const currentQuestion = questions.find((q) => q.id === selectedNum)?.text || ''

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3} // 0부터 시작: 0~3 => 4번째 "연습 진행"
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
          title="즉흥 말하기 연습"
          badgeText="즉흥 구성 연습"
          description="질문을 보고 10초 준비 후, 30초 동안 자유롭게 말해보세요."
        />

        <QuestionCard
          question={currentQuestion}
          selectedNumber={selectedNum}
          onSelect={setSelectedNum}
          step={step}
        />

        {step !== 'finished' ? (
          <TimerSection step={step} prepTimeLeft={prepTimeLeft} recordTimeLeft={recordTimeLeft} />
        ) : (
          <PracticeFeedback />
        )}

        {/* 하단 영역: 마이크 버튼 & 툴팁 */}
        <div className="relative flex w-full items-center justify-between">
          <div className="flex w-[120px] shrink-0 justify-center">
            <MicButton step={step} onStart={startPractice} onStop={stopPractice} />
          </div>

          <div className="mb-auto pb-4">
            {step !== 'finished' && (
              <CoachBubble>완벽한 답변보다는{'\n'}끝까지 말하는 것에 집중해보세요.</CoachBubble>
            )}
            {step === 'finished' && (
              <CoachBubble>
                <span className="mb-2 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1 pl-4 text-sm text-[#4E4AC7]">
                  <li>주어진 시간을 거의 다 활용했습니다.</li>
                  <li>"음", "어" 같은 추임새가 적습니다.</li>
                  <li>질문에 적절하게 답변했습니다.</li>
                </ul>
              </CoachBubble>
            )}
          </div>
        </div>
      </PracticeLayout>
    </div>
  )
}

export default ImpromptuPractice
