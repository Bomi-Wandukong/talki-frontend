import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import type { Results as FaceMeshResults } from '@mediapipe/face_mesh'
import { Pose } from '@mediapipe/pose'
import type { Results as PoseResults } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'

export interface LiveFeedbackTrackerRef {
  stopRecording: () => Promise<Blob>
}

export interface LiveFeedbackTrackerProps {
  presentationType?: string
  isLiveFeedbackOn?: boolean
  isEmergencyOn?: boolean
  onFeedbackReceived?: (msg: string) => void
  onSessionStart?: (presentationId: string) => void
}

const LiveFeedbackTracker = forwardRef<LiveFeedbackTrackerRef, LiveFeedbackTrackerProps>(
  (
    {
      presentationType,
      isLiveFeedbackOn = false,
      isEmergencyOn = false,
      onFeedbackReceived,
      onSessionStart,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordedChunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const cameraRef = useRef<Camera | null>(null)

    const faceDataRef = useRef<FaceMeshResults | null>(null)
    const poseDataRef = useRef<PoseResults | null>(null)

    const toggleStatesRef = useRef({ isLiveFeedbackOn, isEmergencyOn })
    const onFeedbackReceivedRef = useRef(onFeedbackReceived)
    const onSessionStartRef = useRef(onSessionStart)

    useEffect(() => {
      toggleStatesRef.current = { isLiveFeedbackOn, isEmergencyOn }
      onFeedbackReceivedRef.current = onFeedbackReceived
      onSessionStartRef.current = onSessionStart
    }, [isLiveFeedbackOn, isEmergencyOn, onFeedbackReceived, onSessionStart])

    const wsRef = useRef<WebSocket | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const processorRef = useRef<ScriptProcessorNode | null>(null)

    const stopRecording = (): Promise<Blob> => {
      console.log('⏹️ stopRecording called, current state:', mediaRecorderRef.current?.state)
      return new Promise((resolve, reject) => {
        if (!mediaRecorderRef.current) {
          return reject(new Error('MediaRecorder is not initialized'))
        }

        // 만약 이미 inactive 상태라면, 현재까지 쌓인 청크로 블롭을 만들어 반환합니다.
        if (mediaRecorderRef.current.state === 'inactive') {
          console.warn('⚠️ MediaRecorder is already inactive. Returning existing chunks.')
          if (recordedChunksRef.current.length > 0) {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' })
            recordedChunksRef.current = []
            return resolve(blob)
          } else {
            return reject(new Error('MediaRecorder is inactive and no data was recorded.'))
          }
        }

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' })
          recordedChunksRef.current = []
          console.log('💾 Recording stopped and blob created')
          resolve(blob)
        }

        mediaRecorderRef.current.stop()
      })
    }

    useImperativeHandle(ref, () => ({ stopRecording }))

    useEffect(() => {
      if (!videoRef.current) return

      let lastLogTime = 0
      let isCleanup = false

      const smartLocateFile = (file: string) => {
        if (file.includes('hands')) return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        if (file.includes('pose')) return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        if (file.includes('face_mesh'))
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      }

      const faceMesh = new FaceMesh({ locateFile: smartLocateFile })
      const pose = new Pose({ locateFile: smartLocateFile })

      function float32ToInt16(float32: Float32Array): Int16Array {
        const int16 = new Int16Array(float32.length)
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]))
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
        }
        return int16
      }

      function arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = ''
        const bytes = new Uint8Array(buffer)
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
      }

      const FACE_INDICES = [
        468, 469, 470, 471, 473, 474, 475, 476, 33, 133, 362, 263, 159, 386, 145, 374,
      ]
      const POSE_INDICES = [13, 14, 15, 16]

      function buildPayload(base64Audio: string) {
        const face: Record<string, { x: number; y: number }> = {}
        const pose: Record<string, { x: number; y: number }> = {}

        const faceLandmarks = faceDataRef.current?.multiFaceLandmarks?.[0]
        FACE_INDICES.forEach((idx) => {
          face[String(idx)] = faceLandmarks?.[idx]
            ? {
                x: Number(faceLandmarks[idx].x.toFixed(3)),
                y: Number(faceLandmarks[idx].y.toFixed(3)),
              }
            : { x: 0, y: 0 }
        })

        const poseLandmarks = poseDataRef.current?.poseLandmarks
        POSE_INDICES.forEach((idx) => {
          pose[String(idx)] = poseLandmarks?.[idx]
            ? {
                x: Number(poseLandmarks[idx].x.toFixed(3)),
                y: Number(poseLandmarks[idx].y.toFixed(3)),
              }
            : { x: 0, y: 0 }
        })

        return { face, pose, audio: base64Audio, timestamp: Date.now() }
      }

      // ✅ WS onopen 이후 호출 → 연결 확정 후 오디오 전송 시작
      function startAudioWebSocketRecording(stream: MediaStream) {
        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length === 0) return

        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(new MediaStream(audioTracks))

        // 1초(sampleRate 샘플 수) 누적 후 전송
        const targetSamples = audioCtx.sampleRate
        const accumulator: Float32Array[] = []
        let totalSamples = 0

        const processor = audioCtx.createScriptProcessor(4096, 1, 1)
        source.connect(processor)
        processor.connect(audioCtx.destination)

        processor.onaudioprocess = (e) => {
          if (isCleanup) return

          const chunk = new Float32Array(e.inputBuffer.getChannelData(0))
          accumulator.push(chunk)
          totalSamples += chunk.length

          if (totalSamples >= targetSamples) {
            const merged = new Float32Array(totalSamples)
            let offset = 0
            for (const c of accumulator) {
              merged.set(c, offset)
              offset += c.length
            }
            accumulator.length = 0
            totalSamples = 0

            if (wsRef.current?.readyState !== WebSocket.OPEN) return

            const int16 = float32ToInt16(merged)
            const base64Audio = arrayBufferToBase64(int16.buffer as ArrayBuffer)
            const payload = buildPayload(base64Audio)

            console.log('📤 WS Payload:', {
              faceKeys: Object.keys(payload.face),
              poseKeys: Object.keys(payload.pose),
              audioLength: base64Audio.length,
              timestamp: payload.timestamp,
            })

            wsRef.current.send(JSON.stringify(payload))
          }
        }

        audioContextRef.current = audioCtx
        processorRef.current = processor
      }

      function startRecording(stream: MediaStream) {
        try {
          const options = { mimeType: 'video/mp4' }
          // 브라우저 지원 여부 확인 (최소한의 안전장치)
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn(`⚠️ ${options.mimeType} is not supported, falling back to default.`)
            delete (options as any).mimeType
          }

          const mediaRecorder = new MediaRecorder(stream, options)

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data)
            }
          }

          mediaRecorder.onerror = (event) => {
            console.error('❌ MediaRecorder Error:', (event as any).error)
          }

          mediaRecorder.onstart = () => {
            console.log('🎥 MediaRecorder started, state:', mediaRecorder.state)
          }

          mediaRecorder.start(1000) // 1초마다 데이터 조각 획득 (안정성 강화)
          mediaRecorderRef.current = mediaRecorder
          console.log('🎥 Recording initialization requested')
        } catch (err) {
          console.error('❌ Failed to start MediaRecorder:', err)
        }
      }

      function startMediapipe() {
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true, // 468번 홍채 랜드마크 사용에 필요
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
        faceMesh.onResults((results) => {
          faceDataRef.current = results
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

            // ✅ WASM 전역 Module 충돌 방지: Promise.all 대신 순차 실행
            await faceMesh.send({ image })
            await pose.send({ image })

            printCombinedResults()
          },
          width: 640,
          height: 480,
        })

        cameraRef.current = camera
        camera.start()
      }

      async function initCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          if (isCleanup) {
            stream.getTracks().forEach((track) => track.stop())
            return
          }

          streamRef.current = stream
          videoRef.current!.srcObject = stream

          if (presentationType) {
            const wsUrl = `ws://43.201.182.246:8080/realtime?type=${presentationType}`
            const ws = new WebSocket(wsUrl)
            console.log('wsUrl', wsUrl)

            ws.onopen = () => {
              console.log('🟢 WebSocket Connected')
              // ✅ 연결 확정 후 오디오 전송 시작 (테스트 코드의 connect → startSending 순서와 동일)
              startAudioWebSocketRecording(stream)
            }
            ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data)
                console.log('📥 WS Response:', data)

                if (data.type === 'session_start') {
                  console.log('✅ Session Start:', data)
                  if (data.presentationId) onSessionStartRef.current?.(data.presentationId)
                }
                if (data.type === 'feedback' && data.data) {
                  onFeedbackReceivedRef.current?.(data.data)
                }
              } catch (err) {
                console.error('WS Parse error', err)
              }
            }
            ws.onerror = (err) => console.error('WS Error', err)
            ws.onclose = () => console.log('🔴 WebSocket Disconnected')

            wsRef.current = ws
          }

          startRecording(stream)
          startMediapipe()
        } catch (err) {
          console.error('❌ Camera permission denied!', err)
        }
      }

      function printCombinedResults() {
        const now = Date.now()
        if (now - lastLogTime < 1000) return
        lastLogTime = now

        const faceData = faceDataRef.current
        const poseData = poseDataRef.current

        const output: {
          gaze: string
          headTilt: number | null
          shoulderTilt: number | null
          face: any
          shoulder: any
        } = { gaze: 'unknown', headTilt: null, shoulderTilt: null, face: null, shoulder: null }

        if (faceData?.multiFaceLandmarks && faceData.multiFaceLandmarks.length > 0) {
          const face = faceData.multiFaceLandmarks[0]
          const leftEye = face[33]
          const rightEye = face[263]

          const gazeDelta = rightEye.x - leftEye.x
          let gaze = 'center'
          if (gazeDelta > 0.02) gaze = 'right'
          else if (gazeDelta < -0.02) gaze = 'left'

          output.gaze = gaze
          output.headTilt = Number((face[234].y - face[454].y).toFixed(3))
          output.face = {
            leftEye: { x: leftEye.x, y: leftEye.y },
            rightEye: { x: rightEye.x, y: rightEye.y },
          }
        }

        if (poseData?.poseLandmarks) {
          const ls = poseData.poseLandmarks[11]
          const rs = poseData.poseLandmarks[12]
          output.shoulderTilt = Number((ls.y - rs.y).toFixed(3))
          output.shoulder = {
            left: { x: ls.x, y: ls.y },
            right: { x: rs.x, y: rs.y },
          }
        }

        // console.log('📦 Combined (every 1s):', output)
      }

      initCamera()

      return () => {
        isCleanup = true
        console.log('🧹 cleaning up LiveFeedbackTracker effect...')

        cameraRef.current?.stop()
        streamRef.current?.getTracks().forEach((track) => {
          console.log(`🛑 Stopping track: ${track.kind}`)
          track.stop()
        })

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          console.log('⏹️ Stopping MediaRecorder during cleanup')
          mediaRecorderRef.current.stop()
        }

        if (processorRef.current) {
          processorRef.current.disconnect()
          processorRef.current = null
        }
        if (audioContextRef.current) {
          audioContextRef.current
            .close()
            .catch((err) => console.error('Error closing AudioContext', err))
          audioContextRef.current = null
        }
        if (wsRef.current) {
          wsRef.current.close()
        }

        faceMesh.close()
        pose.close()
      }
    }, [presentationType])

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
      />
    )
  }
)

LiveFeedbackTracker.displayName = 'LiveFeedbackTracker'

export default LiveFeedbackTracker
