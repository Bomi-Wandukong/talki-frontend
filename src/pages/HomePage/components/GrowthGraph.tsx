import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const weekData = [
  { name: '월', score: 0 },
  { name: '화', score: 28 },
  { name: '수', score: 22 },
  { name: '목', score: 40 },
  { name: '금', score: 60 },
  { name: '토', score: 48 },
  { name: '일', score: 40 },
]

const monthData = [
  { name: '1주', score: 12 },
  { name: '2주', score: 35 },
  { name: '3주', score: 55 },
  { name: '4주', score: 42 },
]

const GrowthGraph = () => {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')
  const data = activeTab === 'week' ? weekData : monthData

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="mb-[1.5vh] flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('week')}
          className="rounded-full px-4 py-1 text-xs font-semibold transition-all"
          style={
            activeTab === 'week'
              ? { backgroundColor: '#FF9500', color: 'white' }
              : { color: '#FF9500', backgroundColor: 'transparent' }
          }
        >
          Week
        </button>
        <button
          onClick={() => setActiveTab('month')}
          className="px-4 py-1 text-xs font-semibold transition-all"
          style={
            activeTab === 'month'
              ? { backgroundColor: '#FF9500', color: 'white', borderRadius: '999px' }
              : { color: '#FF9500', backgroundColor: 'transparent' }
          }
        >
          Month
        </button>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="min-h-0 flex-1" style={{ minHeight: 180 }}>
        {dimensions.width > 0 && dimensions.height > 0 && (
          <LineChart
            width={dimensions.width}
            height={dimensions.height}
            data={data}
            margin={{ top: 10, right: 24, bottom: 0, left: -4 }}
          >
            <CartesianGrid strokeDasharray="4 6" stroke="#E8E8F0" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AFAFC0', fontSize: 10 }}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AFAFC0', fontSize: 10 }}
              width={36}
            />
            <Tooltip
              contentStyle={{
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                fontSize: '10px',
                color: '#FF9500',
              }}
              itemStyle={{ color: '#FF9500' }}
              cursor={false}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FF9500"
              strokeWidth={2}
              dot={{ fill: '#FF9500', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#FF9500', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </div>
    </div>
  )
}

export default GrowthGraph
