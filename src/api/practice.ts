import api from './fetchClient'

/* ------------------------------------------------------------------ */
/* 공통 타입 (openapi.json / tag: Practice 기준)                        */
/* ------------------------------------------------------------------ */

/** 서버가 관리하는 연습 세션의 현재 단계 */
export type PracticeStepName =
  | 'THOUGHT_RECOGNITION'
  | 'BREATHING'
  | 'MODE_SELECTION'
  | 'PRACTICE_IN_PROGRESS'
  | 'BEHAVIORAL_EXPERIMENT'
  | 'ALTERNATIVE_THOUGHT'
  | 'COMPLETED'

/** 3단계에서 고르는 연습 모드 */
export type PracticeMode = 'SCRIPT_BASED' | 'IMPROMPTU' | 'SKIPPED'

/** 4단계(PRACTICE_IN_PROGRESS)에서 WebSocket으로 진행하는 하위단계 */
export type PracticeSubStep = 'SCRIPT' | 'GAZE' | 'SPEED' | 'IMPROMPTU' | 'KEYWORD' | 'POINT'

/** 1단계 자동사고 항목 */
export type NegativeThought =
  | 'FEAR_OF_JUDGEMENT'
  | 'FEAR_OF_FAILURE'
  | 'FEAR_OF_BLANKING'
  | 'FEAR_OF_BORING_AUDIENCE'
  | 'PHYSICAL_ANXIETY'
  | 'OTHER'

/** 5단계 행동실험 결과 (예상 대비 실제) */
export type ExpectationVsReality =
  | 'MUCH_WORSE_THAN_EXPECTED'
  | 'WORSE_THAN_EXPECTED'
  | 'AS_EXPECTED'
  | 'BETTER_THAN_EXPECTED'
  | 'MUCH_BETTER_THAN_EXPECTED'

/** 6단계 대체사고 항목 */
export type AlternativeThoughtOption =
  | 'PRACTICE_MAKES_IT_BETTER'
  | 'MISTAKES_ARE_OKAY'
  | 'AUDIENCE_IS_ON_MY_SIDE'
  | 'CUSTOM'

export interface SessionStartResponse {
  sessionId: string
  currentStep: PracticeStepName
}

export interface StepResponse {
  currentStep: PracticeStepName
  subStepQueue?: PracticeSubStep[]
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

export interface SubStepResultResponse {
  subStep: PracticeSubStep
  score: number
  feedbackText: string
  /** 서버가 문자열로 직렬화해서 내려주는 원본 분석 결과 JSON */
  rawResultJson: string
}

export interface ReportResponse {
  sessionId: string
  createdAt: string
  mode: PracticeMode
  thoughtRecognition: {
    selectedThoughts: NegativeThought[]
    customThought: string | null
  }
  behavioralExperiment: {
    expectationVsReality: ExpectationVsReality
  }
  alternativeThought: {
    selectedThought: AlternativeThoughtOption
    customThought: string | null
  }
  subStepResults: SubStepResultResponse[]
}

/* ------------------------------------------------------------------ */
/* 0 ~ 7단계 API                                                        */
/* ------------------------------------------------------------------ */

/**
 * 0단계: 훈련 시작. 세션을 새로 만들고 sessionId를 발급받는다.
 * 세션 상태는 Redis에만 저장되고 TTL이 30분이며, 중간 이탈 시 재개할 수 없다.
 */
export const startPracticeSession = (): Promise<SessionStartResponse> =>
  api.post('/practice/sessions')

/** 1단계: 자동사고 인식 (복수 선택 + 직접 입력) */
export const submitThoughtRecognition = (
  sessionId: string,
  body: { selectedThoughts: NegativeThought[]; customThought?: string | null }
): Promise<StepResponse> =>
  api.patch(`/practice/sessions/${sessionId}/thought-recognition`, body)

/** 2단계: 호흡 조절 애니메이션 완료 여부 기록 */
export const submitBreathing = (sessionId: string, completed: boolean): Promise<StepResponse> =>
  api.patch(`/practice/sessions/${sessionId}/breathing`, { completed })

/**
 * 3단계: 연습 모드 선택.
 * 응답의 subStepQueue 순서대로 4단계 WebSocket에 연결하면 된다.
 */
export const submitMode = (sessionId: string, mode: PracticeMode): Promise<StepResponse> =>
  api.patch(`/practice/sessions/${sessionId}/mode`, { mode })

/** 4단계 진행 상태 조회 (WebSocket 진행 상황을 FE가 동기화할 때 사용) */
export const getPracticeSessionState = (sessionId: string): Promise<SessionStateResponse> =>
  api.get(`/practice/sessions/${sessionId}`)

/** 5단계: 행동실험 결과 (예상과 실제 비교) */
export const submitBehavioralExperiment = (
  sessionId: string,
  expectationVsReality: ExpectationVsReality
): Promise<StepResponse> =>
  api.patch(`/practice/sessions/${sessionId}/behavioral-experiment`, { expectationVsReality })

/** 6단계: 대체 사고 선택 (CUSTOM이면 customThought에 문장을 담아 보낸다) */
export const submitAlternativeThought = (
  sessionId: string,
  body: { selectedThought: AlternativeThoughtOption; customThought?: string | null }
): Promise<StepResponse> =>
  api.patch(`/practice/sessions/${sessionId}/alternative-thought`, body)

/**
 * 7단계: 완료 처리. Redis 세션을 MySQL로 이관하고 스트릭을 갱신한다.
 * 호출 이후 GET /practice/sessions/{sessionId}는 404가 된다.
 */
export const completePracticeSession = (sessionId: string): Promise<CompleteResponse> =>
  api.post(`/practice/sessions/${sessionId}/complete`)

/** 완료된 세션의 최종 리포트 조회 (complete 처리 후에만 조회 가능) */
export const getPracticeReport = (sessionId: string): Promise<ReportResponse> =>
  api.get(`/practice/sessions/${sessionId}/report`)

/* ------------------------------------------------------------------ */
/* 화면 문구 <-> 서버 enum 매핑                                          */
/* ------------------------------------------------------------------ */

/**
 * 자동사고 enum -> 화면 문구. 여기가 유일한 원본이다.
 *
 * 서버 enum을 기준으로 삼고 문구를 1:1로 맞췄기 때문에,
 * 보낼 때도 받을 때도 값이 뭉개지지 않는다.
 * 스펙의 설명("실패에 대한 두려움")은 명사형이라 그대로 쓰지 않고,
 * 선택지로 읽히도록 ~것 같다 / ~할 것이다 어미로 통일했다.
 */
export const THOUGHT_ENUM_TO_LABEL: Record<NegativeThought, string> = {
  FEAR_OF_JUDGEMENT: '사람들이 나를 이상하게 볼 것 같다.',
  FEAR_OF_FAILURE: '발표를 망치고 실패할 것 같다.',
  FEAR_OF_BLANKING: '말을 하다가 머릿속이 하얘질 것 같다.',
  FEAR_OF_BORING_AUDIENCE: '사람들이 내 이야기를 지루해할 것 같다.',
  PHYSICAL_ANXIETY: '긴장해서 목소리가 떨리고 몸이 굳을 것 같다.',
  OTHER: '', // 직접 입력이므로 customThought를 대신 쓴다
}

/** 1단계 화면에 뿌릴 선택지 순서. OTHER는 "직접 입력하기" 버튼이 담당하므로 뺀다. */
export const THOUGHT_OPTIONS: NegativeThought[] = [
  'FEAR_OF_JUDGEMENT',
  'FEAR_OF_FAILURE',
  'FEAR_OF_BLANKING',
  'FEAR_OF_BORING_AUDIENCE',
  'PHYSICAL_ANXIETY',
]

/** 자동사고 하나를 화면에 찍을 문장으로 바꾼다. OTHER면 사용자가 입력한 문장을 쓴다. */
export const formatThought = (
  thought: NegativeThought,
  customThought?: string | null
): string =>
  thought === 'OTHER'
    ? (customThought?.trim() || '직접 입력한 생각')
    : THOUGHT_ENUM_TO_LABEL[thought]

/** 5단계 화면의 선택지 id -> 서버 enum */
export const FEEL_ID_TO_ENUM: Record<string, ExpectationVsReality> = {
  'much-better': 'MUCH_BETTER_THAN_EXPECTED',
  'little-better': 'BETTER_THAN_EXPECTED',
  similar: 'AS_EXPECTED',
  'little-harder': 'WORSE_THAN_EXPECTED',
  'much-harder': 'MUCH_WORSE_THAN_EXPECTED',
}

/** 하위단계 enum -> 화면 표시용 한글 라벨 */
export const SUB_STEP_LABEL: Record<PracticeSubStep, string> = {
  SCRIPT: '스크립트 읽기 연습',
  GAZE: '시선 고정 훈련',
  SPEED: '말 속도 훈련',
  IMPROMPTU: '즉흥 말하기',
  KEYWORD: '키워드 기반 구성',
  POINT: '핵심 파악 연습',
}

/**
 * 대체사고 enum -> 화면 문구. 자동사고와 마찬가지로 여기가 유일한 원본이다.
 * 서버 enum 기준으로 1:1로 맞춰서 보낼 때도 받을 때도 값이 뭉개지지 않는다.
 * 스스로에게 거는 마음가짐 문장이라 인용부호와 반말 어투를 유지한다.
 */
export const ALTERNATIVE_THOUGHT_LABEL: Record<AlternativeThoughtOption, string> = {
  MISTAKES_ARE_OKAY: '"실수해도 괜찮아. 완벽하지 않아도 충분해."',
  PRACTICE_MAKES_IT_BETTER: '"연습할수록 나아질 거야. 오늘도 한 걸음 나아갔어."',
  AUDIENCE_IS_ON_MY_SIDE: '"청중은 내 편이야. 내 이야기를 들으러 온 사람들이야."',
  CUSTOM: '', // 직접 입력이므로 customThought를 대신 쓴다
}

/** 6단계 화면에 뿌릴 선택지 순서. CUSTOM은 "직접 입력하기" 버튼이 담당하므로 뺀다. */
export const ALTERNATIVE_THOUGHT_OPTIONS: AlternativeThoughtOption[] = [
  'MISTAKES_ARE_OKAY',
  'PRACTICE_MAKES_IT_BETTER',
  'AUDIENCE_IS_ON_MY_SIDE',
]

/** 대체사고를 화면에 찍을 문장으로 바꾼다. CUSTOM이면 사용자가 입력한 문장을 쓴다. */
export const formatAlternativeThought = (
  selected: AlternativeThoughtOption,
  customThought?: string | null
): string =>
  selected === 'CUSTOM'
    ? (customThought?.trim() || '직접 입력한 문장')
    : ALTERNATIVE_THOUGHT_LABEL[selected]

/** 행동실험 결과 enum -> 화면 출력용 문장 (5단계 선택지 문구와 동일) */
export const EXPECTATION_LABEL: Record<ExpectationVsReality, string> = {
  MUCH_BETTER_THAN_EXPECTED: '예상보다 훨씬 더 나았어요.',
  BETTER_THAN_EXPECTED: '예상보다 조금 나았어요.',
  AS_EXPECTED: '예상한 것과 비슷했어요.',
  WORSE_THAN_EXPECTED: '예상보다 조금 어려웠어요.',
  MUCH_WORSE_THAN_EXPECTED: '예상보다 훨씬 어려웠어요.',
}
