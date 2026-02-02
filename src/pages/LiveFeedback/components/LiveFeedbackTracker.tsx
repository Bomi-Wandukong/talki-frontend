import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import type { Results as FaceMeshResults } from '@mediapipe/face_mesh'
import { Hands } from '@mediapipe/hands'
import type { Results as HandsResults } from '@mediapipe/hands'
import { Pose } from '@mediapipe/pose'
import type { Results as PoseResults } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'

export interface LiveFeedbackTrackerRef {
  stopRecording: () => void
}

const LiveFeedbackTracker = forwardRef<LiveFeedbackTrackerRef>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 녹화 관련
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const cameraRef = useRef<Camera | null>(null)

  // MediaPipe 결과 저장을 위한 ref (리렌더링 방지)
  const faceDataRef = useRef<FaceMeshResults | null>(null)
  const handDataRef = useRef<HandsResults | null>(null)
  const poseDataRef = useRef<PoseResults | null>(null)

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        })

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `live-feedback-${Date.now()}.webm`
        a.click()

        URL.revokeObjectURL(url)
        recordedChunksRef.current = []

        console.log('💾 Recording saved')
      }
    }
  }

  // 부모 컴포넌트에서 호출할 수 있도록 메서드 노출
  useImperativeHandle(ref, () => ({
    stopRecording,
  }))

  useEffect(() => {
    if (!videoRef.current) return

    let lastLogTime = 0
    let isCleanup = false

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    })
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    })

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (isCleanup) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        videoRef.current!.srcObject = stream

        // 녹화 시작
        startRecording(stream)
        startMediapipe()
      } catch (err) {
        console.error('❌ Camera permission denied!', err)
      }
    }

    function startRecording(stream: MediaStream) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder

      console.log('🎥 Recording started')
    }

    function startMediapipe() {
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      faceMesh.onResults((results) => {
        faceDataRef.current = results
      })

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      hands.onResults((results) => {
        handDataRef.current = results
      })

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      pose.onResults((results) => {
        poseDataRef.current = results
      })

      const camera = new Camera(videoRef.current!, {
        onFrame: async () => {
          if (isCleanup) return
          const image = videoRef.current!
          // 병렬 실행으로 프레임 드랍 방지
          await Promise.all([faceMesh.send({ image }), hands.send({ image }), pose.send({ image })])

          printCombinedResults()
        },
        width: 640,
        height: 480,
      })

      cameraRef.current = camera
      camera.start()
    }

    function printCombinedResults() {
      const now = Date.now()
      if (now - lastLogTime < 1000) return
      lastLogTime = now

      const faceData = faceDataRef.current
      const handData = handDataRef.current
      const poseData = poseDataRef.current

      const output: {
        gaze: string
        headTilt: number | null
        pinch: boolean
        shoulderTilt: number | null
        face: any
        hand: any
        shoulder: any
      } = {
        gaze: 'unknown',
        headTilt: null,
        pinch: false,
        shoulderTilt: null,
        face: null,
        hand: null,
        shoulder: null,
      }

      /** FaceMesh */
      if (faceData?.multiFaceLandmarks && faceData.multiFaceLandmarks.length > 0) {
        const face = faceData.multiFaceLandmarks[0]
        const leftEye = face[33]
        const rightEye = face[263]

        // Eye corner 기반 시선 근사 (IRIS 미사용)
        const gazeDelta = rightEye.x - leftEye.x
        let gaze = 'center'
        if (gazeDelta > 0.02) gaze = 'right'
        else if (gazeDelta < -0.02) gaze = 'left'

        const headTilt = face[234].y - face[454].y

        output.gaze = gaze
        output.headTilt = Number(headTilt.toFixed(3))
        output.face = {
          leftEye: { x: leftEye.x, y: leftEye.y },
          rightEye: { x: rightEye.x, y: rightEye.y },
        }
      }

      /** Hands */
      if (handData?.multiHandLandmarks) {
        const firstHand = handData.multiHandLandmarks[0]
        if (firstHand) {
          const thumb = firstHand[4]
          const index = firstHand[8]

          const dx = thumb.x - index.x
          const dy = thumb.y - index.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 0.03) output.pinch = true

          output.hand = {
            thumbTip: { x: thumb.x, y: thumb.y },
            indexTip: { x: index.x, y: index.y },
          }
        }
      }

      /** Pose */
      if (poseData?.poseLandmarks) {
        const ls = poseData.poseLandmarks[11]
        const rs = poseData.poseLandmarks[12]

        const shoulderTilt = ls.y - rs.y

        output.shoulderTilt = Number(shoulderTilt.toFixed(3))
        output.shoulder = {
          left: { x: ls.x, y: ls.y },
          right: { x: rs.x, y: rs.y },
        }
      }

      console.log('📦 Combined (every 1s):', output)
    }

    initCamera()

    return () => {
      isCleanup = true
      console.log('🧹 cleaning up...')

      // 리소스 해제
      cameraRef.current?.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }

      // MediaPipe 인스턴스 종료 (지원되는 경우)
      faceMesh.close()
      hands.close()
      pose.close()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
    />
  )
})

LiveFeedbackTracker.displayName = 'LiveFeedbackTracker'

export default LiveFeedbackTracker
