import { useCallback, useEffect, useRef, useState } from 'react'
import { WS_BASE_URL } from '@/api/fetchClient'
import type { PracticeSubStep } from '@/api/practice'
import { getPracticeSessionId } from '@/utils/practiceSession'

/**
 * 연습탭 4단계(PRACTICE_IN_PROGRESS)의 하위단계 실시간 분석 WebSocket 훅.
 *
 * 엔드포인트
 *   ws://{host}/practice/realtime?sessionId={id}&subStep={SCRIPT|GAZE|...}
 *
 * 메시지 흐름
 *   1) 연결 성공 직후 서버가 session_start를 1회 내려준다 (하위단계별 컨텍스트).
 *   2) 진행 중에는 클라이언트가 audio 또는 face 페이로드를 계속 보내고,
 *      서버는 필요할 때 feedback 메시지를 내려준다. (안 올 수도 있음)
 *   3) 하위단계가 끝나면 서버가 result를 1회 내려준다.
 *
 * 주의: result를 받아도 서버가 연결을 먼저 끊지 않는다. FE가 직접 close()해야 한다.
 */

export interface PracticeSessionStartMessage {
  type: 'session_start'
  subStep: PracticeSubStep
  /** SCRIPT */
  script_text?: string
  speak_seconds?: number
  reference_range?: { wpm_min: number; wpm_max: number }
  /** GAZE */
  target_duration_sec?: number
  /** IMPROMPTU */
  topic?: string
  prep_seconds?: number
  /** KEYWORD / POINT (스펙상 미검증) */
  keywords?: string[]
  passage?: string
}

export interface PracticeResultMessage {
  type: 'result'
  subStep: PracticeSubStep
  score: number
  feedback_text: string
  raw_result?: Record<string, unknown>
}

export type RealtimeStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

interface UsePracticeRealtimeOptions {
  subStep: PracticeSubStep
  /** false면 연결하지 않는다. (세션이 아직 없을 때 등) */
  enabled?: boolean
}

export function usePracticeRealtime({ subStep, enabled = true }: UsePracticeRealtimeOptions) {
  const wsRef = useRef<WebSocket | null>(null)

  // 세션 ID는 마운트 시점에 한 번만 읽는다. (없으면 곧바로 error 상태로 시작)
  const [sessionId] = useState(() => getPracticeSessionId())
  const hasSession = !!sessionId

  const [status, setStatus] = useState<RealtimeStatus>(() => {
    if (!enabled) return 'idle'
    return hasSession ? 'connecting' : 'error'
  })
  const [sessionStart, setSessionStart] = useState<PracticeSessionStartMessage | null>(null)
  const [liveFeedback, setLiveFeedback] = useState<string[]>([])
  const [result, setResult] = useState<PracticeResultMessage | null>(null)
  // 세션이 없는 건 연결을 미루는 화면(enabled=false로 시작하는 GAZE 등)에서도 바로 알려야 한다.
  // 이 초기화 함수는 마운트 때 한 번만 돌기 때문에 enabled를 조건에 넣으면 영영 표시되지 않는다.
  const [errorMessage, setErrorMessage] = useState<string | null>(() =>
    hasSession ? null : '연습 세션이 없습니다. 처음부터 다시 시작해주세요.'
  )

  useEffect(() => {
    if (!enabled) return

    if (!sessionId) {
      console.error('[practice-realtime] sessionId가 없어 WebSocket에 연결할 수 없습니다.')
      return
    }

    const url = `${WS_BASE_URL}/practice/realtime?sessionId=${sessionId}&subStep=${subStep}`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setStatus('open')

    // 개발 중에는 서버가 보낸 내용을 콘솔에서 바로 확인할 수 있게 남긴다.
    // 배포 빌드에서는 import.meta.env.DEV가 false라 아예 실행되지 않는다.
    const log = (label: string, payload: unknown) => {
      if (import.meta.env.DEV) console.log(`[practice-realtime:${subStep}] ${label}`, payload)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'session_start':
            log('session_start ▶', data)
            setSessionStart(data as PracticeSessionStartMessage)
            break
          case 'feedback':
            // data.data는 문자열 배열로 내려온다. 단일 문자열로 오는 경우도 방어한다.
            log('feedback ▶', data.data)
            setLiveFeedback(Array.isArray(data.data) ? data.data : [String(data.data)])
            break
          case 'result':
            log(`result ▶ score ${data.score} ·`, {
              feedback_text: data.feedback_text,
              raw_result: data.raw_result,
            })
            setResult(data as PracticeResultMessage)
            break
          case 'error':
            // 서버 메시지는 "invalid or already completed subStep: SCRIPT" 같은 개발자용 문구라
            // 콘솔에만 남기고 화면에는 사용자용 문구를 보여준다.
            console.error('[practice-realtime] 서버 에러:', data.message)
            setErrorMessage('실시간 분석을 시작할 수 없습니다. 이전 단계부터 다시 진행해주세요.')
            setStatus('error')
            break
          default:
            break
        }
      } catch (err) {
        console.error('[practice-realtime] 메시지 파싱 실패', err)
      }
    }

    ws.onerror = () => {
      setStatus('error')
      setErrorMessage('실시간 분석 서버에 연결하지 못했습니다.')
    }

    ws.onclose = () => {
      setStatus((prev) => (prev === 'error' ? prev : 'closed'))
    }

    return () => {
      // 하위단계를 벗어날 때 FE가 직접 닫아준다.
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
      wsRef.current = null
    }
  }, [subStep, enabled, sessionId])

  /** 연결이 열려 있을 때만 페이로드를 보낸다. */
  const send = useCallback((payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return false
    wsRef.current.send(JSON.stringify(payload))
    return true
  }, [])

  /** 음성 하위단계용: base64 16bit PCM 전송 */
  const sendAudio = useCallback(
    (base64Audio: string) => send({ audio: base64Audio, timestamp: Date.now() }),
    [send]
  )

  /** GAZE용: 얼굴 랜드마크 전송 */
  const sendFace = useCallback(
    (face: Record<string, { x: number; y: number }>) => send({ face, timestamp: Date.now() }),
    [send]
  )

  const close = useCallback(() => {
    wsRef.current?.close()
  }, [])

  return {
    status,
    sessionStart,
    liveFeedback,
    result,
    errorMessage,
    send,
    sendAudio,
    sendFace,
    close,
  }
}

export default usePracticeRealtime
