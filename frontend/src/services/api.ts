import axios from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // include backend cookies
});

/* ------------------ CSRF + AUTH REQUEST INTERCEPTOR ------------------ */
api.interceptors.request.use(
  (config) => {
    // Prefer stored CSRF token (cross-domain safe)
    const csrfToken = localStorage.getItem('csrf_token') ||
      document.cookie.split('; ')
        .find((row) => row.startsWith('csrf_token='))
        ?.split('=')[1];

    if (
      csrfToken &&
      ['post', 'put', 'patch', 'delete'].includes(
        config.method?.toLowerCase() || ''
      )
    ) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Attach Bearer token if present
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------ RESPONSE INTERCEPTOR ------------------ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/* ------------------ FETCH + STORE CSRF TOKEN ------------------ */
export const getCsrfToken = async () => {
  const res = await api.get('/auth/csrf');
  const token = res?.data?.csrf;
  if (token) {
    localStorage.setItem('csrf_token', token);
    api.defaults.headers['X-CSRF-Token'] = token; // auto-attach going forward
  }
  return res;
};

/* ------------------ AUTH API ------------------ */
export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),

  updateProfile: (name: string) =>
    api.put('/auth/profile', { name }),

  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  githubLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },
};

/* ------------------ CHAT API ------------------ */
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

/* ------------------ ADMIN API ------------------ */
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserCount: () => api.get('/admin/users/count'),
  getFeedback: () => api.get('/admin/feedback'),
};

/* ------------------ FEEDBACK API ------------------ */
export const feedbackAPI = {
  submitFeedback: (message: string) => api.post('/feedback', { message }),
};

export default api;
