import api from './fetchClient';

export interface PersonalHomeResponse {
  userName: string;
  practiceDays: {
    streakDays: number;
    practiceDays: string[];
  };
  mindSetting: string;
  recentPresentationReport: {
    dateTime: string;
    totalScore: number;
    topic: string;
  } | null;
}

/**
 * Validates the shape of the PersonalHomeResponse at runtime.
 */
function validatePersonalHomeResponse(data: any): data is PersonalHomeResponse {
  if (!data || typeof data !== 'object') return false;

  const hasValidPracticeDays =
    data.practiceDays &&
    typeof data.practiceDays.streakDays === 'number' &&
    Array.isArray(data.practiceDays.practiceDays);

  const hasValidRecentReport =
    data.recentPresentationReport === null ||
    (typeof data.recentPresentationReport === 'object' &&
      typeof data.recentPresentationReport.dateTime === 'string' &&
      typeof data.recentPresentationReport.totalScore === 'number' &&
      typeof data.recentPresentationReport.topic === 'string');

  return (
    typeof data.userName === 'string' &&
    typeof data.mindSetting === 'string' &&
    !!hasValidPracticeDays &&
    !!hasValidRecentReport
  );
}

export const getPersonalHome = async (): Promise<PersonalHomeResponse> => {
  const response = await api.get('/personal/home');

  if (import.meta.env.DEV) {
    console.log('getPersonalHome API response:', response);
  }

  if (!validatePersonalHomeResponse(response)) {
    throw new Error('Invalid API response format for PersonalHomeResponse');
  }

  return response;
};
