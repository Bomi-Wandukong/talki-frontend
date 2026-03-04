export interface PracticeCardProps {
  title: React.ReactNode
  description: React.ReactNode
  rightContent: React.ReactNode
}

export default function PracticeCard({ title, description, rightContent }: PracticeCardProps) {
  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl shadow-xl md:min-h-[550px] md:flex-row md:rounded-[40px]`}
      style={{
        boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Right Content Area (Image/Graphic) - Top on mobile, Right on desktop */}
      <div className="relative order-1 flex w-full items-center justify-center overflow-hidden p-6 md:order-2 md:w-[55%] md:p-0 md:pr-8">
        {rightContent}
      </div>

      {/* Left Content Area (Text) - Bottom on mobile, Left on desktop */}
      <div className="order-2 flex w-full flex-col justify-between px-8 py-10 md:order-1 md:w-[45%] md:px-16 md:py-24">
        <div>
          <h3 className="whitespace-pre-line text-xl font-bold leading-[1.3] text-gray-900 md:text-3xl">
            {title}
          </h3>
          <p className="mt-6 text-base font-light leading-relaxed text-gray-500 md:mt-8 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
