import { useEffect } from 'react'
import { LuX, LuChevronRight } from 'react-icons/lu'
import PracticeButtons from './PracticeButtons'

interface DateDetailModalProps {
  date: Date
  onClose: () => void
  isMobile?: boolean
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

const REPORT_DATA = [
  {
    id: 1,
    date: '2025.10.05',
    time: '23:12',
    score: 25,
    title: '사회불안완화를 위한 인지행동치료 서비스에 대한 발표',
  },
  {
    id: 2,
    date: '2025.10.05',
    time: '18:36',
    score: 15,
    title: '프론트엔드 취업 면접에 대한 연습',
  },
  {
    id: 3,
    date: '2025.10.05',
    time: '15:58',
    score: 10,
    title: '사회불안완화를 위한 인지행동치료 서비스에 대한 발표',
  },
]

const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const day = DAYS_KR[date.getDay()]
  return `${y}.${m}.${d} (${day})`
}

/* ─── Mobile Card ─── */
const MobileModal = ({ date, onClose }: { date: Date; onClose: () => void }) => {
  return (
    <div
      className="flex w-full flex-col overflow-hidden bg-white"
      style={{
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      }}
    >
      {/* Header: large date + X */}
      <div className="flex items-start justify-between px-5 pb-4 pt-6">
        <span
          className="text-gray-900"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {formatDate(date)}
        </span>
        <button
          onClick={onClose}
          className="mt-1 text-gray-400 transition-colors hover:text-gray-600"
        >
          <LuX className="h-5 w-5" />
        </button>
      </div>

      {/* 실전 section */}
      <div className="px-5 pb-2">
        <span className="text-sm font-semibold text-gray-800">실전</span>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid #F0F0F6',
          marginLeft: 20,
          marginRight: 20,
        }}
      />

      {/* Report list */}
      <div className="px-5">
        {REPORT_DATA.map((item, idx) => (
          <div
            key={item.id}
            className="flex cursor-pointer items-center gap-3 py-4"
            style={idx !== REPORT_DATA.length - 1 ? { borderBottom: '1px solid #F0F0F6' } : {}}
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs text-[#AFAFC0]">
                {item.date}&nbsp;&nbsp;{item.time}
              </p>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm font-bold text-gray-900">{item.score}점</span>
                <span className="truncate text-sm text-[#6B7280]">{item.title}</span>
              </div>
            </div>
            <LuChevronRight className="h-4 w-4 shrink-0 text-[#D0D0DC]" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid #F0F0F6',
          margin: '4px 20px',
        }}
      />

      {/* 연습 section — label above buttons */}
      <div className="px-5 pb-6 pt-4">
        <span className="mb-3 block text-sm font-semibold text-gray-800">연습</span>
        <PracticeButtons />
      </div>
    </div>
  )
}

/* ─── Desktop Card ─── */
const DesktopModal = ({ date, onClose }: { date: Date; onClose: () => void }) => {
  return (
    <div
      className="relative flex flex-col overflow-hidden bg-white text-[#3B3B3B]"
      style={{
        borderRadius: '24px',
        width: 'min(90vw, 720px)',
        maxHeight: '90vh',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold">실전</span>
        </div>
        <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
          <LuX className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid #F0F0F6',
          margin: '4px 0',
        }}
      />

      {/* Report list */}
      <div className="overflow-y-auto px-8">
        {REPORT_DATA.map((item, idx) => (
          <div
            key={item.id}
            className="-mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-4 transition-colors hover:bg-gray-50"
            style={idx !== REPORT_DATA.length - 1 ? { borderBottom: '1px solid #F0F0F6' } : {}}
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs text-[#AFAFC0]">
                {item.date}&nbsp;&nbsp;{item.time}
              </p>
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-base font-bold">{item.score}점</span>
                <span className="text-[#D9D9D9]">|</span>
                <span className="truncate text-sm text-[#6B7280]">{item.title}</span>
              </div>
            </div>
            <LuChevronRight className="h-4 w-4 shrink-0 text-[#D0D0DC]" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid #F0F0F6',
          margin: '4px 0',
        }}
      />

      {/* Practice Section — side-by-side on desktop */}
      <div className="flex items-start gap-5 px-8 pb-6 pt-4">
        <div className="shrink-0 pr-12 pt-2">
          <span className="text-base font-bold">연습</span>
        </div>
        <div className="flex-1">
          <PracticeButtons />
        </div>
      </div>
    </div>
  )
}

const DateDetailModal = ({ date, onClose, isMobile }: DateDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (isMobile) {
    return <MobileModal date={date} onClose={onClose} />
  }
  return <DesktopModal date={date} onClose={onClose} />
}

export default DateDetailModal
