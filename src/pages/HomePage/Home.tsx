import { useState } from 'react'
import Nav from '@/components/Nav/Nav'
import LeftPanel from './components/LeftPanel'
import CalendarView from './components/CalendarView'
import DashboardView from './components/DashboardView'
import DateDetailModal from './components/DateDetailModal'

const today = new Date()

const PRACTICED_DATES: Date[] = []
for (let i = 1; i <= 2; i++) {
  const d = new Date(today)
  d.setDate(today.getDate() - i)
  PRACTICED_DATES.push(d)
}

const STREAK = 2

const Home = () => {
  const [rightView, setRightView] = useState<'calendar' | 'dashboard'>('dashboard')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const toggleRightView = () => {
    setRightView((prev) => (prev === 'calendar' ? 'dashboard' : 'calendar'))
    handleCloseDetail()
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedDate(null)
  }

  const rightPanelContent =
    rightView === 'calendar' ? (
      <CalendarView
        currentMonth={currentMonth}
        today={today}
        practicedDates={PRACTICED_DATES}
        onMonthChange={setCurrentMonth}
        onDateClick={handleDateClick}
      />
    ) : (
      <DashboardView />
    )

  return (
    <div className="min-h-screen bg-[#F7F7F8] pt-[80px]">
      <Nav />
      <div className="flex flex-col lg:h-[calc(100vh-80px)] lg:flex-row">
        {/* ─── Left Panel: bottom on mobile, left on desktop ─── */}
        <div className="order-2 w-full rounded-t-3xl bg-white px-6 lg:order-1 lg:h-full lg:w-1/3 lg:overflow-y-auto lg:rounded-none min-[1500px]:px-16">
          <LeftPanel
            streak={STREAK}
            today={today}
            practicedDates={PRACTICED_DATES}
            rightView={rightView}
            onArrowClick={toggleRightView}
          />
        </div>

        {/* ─── Right Panel: top on mobile, right on desktop ─── */}
        <div className="relative order-1 w-full bg-[#F7F7F8] lg:order-2 lg:h-full lg:w-2/3">
          {/* Mobile: Modal replaces panel content */}
          <div className="block px-4 py-10 lg:hidden">
            {isDetailModalOpen && selectedDate ? (
              <DateDetailModal date={selectedDate} onClose={handleCloseDetail} isMobile />
            ) : (
              rightPanelContent
            )}
          </div>

          {/* Desktop: Scrollable panel + overlay modal */}
          <div className="relative hidden lg:block lg:h-full">
            <div
              className={`h-full overflow-y-auto transition-all duration-300 ${
                rightView === 'dashboard' ? 'px-20 py-16' : 'px-12 py-10'
              }`}
            >
              {rightPanelContent}
            </div>

            {isDetailModalOpen && selectedDate && (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/35"
                onClick={handleCloseDetail}
              >
                <DateDetailModal date={selectedDate} onClose={handleCloseDetail} isMobile={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
