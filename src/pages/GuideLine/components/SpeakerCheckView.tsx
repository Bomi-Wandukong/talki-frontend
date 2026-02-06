import { useEffect, useRef, useState } from 'react'

const SpeakerCheckView = ({ onComplete }: { onComplete: () => void }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('카메라를 불러올 수 없습니다:', err)
      }
    }

    initVideo()

    return () => {
      // 카메라 트랙 중지
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // 마이크 분석
  const startAnalyzing = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)

    audioContextRef.current = audioContext

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray)
      const sum = dataArray.reduce((a, b) => a + b, 0)
      const average = sum / bufferLength
      const level = Math.min((average / 128) * 100, 100)
      setAudioLevel(level)
      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }
    updateLevel()
  }

  // 녹음 시작/중지
  const toggleRecording = async () => {
    if (!isRecording) {
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
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        alert('마이크 접근 권한이 필요합니다.')
      }
    } else {
      mediaRecorderRef.current?.stop()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      audioContextRef.current?.close()
      setIsRecording(false)
      setAudioLevel(0)
    }
  }

  return (
    <div className="flex w-full items-center justify-around">
      <div className="relative aspect-video w-full max-w-[50%] overflow-hidden rounded-2xl bg-gray-200">
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="mb-6 mt-5 flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border ${audioBlob ? 'border-[#4DCB56] bg-[#4DCB56]' : 'border-gray-300'}`}
          >
            {audioBlob && (
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
            마이크 음성 확인을 위해 버튼을 누른 후 아래의 문장을 읽어주세요.
          </p>
        </div>

        <div className="mb-8 flex w-[80%] items-center gap-4">
          <button
            onClick={toggleRecording}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isRecording ? 'bg-red-500 shadow-lg' : 'bg-gray-100'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isRecording ? 'white' : '#666'}>
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-300 to-indigo-600 transition-all duration-75 ease-out"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>

        <p className="mb-10 text-xl fontSB text-indigo-600">
          " 작은 한마디라도 괜찮아요. 시작이 중요하니까요 "
        </p>

        <button
          onClick={onComplete}
          disabled={!audioBlob}
          className={`rounded-full px-10 py-3 font-bold text-white transition-all ${audioBlob ? 'bg-indigo-600 hover:bg-indigo-700' : 'cursor-not-allowed bg-gray-300'}`}
        >
          확인 완료
        </button>
      </div>
    </div>
  )
}

export default SpeakerCheckView
