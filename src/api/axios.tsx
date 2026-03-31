import axios from 'axios'

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? 'http://43.201.182.246:8080' : '/api',
  // 필요한 경우 타임아웃 등 추가 설정 가능
  // timeout: 10000,
})

// 요청 가로채기 (인터셉터) 등 공통 로직을 여기에 추가할 수 있습니다.

export default axiosInstance
