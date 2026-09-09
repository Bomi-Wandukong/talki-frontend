import api from './fetchClient'

/* ------------------------------------------------------------------ */
/* 타입 정의 (스웨거 /practice 스키마 기준)                              */
/* ------------------------------------------------------------------ */

export type PracticeStepName =
  | 'THOUGHT_RECOGNITION'
  | 'BREATHING'
  | 'MODE_SELECTION'
  | 'PRACTICE_IN_PROGRESS'
  | 'BEHAVIORAL_EXPERIMENT'
  | 'ALTERNATIVE_THOUGHT'
  | 'COMPLETED'

export type PracticeMode = 'SCRIPT_BASED' | 'IMPROMPTU' | 'SKIPPED'

export type PracticeSubStep = 'SCRIPT' | 'GAZE' | 'SPEED' | 'IMPROMPTU' | 'KEYWORD' | 'POINT'

export interface SessionStartResponse {
  sessionId: string
  currentStep: PracticeStepName
}

export interface StepResponse {
  currentStep: PracticeStepName
  subStepQueue: PracticeSubStep[]
}

export interface SessionStateResponse {
  currentStep: PracticeStepName
  mode: PracticeMode
  subStepQueue: PracticeSubStep[]
  completedSubSteps: PracticeSubStep[]
}

export interface CompleteResponse {
  sessionId: string
  mode: PracticeMode
  completedSubSteps: PracticeSubStep[]
  alternativeThought: string
}

/* ------------------------------------------------------------------ */
/* REST API                                                            */
/* ------------------------------------------------------------------ */

/** 0단계: 훈련 시작 (세션 생성, Redis TTL 30분) */
export const startPracticeSession = (): Promise<SessionStartResponse> =>
  api.post('/practice/sessions')

/** 3단계: 연습 모드 선택 → 응답의 subStepQueue 순서대로 4단계를 진행한다 */
export const selectPracticeMode = (
  sessionId: string,
  mode: PracticeMode
): Promise<StepResponse> => api.patch(`/practice/sessions/${sessionId}/mode`, { mode })

/** 4단계 진행 상태 조회 (완료된 하위단계 동기화용) */
export const getPracticeSessionState = (sessionId: string): Promise<SessionStateResponse> =>
  api.get(`/practice/sessions/${sessionId}`)

/** 7단계: 완료 처리 (Redis → MySQL 이관) */
export const completePracticeSession = (sessionId: string): Promise<CompleteResponse> =>
  api.post(`/practice/sessions/${sessionId}/complete`)

/* ------------------------------------------------------------------ */
/* 세션 ID 보관 (연습 위저드 전체에서 공유)                              */
/* ------------------------------------------------------------------ */

const SESSION_KEY = 'practiceSessionId'

export const getStoredSessionId = () => sessionStorage.getItem(SESSION_KEY)
export const setStoredSessionId = (id: string) => sessionStorage.setItem(SESSION_KEY, id)
export const clearStoredSessionId = () => sessionStorage.removeItem(SESSION_KEY)

/**
 * 즉흥 구성 연습(IMPROMPTU)용 세션을 확보한다.
 *
 * 이미 유효한 세션이 있으면 그대로 재사용하고,
 * 없거나 만료(404)된 경우 세션을 새로 만들고 모드를 IMPROMPTU로 지정한다.
 * 반환되는 subStepQueue는 [IMPROMPTU, KEYWORD, POINT] 순서다.
 *
 * @param subStep 이어서 진행할 하위단계. 해당 단계가 이미 완료된 세션이면
 *                WebSocket 연결이 거부되므로 세션을 새로 발급한다.
 */
export const ensureImpromptuSession = async (
  subStep?: PracticeSubStep
): Promise<{
  sessionId: string
  subStepQueue: PracticeSubStep[]
  completedSubSteps: PracticeSubStep[]
}> => {
  const stored = getStoredSessionId()

  if (stored) {
    try {
      const state = await getPracticeSessionState(stored)
      const completedSubSteps = state.completedSubSteps ?? []
      const alreadyDone = !!subStep && completedSubSteps.includes(subStep)

      if (state.mode === 'IMPROMPTU' && state.subStepQueue?.length && !alreadyDone) {
        return { sessionId: stored, subStepQueue: state.subStepQueue, completedSubSteps }
      }

      if (!alreadyDone) {
        // 세션은 살아있지만 아직 모드가 정해지지 않은 경우
        const step = await selectPracticeMode(stored, 'IMPROMPTU')
        return { sessionId: stored, subStepQueue: step.subStepQueue ?? [], completedSubSteps }
      }

      // 이미 마친 하위단계 → 새 세션으로 다시 시작
      clearStoredSessionId()
    } catch {
      // 만료·폐기된 세션 → 아래에서 새로 발급
      clearStoredSessionId()
    }
  }

  const { sessionId } = await startPracticeSession()
  setStoredSessionId(sessionId)
  const step = await selectPracticeMode(sessionId, 'IMPROMPTU')

  return { sessionId, subStepQueue: step.subStepQueue ?? [], completedSubSteps: [] }
}
