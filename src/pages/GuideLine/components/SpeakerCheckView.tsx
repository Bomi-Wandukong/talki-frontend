import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const SpeakerCheckView = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate() 
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const [isAnalyzing, setIsAnalyzing] = useState(false) // 분석 중 로딩 상태
  const [sttResult, setSttResult] = useState<'success' | 'fail' | null>(null) // 분석 결과

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  // 가상의 백엔드 분석 API 호출 함수
  const mockAnalyzeAudio = async (blob: Blob) => {
    setIsAnalyzing(true)
    setSttResult(null)

    // 1. 고의로 2초 정도 시간을 늘림 (네트워크 통신 시뮬레이션)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 2. 임시 결과 도출 (80% 확률로 성공, 20% 확률로 실패)
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
      setSttResult('success')
    } else {
      setSttResult('fail')
    }
    setIsAnalyzing(false)
  }

  const initVideo = useCallback(async () => {
    try {
      setStatus('loading')
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStatus('ready')
      }
    } catch (err) {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    initVideo()
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      audioContextRef.current?.close()
    }
  }, [initVideo])

  const startAnalyzing = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioContextRef.current = audioContext
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      const updateLevel = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return
        analyser.getByteFrequencyData(dataArray)
        const sum = dataArray.reduce((a, b) => a + b, 0)
        const level = Math.min((sum / bufferLength / 128) * 100, 100)
        setAudioLevel(level)
        animationFrameRef.current = requestAnimationFrame(updateLevel)
      }
      updateLevel()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMainButtonClick = async () => {
    if (status === 'error') {
      initVideo()
      return
    }

    if (sttResult === 'fail') {
      setAudioBlob(null)
      setSttResult(null)
    }

    if (!isRecording && !audioBlob) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        startAnalyzing(stream)
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          setAudioBlob(blob)
          stream.getTracks().forEach((track) => track.stop())

          // --- [녹음 중지 시 가상 분석 시작] ---
          mockAnalyzeAudio(blob)
        }
        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        alert('마이크 접근 권한이 필요합니다.')
      }
    } else if (isRecording) {
      mediaRecorderRef.current?.stop()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      audioContextRef.current?.close()
      setIsRecording(false)
      setAudioLevel(0)
    } else if (sttResult === 'success') {
      onComplete()
      navigate('/live')
    }
  }

  const getButtonConfig = () => {
    if (status === 'loading') return { text: '로딩 중...', className: 'bg-gray-400 cursor-wait' }
    if (status === 'error')
      return { text: '다시 시도', className: 'bg-orange-500 hover:bg-orange-600' }

    // 분석 중일 때
    if (isAnalyzing)
      return { text: '인식 중...', className: 'bg-[#FFA956] cursor-wait animate-pulse' }

    // 분석 결과에 따른 분기
    if (sttResult === 'fail')
      return { text: '다시 녹음하기', className: 'bg-red-500 hover:bg-red-600' }
    if (sttResult === 'success')
      return { text: '확인 완료', className: 'bg-[#5650FF] hover:bg-indigo-700' }

    if (isRecording) return { text: '녹음 완료', className: 'bg-red-500 hover:bg-red-600' }
    return { text: '녹음 시작', className: 'bg-[#5650FF] hover:bg-[#ACA9FE]' }
  }

  const buttonConfig = getButtonConfig()

  return (
    <div className="flex w-full items-center justify-around p-4">
      <div className="relative aspect-video w-full max-w-[50%] overflow-hidden rounded-2xl bg-gray-200 shadow-inner">
        <video
          ref={videoRef}
          className={`h-full w-full scale-x-[-1] object-cover transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="flex w-1/2 flex-col items-center">
        <div className="mb-6 mt-5 flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${sttResult === 'success' ? 'border-[#4DCB56] bg-[#4DCB56]' : 'border-gray-300'}`}
          >
            {sttResult === 'success' && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7L6 10L11 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <p className="text-gray-600">
            {isAnalyzing
              ? '목소리를 분석하고 있어요...'
              : sttResult === 'success'
                ? '마이크 확인 완료! 아주 잘 들려요.'
                : sttResult === 'fail'
                  ? '음성 인식이 잘 안 되었어요. 다시 해볼까요?'
                  : '마이크 음성 확인을 위해 버튼을 누른 후 아래의 문장을 읽어주세요.'}
          </p>
        </div>

        <div className="mb-8 flex w-2/3 items-center gap-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isRecording ? '#6366f1' : '#9ca3af'}
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-75 ease-out ${isRecording ? 'bg-indigo-500' : 'bg-gray-300'}`}
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>

        <p className="fontSB mb-10 text-center text-xl leading-relaxed text-[#5650FF]">
          " 작은 한마디라도 괜찮아요. 시작이 중요하니까요 "
        </p>

        <button
          onClick={handleMainButtonClick}
          disabled={status === 'loading' || isAnalyzing}
          className={`fontSB rounded-xl px-12 py-4 text-white transition-all active:scale-95 disabled:opacity-50 ${buttonConfig.className}`}
        >
          {buttonConfig.text}
        </button>

        {sttResult && !isRecording && !isAnalyzing && (
          <button
            onClick={() => {
              setAudioBlob(null)
              setSttResult(null)
              setAudioLevel(0)
            }}
            className="mt-4 text-sm text-gray-400 underline hover:text-gray-600"
          >
            처음부터 다시 녹음하기
          </button>
        )}
      </div>
    </div>
  )
}

export default SpeakerCheckView
