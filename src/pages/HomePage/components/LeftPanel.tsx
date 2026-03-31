import { LuChevronRight, LuChevronLeft } from 'react-icons/lu'
import { IMAGES } from '@/utils/images'

interface LeftPanelProps {
  streak: number
  today: Date
  practicedDates: Date[]
  rightView: 'calendar' | 'dashboard'
  onArrowClick: () => void
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const LeftPanel = ({ streak, today, practicedDates, rightView, onArrowClick }: LeftPanelProps) => {
  // Build current week Mon–Sun
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const isPracticed = (date: Date) => practicedDates.some((pd) => isSameDay(pd, date))

  return (
    <div className="flex h-full flex-col py-10 lg:justify-center lg:py-0">
      <div className="mb-[4vh] lg:mb-[6vh]">
        <h1 className="mb-1 text-lg font-bold text-[#5650FF] lg:text-[1.6rem]">
          <span className="text-[#FF9500]">김톡희</span>님, 반가워요!
        </h1>
        <p className="text-xs text-[#ACA9FE] lg:text-base">
          작은 시작이라도 괜찮아요. 토키가 함께 할게요!
        </p>
      </div>

      {/* Streak Section */}
      <div className="mb-[4vh] lg:mb-[5vh]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#716FA4] lg:text-base">
            연속 연습 <span className="text-lg text-[#5650FF]">{streak}</span>일
          </span>
          <button
            onClick={onArrowClick}
            className="text-gray-400 transition-colors hover:text-[#6C63FF]"
          >
            {rightView === 'calendar' ? (
              <LuChevronLeft className="h-5 w-5" />
            ) : (
              <LuChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Week circles card */}
        <div
          className="rounded-xl px-4 py-3 lg:rounded-3xl lg:py-[3.5vh] min-[1500px]:px-10"
          style={{
            border: '1px solid #F0F0F5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex justify-between">
            {currentWeek.map((date, idx) => {
              const practiced = isPracticed(date)
              const dayLetter = DAYS_KR[date.getDay()]

              return (
                <div key={idx} className="flex flex-col items-center">
                  {practiced ? (
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full min-[1200px]:h-8 min-[1200px]:w-8 xl:h-9 xl:w-9"
                      style={{ backgroundColor: '#6C63FF' }}
                    >
                      <svg
                        className="h-4 w-4 min-[1200px]:h-5 min-[1200px]:w-5 xl:h-6 xl:w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ strokeWidth: 3.5 }}
                          stroke="white"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5FA] text-[10px] font-medium text-[#3B3B3B] min-[1200px]:h-8 min-[1200px]:w-8 min-[1200px]:text-xs xl:h-9 xl:w-9 xl:text-sm">
                      {dayLetter}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Today's Recommendation */}
      <div className="mb-[4vh] lg:mb-[5vh]">
        <h2 className="mb-2 text-sm font-semibold text-[#716FA4] lg:text-base">
          오늘의 <span className="text-[#5650FF]">추천 연습</span>
        </h2>
        <div
          className="group flex cursor-pointer items-center justify-between rounded-xl border px-5 py-[2.5vh] transition-all hover:shadow-md lg:rounded-3xl"
          style={{ border: '1px solid #F0F0F5', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div>
            <p className="mb-1 text-xs text-[#AFAFC0]">
              시선처리가 어색한 김톡희님을 위한 오늘의 연습!
            </p>
            <p className="text-base font-semibold text-[#3B3B3B]">시선 연습</p>
          </div>
          <LuChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-gray-400" />
        </div>
      </div>

      {/* Recent Report */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-[#716FA4] lg:text-base">
          최근 <span className="text-[#5650FF]">실전 리포트 결과</span>
        </h2>
        <div
          className="group flex cursor-pointer items-center justify-between rounded-xl border px-5 py-[2.5vh] transition-all hover:shadow-md lg:rounded-3xl"
          style={{ border: '1px solid #F0F0F5', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs text-[#AFAFC0]">2025.10.05&nbsp;&nbsp;23:12</p>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-base font-bold text-[#3B3B3B]">25점</span>
              <p className="truncate text-sm">사회불안완화를 위한 인지행동치료 서비스</p>
            </div>
          </div>
          <LuChevronRight className="ml-2 h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-gray-400" />
        </div>
      </div>

      {/* 실전 / 연습 Cards — mobile only (PC notice) */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:hidden">
        {/* 실전 Card (mobile) */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, #A9A4D8 0%, #8E88C4 100%)',
            minHeight: '140px',
          }}
        >
          <h3 className="mb-1 text-lg font-bold text-white">실전</h3>
          <p className="text-xs leading-relaxed text-white/80">
            실전 기능은 PC 환경에서
            <br />
            진행해주세요.
          </p>
          <div className="absolute bottom-5 right-5">
            <img
              src={IMAGES.home.real}
              alt="실전"
              className="h-12 w-12 object-contain opacity-40"
            />
          </div>
        </div>

        {/* 연습 Card (mobile) */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white p-5"
          style={{ minHeight: '140px', border: '1px solid #F0F0F5' }}
        >
          <h3 className="mb-1 text-lg font-bold" style={{ color: '#1A1A2E' }}>
            연습
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: '#9BA1B0' }}>
            연습 기능은 PC 환경에서
            <br />
            진행해주세요.
          </p>
          <div className="absolute bottom-5 right-5">
            <img
              src={IMAGES.home.practice}
              alt="연습"
              className="h-12 w-12 object-contain opacity-40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftPanel
