import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies (for HTTP-only auth tokens)
});

// Request interceptor: attach CSRF token and handle authentication
api.interceptors.request.use(
  (config) => {
    // CSRF token from cookie (for mutations)
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];

    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data on unauthorized
      localStorage.removeItem('user');
      // Cookie will be cleared by backend on logout
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const getCsrfToken = () => api.get('/auth/csrf');


export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
  
  updateProfile: (name: string) =>
    api.put('/auth/profile', { name }),
  
  // OAuth redirects
  googleLogin: async () => {
    try {
      // Check if OAuth is configured
      const response = await api.get('/auth/google', { validateStatus: (status) => status < 500 });
      if (response.status === 503) {
        alert('Google OAuth is not configured. Please contact the administrator or use email/password login.');
        return;
      }
      // If we get here, it's a redirect (302), just follow it
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (error: any) {
      // If it's a redirect error (302), that's fine - just redirect
      if (error.response?.status === 302 || !error.response) {
        window.location.href = `${API_BASE_URL}/auth/google`;
      } else if (error.response?.status === 503) {
        alert('Google OAuth is not configured. Please contact the administrator or use email/password login.');
      } else {
        console.error('Google OAuth error:', error);
        alert('Failed to initiate Google login. Please try again.');
      }
    }
  },
  
  githubLogin: async () => {
    try {
      // Check if OAuth is configured
      const response = await api.get('/auth/github', { validateStatus: (status) => status < 500 });
      if (response.status === 503) {
        alert('GitHub OAuth is not configured. Please contact the administrator or use email/password login.');
        return;
      }
      // If we get here, it's a redirect (302), just follow it
      window.location.href = `${API_BASE_URL}/auth/github`;
    } catch (error: any) {
      // If it's a redirect error (302), that's fine - just redirect
      if (error.response?.status === 302 || !error.response) {
        window.location.href = `${API_BASE_URL}/auth/github`;
      } else if (error.response?.status === 503) {
        alert('GitHub OAuth is not configured. Please contact the administrator or use email/password login.');
      } else {
        console.error('GitHub OAuth error:', error);
        alert('Failed to initiate GitHub login. Please try again.');
      }
    }
  },
};

export const chatAPI = {
  createChat: () => api.post('/chat/create'),
  
  sendMessage: (chatId: string, text: string) =>
    api.post('/chat/message', { chatId, text }),
  
  getChatHistory: () => api.get('/chat/history'),
  
  getChat: (chatId: string) => api.get(`/chat/${chatId}`),
  
  toggleStar: (chatId: string) => api.patch(`/chat/${chatId}/star`),
  
  deleteChat: (chatId: string) => api.delete(`/chat/${chatId}`),
  
  clearAllChats: () => api.delete('/chat/clear'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserCount: () => api.get('/admin/users/count'),
  getFeedback: () => api.get('/admin/feedback'),
};

export const feedbackAPI = {
  submitFeedback: (message: string) => api.post('/feedback', { message }),
};

export default api;

