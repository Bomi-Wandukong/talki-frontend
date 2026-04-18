import CircleProgress from '@/components/CircleProgress/CircleProgress'
import LinearProgressBar from '@/components/LinearProgressBar/LinearProgressBar'
import { IMAGES } from '@/utils/images'

export default function AnalysisResult({ data }: { data?: any }) {
  const progressData = [
    { label: '발화 속도', score: data?.scores?.speechRate ?? 0 },
    { label: '시선 집중도', score: data?.scores?.gazeFocus ?? 0 },
    { label: '주제 적절성', score: data?.scores?.topicRelevance ?? 0 },
    { label: '제스처 안정성', score: data?.scores?.gestureStability ?? 0 },
  ]

  const totalScore = data?.totalScore ?? 0
  const goodPoints = data?.goodPoints ?? '분석 결과를 불러오는 중입니다...'
  const growthPoints = data?.growthPoints ?? '분석 결과를 불러오는 중입니다...'
  const emergencyScore = data?.emergencyQuestionScore ?? 0

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8]">
      {/* 상단 분석 영역 */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16">
        <p className="mb-11 max-w-2xl animate-[fadeIn_0.5s_ease-out] border-b-2 border-[#D7D6F1] pb-3 text-[20px] font-bold text-[#3B3B3B]">
          분석 결과
        </p>

        {/* 분석 총점 */}
        <div className="flex animate-[fadeIn_0.7s_ease-out_0.2s_both] flex-col items-center justify-between gap-8 md:flex-row md:gap-0">
          <div className="text-center text-[13px] md:mr-[13%] md:text-left">
            <p>분석 총점</p>
            <p>
              <span className="fontBold text-[24px] text-[#5650FF]">{totalScore}</span> / 100
            </p>
          </div>

          <div className="flex w-full flex-1 justify-between gap-4 md:w-auto">
            {progressData.map((item) => (
              <CircleProgress key={item.label} label={item.label} score={item.score} />
            ))}
          </div>
        </div>

        <div className="mt-11">
          <LinearProgressBar label="돌발 질문 점수" score={emergencyScore} maxScore={100} />
        </div>
      </div>

      {/* 피드백 내용 */}
      <div className="mt-12 w-full animate-[slideUp_0.8s_ease-out_0.6s_both] rounded-t-[60px] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-12 leading-6 text-[#3B3B3B]">
          {/* 좋은 점 */}
          <div className="mb-10 border-b-2 border-[#D7D6F1] pb-10">
            <p className="fontBold text-[17px]">
              <span className="text-[#5650FF]">{localStorage.getItem('userName') || '회원'}</span> 님은 이런 점이 좋았어요!
            </p>
            <p className="mt-6 px-4 text-[13px] whitespace-pre-line">
              {goodPoints}
            </p>
          </div>

          {/* 성장 포인트 */}
          <div className="mb-10 border-b-2 border-[#D7D6F1] pb-10">
            <p className="fontBold text-[17px]">
              조금 더 <span className="text-[#5650FF]">성장할 수 있는 포인트</span>
              예요!
            </p>
            <p className="mt-6 px-4 text-[13px] whitespace-pre-line">
              {growthPoints}
            </p>
          </div>

          {/* 연습 추천 */}
          <div className="mb-10 pb-10">
            <p className="fontBold text-[17px]">
              이런 <span className="text-[#5650FF]">연습</span>을 해보는 건 어떨까요?
            </p>

            <div className="mt-6 px-4">
              <div className="mt-8 flex flex-col gap-8 md:flex-row">
                <div className="hover:scale-103 flex h-32 w-full cursor-pointer items-center rounded-3xl border-2 border-[#FFA956]/[.56] bg-white px-6 transition-all duration-300 hover:shadow-lg md:w-[50%]">
                  <div className="flex basis-[30%] justify-end">
                    <img src={IMAGES.speakPractice} className="h-24 w-24 object-contain" />
                  </div>

                  <div className="basis-[70%] pl-[6%]">
                    <p className="text-[17px] font-bold">말하기 연습</p>
                    <p className="mt-2 text-[11px]">
                      대본을 따라 읽으며 안정적인 말하기를 연습합니다.
                    </p>
                  </div>
                </div>

                <div className="hover:scale-103 flex h-32 w-full cursor-pointer items-center rounded-3xl border-2 border-[#FFA956]/[.56] bg-[#FFA956] px-6 transition-all duration-300 hover:shadow-lg md:w-[50%]">
                  <div className="flex basis-[30%] justify-end">
                    <img src={IMAGES.speakPractice} className="h-24 w-24 object-contain" />
                  </div>

                  <div className="basis-[70%] pl-[6%] text-white">
                    <p className="text-[17px] font-bold">시선 · 표정 훈련</p>
                    <p className="mt-2 text-[11px]">
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
