import "./css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuideLine from "./GuideLine";
import LiveFeedback from "./pages/LiveFeedback";
import FeedbackResult from "./pages/FeedbackResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuideLine />} />
        <Route path="/live" element={<LiveFeedback />} />
        <Route path="/result" element={<FeedbackResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
