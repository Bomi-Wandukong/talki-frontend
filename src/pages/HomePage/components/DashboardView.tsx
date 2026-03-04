import GrowthGraph from './GrowthGraph'
import { IMAGES } from '@/utils/images'

const DashboardView = () => {
  return (
    <div className="flex flex-col gap-14 lg:h-full">
      {/* 실전 / 연습 Cards — desktop only */}
      <div className="hidden grid-cols-2 gap-10 lg:grid">
        {/* 실전 Card */}
        <div
          className="relative cursor-pointer overflow-hidden rounded-3xl px-7 py-5 transition-all hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #7C72F5 0%, #5E55E6 100%)',
            minHeight: '220px',
          }}
        >
          <div className="relative z-10 max-w-[55%]">
            <h3 className="mb-2 text-2xl font-bold text-white">실전</h3>
            <p className="leading-relaxed text-white/70">
              실제 같은 분위기에서
              <br />
              실전에 임해봐요
            </p>
          </div>
          <div className="absolute bottom-5 right-7">
            <img
              src={IMAGES.home.real}
              alt="실전"
              className="pointer-events-none h-[100px] w-[100px] object-contain min-[1200px]:h-32 min-[1200px]:w-32 min-[1400px]:h-40 min-[1400px]:w-40"
            />
          </div>
        </div>

        {/* 연습 Card */}
        <div
          className="relative cursor-pointer overflow-hidden rounded-3xl bg-white px-7 py-5 transition-all hover:shadow-xl"
          style={{ minHeight: '220px' }}
        >
          <div className="relative z-10 max-w-[55%]">
            <h3 className="mb-2 text-2xl font-bold" style={{ color: '#1A1A2E' }}>
              연습
            </h3>
            <p className="leading-relaxed" style={{ color: '#9BA1B0' }}>
              부족했던 부분들을
              <br />
              연습으로 채워봐요
            </p>
          </div>
          <div className="absolute bottom-5 right-7">
            <img
              src={IMAGES.home.practice}
              alt="연습"
              className="pointer-events-none h-[100px] w-[100px] object-contain min-[1200px]:h-32 min-[1200px]:w-32 min-[1400px]:h-40 min-[1400px]:w-40"
            />
          </div>
        </div>
      </div>

      {/* Growth Graph Group */}
      <div className="flex flex-col gap-5 lg:flex-1">
        <h2 className="text-base font-semibold text-[#716FA4]">내 성장 그래프</h2>
        <div className="flex min-h-[240px] flex-col rounded-3xl bg-white p-6 shadow-sm lg:flex-1">
          <div className="flex min-h-0 flex-1 flex-col">
            <GrowthGraph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
