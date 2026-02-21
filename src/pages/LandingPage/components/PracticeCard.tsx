export interface PracticeCardProps {
  title: React.ReactNode
  description: React.ReactNode
  rightContent: React.ReactNode
}

export default function PracticeCard({ title, description, rightContent }: PracticeCardProps) {
  return (
    <div
      className={`flex min-h-[550px] w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:flex-row`}
      style={{
        boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Left Content Area (2/5) */}
      <div className="flex w-full flex-col justify-between px-16 py-16 md:w-[45%] md:py-24">
        <h3 className="whitespace-pre-line text-2xl font-bold leading-[1.3] text-gray-900 md:text-3xl">
          {title}
        </h3>
        <p className="mt-8 text-lg font-light leading-relaxed text-gray-500 md:text-lg">
          {description}
        </p>
      </div>

      {/* Right Content Area (3/5) */}
      <div className="relative flex w-full items-center justify-center overflow-hidden md:w-[55%] md:pr-8">
        {rightContent}
      </div>
    </div>
  )
}
