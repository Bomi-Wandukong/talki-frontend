import { IMAGES } from '@/utils/images'

interface CalendarViewProps {
  currentMonth: Date
  today: Date
  practicedDates: Date[]
  onMonthChange: (month: Date) => void
  onDateClick: (date: Date) => void
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const generateCalendarDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const days: Date[] = []

  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDate - i))
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }
  return days
}

const CalendarView = ({
  currentMonth,
  today,
  practicedDates,
  onMonthChange,
  onDateClick,
}: CalendarViewProps) => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const days = generateCalendarDays(year, month)

  const isPracticed = (date: Date) => practicedDates.some((pd) => isSameDay(pd, date))
  const isToday = (date: Date) => isSameDay(date, today)
  const isCurrentMonth = (date: Date) => date.getMonth() === month

  const goToPrevMonth = () => onMonthChange(new Date(year, month - 1, 1))
  const goToNextMonth = () => onMonthChange(new Date(year, month + 1, 1))

  // Split days into 6 rows of 7
  const weeks: Date[][] = []
  for (let i = 0; i < 6; i++) {
    weeks.push(days.slice(i * 7, i * 7 + 7))
  }

  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-white"
      style={{
        minHeight: '520px',
        borderRadius: '20px',
        border: '1px solid #E8E8F4',
        boxShadow: '0 2px 16px rgba(108,99,255,0.07)',
      }}
    >
      {/* Month Header */}
      <div className="flex items-center justify-center gap-5 py-5">
        <button
          onClick={goToPrevMonth}
          className="transition-opacity hover:opacity-60"
          style={{ color: '#6C63FF' }}
        >
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path
              d="M7 1L1 6.5L7 12"
              stroke="#6C63FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2
          style={{ color: '#6C63FF', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.2px' }}
        >
          {year}년 {month + 1}월
        </h2>
        <button
          onClick={goToNextMonth}
          className="transition-opacity hover:opacity-60"
          style={{ color: '#6C63FF' }}
        >
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path
              d="M1 1L7 6.5L1 12"
              stroke="#6C63FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div
        className="grid grid-cols-7"
        style={{ borderTop: '1px solid #ECEDF6', borderBottom: '1px solid #ECEDF6' }}
      >
        {DAYS_KR.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium"
            style={{ color: '#9B99CC' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {weeks.map((week, wIdx) => (
          <div
            key={wIdx}
            className="grid flex-1 grid-cols-7"
            style={{ borderBottom: wIdx < 5 ? '1px solid #ECEDF6' : 'none' }}
          >
            {week.map((date, dIdx) => {
              const practiced = isPracticed(date)
              const todayDate = isToday(date)
              const inMonth = isCurrentMonth(date)

              return (
                <div
                  key={dIdx}
                  onClick={() => onDateClick(date)}
                  className="relative flex cursor-pointer flex-col transition-colors hover:bg-purple-50/40"
                  style={{
                    borderRight: dIdx < 6 ? '1px solid #ECEDF6' : 'none',
                    opacity: inMonth ? 1 : 0.35,
                    padding: '8px 8px',
                  }}
                >
                  {/* Date number — top right */}
                  <div className="flex justify-end">
                    {todayDate ? (
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{ backgroundColor: '#6C63FF' }}
                      >
                        <span className="text-xs font-semibold text-white">{date.getDate()}</span>
                      </div>
                    ) : (
                      <span
                        className="text-xs font-medium"
                        style={{ color: inMonth ? '#8B8EC4' : '#C0C0D8' }}
                      >
                        {date.getDate()}
                      </span>
                    )}
                  </div>

                  {/* Check icon — centered overlay */}
                  {practiced && (
                    <div className="absolute inset-x-0 bottom-0 top-[25%] flex items-center justify-center">
                      <img
                        src={IMAGES.home.calenderCheck}
                        alt="Check"
                        className="h-[60%] w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarView
