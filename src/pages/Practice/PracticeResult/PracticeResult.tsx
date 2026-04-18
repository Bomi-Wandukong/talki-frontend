import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'
import { IMAGES } from '@/utils/images'

const PracticeResult = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full bg-[#FAFBFC] pt-[130px]">
      <Nav />

      <div className="flex h-full flex-col items-center justify-center gap-3 px-16 pb-16">
        <img src={IMAGES.home.calenderCheck} alt="완료" className="w-[88px]" />

        <p className="fontBold mt-2 text-[24px] text-[#3B3B3B]">연습을 완료했습니다.</p>
        <p className="fontRegular text-[14px] text-[#9B9B9B]">오늘 하루도 한 걸음 나아갔습니다!</p>
        <div className="mt-6 w-full max-w-[780px] items-start gap-8">
          <div className="flex">
            {/* 오늘 진행 내용 */}
            <div className="flex flex-1 flex-col gap-3 self-end">
              <p className="fontSB text-[14px] text-[#3B3B3B]">오늘 진행 내용</p>
              <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-start gap-6">
                  <span className="fontRegular shrink-0 text-[13px] text-[#9B9B9B]">
                    선택한 훈련
                  </span>
                  <ul className="flex flex-col gap-2">
                    <li className="fontRegular flex items-center gap-2 text-[14px] text-[#3B3B3B]">
                      <span className="text-[#5650FF]">•</span> 스크립트 읽기 연습
                    </li>
                    <li className="fontRegular flex items-center gap-2 text-[14px] text-[#3B3B3B]">
                      <span className="text-[#5650FF]">•</span> 시선 고정 훈련
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 코치 버블 */}
            <div className="flex flex-1 flex-col items-end gap-4">
              <div className="relative w-full pl-5 pt-4">
                <img
                  src={IMAGES.logo}
                  alt="토끼 로고"
                  className="absolute -top-1 left-8 z-10 w-[56px] object-contain drop-shadow-sm"
                />
                <div className="w-full rounded-[24px] rounded-br-[0px] border border-[#5650FF] bg-white px-7 py-5 pl-14 shadow-sm">
                  <p className="fontBold mb-3 text-[14px] text-[#5650FF]">기억하세요.</p>
                  <ul className="flex flex-col gap-2">
                    <li className="fontRegular flex items-start gap-2 text-[13px] text-[#4E4AC7]">
                      <span className="mt-[3px] shrink-0">•</span>불안은 실제 위험이 아니라
                      예측입니다.
                    </li>
                    <li className="fontRegular flex items-start gap-2 text-[13px] text-[#4E4AC7]">
                      <span className="mt-[3px] shrink-0">•</span>실제로 경험하면 예상과 다른 경우가
                      많습니다.
                    </li>
                    <li className="fontRegular flex items-start gap-2 text-[13px] text-[#4E4AC7]">
                      <span className="mt-[3px] shrink-0">•</span>작은 경험들이 모여 자신감이
                      됩니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* 버튼 */}
          <div className="w-full mt-6 flex justify-end">
          <button
            onClick={() => navigate('/home')}
            className="fontSB rounded-xl bg-[#5650FF] px-10 py-3 text-[14px] text-white transition-colors hover:bg-[#4440DD]"
          >
            메인으로 돌아가기
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeResult
