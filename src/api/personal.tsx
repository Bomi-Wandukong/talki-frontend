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

export const getPersonalHome = async (): Promise<PersonalHomeResponse> => {
  const response = await api.get('/personal/home');
  console.log('getPersonalHome API response:', response);
  return response as PersonalHomeResponse;
};
