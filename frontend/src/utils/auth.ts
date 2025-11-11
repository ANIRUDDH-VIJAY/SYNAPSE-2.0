// src/utils/auth.ts
export function getAuthToken(): string | null {
  try {
    // Support multiple token shapes stored in localStorage (guard for non-browser test envs)
    if (typeof localStorage === 'undefined' || localStorage === null) return null;
    const raw = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('user');
    if (!raw) return null;

    // If user object stringified
    if (raw.startsWith('{') || raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        return parsed?.token || parsed?.accessToken || parsed?.authToken || null;
      } catch (e) {
        return null;
      }
    }

    // Otherwise assume it's a bare token string
    return raw;
  } catch (e) {
    console.error('getAuthToken error', e);
    return null;
  }
}

export default getAuthToken;
