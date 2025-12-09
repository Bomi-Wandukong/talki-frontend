import React, { useEffect, useRef, useState } from "react";

export default function AnalysisResultDetail() {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleSections((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="w-screen bg-[#F7F7F8] text-[#3B3B3B]">
        {/* 전체 간격 프레임 */}
        <div className="fontLight leading-6 w-full py-20 px-[20%]">
          <span className="text-[25px] fontBold pb-3 border-b border-[#D7D6F1]">
            세부 분석 결과
          </span>

          {/* 음성 분석 결과 */}
          <div
            ref={(el) => (sectionRefs.current[0] = el)}
            data-index="0"
            className={`mt-10 w-full bg-white rounded-2xl border border-[#D7D6F1] px-8 pt-10 pb-15 transition-all duration-700 ${
              visibleSections.includes(0)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <p className="text-[20px] fontBold">
              <span className="text-[#5650FF]">음성</span> 분석 결과
            </p>

            <div className="mt-8 px-5">
              <div className="flex flex-col justify-center">
                <img
                  src="./img/voiceFeedback.png"
                  className="px-[10%] w-auto"
                />

                <div className="mt-12">
                  <p className="text-[#5650FF] text-[16px] fontBold">
                    파동 분석 결과(발화 속도, 높낮이 분석)
                  </p>

                  <p className="text-[14px] mt-6 px-8">
                    전체적으로 음성 파형의 리듬이 일정하게 유지되며, 문장 사이의
                    호흡 간격도 자연스러운 편이었어요. 발화 속도 역시 급격하게
                    흔들리는 부분 없이 비교적 안정적으로 유지되어 청자가 내용을
                    따라가기 좋은 흐름이었습니다. 특히 문장 도입부에서 톤이
                    일정하게 올라가는 패턴이 있어 전달 의도에 힘이 실리는 장점이
                    보였어요.
                    <br />
                    <br />
                    일부 구간에서 파형의 높낮이가 갑자기 높아지거나 낮아지는
                    부분이 나타났는데, 이는 순간적으로 말의 속도가 빨라지거나
                    볼륨이 작아지면서 발생한 것으로 보입니다. 발표 중 긴장하거나
                    강조하려는 순간에 나타나는 흔한 패턴이기 때문에, 톤을
                    일정하게 유지하는 연습을 더하면 안정감이 더욱 높아질 것
                    같아요. 또한 구간마다 호흡 텀이 조금 짧아지는 부분도 있어
                    청중에게는 약간 빠르게 느껴질 수 있어요. 중간중간 여유 있는
                    호흡 포인트를 넣어주면 발표 흐름이 더 부드러워질 거예요!
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-col justify-center">
                <p className="text-[#5650FF] text-[16px] fontBold">
                  반복어 분석 결과
                </p>

                <p className="text-[14px] mt-6 px-8">
                  "음…", "어…", "그…"와 같은 생각하는 순간 나오는 습관 반복어가
                  소량 포함되어 있었어요. 하지만 대화형 발표에서는 자연스럽게
                  나타나는 부분이고, 전체 발화량 대비 과도하게 많지는 않은
                  편이었습니다. 또한 반복어가 주로 문장 시작부에 집중적으로
                  등장했다는 점에서, 내용 전환을 준비하는 과정에서 나타나는
                  자연스러운 현상으로 보입니다.
                  <br />
                  <br />
                  반복어는 청자의 집중력을 흐릴 수 있기 때문에, 문장 시작 전에
                  한 템포 쉬어가거나, 생각하는 시간도 말 없이 가져가는 습관을
                  들이면 훨씬 더 깔끔한 발표가 될 거예요. 특히 "음…"과 "어…"가
                  전체 반복어의 대부분을 차지하고 있었으니, 이 두 가지 표현만
                  조금 줄여도 발표의 전문성이 크게 올라가 보여요!
                </p>

                <img
                  src="./img/voiceFeedbackGraph.png"
                  className="mt-6 w-auto px-[15%]"
                />
              </div>
            </div>
          </div>

          {/* 시선 분석 결과 */}
          <div
            ref={(el) => (sectionRefs.current[1] = el)}
            data-index="1"
            className={`mt-10 w-full bg-white rounded-2xl border border-[#D7D6F1] px-8 pt-10 pb-15 transition-all duration-700 ${
              visibleSections.includes(1)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <p className="text-[20px] fontBold">
              <span className="text-[#5650FF]">시선</span> 분석 결과
            </p>

            {/* 메인 컨테이너 */}
            <div className="mt-5 px-2 flex items-center">
              {/* 왼쪽 박스 */}
              <div className="min-w-[200px] min-h-[150px] rounded-xl bg-[#F7F7F8] flex flex-col justify-between p-6">
                <p className="text-[15px] text-gray-600 mb-3">카메라 응시율</p>
                <p className="text-[36px] fontBold text-[#5650FF] text-right">
                  72%
                </p>
              </div>

              {/* 오른쪽 설명 */}
              <p className="flex-1 text-[14px] ml-5 pl-4 border-l-2 border-[#D7D6F1]">
                카메라 응시율이 72%로 비교적 높은 편에 속해요. 전체 발표
                흐름에서 카메라를 바라보는 시간이 안정적으로 유지되어 청중과의
                눈맞춤 효과가 잘 드러난 발표였습니다. 특히 핵심 내용을 전달할 때
                카메라를 자연스럽게 응시하는 패턴이 나타나, 자신감 있는 인상을
                주는 데 도움이 되었어요. <br /> <br />
                일부 구간에서는 화면 밖으로 시선이 잠시 흔들리거나 특정 방향으로
                치우치는 모습이 보였어요. 잠깐씩 참고 자료를 확인하는 과정에서
                나타난 것으로 보이며, 큰 문제는 아니지만 시선의 일관성을 조금만
                더 유지하면 발표의 안정감이 더욱 강화될 거예요. 또한 문장 전환
                시 카메라 응시가 줄어드는 경향이 있어, 이 지점에서만 조금 더
                신경 써준다면 발표 전체가 훨씬 자연스럽고 단단해 보일 거예요.
              </p>
            </div>
          </div>

          {/* 행동 분석 결과 */}
          <div
            ref={(el) => (sectionRefs.current[2] = el)}
            data-index="2"
            className={`mt-10 w-full bg-white rounded-2xl border border-[#D7D6F1] px-8 pt-10 pb-15 transition-all duration-700 ${
              visibleSections.includes(2)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <p className="text-[20px] fontBold">
              <span className="text-[#5650FF]">행동</span> 분석 결과
            </p>

            <div className="mt-5 px-2">
              <img src="./img/myVideoEx.png" className="mx-auto" />

              <div className="mt-8">
                <p className="text-[#5650FF] text-[16px] fontBold">
                  강점 포인트
                </p>

                <div className="mt-4 text-[14px] border-2 border-[#D7D6F1] rounded-xl overflow-hidden">
                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      핵심 문장을 말할 때 억양이 안정적으로 유지되어 전달력이
                      높았던 구간
                    </div>

                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:12 ~ 0:18
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      시선을 카메라에 꾸준히 고정하며 자신감 있는 태도를 보여준
                      구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:25 ~ 0:32
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      손 제스처가 자연스럽게 내용과 결합되어 설명이 명확하게
                      들렸던 구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:37 ~ 0:45
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      속도와 톤이 일정하게 유지되어 청중이 내용에 몰입할 수
                      있었던 구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      3:11 ~ 3:54
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      중요 포인트를 강조할 때 목소리 톤 변화가 적절해 설득력이
                      높았던 구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      5:30 ~ 5:59
                    </div>
                  </div>
                </div>

                <p className="text-[14px] mt-7 px-8 mx-9 border-l-2 border-[#D7D6F1]">
                  전체 발표에서 안정적인 톤과 일관된 시선 처리, 그리고
                  자연스러운 제스처 사용이 꾸준히 나타나 긍정적인 인상을
                  주었습니다. 특히 중요한 내용을 전달할 때 목소리의 높낮이를
                  활용하거나 속도를 조절하는 부분이 효과적이어서 메시지가
                  명확하게 전달되었어요. 또한 카메라 응시 비율이 높아 청중과의
                  연결감이 잘 유지되었고, 설명할 때 손동작을 적절히 활용해
                  내용의 흐름이 부드럽게 이어졌습니다. 이러한 강점들은 발표의
                  전체적인 전문성과 설득력을 강화해주는 요소이기 때문에 앞으로도
                  유지하면 좋을 부분이에요.
                </p>
              </div>

              <div className="mt-8">
                <p className="text-[#5650FF] text-[16px] fontBold">
                  개선 포인트
                </p>

                <div className="mt-4 text-[14px] border-2 border-[#D7D6F1] rounded-xl overflow-hidden">
                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      문장 시작 부분에서 속도가 조금 빨라져 내용이 급하게
                      느껴졌던 구간
                    </div>

                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:12 ~ 0:18
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      시선이 잠시 화면 밖으로 이동해 집중도가 떨어져 보였던 구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:25 ~ 0:32
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      말을 잇는 과정에서 '음...', '어...' 등의 반복어가 나타난
                      구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      0:37 ~ 0:45
                    </div>
                  </div>

                  <div className="flex border-b border-[#D7D6F1]">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      손 제스처가 다소 크고 빈번하게 사용되어 메세지가 흐려졌던
                      구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      3:11 ~ 3:54
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-[80%] flex items-center justify-center py-3 px-4 text-center border-r border-[#D7D6F1]">
                      문장 마무리 시 톤이 약해져 전달력이 다소 떨어진 구간
                    </div>
                    <div className="w-[20%] flex items-center justify-center py-3 px-4 text-[#5678FF]">
                      5:30 ~ 5:59
                    </div>
                  </div>
                </div>

                <p className="text-[14px] mt-7 px-8 mx-9 border-l-2 border-[#D7D6F1]">
                  전반적으로 안정적으로 발표했지만, 몇몇 구간에서는 속도 변화나
                  시선 처리, 반복어 사용 등으로 인해 전달력이 조금씩 약해지는
                  모습이 관찰되었어요. 문장 시작이나 전환 시 속도가 빨라지는
                  경향이 있어, 이 부분만 조금 더 천천히 시작하면 훨씬 안정감
                  있게 들릴 거예요. 또한 설명 중 잠시 시선이 흔들리는 장면이
                  나타났는데, 카메라 중심을 기준으로 조금만 더 일관성을 유지하면
                  발표의 집중도가 높아집니다. 제스처는 자연스러운 편이지만 특정
                  구간에서는 과하게 사용되어 메시지를 방해하는 느낌을 줄 수
                  있으니, 중요한 포인트를 강조할 때만 의도적으로 사용하는 연습이
                  좋아요. 마지막으로 반복어는 청중의 몰입을 끊을 수 있기 때문에
                  문장 사이의 호흡을 조금 더 정리하면 더 효과적인 전달이
                  가능해질 거예요.
                </p>
              </div>
            </div>
          </div>

          {/* 발표 내용 분석 결과 */}
          <div
            ref={(el) => (sectionRefs.current[3] = el)}
            data-index="3"
            className={`mt-10 w-full bg-white rounded-2xl border border-[#D7D6F1] px-8 pt-10 pb-15 transition-all duration-700 ${
              visibleSections.includes(3)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            <p className="text-[20px] fontBold">
              <span className="text-[#5650FF]">발표 내용</span> 분석 결과
            </p>
            {/* 메인 컨테이너 */}
            <div className="mt-5 px-2">
              <img
                src="./img/contentFeedbackGraph.png"
                className="min-w-[200px] h-auto object-contain mx-auto"
              />
              <p className="text-[14px] mt-7 px-[8%]">
                전체적으로 질문의 핵심을 잘 파악하고 이에 맞는 방향으로 답변한
                점이 돋보였습니다. 특히 발언 초반부에서 주제의 맥락을 정확히
                짚고, 예시를 통해 내용을 구체화한 부분은 청중에게 명확한 이해를
                제공한 강점으로 보입니다. 또한 설명 과정에서 불필요한 반복 없이
                핵심 메시지를 중심으로 답변을 구성해 전체 흐름이 자연스러웠어요.
                일부 구간에서 주제와 약하게 연결되는 부가 설명이 포함되어 발언
                흐름이 잠시 느슨해지는 장면이 있었습니다. 이 내용들이 완전히
                잘못된 정보는 아니지만, 질문에서 요구한 핵심 답변과 직접적인
                관계가 약해 전달력이 조금 떨어져 보였어요. 또한 내용 전개 도중
                문장 간 연결이 조금 어색하게 느껴지는 부분이 있어 청중이 다소
                집중이 흐트러질 수 있는 여지가 있었습니다. 답변 과정에서 핵심
                메시지–근거–예시 순으로 구조화하면 논리적 완성도가 더 높아질
                거예요. 또한 주제에서 벗어나는 내용은 과감히 생략하거나, "이
                부분은 추가 정보지만…"처럼 의도를 명확히 밝혀주면 발언의
                일관성이 유지됩니다. 문장 간 전환을 조금만 더 매끄럽게
                다듬는다면 발표 전체의 흐름이 훨씬 정돈되어 보이고, 전달력 역시
                크게 향상될 것입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
