import { useCallback, useEffect, useRef, useState } from 'react'
import { ensureImpromptuSession } from '@/api/practice'
import type { PracticeSubStep } from '@/api/practice'

export const PRACTICE_WS_BASE = 'ws://43.201.182.246:8080'

/** FastAPI가 최종 STT를 16kHz mono wav로 저장하므로 전송 샘플레이트를 맞춘다. */
const TARGET_SAMPLE_RATE = 16000
/** 서버 수신 타임아웃(15초)에 걸리지 않도록 대기 구간에 보내는 하트비트 주기 */
const KEEPALIVE_INTERVAL_MS = 5000
/**
 * 서버는 "첫 오디오 프레임 수신 시각 + speak_seconds"를 넘긴 프레임이 도착해야 종료 판정을 한다.
 * 화면 카운트다운이 끝난 뒤에도 잠시 더 전송해 서버가 곧바로 결과를 계산하도록 한다.
 */
const TAIL_STREAM_MS = 5000
/** 서버 수신 타임아웃(15초) + CPU Whisper 재분석까지 감안한 결과 대기 상한 */
const RESULT_WAIT_TIMEOUT_MS = 60000

export type SubStepPhase =
  | 'connecting'
  | 'ready'
  | 'preparing'
  | 'recording'
  | 'analyzing'
  | 'finished'
  | 'error'

export interface SubStepContext {
  subStep: PracticeSubStep
  /** IMPROMPTU: 즉흥 말하기 주제 */
  topic?: string
  /** KEYWORD: 포함해야 할 키워드 3개 */
  keywords?: string[]
  /** POINT: 요약할 원문 */
  passage?: string
  /** POINT: 원문의 참고 키워드 */
  referenceKeywords?: string[]
  prepSeconds: number
  speakSeconds: number
}

export interface KeywordUsage {
  keyword: string
  used: boolean
}

export interface SubStepRawResult {
  wpm?: number
  fillers_count?: number
  fillers_freq?: number
  duration_sec?: number
  articulation_label?: string
  text?: string
  // IMPROMPTU
  spoken_duration_sec?: number
  structure_completeness?: string
  // KEYWORD
  keyword_usage?: KeywordUsage[]
  keyword_coverage?: string
  connection_naturalness?: string
  // POINT
  reference_keyword_coverage?: string
  gist_accuracy_label?: string
  missing_points?: string[]
}

export interface SubStepResult {
  subStep: PracticeSubStep
  score: number
  feedbackText: string
  raw: SubStepRawResult
}

/** 서버 → 클라이언트 WebSocket 메시지 (session_start / feedback / result / error) */
interface PracticeWsMessage {
  type?: 'session_start' | 'feedback' | 'result' | 'error'
  subStep?: PracticeSubStep
  topic?: string
  keywords?: string[]
  passage?: string
  reference_keywords?: string[]
  prep_seconds?: number
  speak_seconds?: number
  data?: string[]
  score?: number
  feedback_text?: string
  raw_result?: SubStepRawResult
  message?: string
}

/** 서버의 keyword_usage와 동일한 규칙(공백 제거 후 부분 문자열 포함)으로 사용 여부를 판정한다. */
export const isKeywordUsed = (keyword: string, text: string | undefined) =>
  (text ?? '').replace(/\s/g, '').includes(keyword.replace(/\s/g, ''))

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

function encodePcm16Base64(samples: Float32Array): string {
  const pcm = new Int16Array(samples.length)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }

  const bytes = new Uint8Array(pcm.buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/**
 * 연습탭 4단계 하위단계(IMPROMPTU / KEYWORD / POINT) 실시간 분석 WebSocket 훅.
 *
 * - 마운트 시 세션을 확보하고 ws://.../practice/realtime 에 접속해 session_start(주제·키워드·원문)를 받는다.
 * - 대기 구간에는 오디오 없는 하트비트만 보내 서버 수신 타임아웃을 방지한다.
 * - 말하기 구간에만 16kHz PCM16 오디오를 1초 단위로 전송하고, 최종 result 메시지를 결과로 돌려준다.
 */
export function usePracticeSubStep(subStep: PracticeSubStep) {
  const [phase, setPhase] = useState<SubStepPhase>('connecting')
  const [context, setContext] = useState<SubStepContext | null>(null)
  const [result, setResult] = useState<SubStepResult | null>(null)
  const [liveFeedback, setLiveFeedback] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [prepTimeLeft, setPrepTimeLeft] = useState(0)
  const [recordTimeLeft, setRecordTimeLeft] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isStreamingRef = useRef(false)

  /* ---------------- 전송 유틸 ---------------- */

  const send = useCallback((payload: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    }
  }, [])

  const stopKeepalive = useCallback(() => {
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current)
      keepaliveRef.current = null
    }
  }, [])

  const startKeepalive = useCallback(() => {
    stopKeepalive()
    keepaliveRef.current = setInterval(() => {
      // audio 필드가 없으면 서버는 분석 대상으로 삼지 않고 수신 타임아웃만 갱신한다.
      send({ timestamp: Date.now() })
    }, KEEPALIVE_INTERVAL_MS)
  }, [send, stopKeepalive])

  const stopAudioPipeline = useCallback(() => {
    isStreamingRef.current = false

    if (tailTimerRef.current) {
      clearTimeout(tailTimerRef.current)
      tailTimerRef.current = null
    }
    if (processorRef.current) {
      processorRef.current.onaudioprocess = null
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  /** 마이크 권한을 미리 확보해 준비 구간 도중 권한 창이 뜨는 것을 막는다. */
  const acquireMicrophone = useCallback(async () => {
    if (!streamRef.current) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
    }
    return streamRef.current
  }, [])

  const startAudioPipeline = useCallback(async () => {
    const stream = await acquireMicrophone()

    const audioCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE })
    const source = audioCtx.createMediaStreamSource(stream)
    const processor = audioCtx.createScriptProcessor(4096, 1, 1)

    const accumulated: Float32Array[] = []
    let accumulatedLength = 0

    processor.onaudioprocess = (event) => {
      if (!isStreamingRef.current) return

      const input = new Float32Array(event.inputBuffer.getChannelData(0))
      const chunk =
        audioCtx.sampleRate === TARGET_SAMPLE_RATE
          ? input
          : downsample(input, audioCtx.sampleRate, TARGET_SAMPLE_RATE)

      accumulated.push(chunk)
      accumulatedLength += chunk.length

      // 1초 분량이 모이면 전송
      if (accumulatedLength < TARGET_SAMPLE_RATE) return

      const merged = new Float32Array(accumulatedLength)
      let offset = 0
      for (const part of accumulated) {
        merged.set(part, offset)
        offset += part.length
      }
      accumulated.length = 0
      accumulatedLength = 0

      send({ audio: encodePcm16Base64(merged), timestamp: Date.now() })
    }

    source.connect(processor)
    processor.connect(audioCtx.destination)

    audioCtxRef.current = audioCtx
    processorRef.current = processor
    isStreamingRef.current = true
  }, [acquireMicrophone, send])

  /* ---------------- WebSocket 연결 ---------------- */

  useEffect(() => {
    let disposed = false

    const connect = async () => {
      try {
        const { sessionId } = await ensureImpromptuSession(subStep)
        if (disposed) return

        const ws = new WebSocket(
          `${PRACTICE_WS_BASE}/practice/realtime?sessionId=${sessionId}&subStep=${subStep}`
        )
        wsRef.current = ws

        ws.onopen = () => startKeepalive()

        ws.onmessage = (event) => {
          let data: PracticeWsMessage
          try {
            data = JSON.parse(event.data) as PracticeWsMessage
          } catch {
            return
          }

          if (data.type === 'session_start') {
            setContext({
              subStep,
              topic: data.topic,
              keywords: data.keywords,
              passage: data.passage,
              referenceKeywords: data.reference_keywords,
              prepSeconds: data.prep_seconds ?? 0,
              speakSeconds: data.speak_seconds ?? 30,
            })
            setPrepTimeLeft(data.prep_seconds ?? 0)
            setRecordTimeLeft(data.speak_seconds ?? 30)
            setPhase('ready')
            return
          }

          if (data.type === 'feedback' && Array.isArray(data.data)) {
            setLiveFeedback(data.data)
            return
          }

          if (data.type === 'result') {
            stopKeepalive()
            stopAudioPipeline()
            if (resultTimerRef.current) {
              clearTimeout(resultTimerRef.current)
              resultTimerRef.current = null
            }
            setResult({
              subStep: data.subStep ?? subStep,
              score: data.score ?? 0,
              feedbackText: data.feedback_text ?? '',
              raw: data.raw_result ?? {},
            })
            setPhase('finished')
            ws.close()
            return
          }

          if (data.type === 'error') {
            setError(data.message ?? '연습 세션을 시작할 수 없습니다.')
            setPhase('error')
          }
        }

        ws.onerror = () => {
          if (disposed) return
          setError('실시간 분석 서버에 연결하지 못했습니다.')
          setPhase('error')
        }

        ws.onclose = () => {
          stopKeepalive()
        }
      } catch (err) {
        if (disposed) return
        console.error('연습 세션 준비 실패', err)
        setError('연습 세션을 준비하지 못했습니다. 다시 시도해주세요.')
        setPhase('error')
      }
    }

    connect()

    return () => {
      disposed = true
      stopKeepalive()
      stopAudioPipeline()
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current)
        resultTimerRef.current = null
      }
      if (wsRef.current) {
        wsRef.current.onmessage = null
        wsRef.current.onerror = null
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [subStep, startKeepalive, stopKeepalive, stopAudioPipeline])

  /* ---------------- 진행 제어 ---------------- */

  const failWithMicError = useCallback(
    (err: unknown) => {
      console.error('마이크 접근 오류', err)
      setError('마이크 접근 권한이 필요합니다.')
      setPhase('error')
      // 연결은 유지하되 서버가 빈 결과로 세션을 끝내지 않도록 하트비트를 되살린다.
      startKeepalive()
    },
    [startKeepalive]
  )

  const beginRecording = useCallback(async () => {
    stopKeepalive()
    try {
      await startAudioPipeline()
      setPhase('recording')
    } catch (err) {
      failWithMicError(err)
    }
  }, [startAudioPipeline, stopKeepalive, failWithMicError])

  /** 마이크 버튼: 준비 시간이 있으면 준비 단계로, 없으면(POINT) 곧바로 녹음 */
  const start = useCallback(async () => {
    if (phase !== 'ready') return

    try {
      await acquireMicrophone()
    } catch (err) {
      failWithMicError(err)
      return
    }

    if ((context?.prepSeconds ?? 0) > 0) {
      setPhase('preparing')
    } else {
      await beginRecording()
    }
  }, [phase, context, beginRecording, acquireMicrophone, failWithMicError])

  /** 말하기 종료 → 서버의 최종 result 를 기다린다 */
  const stop = useCallback(
    (reason: 'timeout' | 'manual') => {
      setPhase('analyzing')

      if (reason === 'timeout') {
        // 서버가 speak_seconds 초과를 감지하도록 잠시 더 전송한 뒤 정리한다.
        tailTimerRef.current = setTimeout(() => stopAudioPipeline(), TAIL_STREAM_MS)
      } else {
        stopAudioPipeline()
      }

      // 결과가 끝내 오지 않아도 화면이 멈추지 않도록 상한을 둔다.
      resultTimerRef.current = setTimeout(() => {
        stopAudioPipeline()
        setNotice('분석 결과를 받지 못했어요. 다음 단계로 진행할 수 있습니다.')
        setPhase('finished')
      }, RESULT_WAIT_TIMEOUT_MS)
    },
    [stopAudioPipeline]
  )

  // 준비 / 말하기 카운트다운 (전환은 타이머 콜백 안에서 수행)
  useEffect(() => {
    if (phase === 'preparing') {
      const timer = setTimeout(() => {
        if (prepTimeLeft <= 1) {
          setPrepTimeLeft(0)
          void beginRecording()
        } else {
          setPrepTimeLeft((prev) => prev - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (phase === 'recording') {
      const timer = setTimeout(() => {
        if (recordTimeLeft <= 1) {
          setRecordTimeLeft(0)
          stop('timeout')
        } else {
          setRecordTimeLeft((prev) => prev - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, prepTimeLeft, recordTimeLeft, beginRecording, stop])

  const stopManually = useCallback(() => stop('manual'), [stop])

  return {
    phase,
    context,
    result,
    liveFeedback,
    error,
    /** 결과를 끝내 받지 못했을 때의 안내 문구 */
    notice,
    prepTimeLeft,
    recordTimeLeft,
    start,
    stop: stopManually,
  }
}
