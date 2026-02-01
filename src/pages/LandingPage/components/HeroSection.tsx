import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#ACA9FE] to-[#5650FF]">
      {/* Background Wave */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <svg
          className="h-full w-full min-w-[1000px]"
          viewBox="0 0 1000 320"
          preserveAspectRatio="none"
        >
          <g className="animate-[wave_15s_linear_infinite]">
            <path
              className="origin-bottom animate-[undulate_8s_ease-in-out_infinite_alternate]"
              fill="#5650FF"
              fillOpacity="0.5"
              d="M0,160 C300,50 700,270 1000,160 C1300,50 1700,270 2000,160 C2300,50 2700,270 3000,160 V320 H0 Z"
            ></path>
          </g>
          <g className="animate-[wave_20s_linear_infinite]">
            <path
              className="origin-bottom animate-[undulate_10s_ease-in-out_infinite_alternate-reverse]"
              fill="#5650FF"
              fillOpacity="0.7"
              d="M0,160 C350,280 650,40 1000,160 C1350,280 1650,40 2000,160 C2350,280 2650,40 3000,160 V320 H0 Z"
            ></path>
          </g>
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col items-center justify-center gap-10 px-8 md:px-40 lg:flex-row">
        {/* Left Section: Text */}
        <div className="flex animate-[fadeIn_1s_ease-out] flex-col items-start text-white lg:w-[45%]">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/img/whiteLogo.png"
              alt="TALKI Logo"
              className="w-40 object-contain lg:w-[250px]"
            />
          </div>

          <h2 className="mb-6 text-[20px] font-bold leading-tight md:text-[24px]">
            불안한 순간을 함께 연습하는 서비스
          </h2>

          <p className="text-[15px] font-light leading-relaxed text-white/90 md:text-[16px]">
            사회불안이 있더라도, 발표와 면접이 두렵지 않도록.
            <br />
            인지행동치료 기반의 훈련으로 불안을 완화할 수 있도록 도와드려요.
            <br />
            혼자서는 어렵던 연습, 이제는 <span className="font-bold">토키TALKI</span>와 함께해요.
          </p>
        </div>

        {/* Right Section: Illustration & Button */}
        <div className="mt-0 flex animate-[slideUp_1s_ease-out_0.3s_both] flex-col items-center lg:w-[60%] lg:items-end">
          {/* Illustration */}
          <div className="relative mb-8 w-full max-w-[1000px]">
            <img
              src="/img/main1.png"
              alt="Illustration"
              className="animate-floating h-auto w-full object-contain"
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/guideline')}
            className="group flex w-full max-w-[400px] items-center justify-between rounded-2xl bg-white px-8 py-3.5 text-[18px] font-bold text-[#5650FF] shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] lg:mr-20"
          >
            <span>토키 체험해보기</span>
            <svg
              className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-0 flex w-full animate-bounce flex-col items-center text-white">
        <span className="mb-2 text-sm font-light">Scroll Down</span>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      <style>{`
        @keyframes wave {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-1000px);
          }
        }
        @keyframes undulate {
          0% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.1);
          }
          100% {
            transform: scaleY(0.95);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
