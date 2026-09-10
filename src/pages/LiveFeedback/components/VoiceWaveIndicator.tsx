import { useEffect, useRef, useState } from 'react'

interface VoiceWaveIndicatorProps {
  size?: number // 원 지름 (기본값: 112px)
  threshold?: number // 음성 감지 임계값 (0-255, 기본값: 30)
  onVoiceDetected?: (isDetected: boolean) => void // 음성 감지 콜백
  onError?: (error: string) => void // 에러 콜백
}

/** SVG viewBox 기준 좌표계 */
const VIEW = 100
/** 잔잔할 때 수면 높이 (값이 클수록 아래) */
const IDLE_LEVEL = 56
/** 크게 말할 때 차오르는 수면 높이 */
const LOUD_LEVEL = 44
/** 잔잔할 때 / 크게 말할 때 파고 */
const IDLE_AMPLITUDE = 1.6
const LOUD_AMPLITUDE = 11

/** 사인파를 원 안을 채우는 닫힌 path 로 만든다. */
function buildWavePath(phase: number, amplitude: number, level: number, frequency: number) {
  const steps = 28
  let d = ''

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * VIEW
    const y = level + Math.sin((i / steps) * Math.PI * 2 * frequency + phase) * amplitude
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `
  }

  // 아래쪽을 막아 물이 차 있는 형태로 닫는다.
  return `${d}L${VIEW},${VIEW} L0,${VIEW} Z`
}

/**
 * 마이크 입력에 반응하는 음성 인디케이터.
 * 원 크기는 고정하고, 원 안의 물결이 말소리에 따라 요동친다.
 */
export default function VoiceWaveIndicator({
  size = 112,
  threshold = 30,
  onVoiceDetected,
  onError,
}: VoiceWaveIndicatorProps) {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const backWaveRef = useRef<SVGPathElement | null>(null)
  const frontWaveRef = useRef<SVGPathElement | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 프레임마다 바뀌는 값은 리렌더를 피하기 위해 ref 로 관리한다.
  const phaseRef = useRef(0)
  const smoothedVolumeRef = useRef(0)
  const lastDetectedRef = useRef(false)

  const onVoiceDetectedRef = useRef(onVoiceDetected)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onVoiceDetectedRef.current = onVoiceDetected
    onErrorRef.current = onError
  }, [onVoiceDetected, onError])

  useEffect(() => {
    let disposed = false

    const animate = () => {
      if (disposed) return

      const analyser = analyserRef.current
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)

        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        const detected = average > threshold

        if (detected !== lastDetectedRef.current) {
          lastDetectedRef.current = detected
          setIsActive(detected)
          onVoiceDetectedRef.current?.(detected)
        }

        // 튀는 값 대신 부드럽게 따라가도록 감쇠 (올라갈 땐 빠르게, 내려갈 땐 천천히)
        const target = Math.min(average / 80, 1)
        const current = smoothedVolumeRef.current
        smoothedVolumeRef.current = current + (target - current) * (target > current ? 0.35 : 0.08)
      }

      const volume = smoothedVolumeRef.current
      const amplitude = IDLE_AMPLITUDE + (LOUD_AMPLITUDE - IDLE_AMPLITUDE) * volume
      const level = IDLE_LEVEL + (LOUD_LEVEL - IDLE_LEVEL) * volume

      // 소리가 클수록 물결이 빠르게 흐른다.
      phaseRef.current += 0.06 + volume * 0.12

      backWaveRef.current?.setAttribute(
        'd',
        buildWavePath(-phaseRef.current * 0.7, amplitude * 0.7, level + 3, 1.2)
      )
      frontWaveRef.current?.setAttribute(
        'd',
        buildWavePath(phaseRef.current, amplitude, level, 1.6)
      )

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (disposed) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream

        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.6
        audioContext.createMediaStreamSource(stream).connect(analyser)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        setPermissionGranted(true)
      } catch (error) {
        if (disposed) return
        console.error('마이크 권한 거부 또는 오류:', error)
        setPermissionDenied(true)
        onErrorRef.current?.('마이크 권한이 필요합니다.')
      }
    }

    initMicrophone()
    // 권한을 기다리는 동안에도 잔물결은 흐르게 둔다.
    animate()

    return () => {
      disposed = true
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      audioContextRef.current?.close().catch(() => {})
      audioContextRef.current = null
      analyserRef.current = null
    }
  }, [threshold])

  // 권한 거부 시 표시
  if (permissionDenied) {
    return (
      <div
        className="relative flex items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30"
        style={{ width: size, height: size }}
      >
        <svg
          className="h-9 w-9 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth={2} />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-white/10 backdrop-blur-sm transition-shadow duration-300 ${
        isActive ? 'ring-2 ring-white/70 shadow-[0_0_24px_6px_rgba(172,169,254,0.45)]' : 'ring-1 ring-white/40'
      } ${permissionGranted ? '' : 'opacity-60'}`}
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="none"
      >
        {/* 뒤쪽 물결 — 느리고 옅게 흘러 깊이를 만든다 */}
        <path ref={backWaveRef} fill="#5650FF" fillOpacity={0.55} />
        {/* 앞쪽 물결 */}
        <path ref={frontWaveRef} fill="#ACA9FE" fillOpacity={0.9} />
      </svg>

      {/* 마이크 아이콘 (크기 고정) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="h-8 w-8 text-white/85 drop-shadow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </div>
    </div>
  )
}
