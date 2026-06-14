import axios from 'axios';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'https://api.booktown.shop'}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token to authorization header if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g. token expired, server error)
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized (token expired) and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Attempt to reissue access token
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL ?? 'https://api.booktown.shop'}/api/v1/auth/reissue`,
            { refreshToken }
          );
          const newAccessToken = data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        }
      } catch {
        // Reissue failed: Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
