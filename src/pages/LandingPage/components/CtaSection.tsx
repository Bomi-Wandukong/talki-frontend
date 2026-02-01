import { useEffect, useRef, useState } from "react";

export default function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5650FF]/10 rounded-full blur-[120px] transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />

      <div className="relative z-10 text-center w-full max-w-[510px]">
        <h2
          className={`text-3xl md:text-5xl font-bold text-[#5650FF] mb-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translateY-0" : "opacity-0 translate-y-10"
          }`}>
          지금 토키를 시작해보세요.
        </h2>

        <button
          className={`group relative flex items-center justify-between bg-[#5650FF] text-white w-full py-5 px-10 rounded-2xl text-xl font-semibold shadow-[0_20px_40px_rgba(86,80,255,0.3)] hover:shadow-[0_25px_50px_rgba(86,80,255,0.4)] transition-all duration-500 hover:-translate-y-1 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: "500ms" }}>
          <span>시작하기</span>
          <svg
            className="w-16 h-6 overflow-visible"
            viewBox="0 0 64 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <defs>
              <mask id="arrow-mask">
                <g className="group-hover:translate-x-1.5 transition-transform duration-500">
                  <path
                    d="M0 12H60M60 12L52 4M60 12L52 20"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </mask>
              <linearGradient
                id="flow-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Base Arrow (Faded) */}
            <g className="group-hover:translate-x-1.5 transition-transform duration-500">
              <path
                d="M0 12H60M60 12L52 4M60 12L52 20"
                stroke="white"
                strokeWidth="2.5"
                strokeOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            {/* Animated Flow Light */}
            <g
              mask="url(#arrow-mask)"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <rect
                x="-80"
                y="0"
                width="80"
                height="24"
                fill="url(#flow-gradient)"
                className="animate-[arrow-flow_2s_infinite_linear]"
              />
            </g>
          </svg>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>

      <style>{`
        @keyframes arrow-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(160px); }
        }
      `}</style>

      {/* Floating particles for extra "feel" */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#5650FF]/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
