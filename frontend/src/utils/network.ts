import { getAuthToken } from './auth';

export async function postChatMessage(text: string, chatId?: string) {
  if (!text || !text.trim()) return;
  // Prefer Vite's import.meta.env, fallback to process.env for test/runtime flexibility
  const base = ((import.meta as any)?.env?.VITE_BACKEND_URL as string) || process.env.VITE_BACKEND_URL || 'http://localhost:4000';
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
