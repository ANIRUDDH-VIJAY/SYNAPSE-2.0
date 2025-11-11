import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as auth from './auth';

describe('postChatMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // set default env for tests (some runtimes prefer process.env)
    (import.meta as any).env = { VITE_BACKEND_URL: 'https://example.com' };
    (process.env as any).VITE_BACKEND_URL = 'https://example.com';
    vi.spyOn(auth, 'getAuthToken').mockReturnValue(null as any);
  });

  it('posts to VITE_BACKEND_URL/chat/message with text and chatId', async () => {
    const fakeFetch = vi.fn(() => Promise.resolve({ ok: true }));
    (global as any).fetch = fakeFetch;

    // import the module after setting import.meta.env to ensure the module reads the test env
    const { postChatMessage } = await import('./network');

    await postChatMessage('hello', 'chat123');

  expect(fakeFetch).toHaveBeenCalled();
  const call = (fakeFetch as any).mock.calls[0] as any;
  const url = call[0];
  const opts = call[1];
  expect(url).toBe('https://example.com/chat/message');
  expect(opts?.method).toBe('POST');
  const body = JSON.parse(opts?.body);
    expect(body.text).toBe('hello');
    expect(body.chatId).toBe('chat123');
  });
});
