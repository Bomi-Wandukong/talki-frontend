export interface PracticeCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  rightContent: React.ReactNode;
  top: string;
  zIndex: string;
  marginTop?: string;
  marginBottom?: string;
}

export default function PracticeCard({
  title,
  description,
  rightContent,
  top,
  zIndex,
  marginTop,
  marginBottom = "mb-[100px]",
}: PracticeCardProps) {
  return (
    <div
      className={`bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px] ${marginBottom}`}
      style={{
        marginTop: marginTop,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
      }}>
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
          {title}
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed font-light">
          {description}
        </p>
      </div>
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {rightContent}
      </div>
    </div>
  );
}
