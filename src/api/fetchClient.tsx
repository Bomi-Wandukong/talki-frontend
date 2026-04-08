export const BASE_URL = import.meta.env.PROD ? 'http://43.201.182.246:8080' : '/api';

interface FetchClientOptions extends RequestInit {
  data?: any;
}

const fetchClient = async (endpoint: string, options: FetchClientOptions = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!(options.data instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // LocalStorage Token Header 
  const token = localStorage.getItem('accessToken');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    if (options.data instanceof FormData) {
      config.body = options.data;
    } else {
      config.body = JSON.stringify(options.data);
    }
  }

  let response = await fetch(url, config);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const reissueOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        };
        const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, reissueOptions);
        
        if (reissueRes.ok) {
          const reissueData = await reissueRes.json();
          const { newAccess, newRefresh } = reissueData;
          localStorage.setItem('accessToken', newAccess);
          localStorage.setItem('refreshToken', newRefresh);

          // Retry the original request
          headers.set('Authorization', `Bearer ${newAccess}`);
          const retryConfig = { ...config, headers };
          response = await fetch(url, retryConfig);
        } else {
          // Refresh token invalid or expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (err) {
        console.error('Failed to reissue token', err);
      }
    }
  }

  if (!response.ok) {
    // You could also parse the error body here if backend sends error details
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return response;
};

export const api = {
  get: (endpoint: string, options?: FetchClientOptions) => 
    fetchClient(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: FetchClientOptions) => 
    fetchClient(endpoint, { ...options, method: 'POST', data }),
  put: (endpoint: string, data?: any, options?: FetchClientOptions) => 
    fetchClient(endpoint, { ...options, method: 'PUT', data }),
  patch: (endpoint: string, data?: any, options?: FetchClientOptions) =>
    fetchClient(endpoint, { ...options, method: 'PATCH', data }),
  delete: (endpoint: string, options?: FetchClientOptions) =>
    fetchClient(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
