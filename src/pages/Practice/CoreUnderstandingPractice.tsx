import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import CoachBubble from '@/components/Practice/CoachBubble'
import TitleSection from './components/TitleSection'
import CoreTextCard, { type CoreKeyword } from './components/CoreTextCard'
import KeywordAnalysis from './components/KeywordAnalysis'
import { usePracticeSubStep, isKeywordUsed } from '@/hooks/usePracticeSubStep'

const CoreUnderstandingPractice = () => {
  const navigate = useNavigate()
  const { phase, context, result, liveFeedback, error, notice, prepTimeLeft, recordTimeLeft, start, stop } =
    usePracticeSubStep('POINT')

  const raw = result?.raw
  const isRunning = phase === 'preparing' || phase === 'recording' || phase === 'analyzing'

  // POINT 는 raw_result 에 키워드별 사용 여부가 없어, 서버와 동일한 규칙으로 인식 텍스트에서 판정한다.
  const keywords: CoreKeyword[] = (context?.referenceKeywords ?? []).map((text, index) => ({
    id: index + 1,
    text,
    isUsed: result ? isKeywordUsed(text, raw?.text) : false,
  }))

  const usedCount = keywords.filter((keyword) => keyword.isUsed).length
  const missingPoints = raw?.missing_points ?? []

  const handlePrev = () => navigate('/practice/keyword')
  const handleNext = () => navigate('/practice/feelresult')

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3}
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
          title="핵심 파악 연습"
          badgeText="즉흥 구성 연습"
          description={`아래 글을 읽고 핵심 내용을 ${context?.speakSeconds ?? 30}초 동안 요약하여 말해보세요.`}
        />

        {error && (
          <div className="mb-4 rounded-xl border border-[#F3C1C1] bg-[#FDEDED] px-5 py-3 text-[14px] text-[#C0392B]">
            {error}
          </div>
        )}

        {notice && !error && (
          <div className="mb-4 rounded-xl border border-[#F0DCA8] bg-[#FDF6E3] px-5 py-3 text-[14px] text-[#8A6D1F]">
            {notice}
          </div>
        )}

        {phase === 'connecting' ? (
          <div className="mb-6 h-[220px] animate-pulse rounded-[20px] bg-white shadow-sm" />
        ) : (
          <CoreTextCard originalText={context?.passage ?? ''} keywords={keywords} />
        )}

        {phase !== 'finished' || !result ? (
          <TimerSection
            step={phase}
            prepTimeLeft={prepTimeLeft}
            recordTimeLeft={recordTimeLeft}
            isCompact={true}
            showPrep={(context?.prepSeconds ?? 0) > 0}
          />
        ) : (
          <KeywordAnalysis
            usedCount={usedCount}
            totalCount={keywords.length}
            evaluation={raw?.gist_accuracy_label ?? '-'}
            detail="핵심 파악 정확도"
          />
        )}

        {/* 하단 영역: 마이크 버튼 & 툴팁 */}
        <div className="relative flex w-full items-center justify-between">
          <div className="flex w-[120px] shrink-0 justify-center">
            <MicButton step={phase} onStart={start} onStop={stop} />
          </div>

          <div className="mb-auto pb-4">
            {phase === 'analyzing' && (
              <CoachBubble>요약한 내용을 분석하고 있어요.{'\n'}잠시만 기다려주세요.</CoachBubble>
            )}

            {phase !== 'finished' && phase !== 'analyzing' && (
              <CoachBubble>
                {liveFeedback.length > 0 ? (
                  liveFeedback.join('\n')
                ) : (
                  <>
                    <span className="mb-2 block font-bold text-[#4E4AC7]">요약 가이드</span>
                    <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                      <li>원문의 핵심 메세지를 파악하세요.</li>
                      <li>중요한 키워드를 포함하세요.</li>
                      <li>간결하고 명확하게 표현하세요.</li>
                    </ul>
                  </>
                )}
              </CoachBubble>
            )}

            {phase === 'finished' && result && (
              <CoachBubble>
                <span className="mb-3 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                  <li>{result.feedbackText}</li>
                  <li>
                    참고 키워드{' '}
                    {raw?.reference_keyword_coverage ?? `${usedCount}/${keywords.length}`}개를
                    포함했습니다.
                  </li>
                  {missingPoints.length > 0 && (
                    <li>"{missingPoints.join(', ')}" 내용을 추가하면 더 완벽합니다.</li>
                  )}
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
