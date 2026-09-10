import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'
import TimerSection from './components/TimerSection'
import MicButton from './components/MicButton'
import CoachBubble from '@/components/Practice/CoachBubble'
import RealtimeErrorBanner from '@/components/Practice/RealtimeErrorBanner'
import TitleSection from './components/TitleSection'
import KeywordCards, { type KeywordType } from './components/KeywordCards'
import KeywordAnalysis from './components/KeywordAnalysis'
import { usePracticeSubStep, isKeywordUsed } from '@/hooks/usePracticeSubStep'

const KeywordPractice = () => {
  const navigate = useNavigate()
  const { phase, context, result, liveFeedback, error, notice, prepTimeLeft, recordTimeLeft, start, stop } =
    usePracticeSubStep('KEYWORD')

  const raw = result?.raw
  const isRunning = phase === 'preparing' || phase === 'recording' || phase === 'analyzing'

  // 서버가 내려준 keyword_usage 를 우선 사용하고, 없으면 인식된 텍스트로 동일 규칙 판정
  const serverUsage = raw?.keyword_usage
  const keywords: KeywordType[] = (context?.keywords ?? []).map((text, index) => ({
    id: index + 1,
    text,
    isUsed:
      serverUsage?.find((usage) => usage.keyword === text)?.used ??
      (result ? isKeywordUsed(text, raw?.text) : false),
  }))

  const usedCount = keywords.filter((keyword) => keyword.isUsed).length

  const handlePrev = () => navigate('/practice/impromptu')
  const handleNext = () => navigate('/practice/core')

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={3} // 연습 진행 탭 활성화 유지
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
          title="키워드 기반 구성 연습"
          badgeText="즉흥 구성 연습"
          description={`아래 ${context?.keywords?.length ?? 3}개의 키워드를 모두 포함하여 자유롭게 말해보세요.`}
        />

        <RealtimeErrorBanner message={error} />

        {notice && !error && (
          <div className="mb-4 rounded-xl border border-[#F0DCA8] bg-[#FDF6E3] px-5 py-3 text-[14px] text-[#8A6D1F]">
            {notice}
          </div>
        )}

        {phase === 'connecting' ? (
          <div className="mb-8 mt-6 grid grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex min-h-[84px] animate-pulse items-center justify-center rounded-xl bg-white p-6 shadow-sm"
              />
            ))}
          </div>
        ) : (
          <KeywordCards keywords={keywords} />
        )}

        {phase !== 'finished' || !result ? (
          <TimerSection step={phase} prepTimeLeft={prepTimeLeft} recordTimeLeft={recordTimeLeft} />
        ) : (
          <KeywordAnalysis
            usedCount={usedCount}
            totalCount={keywords.length}
            evaluation={raw?.connection_naturalness ?? '-'}
            detail="연결 자연스러움"
          />
        )}

        {/* 하단 영역: 마이크 버튼 & 툴팁 */}
        <div className="relative flex w-full items-center justify-between">
          <div className="flex w-[120px] shrink-0 justify-center">
            <MicButton step={phase} onStart={start} onStop={stop} />
          </div>

          <div className="mb-auto pb-4">
            {phase === 'analyzing' && (
              <CoachBubble>키워드 사용을 분석하고 있어요.{'\n'}잠시만 기다려주세요.</CoachBubble>
            )}

            {phase !== 'finished' && phase !== 'analyzing' && (
              <CoachBubble>
                {liveFeedback.length > 0
                  ? liveFeedback.join('\n')
                  : `키워드를 억지로 넣기보다는\n자연스러운 흐름을 만들어보세요.`}
              </CoachBubble>
            )}

            {phase === 'finished' && result && (
              <CoachBubble>
                <span className="mb-3 block font-bold text-[#4E4AC7]">TALKI의 간단 피드백</span>
                <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-[#4E4AC7]">
                  <li>{result.feedbackText}</li>
                  <li>
                    키워드 사용 {raw?.keyword_coverage ?? `${usedCount}/${keywords.length}`}개를
                    확인했습니다.
                  </li>
                  {keywords
                    .filter((keyword) => !keyword.isUsed)
                    .map((keyword) => (
                      <li key={keyword.id}>
                        "{keyword.text}" 키워드를 추가하면 더 완성도가 높아집니다.
                      </li>
                    ))}
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
