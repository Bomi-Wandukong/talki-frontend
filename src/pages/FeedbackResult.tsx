import React, { useState } from "react";
import AnalysisResult from "../components/AnalysisResult";
import AnalysisResultDetail from "../components/AnalysisResultDetail";
import FeedbackBottomBar from "../components/FeedbackBottomBar";

export default function FeedbackResult() {
  const [showDetail, setShowDetail] = useState(false);

  const handleBottomButton = () => {
    if (showDetail) {
      // 상세 페이지 → 홈으로 돌아가기
      // 예: 홈으로 이동하거나 다른 페이지로 이동
      window.location.href = "/"; // 필요하면 변경 가능
    } else {
      // 상세 분석 보기 클릭
      setShowDetail(true);
    }
  };

  return (
    <>
      {/* 처음에는 AnalysisResult만 보임 */}
      <AnalysisResult />

      {/* 상세 분석 보기 눌렀을 때만 화면 추가 */}
      {showDetail && <AnalysisResultDetail />}

      {/* 버튼 상태 변경 */}
      <FeedbackBottomBar isDetail={showDetail} onClick={handleBottomButton} />
    </>
  );
}
