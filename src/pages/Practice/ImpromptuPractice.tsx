import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import CoachBubble from '@/components/Practice/CoachBubble'
import RealtimeErrorBanner from '@/components/Practice/RealtimeErrorBanner'
import TitleSection from './components/TitleSection'
import QuestionCard from './components/QuestionCard'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import PracticeFeedback from './components/PracticeFeedback'
import { usePracticeSubStep } from '@/hooks/usePracticeSubStep'

const ImpromptuPractice = () => {
  const navigate = useNavigate()
  const { phase, context, result, liveFeedback, error, notice, prepTimeLeft, recordTimeLeft, start, stop } =
    usePracticeSubStep('IMPROMPTU')

  const raw = result?.raw
  const isRunning = phase === 'preparing' || phase === 'recording' || phase === 'analyzing'

  const handleNext = () => navigate('/practice/keyword')
  const handlePrev = () => navigate(-1)

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3} // 0부터 시작: 0~3 => 4번째 "연습 진행"
        canGoPrev={true}
        canGoNext={phase === 'ready' || phase === 'finished' || phase === 'error'}
        isLocked={isRunning}
        onPrev={handlePrev}
        onNext={handleNext}
        lockedMessage={
          phase === 'ready'
            ? '건너뛰려면 다음 버튼 클릭'
            : phase !== 'finished'
              ? '연습을 완료하면 다음으로 넘어갈 수 있어요.'
              : undefined
        }
      >
        <TitleSection
          title="즉흥 말하기 연습"
          badgeText="즉흥 구성 연습"
          description={`질문을 보고 ${context?.prepSeconds ?? 10}초 준비 후, ${context?.speakSeconds ?? 30}초 동안 자유롭게 말해보세요.`}
        />

        <RealtimeErrorBanner message={error} />

        {notice && !error && (
          <div className="mb-4 rounded-xl border border-[#F0DCA8] bg-[#FDF6E3] px-5 py-3 text-[14px] text-[#8A6D1F]">
            {notice}
          </div>
        )}

        <QuestionCard
          question={context?.topic ?? ''}
          step={phase}
          isLoading={phase === 'connecting'}
        />

        {phase !== 'finished' || !result ? (
          <TimerSection step={phase} prepTimeLeft={prepTimeLeft} recordTimeLeft={recordTimeLeft} />
        ) : (
          <PracticeFeedback
            fillersCount={raw?.fillers_count}
            spokenSeconds={raw?.spoken_duration_sec ?? raw?.duration_sec}
            structureLabel={raw?.structure_completeness}
          />
        )}

        {/* 하단 영역: 마이크 버튼 & 툴팁 */}
        <div className="relative flex w-full items-center justify-between">
          <div className="flex w-[120px] shrink-0 justify-center">
            <MicButton step={phase} onStart={start} onStop={stop} />
          </div>

          <div className="mb-auto pb-4">
            {phase === 'analyzing' && (
              <CoachBubble>말한 내용을 분석하고 있어요.{'\n'}잠시만 기다려주세요.</CoachBubble>
            )}

            {phase !== 'finished' && phase !== 'analyzing' && (
              <CoachBubble>
                {liveFeedback.length > 0
                  ? liveFeedback.join('\n')
                  : `완벽한 답변보다는\n끝까지 말하는 것에 집중해보세요.`}
              </CoachBubble>
            )}

            {phase === 'finished' && result && (
              <CoachBubble>
                <span className="mb-2 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1 pl-4 text-sm text-[#4E4AC7]">
                  <li>{result.feedbackText}</li>
                  <li>불필요한 추임새를 {raw?.fillers_count ?? 0}회 사용했습니다.</li>
                  <li>발음 명확도는 {raw?.articulation_label ?? '-'} 수준입니다.</li>
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
