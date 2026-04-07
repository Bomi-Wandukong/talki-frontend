import Nav from '@/components/Nav/Nav'
import { IMAGES } from '@/utils/images'
import { useNavigate } from 'react-router-dom'

const PracticeTutorial = () => {
  const navigate = useNavigate()
  const handleStart = () => {
    navigate('/practice/start')
  }
  return (
    <div className="min-h-screen bg-[#F7F7F8] pb-20 pt-[100px] w-full">
      <Nav />

      <div className="mx-auto flex w-[75%] flex-col items-center pt-20">
        {/* 타이틀 */}
        <div className="flex w-full items-center">
          <div className="mb-10 w-[75%]">
            <h1 className="fontBold text-[28px] text-[#3B3B3B]">
              <span className="text-[#5650FF]">발표/면접</span> 불안 훈련
            </h1>
            <p className="mt-2 text-[#716FA4]">인지행동치료(CBT) 기반 연습 프로그램</p>
          </div>
          <div className="w-[25%] text-center">
            <p className="fontSB rounded-xl bg-white p-4 text-[16px] text-[#716FA4]">
              예상 소요 시간 : 약 15분~20분
            </p>
          </div>
        </div>

        {/* 01, 02번 카드 */}
        <div className="mb-7 flex w-full gap-5">
          <div className="relative flex h-44 w-[50%] items-center overflow-hidden rounded-2xl bg-white px-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
            <div className="absolute right-0 h-full w-[40%]">
              <img src={IMAGES.PT1} className="h-full w-full object-cover" alt="background 2" />
            </div>
            <div className="relative z-10 flex flex-col items-start pl-5">
              <span className="fontBold absolute -left-0.5 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                01
              </span>
              <p
                className="fontMedium z-10 text-[18px] leading-[1.4] text-[#3B3B3B]"
                style={{
                  textShadow: `
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff
    `,
                }}
              >
                연습 전, <span className="fontBold text-[#5650FF]">자동사고</span>를 인식합니다.
              </p>
              <div className="text-[14px] text-[#716FA4] mt-2">
                <p>
                  <span className="fontBold">자동사고(Automatic Thoughts)</span>란?
                </p>
                <p>
                  어떤 상황에서 의식적인 노력 없이
                  <br />
                  순간적으로 떠오르는 부정적이고 습관적인 생각
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex h-44 w-[50%] items-center overflow-hidden rounded-2xl bg-white px-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
            <div className="absolute right-0 h-full mr-6">
              <img src={IMAGES.PT2} className="h-full w-full object-cover" alt="background 3" />
            </div>
            <div className="relative z-10 flex flex-col items-start pl-5">
              <span className="fontBold absolute -left-0.5 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                02
              </span>
              <p
                className="fontMedium z-10 text-[18px] leading-[1.4] text-[#3B3B3B]"
                style={{
                  textShadow: `
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff
    `,
                }}
              >
                <span className="fontBold text-[#5650FF]">짧은 호흡</span>으로 긴장을 완화합니다.
              </p>
              <div className="text-[14px] text-[#716FA4] mt-2">
                <p>
                  <span className="fontBold">지금 숨을 천천히 들이쉬고, 길게 내쉬어 보세요.</span>
                </p>
                <p>
                  짧은 호흡 조절만으로도 몸의 긴장이 완화되고
                  <br />
                  집중력이 높아집니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* 03번 카드 */}
          <div className="relative flex h-44 w-full items-center overflow-hidden rounded-2xl bg-white px-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
            <div className="relative flex flex-col">
              <span className="fontBold absolute -left-5 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                03
              </span>
              <div className="relative z-10">
                <p
                  className="fontMedium text-[18px] leading-[1.4]"
                  style={{
                    textShadow: `
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff
    `,
                  }}
                >
                  <span className="fontBold text-[#5650FF]">말하기 훈련</span>을 통해 다양한 상황을
                  경험합니다.
                </p>
              </div>
            </div>
            <div className="ml-6 text-[14px] text-[#716FA4]">
              <p className="fontSB">
                두 가지의 프로그램(스크립트 기반 기초 연습, 즉흥 구성 훈련)이 진행됩니다.
              </p>
              <p className="fontLight">
                각 연습을 통해 말하기의 기본과 즉석에서 말하는 연습을 합니다. <br />
                세부 내용은 이후 프로그램 선택 시 설명을 확인하세요.
              </p>
            </div>
            <div className="absolute right-0 h-full w-[30%]">
              <img src={IMAGES.PT3} className="h-full object-cover" alt="background 3" />
            </div>
          </div>

          {/* 04번 카드 */}
          <div className="relative mt-7 flex h-44 w-full items-center overflow-hidden rounded-2xl bg-white px-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
            <div className="relative flex flex-col">
              <span className="fontBold absolute -left-5 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                04
              </span>
              <div className="relative z-10">
                <p
                  className="fontMedium text-[18px] leading-[1.4]"
                  style={{
                    textShadow: `
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff
    `,
                  }}
                >
                  결과를 확인한 후,
                  <br />
                  <span className="fontBold text-[#5650FF]">균형 잡힌 생각</span>을 찾도록 돕습니다.
                </p>
              </div>
            </div>
            <div className="ml-8 text-[#716FA4]">
              <p className="fontSB">진행했던 연습들을 정리하며 마무리 지어요.</p>
              <p className="fontLight">
                심리적으로 마무리를 지으며 결과를 정리하고, 개선이 필요한 사고 패턴을 함께
                살펴봅니다.
              </p>
            </div>
            <div className="absolute right-0 h-full w-[30%]">
              <img src={IMAGES.PT4} className="h-full object-cover" alt="background 3" />
            </div>
          </div>

          {/* 하단 영역 */}
          <div className="mt-7 flex flex-col w-full items-center justify-center">
            <p className="mb-7 text-[14px] text-[#727272]">본 연습은 사회불안 치료에서 사용되는 인지행동치료(CBT) 프로토콜을 기반으로 설계되었으며, 자동사고 인식·인지 재구조화·행동 노출 등의 단계적 훈련을 통해 불안을 다루는 연습을 제공합니다.</p>
            <button
              onClick={handleStart}
              className="text-md fontMedium rounded-xl bg-[#5650FF] px-20 py-4 text-white transition-all hover:bg-[#4540cc] active:scale-95"
            >
              <span className="mr-2"> ▶ </span>  연습 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeTutorial
