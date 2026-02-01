import CircleProgress from '@/components/CircleProgress/CircleProgress'
import LinearProgressBar from '@/components/LinearProgressBar/LinearProgressBar'

export default function AnalysisResult() {
  const progressData = [
    { label: '발화 속도', score: 20 },
    { label: '시선 집중도', score: 62 },
    { label: '주제 적절성', score: 75 },
    { label: '제스처 안정성', score: 62 },
  ]

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8]">
      {/* 상단 분석 영역 */}
      <div className="fontBold mx-auto w-full max-w-5xl px-6 pt-20">
        <p className="max-w-43 mb-13 animate-[fadeIn_0.5s_ease-out] border-b-2 border-[#D7D6F1] pb-3 text-[25px] text-[#3B3B3B]">
          분석 결과
        </p>

        {/* 분석 총점 */}
        <div className="fontRegular flex animate-[fadeIn_0.7s_ease-out_0.2s_both] flex-col items-center justify-between gap-10 md:flex-row md:gap-0">
          <div className="text-center text-[15px] md:mr-[13%] md:text-left">
            <p>분석 총점</p>
            <p>
              <span className="fontBold text-[30px] text-[#5650FF]">51.25</span> / 100
            </p>
          </div>

          <div className="flex w-full flex-1 justify-between gap-4 md:w-auto">
            {progressData.map((item) => (
              <CircleProgress key={item.label} label={item.label} score={item.score} />
            ))}
          </div>
        </div>

        <div className="mt-15">
          <LinearProgressBar label="돌발 질문 점수" score={51.25} maxScore={100} />
        </div>
      </div>

      {/* 피드백 내용 */}
      <div className="mt-17 w-full animate-[slideUp_0.8s_ease-out_0.6s_both] rounded-t-[80px] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="pt-17 fontLight mx-auto w-full max-w-5xl px-6 leading-6 text-[#3B3B3B]">
          {/* 좋은 점 */}
          <div className="mb-12 border-b-2 border-[#D7D6F1] pb-12">
            <p className="fontBold text-[20px]">
              <span className="text-[#5650FF]">김독희</span> 님은 이런 점이 좋았어요!
            </p>
            <p className="mt-8 px-4 text-[15px]">
              전반적으로 안정된 발화 속도와 시선 집중이 유지되어 발표의 흐름이 자연스러웠어요.
              제스처 또한 과하거나 불안정하지 않아 자신감 있는 인상을 주었습니다.
            </p>
          </div>

          {/* 성장 포인트 */}
          <div className="mb-12 border-b-2 border-[#D7D6F1] pb-12">
            <p className="fontBold text-[20px]">
              조금 더 <span className="text-[#5650FF]">성장할 수 있는 포인트</span>
              예요!
            </p>
            <p className="mt-8 px-4 text-[15px]">
              발화 속도가 일정하지 않아 일부 구간에서 말이 다소 급하게 느껴져, 템포를 조금 더
              안정적으로 유지하면 좋을 것 같아요.
              <br />
              시선이 한쪽으로 치우치는 부분이 있어 발표 공간 전체를 고르게 바라보는 연습만 더하면
              집중도와 몰입도가 훨씬 올라갈 거예요.
              <br />
              <br />
              전반적으로는 안정적인 흐름을 잘 유지하고 있고, 표현력과 시선 처리만 보완된다면 훨씬
              완성도 높은 발표가 될 가능성이 충분해 보여요.
            </p>
          </div>

          {/* 연습 추천 */}
          <div className="mb-12 pb-12">
            <p className="fontBold text-[20px]">
              이런 <span className="text-[#5650FF]">연습</span>을 해보는 건 어떨까요?
            </p>

            <div className="mt-8 px-4">
              <div className="mt-10 flex flex-col gap-10 md:flex-row">
                <div className="hover:scale-103 flex h-40 w-full cursor-pointer items-center rounded-3xl border-2 border-[#FFA956]/[.56] bg-white px-6 transition-all duration-300 hover:shadow-lg md:w-[50%]">
                  <div className="flex basis-[30%] justify-end">
                    <img src="/img/speakPractice.png" className="h-30 w-30 object-contain" />
                  </div>

                  <div className="basis-[70%] pl-[6%]">
                    <p className="text-[20px] font-bold">말하기 연습</p>
                    <p className="mt-3 text-[13px]">
                      대본을 따라 읽으며 안정적인 말하기를 연습합니다.
                    </p>
                  </div>
                </div>

                <div className="hover:scale-103 flex h-40 w-full cursor-pointer items-center rounded-3xl border-2 border-[#FFA956]/[.56] bg-[#FFA956] px-6 transition-all duration-300 hover:shadow-lg md:w-[50%]">
                  <div className="flex basis-[30%] justify-end">
                    <img src="./img/speakPractice.png" className="h-30 w-30 object-contain" />
                  </div>

                  <div className="basis-[70%] pl-[6%] text-white">
                    <p className="text-[20px] font-bold">시선 · 표정 훈련</p>
                    <p className="mt-3 text-[13px]">
                      자연스러운 시선 이동과 표정 표현을 연습합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>
    </div>
  )
}
