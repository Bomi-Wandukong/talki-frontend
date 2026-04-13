import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'

const PHASE_DURATION = 3 
const TOTAL_CYCLES = 3

type Status = 'idle' | 'inhale' | 'exhale' | 'done'

const BreathingPractice = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('idle')
  const [expanded, setExpanded] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const runCycle = (currentCycle: number) => {
    if (currentCycle >= TOTAL_CYCLES) {
      setStatus('done')
      setExpanded(false)
      return
    }
    setStatus('inhale')
    setExpanded(true)

    const t1 = setTimeout(() => {
      setStatus('exhale')
      setExpanded(false)

      const t2 = setTimeout(() => {
        runCycle(currentCycle + 1)
      }, PHASE_DURATION * 1000)
      timeoutsRef.current.push(t2)
    }, PHASE_DURATION * 1000)
    timeoutsRef.current.push(t1)
  }

  const handleStart = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    runCycle(0)
  }

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const isRunning = status === 'inhale' || status === 'exhale'

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={1}
        canGoPrev={!isRunning}
        canGoNext={!isRunning}
        onPrev={() => navigate('/practice/start')}
        onNext={() => navigate('/practice/select')}
      >
        {/* 타이틀 */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[25px] leading-[35px] fontSB">
              20초 동안 숨을 고르고
              <br />
              시작해볼까요?
            </p>
            <p className="fontLight pt-3 text-[15px] text-[#5D5D5D]">
              원의 크기 변화에 따라 천천히 호흡해주세요.
            </p>
          </div>
          <p className="text-center fontSB whitespace-nowrap rounded-lg bg-[#5650FF] w-[13%] py-2 text-[14px] text-white">
            호흡 조절
          </p>
        </div>

        {/* 호흡 카드 */}
        <div className="flex w-full justify-center items-center gap-16 rounded-2xl bg-white h-[70%] shadow-sm mb-20">
          {/* 애니메이션 원 */}
          <div
            className="flex flex-shrink-0 items-center justify-center rounded-full border border-[#E0DFFF]"
            style={{ width: 250, height: 250 }}
          >
            <div
              className="rounded-full bg-[#5650FF]"
              style={{
                width: 80,
                height: 80,
                transform: expanded ? 'scale(2.1)' : 'scale(1)',
                transition: `transform ${PHASE_DURATION}s ease-in-out`,
                boxShadow: '0 0 60px 20px rgba(86,80,255,0.25)',
              }}
            />
          </div>

          {/* 상태 텍스트 / 버튼 */}
          <div className="flex flex-col items-start" style={{ width: 200 }}>
            {status === 'idle' && (
              <button
                onClick={handleStart}
                className="rounded-2xl bg-[#F0EFFF] px-8 py-4 text-[16px] fontSB text-[#5650FF] transition-colors hover:bg-[#E0DFFF]"
              >
                호흡 시작하기
              </button>
            )}
            {status === 'inhale' && (
              <p className="text-[18px] fontSB text-[#3B3B3B]">들이마시세요.</p>
            )}
            {status === 'exhale' && (
              <p className="text-[18px] fontSB text-[#3B3B3B]">내쉬세요.</p>
            )}
            {status === 'done' && (
              <div className="flex flex-col gap-1">
                <p className="text-[20px] fontSB text-[#5650FF]">✓ 완료</p>
              </div>
            )}
          </div>
        </div>
      </PracticeLayout>
    </div>
  )
}

export default BreathingPractice
