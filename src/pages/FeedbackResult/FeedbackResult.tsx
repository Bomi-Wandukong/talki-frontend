import React, { useState } from 'react'
import AnalysisResult from './components/AnalysisResult'
import AnalysisResultDetail from './components/AnalysisResultDetail'
import FeedbackBottomBar from './components/FeedbackBottomBar'
// import { downloadFullPDF, downloadBasicPDF } from "../../utils/pdfDownload";

export default function FeedbackResult() {
  const [showDetail, setShowDetail] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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
        // await downloadFullPDF()
        alert('전체 분석 결과 PDF 다운로드가 완료되었습니다!')
      } else {
        // 기본 분석만 본 경우 - 기본 분석만 다운로드
        // await downloadBasicPDF()
        alert('기본 분석 결과 PDF 다운로드가 완료되었습니다!')
      }
    } catch (error) {
      console.error('PDF 다운로드 실패:', error)
      alert('PDF 다운로드에 실패했습니다.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="relative">
      {/* 전체 콘텐츠를 감싸는 div */}
      <div id="full-analysis-content">
        {/* 기본 분석 결과 */}
        <div id="basic-analysis-content" className="animate-[fadeIn_0.6s_ease-out]">
          <AnalysisResult />
        </div>

        {/* 세부 분석 결과 */}
        {showDetail && (
          <div className="animate-[slideUp_0.8s_ease-out]">
            <AnalysisResultDetail />
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
