import { type ErrorDetails } from '../components/chat/ErrorBanner';

interface ApiErrorResponse {
  error: ErrorDetails;
}

interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(public details: ErrorDetails) {
    super(details.title);
  }
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private csrfToken?: string;

  private constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    };
  }

  static getInstance(config?: ApiConfig): ApiClient {
    if (!this.instance && config) {
      this.instance = new ApiClient(config);
    }
    if (!this.instance) {
      throw new Error('ApiClient not initialized');
    }
    return this.instance;
  }

  setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
    headers: Record<string, string> = {}
  ): Promise<T> {

    // Add CSRF if required
    if (
      this.csrfToken &&
      (options.method === 'POST' ||
        options.method === 'PUT' ||
        options.method === 'DELETE')
    ) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        credentials: 'include', // Required for cookies
        headers: {
          ...this.defaultHeaders,
          ...headers
        }
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        // Some API routes return empty body (204)
        data = {};
      }

      if (!response.ok) {
        throw new ApiError(
          data?.error || {
            title: 'Server error — something went wrong.',
            what: 'Unexpected server error.',
            action: 'Please try again.',
            code: 'SERVER_ERROR'
          }
        );
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;

      throw new ApiError({
        title: 'Network error — unable to reach server.',
        what: 'Connection failed or timed out.',
        action: 'Check your connection and try again.',
        code: 'NETWORK_FAILURE'
      });
    }
  }
}

// Initialize global instance
export const api = ApiClient.getInstance({
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
});
