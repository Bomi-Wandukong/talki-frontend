import React from "react";
import AnalysisResult from "../components/AnalysisResult";
import AnalysisResultDetail from "../components/AnalysisResultDetail";
import FeedbackBottomBar from "../components/FeedbackBottomBar";

export default function FeedbackResult() {
  return (
    <>
      <AnalysisResult />
      <AnalysisResultDetail />
      <FeedbackBottomBar />
    </>
  );
}
