import { useEffect, useRef, useState } from 'react'
import RepeatWordChart from './RepeatWordChart'
import FeedbackSection from './FeedbackSection'
import VideoPlayerWithPoints from './VideoPlayerWithPoints'

export default function AnalysisResultDetail() {
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleSections((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  // 데이터 정의 (실제로는 props나 API로 받아올 수 있음)
  const actionPoints = {
    strengths: [
      {
        time: '0:02',
        description: '핵심 문장을 말할 때 억양이 안정적으로 유지되어 전달력이 높았던 구간',
      },
      {
        time: '0:08',
        description: '시선을 카메라에 꾸준히 고정하며 자신감 있는 태도를 보여준 구간',
      },
      {
        time: '0:20',
        description: '손 제스처가 자연스럽게 내용과 결합되어 설명이 명확하게 들렸던 구간',
      },
      {
        time: '0:31',
        description: '속도와 톤이 일정하게 유지되어 청중이 내용에 몰입할 수 있었던 구간',
      },
      {
        time: '0:55',
        description: '중요 포인트를 강조할 때 목소리 톤 변화가 적절해 설득력이 높았던 구간',
      },
    ],
    improvements: [
      {
        time: '0:02',
        description: '문장 시작 부분에서 속도가 조금 빨라져 내용이 급하게 느껴졌던 구간',
      },
      {
        time: '0:08',
        description: '시선이 잠시 화면 밖으로 이동해 집중도가 떨어져 보였던 구간',
      },
      {
        time: '0:20',
        description: "말을 잇는 과정에서 '음...', '어...' 등의 반복어가 나타난 구간",
      },
      {
        time: '0:31',
        description: '손 제스처가 다소 크고 빈번하게 사용되어 메세지가 흐려졌던 구간',
      },
      {
        time: '0:55',
        description: '문장 마무리 시 톤이 약해져 전달력이 다소 떨어진 구간',
      },
    ],
    questions: [
      {
        time: '0:02',
        question: '사회불안장애가 정확히 무엇인가요?',
        answer: '사회적인 상황에서 생기는 불안 증상들을 사회불안장애라고 합니다.',
      },
    ],
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8] text-[#3B3B3B]">
      <div className="fontLight mx-auto w-full max-w-5xl px-6 py-20 leading-6">
        <div className="border-b border-[#D7D6F1] pb-3">
          <span className="fontBold text-[25px]">세부 분석 결과</span>
        </div>

        {/* 음성 분석 결과 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="음성"
          isVisible={visibleSections.includes(0)}
          dataIndex={0}
          innerRef={(el) => {
            sectionRefs.current[0] = el
          }}
        >
          <div className="mt-8 px-5">
            <div className="flex flex-col justify-center">
              <p className="fontBold text-[16px] text-[#5650FF]">발화 속도 결과</p>
              <p className="mt-6 text-[14px]">
                발화 속도가 약간 느린 편이에요. 발표 상황에 따라 템포를 조금 더 살리면 전달력이 더
                좋아질 수 있어요.
              </p>
            </div>

            <div className="mt-12 flex flex-col justify-center">
              <p className="fontBold text-[16px] text-[#5650FF]">반복어 분석 결과</p>
              <p className="mt-6 text-[14px]">
                "음…", "어…", "그…"와 같은 생각하는 순간 나오는 습관 반복어가 소량 포함되어
                있었어요. 하지만 대화형 발표에서는 자연스럽게 나타나는 부분이고, 전체 발화량 대비
                과도하게 많지는 않은 편이었습니다.
                <br />
                <br />
                특히 "음…"과 "어…"가 전체 반복어의 대부분을 차지하고 있었으니, 이 두 가지 표현만
                조금 줄여도 발표의 전문성이 크게 올라가 보여요!
              </p>
              <RepeatWordChart />
            </div>
          </div>
        </FeedbackSection>

        {/* 시선 분석 결과 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="시선"
          isVisible={visibleSections.includes(1)}
          dataIndex={1}
          innerRef={(el) => {
            sectionRefs.current[1] = el
          }}
        >
          <div className="mt-5 px-2">
            <div className="flex justify-between rounded-xl bg-[#F7F7F8] p-6">
              <p className="text-[15px] text-gray-600">카메라 응시율</p>
              <p className="fontBold text-right text-[32px] text-[#5650FF]">72%</p>
            </div>

            <p className="mt-5 text-[14px]">
              카메라를 비교적 잘 바라보면서 말하고 있어요. 지금 정도만 유지해도 충분히 안정적인
              인상이에요.
            </p>
          </div>
        </FeedbackSection>

        {/* 행동 분석 결과 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="행동"
          isVisible={visibleSections.includes(2)}
          dataIndex={2}
          innerRef={(el) => {
            sectionRefs.current[2] = el
          }}
        >
          <VideoPlayerWithPoints videoSrc="./video/TimeStampTest.mp4" paramPoints={actionPoints} />
        </FeedbackSection>

        {/* 발표 내용 분석 결과 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="발표 내용"
          isVisible={visibleSections.includes(3)}
          dataIndex={3}
          innerRef={(el) => {
            sectionRefs.current[3] = el
          }}
        >
          <div className="mt-5 flex flex-col gap-6 px-2 md:flex-row">
            <p className="mt-7 flex-1 pl-5 pr-10 text-[14px]">
              발표 내용이 전반적으로 주제에 잘 맞게 구성되어 있고, 핵심에서 크게 벗어나는 부분 없이
              흐름이 잘 유지되고 있어요.
              <br />
              <br />
              전체적인 전개는 이해하기 쉽지만, 일부 구간에서 문단 사이 연결이 조금 끊기는 느낌이
              있어 다듬으면 더 좋아질 것 같아요.
              <br />
              <br />
              내용상 큰 오류나 어색한 부분은 없어서 전반적으로 신뢰감 있게 들립니다.
            </p>

            <img
              src="/img/contentFeedbackGraph.png"
              className="mx-auto h-auto min-w-[280px] object-contain"
              alt="내용 피드백 그래프"
            />
          </div>
        </FeedbackSection>
      </div>
    </div>
  )
}
