import "./css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuideLine from "./GuideLine";
import Next from "./Next";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuideLine />} />
        <Route path="/next" element={<Next />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
