import { useEffect, useRef, useState } from 'react'
import RepeatWordChart from './RepeatWordChart'
import FeedbackSection from './FeedbackSection'
import VideoPlayerWithPoints from './VideoPlayerWithPoints'
import { IMAGES } from '@/utils/images'

export default function AnalysisResultDetail({ data }: { data?: any }) {
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

  // API에서 받은 realTimeResultDTOList를 VideoPlayer용 포맷으로 변환
  const mapTypeToDesc = (type: string) => {
    switch (type) {
      case 'pose_rigid': return '자제가 경직된 구간입니다.'
      case 'pose_unstable': return '자세가 불안정한 구간입니다.'
      case 'gaze_unstable': return '시선이 불안정한 구간입니다.'
      case 'speech_slow': return '말 속도가 느려진 구간입니다.'
      case 'speech_fast': return '말 속도가 빨라진 구간입니다.'
      case 'silence': return '침묵이 발생한 구간입니다.'
      default: return '주의가 필요한 구간입니다.'
    }
  }

  const improvements = (data?.realTimeResultDTOList ?? []).map((item: any) => ({
    time: item.timestamp,
    description: mapTypeToDesc(item.type)
  }))

  const actionPoints = {
    strengths: [
      {
        time: '0:02',
        description: '자연스러운 제스처와 목소리 톤이 돋보였습니다.',
      }
    ],
    improvements: improvements.length > 0 ? improvements : [
      {
        time: '0:00',
        description: '분석된 약점 구간이 없습니다.',
      }
    ],
    questions: (data?.emergencyQuestions ?? []).map((q: any) => ({
      time: q.timestamp || '0:00',
      question: q.question,
      answer: q.answer
    })),
  }

  const speechAnalysis = data?.speechAnalysis ?? '음성 분석 진행 중...'
  const repeatWordAnalysis = data?.repeatWordAnalysis ?? '반복어 분석 진행 중...'
  const gazeRate = data?.cameraGazeRate ?? 0
  const presentationContentFeedback = data?.presentationContentFeedback ?? '내용 분석 진행 중...'

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8] text-[#3B3B3B]">
      <div className="fontLight mx-auto w-full max-w-4xl px-6 pb-28 pt-20 leading-6">
        <div className="border-b border-[#D7D6F1] pb-3">
          <span className="fontBold text-[20px]">세부 분석 결과</span>
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
          <div className="mt-6 px-5">
            <div className="flex flex-col justify-center">
              <p className="fontBold text-[14px] text-[#5650FF]">발화 속도 결과</p>
              <p className="mt-5 text-[12px] whitespace-pre-line">
                {speechAnalysis}
              </p>
            </div>

            <div className="mt-10 flex flex-col justify-center">
              <p className="fontBold text-[14px] text-[#5650FF]">반복어 분석 결과</p>
              <p className="mt-5 text-[12px] whitespace-pre-line">
                {repeatWordAnalysis}
              </p>
              <RepeatWordChart data={data?.repeatWords} />
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
          <div className="mt-4 px-2">
            <div className="flex justify-between rounded-xl bg-[#F7F7F8] p-5">
              <p className="text-[13px] text-gray-600">카메라 응시율</p>
              <p className="fontBold text-right text-[26px] text-[#5650FF]">{gazeRate}%</p>
            </div>

            <p className="mt-4 text-[12px]">
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
          <VideoPlayerWithPoints videoSrc={data?.videoUrl || "./video/TimeStampTest.mp4"} paramPoints={actionPoints} />
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
          <div className="mt-11 flex flex-col gap-5 px-2 md:flex-row">
            <p className="mt-6 flex-1 pl-5 pr-10 text-[12px] whitespace-pre-line">
              {presentationContentFeedback}
            </p>

            <img
              src={IMAGES.graph}
              className="mx-auto h-auto min-w-[240px] object-contain"
              alt="내용 피드백 그래프"
            />
          </div>
        </FeedbackSection>
      </div>
    </div>
  )
}
