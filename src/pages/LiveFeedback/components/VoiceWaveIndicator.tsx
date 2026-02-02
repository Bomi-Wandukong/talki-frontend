import React, { useEffect, useState, useRef } from "react";

interface VoiceWaveIndicatorProps {
  size?: number; // 크기 (기본값: 112px = h-28, w-28)
  threshold?: number; // 음성 감지 임계값 (0-255, 기본값: 30)
  onVoiceDetected?: (isDetected: boolean) => void; // 음성 감지 콜백
  onError?: (error: string) => void; // 에러 콜백
}

export default function VoiceWaveIndicator({
  size = 112,
  threshold = 30,
  onVoiceDetected,
  onError,
}: VoiceWaveIndicatorProps) {
  const [isActive, setIsActive] = useState(false);
  const [waveScale, setWaveScale] = useState(1);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 마이크 권한 요청 및 초기화
  useEffect(() => {
    const initMicrophone = async () => {
      try {
        // 마이크 권한 요청
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        // Web Audio API 설정
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.3;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        microphoneRef.current = microphone;

        setPermissionGranted(true);

        // 음성 레벨 감지 시작
        detectVoice();
      } catch (error) {
        console.error("마이크 권한 거부 또는 오류:", error);
        setPermissionDenied(true);
        onError?.("마이크 권한이 필요합니다.");
      }
    };

    initMicrophone();

    // 클린업
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 음성 레벨 감지
  const detectVoice = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkAudioLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // 평균 음량 계산
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

      // 임계값 이상이면 음성 감지
      const detected = average > threshold;
      setIsActive(detected);
      onVoiceDetected?.(detected);

      // 음량 레벨 저장 (0-1 범위로 정규화)
      const normalizedVolume = Math.min(average / 100, 1);
      setVolumeLevel(normalizedVolume);

      // 음성 감지 시 스케일 조정 (더 큰 음량일수록 크게)
      if (detected) {
        const baseScale = 1 + normalizedVolume * 0.5;
        const jitter = Math.sin(Date.now() / 100) * 0.1 * normalizedVolume;
        setWaveScale(baseScale + jitter);
      } else {
        setWaveScale(1);
      }

      animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  };

  // 권한 거부 시 표시
  if (permissionDenied) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}>
        <div
          className="relative rounded-full bg-gray-300 shadow-lg flex items-center justify-center"
          style={{
            width: size * 0.7,
            height: size * 0.7,
          }}>
          <svg
            className="w-10 h-10 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
            <line x1="4" y1="4" x2="20" y2="20" strokeWidth={2} />
          </svg>
        </div>
      </div>
    );
  }

  // 권한 대기 중
  if (!permissionGranted) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}>
        <div
          className="relative rounded-full bg-gradient-to-br from-purple-200 via-blue-200 to-purple-300 shadow-lg animate-pulse"
          style={{
            width: size * 0.7,
            height: size * 0.7,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}>
      {/* 외곽 파동 원들 - 음성 인식 시 확장 */}
      {isActive && (
        <>
          {/* 첫 번째 파동 */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-purple-300/50 to-blue-300/50"
            style={{
              width: size * (0.9 + volumeLevel * 0.2),
              height: size * (0.9 + volumeLevel * 0.2),
              animation: "wave-pulse 1.2s ease-out infinite",
              opacity: 0.6 + volumeLevel * 0.4,
            }}
          />
          {/* 두 번째 파동 */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-purple-400/40 to-blue-400/40"
            style={{
              width: size * (0.75 + volumeLevel * 0.15),
              height: size * (0.75 + volumeLevel * 0.15),
              animation: "wave-pulse 1s ease-out infinite",
              animationDelay: "0.2s",
              opacity: 0.5 + volumeLevel * 0.5,
            }}
          />
          {/* 세 번째 파동 */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30"
            style={{
              width: size * (0.6 + volumeLevel * 0.1),
              height: size * (0.6 + volumeLevel * 0.1),
              animation: "wave-pulse 0.8s ease-out infinite",
              animationDelay: "0.4s",
              opacity: 0.4 + volumeLevel * 0.6,
            }}
          />
        </>
      )}

      {/* 중앙 메인 원 - 동적으로 크기 변화 */}
      <div
        className="relative rounded-full bg-gradient-to-br from-purple-200 via-blue-200 to-purple-300 shadow-lg"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          transform: `scale(${waveScale})`,
          transition: "transform 0.05s ease-out",
        }}>
        {/* 내부 빛나는 효과 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent" />

        {/* 마이크 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`w-10 h-10 transition-all duration-150 ${
              isActive ? "text-purple-600 drop-shadow-lg" : "text-purple-400"
            }`}
            style={{
              transform: isActive
                ? `scale(${1 + volumeLevel * 0.2})`
                : "scale(1)",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>

        {/* 음성 인식 중 내부 파동 */}
        {isActive && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/50 to-blue-400/50"
              style={{
                animation: "inner-pulse 0.6s ease-in-out infinite",
                opacity: volumeLevel,
              }}
            />
          </div>
        )}
      </div>

      {/* 하단 반사광 효과 */}
      <div
        className="absolute bottom-0 rounded-full bg-gradient-to-t from-purple-400/20 to-transparent blur-md transition-opacity duration-150"
        style={{
          width: size * 0.6,
          height: size * 0.3,
          transform: "translateY(50%)",
          opacity: isActive ? 0.8 + volumeLevel * 0.2 : 0.4,
        }}
      />

      {/* 애니메이션 키프레임 정의 */}
      <style>{`
        @keyframes wave-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes inner-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
