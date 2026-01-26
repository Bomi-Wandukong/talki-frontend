import { useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

type FaceStatus = 'OK' | 'TOO_FAR' | 'NOT_FRONT' | 'WRONG_POSITION'

const CameraCheckView = ({ onComplete }: { onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null)

  const [feedback, setFeedback] = useState<React.ReactNode>('모델을 불러오는 중...')
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [isInside, setIsInside] = useState(false)

  const startTimeRef = useRef<number | null>(null)
  const REQUIRED_TIME = 5000 // 5초 (밀리초 단위)

  // MediaPipe 모델 및 카메라 초기화 (기존 동일)
  useEffect(() => {
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        )
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.6,
        })
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.addEventListener('loadeddata', predictWebcam)
        }
      } catch (error) {
        setFeedback('카메라를 연결할 수 없습니다.')
      }
    }
    init()
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // 실시간 검증 루프
  const predictWebcam = async () => {
    // 1. 비디오 데이터가 유효한지 먼저 체크
    if (!videoRef.current || videoRef.current.readyState < 2 || !faceLandmarkerRef.current) {
      requestAnimationFrame(predictWebcam)
      return
    }

    try {
      const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now())

      // 얼굴이 검출되었고, 랜드마크 데이터가 실제로 존재하는지 확인
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0]

        // 랜드마크 데이터가 유효한 숫자인지 한 번 더 체크 (에러 방지)
        if (!landmarks || landmarks.length === 0) {
          requestAnimationFrame(predictWebcam)
          return
        }

        // 검증 결과 가져오기
        const { status, area } = checkFacePosition(landmarks)

        const faceValid = status === 'OK'
        setIsInside(faceValid)

        if (faceValid) {
          if (!startTimeRef.current) startTimeRef.current = Date.now()
          const elapsed = Date.now() - startTimeRef.current
          const remaining = Math.max(0, Math.ceil((REQUIRED_TIME - elapsed) / 1000))

          setProgress(Math.min((elapsed / REQUIRED_TIME) * 100, 100))
          setTimeLeft(remaining)
          setFeedback(
            <>
              <span className="mr-2 text-[#5650FF]">잘하셨어요!</span> {remaining}초만 더
              유지하세요!
            </>
          )

          if (elapsed >= REQUIRED_TIME) {
            onComplete()
            return
          }
        } else {
          resetValidation()
          if (status === 'TOO_FAR') {
            setFeedback(
              <>
                카메라에 <span className="mx-2 text-[#FFA956]"> 조금 더 가까이 </span> 다가와주세요.
              </>
            )
          } else if (status === 'NOT_FRONT') {
            setFeedback(
              <>
                고개를 돌리지 말고 <span className="mx-2 text-[#5650FF]">정면</span>을 봐주세요.
              </>
            )
          } else {
            setFeedback(
              <>
                얼굴을 <span className="mx-2 text-[#FFA956]">가이드라인</span> 안에 맞춰주세요.
              </>
            )
          }
        }
      } else {
        setFeedback(<>얼굴이 안 보여요. 카메라를 조정해주세요.</>)
        setIsInside(false)
        resetValidation()
      }
    } catch (error) {
      console.error('MediaPipe detection error:', error)
      alert('카메라 설정 중 오류가 발생했습니다. 카메라 세팅을 재설정합니다.')
      window.location.reload()

      return
    }

    requestAnimationFrame(predictWebcam)
  }

  const resetValidation = () => {
    startTimeRef.current = null
    setProgress(0)
    setTimeLeft(5)
  }

  const checkFacePosition = (landmarks: any[]): { status: FaceStatus; area: number } => {
    // 얼굴 면적 계산
    const xCoords = landmarks.map((lm) => lm.x)
    const yCoords = landmarks.map((lm) => lm.y)
    const faceWidth = Math.max(...xCoords) - Math.min(...xCoords)
    const faceHeight = Math.max(...yCoords) - Math.min(...yCoords)
    const faceArea = faceWidth * faceHeight

    // 기준값 검증
    const nose = landmarks[1]
    const isCentered = nose.x > 0.4 && nose.x < 0.6 && nose.y > 0.3 && nose.y < 0.7

    const leftEye = landmarks[33]
    const rightEye = landmarks[263]
    const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 }
    const yawOffset = Math.abs(nose.x - eyeCenter.x)
    const isLookingFront = yawOffset < 0.05

    const isCloseEnough = faceArea > 0.06

    // 우선순위에 따른 상태 반환
    if (!isCloseEnough) return { status: 'TOO_FAR', area: faceArea }
    if (!isCentered) return { status: 'WRONG_POSITION', area: faceArea }
    if (!isLookingFront) return { status: 'NOT_FRONT', area: faceArea }

    return { status: 'OK', area: faceArea }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative aspect-video w-full max-w-[50%] overflow-hidden rounded-2xl">
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          autoPlay
          playsInline
          muted
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src={isInside ? "/img/guidelineSuccess.png" : "/img/guideline.png"}
            alt="가이드라인"
            className={`h-[75%] w-auto transition-all duration-300 mt-10`}
          />
        </div>
      </div>

      <div className="mt-8 flex w-[40%] items-center justify-center">
        <div className="flex w-[15%] justify-end">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 21C12.3135 21.0016 13.6143 20.7437 14.8278 20.2411C16.0412 19.7384 17.1434 19.0009 18.071 18.071C19.0009 17.1434 19.7384 16.0412 20.2411 14.8278C20.7437 13.6143 21.0016 12.3135 21 11C21.0016 9.68655 20.7437 8.38572 20.2411 7.17225C19.7384 5.95878 19.0009 4.85659 18.071 3.92901C17.1434 2.99909 16.0412 2.26162 14.8278 1.75897C13.6143 1.25631 12.3135 0.998388 11 1.00001C9.68655 0.998388 8.38572 1.25631 7.17225 1.75897C5.95878 2.26162 4.85659 2.99909 3.92901 3.92901C2.99909 4.85659 2.26162 5.95878 1.75897 7.17225C1.25631 8.38572 0.998388 9.68655 1.00001 11C0.998388 12.3135 1.25631 13.6143 1.75897 14.8278C2.26162 16.0412 2.99909 17.1434 3.92901 18.071C4.85659 19.0009 5.95878 19.7384 7.17225 20.2411C8.38572 20.7437 9.68655 21.0016 11 21Z"
              stroke={progress > 0 ? '#4DCB56' : '#D9D9D9'}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M7 11L10 14L16 8"
              stroke={progress > 0 ? '#4DCB56' : '#D9D9D9'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="fontMedium flex w-[90%] justify-center text-xl">{feedback}</p>
      </div>
    </div>
  )
}
export default CameraCheckView
