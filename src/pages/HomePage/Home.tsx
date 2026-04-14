import { useState, useEffect } from 'react'
import Nav from '@/components/Nav/Nav'
import LeftPanel from './components/LeftPanel'
import CalendarView from './components/CalendarView'
import DashboardView from './components/DashboardView'
import DateDetailModal from './components/DateDetailModal'

import { getPersonalHome } from '@/api/personal'
import type { PersonalHomeResponse } from '@/api/personal'

const Home = () => {
  const [today] = useState(new Date())
  const [rightView, setRightView] = useState<'calendar' | 'dashboard'>('dashboard')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const [homeData, setHomeData] = useState<PersonalHomeResponse | null>(null)
  const [practicedDates, setPracticedDates] = useState<Date[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await getPersonalHome()
        console.log('Home.tsx Fetched data:', data)
        setHomeData(data)

        if (data.practiceDays) {
          setStreak(data.practiceDays.streakDays || 0)
          const dates = (data.practiceDays.practiceDays || []).map((d: string) => new Date(d))
          setPracticedDates(dates)
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      }
    }
    fetchHomeData()
  }, [])

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
        practicedDates={practicedDates}
        onMonthChange={setCurrentMonth}
        onDateClick={handleDateClick}
      />
    ) : (
      <DashboardView />
    )

  return (
    <div className="h-screen overflow-hidden bg-[#F7F7F8] pt-[80px]">
      <Nav />
      <div className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* ─── Left Panel: bottom on mobile, left on desktop ─── */}
        <div className="order-2 w-full rounded-t-3xl bg-white lg:order-1 lg:h-full lg:w-1/3 lg:overflow-y-auto lg:rounded-none">
          <LeftPanel
            streak={streak}
            today={today}
            practicedDates={practicedDates}
            rightView={rightView}
            onArrowClick={toggleRightView}
            userName={homeData?.userName}
            mindSetting={homeData?.mindSetting}
            recentReport={homeData?.recentPresentationReport}
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
