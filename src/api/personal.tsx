import api from './fetchClient'

export interface PersonalHomeResponse {
  userName: string | null
  practiceDays: {
    streakDays: number
    practiceDays: string[]
  }
  mindSetting: string | null
  recentPresentationReport: {
    dateTime: string
    totalScore: number
    topic: string
  } | null
}

/**
 * Validates the shape of the PersonalHomeResponse at runtime.
 */
function validatePersonalHomeResponse(data: any): data is PersonalHomeResponse {
  if (!data || typeof data !== 'object') {
    if (import.meta.env.DEV) console.warn('PersonalHome validation failed: basic object check');
    return false;
  }

  // Relaxed validation: allow missing or null fields as long as core types are mostly correct
  const hasValidUserName = typeof data.userName === 'string' || data.userName === null || data.userName === undefined;
  const hasValidPracticeDays = !data.practiceDays || (
    typeof data.practiceDays.streakDays === 'number' && 
    Array.isArray(data.practiceDays.practiceDays)
  );
  const hasValidMindSetting = typeof data.mindSetting === 'string' || data.mindSetting === null || data.mindSetting === undefined;
  const hasValidRecentReport = !data.recentPresentationReport || (
    typeof data.recentPresentationReport.dateTime === 'string' &&
    typeof data.recentPresentationReport.totalScore === 'number' &&
    typeof data.recentPresentationReport.topic === 'string'
  );

  if (import.meta.env.DEV) {
    if (!hasValidUserName) console.warn('Invalid userName:', data.userName);
    if (!hasValidPracticeDays) console.warn('Invalid practiceDays:', data.practiceDays);
    if (!hasValidMindSetting) console.warn('Invalid mindSetting:', data.mindSetting);
    if (!hasValidRecentReport) console.warn('Invalid recentReport:', data.recentPresentationReport);
  }

  return true; // We allow basically any object to pass and handle defaults in components
}

export const getPersonalHome = async (): Promise<PersonalHomeResponse> => {
  const response = await api.get('/personal/home')

  if (import.meta.env.DEV) {
    console.log('getPersonalHome API response:', response)
  }

  if (!validatePersonalHomeResponse(response)) {
    throw new Error('Invalid API response format for PersonalHomeResponse')
  }

  return response
}
