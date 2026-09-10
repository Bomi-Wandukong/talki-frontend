import type { PracticeMode, PracticeSubStep } from '@/api/practice'

/**
 * 연습 세션 정보를 화면 간에 넘기기 위한 localStorage 래퍼.
 *
 * 서버 세션은 Redis TTL 30분이고 중간 이탈 시 재개할 수 없다.
 * 따라서 여기 저장된 값은 "현재 진행 중인 위저드 1회분"의 임시 상태이고,
 * 7단계(complete)가 끝나면 clearPracticeSession()으로 비운다.
 */

const KEY_SESSION_ID = 'practiceSessionId'
const KEY_MODE = 'practiceMode'
const KEY_SUB_STEP_QUEUE = 'practiceSubStepQueue'

export const setPracticeSessionId = (sessionId: string) => {
  localStorage.setItem(KEY_SESSION_ID, sessionId)
}

export const getPracticeSessionId = (): string | null => localStorage.getItem(KEY_SESSION_ID)

export const setPracticeMode = (mode: PracticeMode) => {
  localStorage.setItem(KEY_MODE, mode)
}

export const getPracticeMode = (): PracticeMode | null =>
  localStorage.getItem(KEY_MODE) as PracticeMode | null

export const setSubStepQueue = (queue: PracticeSubStep[]) => {
  localStorage.setItem(KEY_SUB_STEP_QUEUE, JSON.stringify(queue))
}

export const getSubStepQueue = (): PracticeSubStep[] => {
  const raw = localStorage.getItem(KEY_SUB_STEP_QUEUE)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PracticeSubStep[]) : []
  } catch {
    return []
  }
}

/** 7단계 완료 후, 또는 세션을 새로 시작하기 전에 이전 값을 비운다. */
export const clearPracticeSession = () => {
  localStorage.removeItem(KEY_SESSION_ID)
  localStorage.removeItem(KEY_MODE)
  localStorage.removeItem(KEY_SUB_STEP_QUEUE)
  // 화면 쪽에서 쓰던 임시 키도 같이 정리
  localStorage.removeItem('practiceType')
  localStorage.removeItem('practiceFeelSelected')
}
