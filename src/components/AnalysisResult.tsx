import React from "react";
import CircleProgress from "./CircleProgress";

export default function AnalysisResult() {
  const progressData = [
    { label: "발화 속도", score: 50 },
    { label: "시선 집중도", score: 62 },
    { label: "주제 적절성", score: 75 },
    { label: "제스처 안정성", score: 62 },
  ];

  return (
    <>
      <div className="w-screen bg-[#F7F7F8]">
        {/* 전체 간격 프레임 */}
        <div className="fontBold w-full pt-20 px-[20%]">
          <p className="max-w-43 text-[25px] text-[#3B3B3B] pb-3 mb-13 border-b-2 border-[#D7D6F1] animate-[fadeIn_0.5s_ease-out]">
            분석 결과
          </p>

          {/* 분석 총점 그래프 */}
          <div className="fontRegular flex justify-between items-center animate-[fadeIn_0.7s_ease-out_0.2s_both]">
            <div className="text-[15px] mr-[13%]">
              <p>분석 총점</p>
              <p>
                <span className="fontBold text-[30px] text-[#5650FF]">
                  51.25
                </span>{" "}
                / 100
              </p>
            </div>

            <div className="flex flex-1 justify-between">
              {progressData.map((item) => (
                <CircleProgress
                  key={item.label}
                  label={item.label}
                  score={item.score}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 피드백 내용 */}
        <div className="mt-17 w-full h-full bg-white rounded-t-[80px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-[slideUp_0.8s_ease-out_0.6s_both]">
          {/* 전체 간격 프레임 */}
          <div className="fontLight leading-6 w-full pt-17 px-[20%] text-[#3B3B3B] ">
            {/* 좋은 점 */}
            <div className="mb-12 pb-12 border-b-2 border-[#D7D6F1]">
              <p className="fontBold text-[20px]">
                <span className="text-[#5650FF]">김독희</span> 님은 이런 점이
                좋았어요!
              </p>
              <p className="px-4 mt-8 text-[15px]">
                전반적으로 안정된 발화 속도와 시선 집중이 유지되어 발표의 흐름이
                자연스러웠어요. 제스처 또한 과하거나 불안정하지 않아 자신감 있는
                인상을 주었습니다. 불안보다는 비교적 낮은 편으로, 긴장보다는
                집중에 가까운 상태로 보입니다. 전반적으로 차분하고 균형 잡힌
                발표 태도를 보여준 결과입니다.
              </p>
            </div>

            {/* 성장 포인트 */}
            <div className="mb-12 pb-12 border-b-2 border-[#D7D6F1]">
              <p className="fontBold text-[20px]">
                조금 더{" "}
                <span className="text-[#5650FF]">성장할 수 있는 포인트</span>
                예요!
              </p>
              <p className="px-4 mt-8 text-[15px]">
                발화 속도가 일정하지 않아 일부분 구간에서 말이 다소 급하게
                느껴졌어요. 전달 내용은 명확했지만 속도 변화가 크면 청중이
                따라가기 어려울 수 있어, 템포를 조금 더 안정적으로 유지하면 좋을
                것 같아요.
                <br /> <br />
                시선이 한쪽으로 치우치면서 청중과의 교감이 약해 보이는 부분도
                있었어요. 발표 공간 전체를 고르게 바라보는 연습만 더하면
                집중도와 몰입도가 훨씬 올라갈 거예요.
                <br /> <br /> 제스처는 자연스러웠지만 감정 표현이 조금 절제된
                느낌이 있어 메시지의 힘이 약해질 때가 있었어요. 억양이나 표정에
                감정을 조금만 더 실어주면 전달력이 크게 향상될 거예요.
                <br />
                <br />
                전반적으로 안정적인 흐름을 잘 유지하고 있고, 표현력과 시선
                처리가 보완된다면 훨씬 완성도 높은 발표가 될 가능성이 충분해
                보여요.
              </p>
            </div>

            {/* 연습 추천 */}
            <div className="mb-12 pb-12">
              <p className="fontBold text-[20px]">
                이런 <span className="text-[#5650FF]">연습</span>을 해보는 건
                어떨까요?
              </p>
              <div className="px-4 mt-8">
                <p className="text-[15px]">
                  대본 읽기 연습에서 속도를 일정하게 유지하는 연습을 해보세요.
                  추가적으로 다양한 표정을 연습해보며 경직된 표정을 완화해보는
                  것도 좋은 방법이에요.
                </p>

                <div className="flex mt-10 gap-10">
                  <div className="px-6 flex items-center w-[50%] h-40 bg-white border-2 border-[#FFA956]/[.56] rounded-3xl hover:shadow-lg transition-all duration-300 hover:scale-103 cursor-pointer">
                    <div className="basis-[30%] flex justify-end">
                      <img
                        src="./img/speakPractice.png"
                        className="h-30 w-30 object-contain"
                      />
                    </div>

                    <div className="basis-[70%] pl-[6%]">
                      <p className="text-[20px] font-bold">말하기 연습</p>
                      <p className="text-[13px] mt-3">
                        제공된 대본을 따라 읽으며 말의 속도, 목소리 떨림, 발음을
                        <br />
                        점검하고 자연스럽고 안정적인 말하기를 연습합니다.
                      </p>
                    </div>
                  </div>

                  <div className="px-6 flex items-center w-[50%] h-40 bg-[#FFA956] border-2 border-[#FFA956]/[.56] rounded-3xl hover:shadow-lg transition-all duration-300 hover:scale-103 cursor-pointer">
                    <div className="basis-[30%] flex justify-end">
                      <img
                        src="./img/speakPractice.png"
                        className="h-30 w-30 object-contain"
                      />
                    </div>

                    <div className="basis-[70%] pl-[6%] text-white">
                      <p className="text-[20px] font-bold">
                        시선처리 / 표정 훈련
                      </p>
                      <p className="text-[13px] mt-3">
                        사람들과 눈을 마주치는 상황을 시뮬레이션하며 <br />
                        자연스러운 시선 이동과 표정 표현을 연습합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
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
    </>
  );
}
