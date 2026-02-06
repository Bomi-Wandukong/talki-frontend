import React from 'react'
import WorryCard from './WorryCard'

const worryData = [
  {
    id: 1,
    text: '발표 실력이 나아지고 있는지 확인하고 싶어요.',
    highlightText: '나아지고 있는지',
    rotation: -14,
    image: '/img/avatar1.png', // Assuming these images might exist or standard placeholders
  },
  {
    id: 2,
    text: '발표만 하면 항상 머리가 새하얘져요.',
    highlightText: '머리가 새하얘져요.',
    rotation: 12,
    image: '/img/avatar2.png',
  },
  {
    id: 3,
    text: '면접할 때 말 속도 조절이 어려워요',
    highlightText: '말 속도 조절',
    rotation: -12,
    image: '/img/avatar3.png',
  },
  {
    id: 4,
    text: '혼자 연습하니까 제가 잘하고 있는지 모르겠어요',
    highlightText: '혼자 연습',
    rotation: 16,
    image: '/img/avatar4.png',
  },
  {
    id: 5,
    text: '발표 실력이 나아지고 있는지 확인하고 싶어요.',
    highlightText: '있는지',
    rotation: -10,
    image: '/img/avatar5.png',
  },
  {
    id: 6,
    text: '발표만 하면 항상 머리가 새하얘져요.',
    highlightText: '머리가 새하얘져요.',
    rotation: 14,
    image: '/img/avatar6.png',
  },
]

export default function WorrySection() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#5650FF] pb-0 pt-20">
      {/* Header Text */}
      <div className="z-10 mb-16 text-center text-white">
        <p className="mb-7 text-lg font-medium opacity-90 md:text-xl">
          발표, 면접...내가 지금 잘 하고 있나?
        </p>
        <h2 className="text-2xl font-bold md:text-3xl">
          말하는 순간이 두렵다면,{' '}
          <span className="bg-white px-2 py-1 text-[#5650FF]">TALKI가 함께해요.</span>
        </h2>
      </div>

      {/* Infinite Card Slider */}
      <div className="relative mb-20 w-full">
        {/* Left Fade Overlay */}
        <div className="pointer-events-auto absolute left-0 top-0 z-30 h-full w-[15%] bg-gradient-to-r from-[#5650FF] to-transparent"></div>
        {/* Right Fade Overlay */}
        <div className="pointer-events-auto absolute right-0 top-0 z-30 h-full w-[15%] bg-gradient-to-l from-[#5650FF] to-transparent"></div>

        <div className="animate-scroll flex w-max items-center gap-12 pb-12 pt-12">
          {/* First set of cards */}
          {worryData.map((item) => (
            <div
              key={`original-${item.id}`}
              className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4"
            >
              <WorryCard
                text={item.text}
                highlightText={item.highlightText}
                rotation={item.rotation}
                // image={item.image}
              />
            </div>
          ))}
          {/* Duplicate set for loop */}
          {worryData.map((item) => (
            <div
              key={`duplicate-${item.id}`}
              className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4"
            >
              <WorryCard
                text={item.text}
                highlightText={item.highlightText}
                rotation={item.rotation}
                // image={item.image}
              />
            </div>
          ))}
          {/* Triplicate set for smoother loop on wide screens */}
          {worryData.map((item) => (
            <div
              key={`triplicate-${item.id}`}
              className="z-10 transition-all duration-300 hover:z-20 hover:-translate-y-4"
            >
              <WorryCard
                text={item.text}
                highlightText={item.highlightText}
                rotation={item.rotation}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Features */}
      <div className="z-10 grid w-full max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        <FeatureBox
          icon={
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          }
          title="실제같은 상황에서 말해보기"
          desc="본인에게 맞는 디테일을 직접 설정해서 진짜처럼 함께 연습하고 개선점을 찾아봐요."
        />
        <FeatureBox
          icon={
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="리포트 및 피드백 생성"
          desc="어떤 점이 부족했고 좋았는지가 적힌 리포트를 확인하고 지속적으로 나아지는 것을 확인해요."
        />
        <FeatureBox
          icon={
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          }
          title="맞춤형 연습 시스템"
          desc="불안을 직면하고 함께 완화하는 방법을 연습하면서 전체적인 실력을 향상시켜요."
        />
      </div>

      {/* Tagline with Rounded Bottom */}
      <div className="mt-16 w-full bg-white">
        <div className="w-full bg-[#5650FF] pb-16 pt-8">
          <p className="text-center text-lg text-white md:text-xl">
            실전 같은 환경, AI 피드백으로{' '}
            <span className="font-bold">지금 말하기 실력을 성장시키세요</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* Move 1/3 since we have 3 sets */
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

function FeatureBox({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white/10 p-6 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
      <div className="shrink-0 rounded-lg bg-white/20 p-2">{icon}</div>
      <div>
        <h3 className="mb-1 text-lg font-bold">{title}</h3>
        <p className="text-sm font-light leading-relaxed opacity-80">{desc}</p>
      </div>
    </div>
  )
}
