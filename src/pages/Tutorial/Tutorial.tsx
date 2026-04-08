import { useState, useEffect } from 'react'
import Nav from '@/components/Nav/Nav'
import { IMAGES } from '@/utils/images'
import { useNavigate } from 'react-router-dom'

const Tutorial = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false) 
  const [isNoShowChecked, setIsNoShowChecked] = useState(false)

  useEffect(() => {
    const hideTutorial = localStorage.getItem('hideTutorial')

    if (hideTutorial === 'true') {
      // 로컬에 값이 있으면 바로 카테고리 페이지로 이동
      navigate('/actual/category', { replace: true })
    } else {
      // 로컬에 값이 없으면 튜토리얼 페이지 표시
      setIsVisible(true)
    }
  }, [navigate])

  const handleStart = () => {
    // '다시 보지 않기'가 체크되어 있다면 로컬 스토리지에 저장
    if (isNoShowChecked) {
      localStorage.setItem('hideTutorial', 'true')
    }

    navigate('/actual/category')
  }
  if (!isVisible) return null

  return (
    <div className="min-h-screen bg-[#F7F7F8] pb-20 pt-[100px] w-full">
      <Nav />

      <div className="mx-auto flex w-[75%] flex-col items-center pt-20">
        <div className="mb-10 w-full">
          <h1 className="text-[28px] fontBold text-[#3B3B3B]">
            보다 <span className="text-[#5650FF]">원활한 실전 진행</span>을 위해!
          </h1>
          <p className="mt-2 text-[#716FA4]">
            토키의 실전에서는 다음과 같은 단계를 바탕으로 진행됩니다.
          </p>
        </div>

        <div className="w-full">
          {/* 01번 카드 */}
          <div className="relative flex h-36 w-full items-center justify-end overflow-hidden rounded-2xl bg-white px-20 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
            <div className="absolute left-0 h-full">
              <img src={IMAGES.bg1} className="h-full w-full object-contain" alt="background" />
            </div>
            <div className="relative flex flex-col items-end">
              <span className="fontBold absolute -left-5 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                01
              </span>
              <div className="relative z-10 text-right">
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
                  먼저, 진행하고자 하는 실전이 무엇인지
                  <br />
                  <span className="text-[#3B3B3B]">카테고리로 정리해봐요.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 01 설명 카드 */}
          <div className="mt-7 flex gap-5">
            <div className="flex h-36 w-[50%] items-center rounded-2xl bg-[#D7D6F1]">
              <img src={IMAGES.mic} className="mt-[3%] h-[90%] w-[37%] mx-3" alt="mic" />
              <div className="w-[60%] p-5">
                <p className="fontBold text-[18px]">실시간 피드백</p>
                <p className="fontRegular text-sm text-[#4B4B4B]">
                  말 속도부터 자세까지. 결과로 받기 전에
                  <br />
                  진행 중에 실시간으로 수정할 수 있도록
                  <br />
                  현재의 문제점을 바로 알려줍니다.
                </p>
              </div>
            </div>
            <div className="flex h-36 w-[50%] items-center justify-center rounded-2xl bg-[#D7D6F1]">
              <img
                src={IMAGES.speechBubble}
                className="w-[35%] self-start px-2"
                alt="speech bubble"
              />
              <div className="w-[60%] p-5">
                <p className="fontBold text-[18px]">돌발 상황 발생</p>
                <p className="fontRegular text-sm text-[#4B4B4B]">
                  기침 소리, 웃음 소리, 돌발 질문과 같이
                  <br />
                  발표/면접 상황에서 금방 당황해질 수 있는
                  <br />
                  돌발 상황들을 경험해봅시다.
                </p>
              </div>
            </div>
          </div>

          {/* 02, 03번 카드 */}
          <div className="mt-7 flex w-full gap-5">
            <div className="relative flex h-36 w-[35%] items-center overflow-hidden rounded-2xl bg-white px-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
              <div className="absolute right-0 h-full w-[60%]">
                <img src={IMAGES.bg2} className="h-full w-full object-cover" alt="background 2" />
              </div>
              <div className="relative z-10 flex flex-col items-start">
                <span className="fontBold absolute -left-4 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
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
                  제대로 된 검사를 위해
                  <br />
                  시작 전 준비를 점검해봐요.
                </p>
              </div>
            </div>

            <div className="relative flex h-36 w-[65%] items-center overflow-hidden rounded-2xl bg-white px-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.05)]">
              <div className="absolute right-0 h-full w-[60%]">
                <img src={IMAGES.bg3} className="h-full w-full object-cover" alt="background 3" />
              </div>
              <div className="relative z-10 flex flex-col items-start">
                <span className="fontBold absolute -left-4 -top-4 z-0 select-none text-[26px] text-[#FFB356]">
                  03
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
                  설정했었던 카테고리에 맞춘 실전 환경에서
                  <br />
                  연습하고자 했던 발표/면접 실전을 진행합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 영역 */}
          <div className="mt-14 flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-[#716FA4]">
              <input
                type="checkbox"
                id="no-show"
                className="h-4 w-4 cursor-pointer"
                checked={isNoShowChecked}
                onChange={(e) => setIsNoShowChecked(e.target.checked)}
              />
              <label htmlFor="no-show" className="fontRegular cursor-pointer select-none text-sm">
                다시 보지 않기
              </label>
            </div>
            <button
              onClick={handleStart}
              className="text-md fontMedium rounded-xl bg-[#5650FF] px-20 py-4 text-white transition-all hover:bg-[#4540cc] active:scale-95"
            >
              시작하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
