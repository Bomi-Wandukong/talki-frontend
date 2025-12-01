import React from "react";
import LiveFeedbackTracker from "../components/LiveFeedbackTracker";

export default function LiveFeedback() {
  return (
    <>
      <LiveFeedbackTracker />
      <div className="bg-[url(./img/LivePeople.png)] bg-no-repeat bg-cover bg-center h-screen w-screen ">
        <div className="text-white">이전</div>
      </div>
    </>
  );
}
