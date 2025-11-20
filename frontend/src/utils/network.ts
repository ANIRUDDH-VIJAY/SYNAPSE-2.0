import { getAuthToken } from './auth';

export async function postChatMessage(text: string, chatId?: string) {
  if (!text || !text.trim()) return;
  // Prefer Vite's import.meta.env
  const base = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000';
  const token = getAuthToken();
  return fetch(`${base}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ text, chatId }),
  });
}

export default postChatMessage;
