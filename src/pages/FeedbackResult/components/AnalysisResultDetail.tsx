import { useEffect, useRef, useState } from 'react'
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

  // 초(second) → "m:ss" 포맷 변환
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const mapTypeToDesc = (type: string) => {
    switch (type) {
      case 'pose_rigid':
        return '자세가 경직된 구간입니다.'
      case 'pose_unstable':
        return '자세가 불안정한 구간입니다.'
      case 'gaze_unstable':
        return '시선이 불안정한 구간입니다.'
      case 'speech_slow':
        return '말 속도가 느려진 구간입니다.'
      case 'speech_fast':
        return '말 속도가 빨라진 구간입니다.'
      case 'silence':
        return '침묵이 발생한 구간입니다.'
      default:
        return '주의가 필요한 구간입니다.'
    }
  }

  // llmFeedback 텍스트
  const speechAnalysis = data?.llmFeedback?.['음성 분석 결과'] ?? '음성 분석 진행 중...'
  const repeatWordAnalysis = data?.llmFeedback?.['반복어 분석 결과'] ?? '반복어 분석 진행 중...'
  const gazeAnalysis = data?.llmFeedback?.['시선 분석 결과'] ?? '시선 분석 진행 중...'
  const postureAnalysis = data?.llmFeedback?.['자세/제스처 분석 결과'] ?? '자세 분석 진행 중...'
  const topicAnalysis = data?.llmFeedback?.['주제 적합성 분석 결과'] ?? '주제 분석 진행 중...'
  const totalAnalysis = data?.llmFeedback?.['전체 분석 결과'] ?? '전체 분석 진행 중...'

  // rawData 수치
  const wpm = data?.rawData?.speech?.wpm ?? 0
  const fillerCount = data?.rawData?.speech?.fillers_count ?? 0
  const silenceRatio = data?.rawData?.speech?.silence_ratio ?? 0
  const poseWarningRatio = Math.round((data?.poseWarningRatio ?? 0) * 100)
  const gazeRate = Math.round((data?.gazeFrontRatio ?? 0) * 100)

  // realTimeResultDTO → VideoPlayer용 포맷 (start/end 초 → "m:ss")
  const improvements = (data?.realTimeResultDTOList ?? []).map((item: any) => ({
    time: formatTime(item.start ?? 0),
    endTime: formatTime(item.end ?? 0),
    description: mapTypeToDesc(item.type),
  }))

  const actionPoints = {
    strengths: [{ time: '0:00', description: '자연스러운 제스처와 목소리 톤이 돋보였습니다.' }],
    improvements:
      improvements.length > 0
        ? improvements
        : [{ time: '0:00', description: '분석된 약점 구간이 없습니다.' }],
    questions: (data?.emergencyQuestions ?? []).map((q: any) => ({
      time: q.timestamp || '0:00',
      question: q.question,
      answer: q.answer,
    })),
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8] text-[#3B3B3B]">
      <div className="fontLight mx-auto w-full max-w-4xl px-6 pb-28 pt-20 leading-6">
        <div className="border-b border-[#D7D6F1] pb-3">
          <span className="fontBold text-[20px]">세부 분석 결과</span>
        </div>

        {/* 음성 분석 */}
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
            <p className="fontBold text-[14px] text-[#5650FF]">발화 속도 결과</p>

            <div className="mt-2">
              <div className="mb-1 flex justify-end text-[11px] text-gray-400">
                적정 범위 (120-160 WPM)
              </div>

              {/* 트랙 */}
              <div className="relative h-4 w-full rounded-full bg-gray-200">
                {/* 적정 범위 초록 구간: 120~160 / 200 */}
                <div
                  className="absolute h-full bg-[#A8D8A8]"
                  style={{ left: '40%', width: '20%' }}
                />
                {/* 현재 WPM 파란 바 */}
                <div
                  className="absolute h-full rounded-l-full bg-[#5650FF]"
                  style={{ width: `${Math.min((wpm / 200) * 100, 100)}%` }}
                />
              </div>

              {/* 마커 (바 아래) */}
              <div className="relative mt-2 h-8">
                <div
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${Math.min((wpm / 200) * 100, 100)}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="h-0 w-0 border-x-4 border-b-[6px] border-x-transparent border-b-[#3B3B3B]" />
                  <span className="mt-1 text-[11px] font-bold text-[#3B3B3B]">{wpm} WPM</span>
                </div>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-[12px] text-[#3B3B3B]">{speechAnalysis}</p>

            <div className="mt-10">
              <p className="fontBold text-[14px] text-[#5650FF]">반복어 분석 결과</p>
              <p className="mt-5 whitespace-pre-line text-[12px] text-[#3B3B3B]">
                {repeatWordAnalysis}
              </p>
            </div>
          </div>
        </FeedbackSection>

        {/* 시선 분석 */}
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
            <p className="mt-4 whitespace-pre-line text-[12px]">{gazeAnalysis}</p>
          </div>
        </FeedbackSection>

        {/* 행동 분석 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="행동"
          isVisible={visibleSections.includes(2)}
          dataIndex={2}
          innerRef={(el) => {
            sectionRefs.current[2] = el
          }}
        >
          <div className="mt-4 px-2">
            <div className="mb-4 flex justify-between rounded-xl bg-[#F7F7F8] p-5">
              <p className="text-[13px] text-gray-600">자세 불안정 비율</p>
              <p className="fontBold text-right text-[26px] text-[#5650FF]">{poseWarningRatio}%</p>
            </div>
            <p className="mb-4 whitespace-pre-line text-[12px]">{postureAnalysis}</p>
            <VideoPlayerWithPoints videoSrc={data?.videoUrl || ''} paramPoints={actionPoints} />
          </div>
        </FeedbackSection>

        {/* 주제 적합성 분석 */}
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
            <p className="mt-6 flex-1 whitespace-pre-line pl-5 pr-10 text-[12px]">
              {topicAnalysis}
            </p>
            <img
              src={IMAGES.graph}
              className="mx-auto h-auto min-w-[240px] object-contain"
              alt="내용 피드백 그래프"
            />
          </div>
        </FeedbackSection>

        {/* 전체 분석 결과 */}
        <FeedbackSection
          title="분석 결과"
          highlightText="전체"
          isVisible={visibleSections.includes(4)}
          dataIndex={4}
          innerRef={(el) => {
            sectionRefs.current[4] = el
          }}
        >
          <p className="mt-6 whitespace-pre-line px-5 text-[12px]">{totalAnalysis}</p>
        </FeedbackSection>
      </div>
    </div>
  )
}
