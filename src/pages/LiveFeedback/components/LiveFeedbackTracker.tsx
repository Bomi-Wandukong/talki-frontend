import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import type { Results as FaceMeshResults } from '@mediapipe/face_mesh'
import { Pose } from '@mediapipe/pose'
import type { Results as PoseResults } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'

/** FastAPI 가 STT 용 wav 를 16kHz mono 로 저장하므로 전송 샘플레이트를 맞춘다. */
const TARGET_SAMPLE_RATE = 16000

export interface LiveFeedbackTrackerRef {
  stopRecording: () => Promise<Blob>
  disconnectWebSocket: () => void
}

export interface LiveFeedbackQuestionPayload {
  question_id: string
  question: string
  time_limit: number
}

export interface LiveFeedbackTrackerProps {
  presentationType?: string
  isLiveFeedbackOn?: boolean
  isEmergencyOn?: boolean
  canRecord?: boolean
  onFeedbackReceived?: (msg: string) => void
  onSurpriseQuestionReceived?: (question: LiveFeedbackQuestionPayload) => void
  onSessionStart?: (presentationId: string) => void
}

const LiveFeedbackTracker = forwardRef<LiveFeedbackTrackerRef, LiveFeedbackTrackerProps>(
  (
    {
      presentationType,
      isLiveFeedbackOn = false,
      isEmergencyOn = false,
      canRecord = true,
      onFeedbackReceived,
      onSurpriseQuestionReceived,
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
    const onSurpriseQuestionReceivedRef = useRef(onSurpriseQuestionReceived)
    const onSessionStartRef = useRef(onSessionStart)
    const canRecordRef = useRef(canRecord)

    // MediaPipe 초기화/추론은 메인 스레드를 크게 점유하므로 카운트다운이 끝난 뒤에 시작한다.
    const startMediapipeRef = useRef<(() => void) | null>(null)
    const mediapipeStartedRef = useRef(false)

    useEffect(() => {
      toggleStatesRef.current = { isLiveFeedbackOn, isEmergencyOn }
      onFeedbackReceivedRef.current = onFeedbackReceived
      onSurpriseQuestionReceivedRef.current = onSurpriseQuestionReceived
      onSessionStartRef.current = onSessionStart
    }, [
      isLiveFeedbackOn,
      isEmergencyOn,
      onFeedbackReceived,
      onSurpriseQuestionReceived,
      onSessionStart,
    ])

    useEffect(() => {
      canRecordRef.current = canRecord
      if (!canRecord || !streamRef.current) return

      if (!mediaRecorderRef.current) {
        startRecordingFromStream(streamRef.current)
      }
      startMediapipeRef.current?.()
    }, [canRecord])

    const wsRef = useRef<WebSocket | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const processorRef = useRef<ScriptProcessorNode | null>(null)
    const sendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const disconnectWebSocket = () => {
      if (wsRef.current) {
        console.log('🔌 Closing WebSocket from explicit end-session action')
        wsRef.current.onopen = null
        wsRef.current.onmessage = null
        wsRef.current.onerror = null
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
      }

      if (sendTimerRef.current) {
        clearInterval(sendTimerRef.current)
        sendTimerRef.current = null
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
    }

    function startRecordingFromStream(stream: MediaStream) {
      try {
        const options = { mimeType: 'video/mp4' }
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

        mediaRecorder.start(1000)
        mediaRecorderRef.current = mediaRecorder
        console.log('🎥 Recording initialization requested')
      } catch (err) {
        console.error('❌ Failed to start MediaRecorder:', err)
      }
    }

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

    useImperativeHandle(ref, () => ({ stopRecording, disconnectWebSocket }))

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

      // 서버(_write_wav)가 16kHz mono 로 저장하므로 전송 샘플레이트를 맞춘다.
      function downsample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
        if (fromRate <= toRate) return input

        const ratio = fromRate / toRate
        const output = new Float32Array(Math.floor(input.length / ratio))

        for (let i = 0; i < output.length; i++) {
          const start = Math.floor(i * ratio)
          const end = Math.min(Math.floor((i + 1) * ratio), input.length)
          let sum = 0
          for (let j = start; j < end; j++) sum += input[j]
          output[i] = end > start ? sum / (end - start) : 0
        }
        return output
      }

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
        // 1초(16000 샘플) 분량을 모아 전송한다.
        const targetSamples = TARGET_SAMPLE_RATE
        const accumulator: Float32Array[] = []
        let totalSamples = 0

        // ── 오디오 캡처 준비 (실패해도 아래 전송 타이머는 계속 동작한다) ──
        try {
          const audioTracks = stream.getAudioTracks()
          if (audioTracks.length === 0) {
            console.warn('⚠️ 오디오 트랙이 없습니다. 랜드마크만 전송합니다.')
          } else {
            const audioCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE })
            const source = audioCtx.createMediaStreamSource(new MediaStream(audioTracks))

            // 사용자 제스처 없이 만들어진 AudioContext 는 suspended 로 시작해 콜백이 돌지 않는다.
            if (audioCtx.state === 'suspended') {
              audioCtx.resume().catch((err) => console.error('AudioContext resume 실패', err))
            }
            console.log(`🎙️ AudioContext state=${audioCtx.state} rate=${audioCtx.sampleRate}`)

            if (audioCtx.sampleRate !== TARGET_SAMPLE_RATE) {
              console.warn(
                `⚠️ AudioContext 가 ${audioCtx.sampleRate}Hz 로 열렸습니다. ${TARGET_SAMPLE_RATE}Hz 로 다운샘플해 전송합니다.`
              )
            }

            const processor = audioCtx.createScriptProcessor(4096, 1, 1)
            source.connect(processor)
            processor.connect(audioCtx.destination)

            // 오디오는 모으기만 하고, 실제 전송은 아래 1초 타이머가 담당한다.
            processor.onaudioprocess = (e) => {
              if (isCleanup) return

              const input = new Float32Array(e.inputBuffer.getChannelData(0))
              const chunk =
                audioCtx.sampleRate === TARGET_SAMPLE_RATE
                  ? input
                  : downsample(input, audioCtx.sampleRate, TARGET_SAMPLE_RATE)
              accumulator.push(chunk)
              totalSamples += chunk.length
            }

            audioContextRef.current = audioCtx
            processorRef.current = processor
          }
        } catch (err) {
          console.error('❌ 오디오 캡처 초기화 실패 — 랜드마크만 전송합니다.', err)
        }

        // ── 1초마다 무조건 전송 ──
        // 오디오가 아직 안 나오더라도 프레임을 보내야 서버 수신 타임아웃(3초)에 걸려
        // 연결이 끊기지 않고, 시선/자세 분석도 계속 돌아간다.
        sendTimerRef.current = setInterval(() => {
          if (isCleanup) return
          if (wsRef.current?.readyState !== WebSocket.OPEN) return

          let base64Audio = ''
          if (totalSamples > 0) {
            const length = Math.min(totalSamples, targetSamples)
            const merged = new Float32Array(length)
            let offset = 0
            for (const c of accumulator) {
              if (offset >= length) break
              const slice = c.subarray(0, Math.min(c.length, length - offset))
              merged.set(slice, offset)
              offset += slice.length
            }
            accumulator.length = 0
            totalSamples = 0

            const int16 = float32ToInt16(merged)
            base64Audio = arrayBufferToBase64(int16.buffer as ArrayBuffer)
          }

          wsRef.current.send(JSON.stringify(buildPayload(base64Audio)))
        }, 1000)
      }

      function startMediapipe() {
        if (mediapipeStartedRef.current || isCleanup) return
        mediapipeStartedRef.current = true

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
                if (
                  data.type === 'surprise_question' &&
                  data.question_id &&
                  data.question &&
                  typeof data.time_limit === 'number'
                ) {
                  if (!toggleStatesRef.current.isEmergencyOn) {
                    console.log('⚠️ Surprise question ignored because emergency toggle is off')
                  } else {
                    onSurpriseQuestionReceivedRef.current?.({
                      question_id: data.question_id,
                      question: data.question,
                      time_limit: data.time_limit,
                    })
                  }
                }
              } catch (err) {
                console.error('WS Parse error', err)
              }
            }
            ws.onerror = (err) => console.error('WS Error', err)
            ws.onclose = () => console.log('🔴 WebSocket Disconnected')

            wsRef.current = ws
          }

          startMediapipeRef.current = startMediapipe

          // 카운트다운 중이면 여기서 시작하지 않고, canRecord 가 켜지는 시점의 effect 가 시작한다.
          if (canRecordRef.current) {
            startRecordingFromStream(stream)
            startMediapipe()
          }
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

        if (sendTimerRef.current) {
          clearInterval(sendTimerRef.current)
          sendTimerRef.current = null
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

        startMediapipeRef.current = null
        if (mediapipeStartedRef.current) {
          mediapipeStartedRef.current = false
          faceMesh.close()
          pose.close()
        }
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
