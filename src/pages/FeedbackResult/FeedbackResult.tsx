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
  const presentationId = location.state?.presentationId

  useEffect(() => {
    if (!presentationId) {
      console.error('No presentationId provided')
      // navigate('/home') // 임시 주석 처리 (테스트를 위해)
      // return
    }

    const fetchResult = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/analyze/getResult?presentationId=${presentationId}`)
        setAnalysisData(res)
      } catch (err) {
        console.error('Failed to fetch analysis result:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
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
        // 세부 분석까지 본 경우 - 전체 다운로드
        await downloadFullPDF()
        alert('전체 분석 결과 PDF 다운로드가 완료되었습니다!')
      } else {
        // 기본 분석만 본 경우 - 기본 분석만 다운로드
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

  return (
    <div className="relative min-h-screen bg-[#F7F7F8] pt-[80px]">
      <Nav />
      {/* 전체 콘텐츠를 감싸는 div */}
      <div id="full-analysis-content">
        {/* 기본 분석 결과 */}
        <div id="basic-analysis-content" className="animate-[fadeIn_0.6s_ease-out]">
          <AnalysisResult data={analysisData} />
        </div>

        {/* 세부 분석 결과 */}
        {showDetail && (
          <div className="animate-[slideUp_0.8s_ease-out]">
            <AnalysisResultDetail data={analysisData} />
          </div>
        )}
      </div>

      {/* 버튼 */}
      <FeedbackBottomBar
        isDetail={showDetail}
        onClick={handleBottomButton}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* 다운로드 중 로딩 표시 */}
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
