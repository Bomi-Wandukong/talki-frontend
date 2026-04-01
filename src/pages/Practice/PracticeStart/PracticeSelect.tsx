import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import PracticeLayout from '@/components/Practice/PracticeLayout'

type PracticeType = 'script' | 'impromptu'

const PRACTICES = [
  {
    id: 'script' as PracticeType,
    title: '스크립트 기반 기초 연습',
    description: '제공된 문장을 읽으며 말하기의 기본을 익힙니다.',
    bullets: ['스크립트 읽기 연습', '시선 고정 훈련'],
    duration: '약 8분',
  },
  {
    id: 'impromptu' as PracticeType,
    title: '즉흥 구성 연습',
    description: '주어진 주제로 즉석에서 말하는 연습을 합니다.',
    bullets: ['즉흥 말하기', '키워드 기반 구성', '핵심 파악 연습'],
    duration: '약 10분',
  },
]

const PracticeSelect = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PracticeType | null>(null)

  const handleNext = () => {
    if (selected === 'script') navigate('/practice/script')
    else if (selected === 'impromptu') navigate('/practice/impromptu')
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAFBFC] pt-[64px]">
      <Nav />
      <PracticeLayout
        currentStepIndex={2}
        canGoPrev={true}
        canGoNext={!!selected}
        onPrev={() => navigate('/practice/breathing')}
        onNext={handleNext}
      >
        {/* 타이틀 */}
        <div className="mb-6 flex w-full items-start justify-between">
          <div>
            <p className="text-[25px] leading-[35px]">
              <span className="fontBold">어떤 방식</span>으로 연습하시겠어요?
            </p>
            <p className="fontLight pt-3 text-[15px] text-[#5D5D5D]">
              두 가지 프로그램 중 원하는 방식을 선택해주세요.
            </p>
          </div>
          <p className="fontSB w-[13%] whitespace-nowrap rounded-lg bg-[#5650FF] py-2 text-center text-[14px] text-white">
            연습 선택
          </p>
        </div>

        {/* 선택 카드 */}
        <div className="grid h-[70%] grid-cols-2 gap-4">
          {PRACTICES.map((practice) => {
            const isActive = selected === practice.id
            return (
              <button
                key={practice.id}
                onClick={() => setSelected(practice.id)}
                className={`flex flex-col items-start rounded-2xl p-7 text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all ${
                  isActive ? 'bg-[#e8e7ff] ring-2 ring-[#5650FF]' : 'bg-white hover:ring-1 hover:ring-[#5650FF]/40'
                }`}
              >
                {/* 라디오 */}
                <span
                  className={`mb-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isActive ? 'border-[#5650FF]' : 'border-[#D0D0D0]'
                  }`}
                >
                  {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />}
                </span>

                <div className="flex h-full tall:h-[80%] w-full flex-col justify-between p-5">
                  <div>
                    <p className="fontSB mb-2 text-[20px] text-[#3B3B3B]">{practice.title}</p>
                    <p className="fontLight text-[15px] text-[#5D5D5D]">{practice.description}</p>
                  </div>

                  <ul className="flex flex-col gap-1.5 tall:gap-5">
                    {practice.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-[15px] text-[#5D5D5D]">
                        <span className="h-1 w-1 rounded-full bg-[#ABABAB]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <div className="mb-3 h-[1px] w-full bg-[#D9D9D9]" />
                    <p className="text-[14px] text-[#ABABAB]">예상 소요 시간 &nbsp;{practice.duration}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-center text-[13px] text-[#716FA4]">
          하고 싶지 않은 연습은 건너뛰기 가능해요! 원하는 연습만 해도록 해요.
        </p>
      </PracticeLayout>
    </div>
  )
}

export default PracticeSelect
