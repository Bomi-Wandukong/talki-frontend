import React, { useState, useEffect } from 'react'
import AnalysisResult from './components/AnalysisResult'
import AnalysisResultDetail from './components/AnalysisResultDetail'
import FeedbackBottomBar from './components/FeedbackBottomBar'
import Nav from '@/components/Nav/Nav'
import { downloadFullPDF, downloadBasicPDF } from '../../utils/pdfDownload'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/api/fetchClient'

export default function FeedbackResult() {
  const [showDetail, setShowDetail] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  const presentationId = location.state?.presentationId || sessionStorage.getItem('presentationId')

  useEffect(() => {
    if (presentationId) {
      sessionStorage.setItem('presentationId', presentationId)
    }
  }, [presentationId])

  useEffect(() => {
    if (!presentationId) {
      console.error('No presentationId provided')
      setLoading(false)
      navigate('/home')
      return
    }

    let isCancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const poll = async () => {
      if (isCancelled) return

      try {
        const res = await api.get(
          `/analyze/getResult?presentationId=${encodeURIComponent(presentationId)}`
        )
        console.log('분석 결과 확인 중:', res)

        if (res) {
          const common = res.commonFeedbackResultDTO ?? res

          const llmFeedback =
            typeof common.llmFeedbackJson === 'string'
              ? JSON.parse(common.llmFeedbackJson)
              : (common.llmFeedbackJson ?? {})

          const rawData =
            typeof common.rawDataJson === 'string'
              ? JSON.parse(common.rawDataJson)
              : (common.rawDataJson ?? {})

          // s3Key로 영상 다운로드 URL 요청
          // s3Key로 영상 다운로드 URL 요청
          let videoUrl = null
          if (res.s3Key) {
            try {
              const videoRes = await api.get(
                `/videos/download-url?key=${encodeURIComponent(res.s3Key)}`
              )
              // 응답이 문자열이거나 { url: "..." } 객체 모두 대응
              if (typeof videoRes === 'string') {
                videoUrl = videoRes
              } else if (videoRes?.url) {
                videoUrl = videoRes.url
              } else if (videoRes?.downloadUrl) {
                videoUrl = videoRes.downloadUrl
              } else {
                // 그 외 객체면 첫 번째 값 사용
                videoUrl = Object.values(videoRes ?? {})[0] ?? null
              }
              console.log('✅ 영상 URL 수신:', videoUrl)
            } catch (e) {
              console.error('영상 URL 요청 실패:', e)
            }
          }

          const processedData = {
            totalScore: common.totalScore ?? 0,
            gazeScore: common.gazeScore ?? 0,
            postureScore: common.postureScore ?? 0,
            speechScore: common.speechScore ?? 0,
            topicScore: common.topicScore ?? 0,
            fillerScore: common.fillerScore ?? 0,
            speechWpm: common.speechWpm ?? 0,
            gazeFrontRatio: common.gazeFrontRatio ?? 0,
            poseWarningRatio: common.poseWarningRatio ?? 0,
            llmFeedback,
            rawData,
            userName: res.userName ?? '',
            presentationType: res.presentationType ?? '',
            videoUrl,
            realTimeResultDTOList: res.realTimeResultDTO ?? [],
          }

          console.log('✅ 분석 결과 수신 성공!')
          setAnalysisData(processedData)
          setLoading(false)
          return
        }
      } catch (err) {
        console.error('Failed to fetch analysis result:', err)
      }

      if (!isCancelled) {
        console.log('🔄 10초 후 다시 시도합니다...')
        timeoutId = setTimeout(poll, 10000)
      }
    }

    setLoading(true)
    poll()

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [presentationId])

  const handleBottomButton = () => {
    if (showDetail) {
      window.location.href = '/'
    } else {
      setShowDetail(true)
    }
  }

  const handleDownloadPDF = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      if (showDetail) {
        await downloadFullPDF()
        alert('전체 분석 결과 PDF 다운로드가 완료되었습니다!')
      } else {
        await downloadBasicPDF()
        alert('기본 분석 결과 PDF 다운로드가 완료되었습니다!')
      }
    } catch (error) {
      console.error('PDF 다운로드 실패:', error)
      alert('PDF 다운로드에 실패했습니다.')
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F8]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#5650FF] border-t-transparent"></div>
          <p className="mt-4 font-medium text-gray-500">결과를 불러오는 중입니다...</p>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F7F8] px-6 text-center">
        <Nav />
        <p className="text-[20px] font-bold text-gray-800">결과를 불러올 수 없습니다.</p>
        <p className="mt-2 text-[15px] text-gray-500">
          분석이 아직 진행 중이거나 오류가 발생했을 수 있습니다.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-xl bg-[#5650FF] px-8 py-3 font-bold text-white transition-all hover:bg-[#4540CC]"
        >
          다시 시도하기
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#F7F7F8] pt-[80px]">
      <Nav />
      <div id="full-analysis-content">
        <div id="basic-analysis-content" className="animate-[fadeIn_0.6s_ease-out]">
          <AnalysisResult data={analysisData} />
        </div>
        {showDetail && (
          <div className="animate-[slideUp_0.8s_ease-out]">
            <AnalysisResultDetail data={analysisData} />
          </div>
        )}
      </div>
      <FeedbackBottomBar
        isDetail={showDetail}
        onClick={handleBottomButton}
        onDownloadPDF={handleDownloadPDF}
      />
      {isDownloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-xl bg-white p-8">
            <p className="text-lg font-bold">PDF 생성 중...</p>
            <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}
    </div>
  )
}
