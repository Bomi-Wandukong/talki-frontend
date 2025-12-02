// GuideLineMic.tsx
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

interface GuideLineMicProps {
  onComplete?: () => void;
}

const GuideLineMic: React.FC<GuideLineMicProps> = ({ onComplete }) => {
  const webcamRef = useRef<Webcam>(null);

  const [isListening, setIsListening] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const testSentence = "안녕하세요, 마이크 테스트를 진행하고 있습니다.";

  // 음성 인식 시작
  const startListening = async () => {
    try {
      // 마이크 권한부터 요청
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError("브라우저가 음성 인식을 지원하지 않습니다. (Chrome 권장)");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "ko-KR";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.error("SpeechRecognition error:", event);
        setError("음성 인식 중 오류가 발생했습니다.");
        setIsListening(false);
        setShowButton(true);
      };

      recognition.onend = () => {
        // 우리가 강제로 stop한 경우에는 여기 들어올 수 있음
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      setTranscript("");
      setError("");
      setIsListening(true);
      setShowButton(false);

      recognition.start();

      // 10초 뒤 Next.tsx로 이동
      timeoutRef.current = window.setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);

        if (onComplete) {
          onComplete();
        }

        navigate("/next");
      }, 10000);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      setError("마이크 접근 권한이 필요합니다.");
      alert("마이크 접근 권한을 허용해주세요.");
    }
  };

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-5xl">
      <section className="mt-4 rounded-3xl bg-white shadow-sm border border-gray-100 px-10 py-10 pt-15 flex justify-center flex-col items-center">
        {/* 웹캠 */}
        <div className="relative w-full max-w-[620px] h-[400px] mb-8">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            className="rounded-xl border border-gray-200 w-full h-full object-cover"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="w-full max-w-[620px] mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 안내 문구 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-white text-lg rounded-full bg-[#5B4BFF] w-7 h-7 flex items-center justify-center">
            ✓
          </span>
          <p className="text-base text-[#3B3B3B]">
            마이크 음성 확인을 위해 버튼을 누른 후 아래의 문장을 읽어주세요.
          </p>
        </div>

        {/* 읽을 문장 */}
        <div className="w-full max-w-[620px] mb-6 p-4 bg-[#F7F7F8] rounded-lg">
          <p className="text-center text-lg text-[#5B4BFF] font-medium">
            "{testSentence}"
          </p>
        </div>


        {/* 녹음 버튼 (눌렀으면 사라짐) */}
        {showButton && (
          <div className="relative flex flex-col items-center justify-center mb-4">
            <button
              onClick={startListening}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 bg-white rounded-full" />
            </button>
          </div>
        )}

        {/* 녹음 중 안내 */}
        {isListening && (
          <p className="text-sm text-[#5B4BFF] mt-3">
            🎤 음성 인식 중입니다... 잠시 후 다음 단계로 넘어가요.
          </p>
        )}
      </section>
    </div>
  );
};

export default GuideLineMic;
