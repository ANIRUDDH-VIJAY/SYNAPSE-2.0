import axios from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // cookies allowed
});

// ------------------------------------------------
// FIXED CSRF INTERCEPTOR — ALWAYS SEND FOR NON-GET
// ------------------------------------------------
let csrfTokenMemory: string | null = null;

export const getStoredCsrfToken = () => csrfTokenMemory;

api.interceptors.request.use(
  (config) => {
    // FIX: method might be undefined → default to GET
    const method = (config.method || 'get').toUpperCase();

    if (csrfTokenMemory && method !== 'GET') {
      config.headers['X-CSRF-Token'] = csrfTokenMemory;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------
// RESPONSE INTERCEPTOR
// ------------------------------------------------
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

export const getCsrfToken = async () => {
  const response = await api.get('/auth/csrf');
  if (response.data?.csrf) {
    csrfTokenMemory = response.data.csrf;
  }
  return response;
};

// ------------------------------------------------
// AUTH API
// ------------------------------------------------
export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),

  updateProfile: (name: string) => api.put('/auth/profile', { name }),

  googleLogin: async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  githubLogin: async () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },
};

// ------------------------------------------------
// CHAT API
// ------------------------------------------------
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

// ------------------------------------------------
// ADMIN + FEEDBACK
// ------------------------------------------------
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserCount: () => api.get('/admin/users/count'),
  getFeedback: () => api.get('/admin/feedback'),
};

export const feedbackAPI = {
  submitFeedback: (message: string) => api.post('/feedback', { message }),
};

export default api;
