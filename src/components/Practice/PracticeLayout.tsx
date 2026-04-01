import React from 'react'
import PracticeSidebar from './PracticeSidebar'
import NavigationArrows from './NavigationArrows'

interface PracticeLayoutProps {
  currentStepIndex: number
  children: React.ReactNode
  coachBubble?: React.ReactNode

  // Navigation props
  canGoPrev?: boolean
  canGoNext?: boolean
  isLocked?: boolean
  onPrev?: () => void
  onNext?: () => void
  lockedMessage?: string
  hideNavigation?: boolean
}

const PracticeLayout: React.FC<PracticeLayoutProps> = ({
  currentStepIndex,
  children,
  coachBubble,
  canGoPrev = true,
  canGoNext = true,
  isLocked = false,
  onPrev,
  onNext,
  lockedMessage,
  hideNavigation = false,
}) => {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#F7F7F8]">
      {/* 사이드바 */}
      <PracticeSidebar currentStepIndex={currentStepIndex} />

      {/* 메인 영역 */}
      <main className="relative flex flex-1 flex-col overflow-y-auto pt-20">
        <div className="relative mx-auto w-full max-w-5xl flex-1">{children}</div>

        {/* 하단 네비게이션 */}
        {!hideNavigation && (
          <div className="z-50 mt-auto flex w-full shrink-0 flex-col items-end pb-8 pr-24">
            {coachBubble}
            <NavigationArrows
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              isLocked={isLocked}
              onPrev={onPrev}
              onNext={onNext}
              lockedMessage={lockedMessage}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default PracticeLayout
