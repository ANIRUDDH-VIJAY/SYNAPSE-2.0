import { v4 as uuidv4 } from 'uuid';
import { type Message } from '../components/chat/ChatWindow';
import { type ErrorDetails } from '../components/chat/ErrorBanner';

interface StreamChunk {
  type: 'token' | 'done';
  content?: string;
  messageId?: string;
  error?: ErrorDetails;
}

interface ChatResponse {
  message?: Message;
  error?: ErrorDetails;
  remainingMessages?: number;
}

interface SendMessageOptions {
  text: string;
  threadId?: string;
  clientMessageId?: string;
  retryWithFallback?: boolean;
}

type MessageUpdateListener = (message: Message) => void;

export class ChatService {
  private static instance: ChatService;
  private pendingRequests: Map<string, AbortController> = new Map();
  private messageCount = 0;
  private messageUpdateListeners: Set<MessageUpdateListener> = new Set();
  
  private constructor() {}

  static getInstance(): ChatService {
    if (!this.instance) {
      this.instance = new ChatService();
    }
    return this.instance;
  }

  async sendMessage({
    text,
    threadId,
    clientMessageId = uuidv4(),
    retryWithFallback = false
  }: SendMessageOptions): Promise<ChatResponse> {
    // Cancel any existing request with same clientMessageId
    this.abortRequest(clientMessageId);
    
    const controller = new AbortController();
    this.pendingRequests.set(clientMessageId, controller);

    try {
      // Use fetch for streaming in the browser because axios doesn't expose
      // a readable stream for response body in browser environments.
      const API_BASE = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000';
      const url = `${API_BASE.replace(/\/$/, '')}/chat/message/stream`;

      // Get CSRF token from cookie for POST requests
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf_token='))
        ?.split('=')[1];

      const fetchResponse = await fetch(url, {
        method: 'POST',
        credentials: 'include', // include cookies for auth
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '' // Add CSRF token header
        },
        body: JSON.stringify({ text, chatId: threadId, clientMessageId, stream: true, retryWithFallback }),
        signal: controller.signal
      });

      if (!fetchResponse.ok) {
        // If streaming endpoint doesn't exist or errors, fall back to axios
        if (fetchResponse.status === 404) {
          throw Object.assign(new Error('Not Found'), { response: { status: 404 } });
        }
        // Read body for error details
        const errText = await fetchResponse.text().catch(() => '');
        throw { response: { status: fetchResponse.status, data: { error: errText } } };
      }

      // Parse SSE-like streaming body
      const reader = fetchResponse.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      let finalContent = '';
      const remainingMessagesHeader = fetchResponse.headers.get('x-dailylimit-remaining');
      const remainingMessages = Number(remainingMessagesHeader || 0);
      this.messageCount = 20 - remainingMessages;

      if (!reader) {
        // No readable stream available, fall back to reading text
        const textBody = await fetchResponse.text();
        // Try to parse as lines
        const lines = (textBody || '').split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk: StreamChunk = JSON.parse(line.slice(6));
              if (chunk.type === 'token' && chunk.content) {
                finalContent += chunk.content;
                this.emit('messageUpdate', {
                  id: `ai-pending-${clientMessageId}`,
                  clientMessageId,
                  role: 'assistant',
                  status: 'streaming',
                  partialContent: finalContent
                });
              } else if (chunk.type === 'done') {
                const finalMessage: Message = {
                  id: `ai-${clientMessageId}`,
                  clientMessageId,
                  role: 'assistant',
                  content: finalContent,
                  status: 'done',
                  timestamp: new Date().toISOString()
                };
                this.emit('messageUpdate', finalMessage);
                return { message: finalMessage, remainingMessages };
              }
            } catch (e) {
              console.error('Error parsing fallback chunk:', e);
            }
          }
        }

        return { message: { id: `ai-${clientMessageId}`, clientMessageId, role: 'assistant', content: finalContent, status: 'done' }, remainingMessages };
      }

      while (!done) {
        const result = await reader.read();
        done = !!result.done;
        const chunkText = decoder.decode(result.value || new Uint8Array(), { stream: true });
        buffer += chunkText;

        // Process any complete SSE messages in buffer (separated by double newline)
        let boundary;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const raw = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          const lines = raw.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const chunk: StreamChunk = JSON.parse(line.slice(6));
                if (chunk.type === 'token' && chunk.content) {
                  finalContent += chunk.content;
                  const streamingMessage: Message = {
                    id: `ai-pending-${clientMessageId}`,
                    clientMessageId,
                    role: 'assistant',
                    status: 'streaming',
                    partialContent: finalContent
                  };
                  this.emit('messageUpdate', streamingMessage);
                } else if (chunk.type === 'done') {
                  const finalMessage: Message = {
                    id: `ai-${clientMessageId}`,
                    clientMessageId,
                    role: 'assistant',
                    content: finalContent,
                    status: 'done',
                    timestamp: new Date().toISOString()
                  };
                  this.emit('messageUpdate', finalMessage);
                  return { message: finalMessage, remainingMessages };
                }
              } catch (e) {
                console.error('Error parsing stream chunk:', e);
              }
            }
          }
        }
      }

      // If the stream closes without a done chunk, return accumulated content
      const finalMessage: Message = {
        id: `ai-${clientMessageId}`,
        clientMessageId,
        role: 'assistant',
        content: finalContent,
        status: 'done',
        timestamp: new Date().toISOString()
      };
      this.emit('messageUpdate', finalMessage);
      return { message: finalMessage, remainingMessages };
    } catch (err: any) {
      // If the streaming endpoint doesn't exist (404), fall back to the non-streaming endpoint
      if (err.response?.status === 404) {
        try {
          const api = (await import('./api')).default;
          const res = await api.post('/chat/message', { chatId: threadId, text, clientMessageId });
          const msgs = res.data?.messages || [];
          const last = msgs[msgs.length - 1];

          const finalMessage: Message = {
            id: `ai-${clientMessageId}`,
            clientMessageId,
            role: 'assistant',
            content: typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content || ''),
            status: 'done',
            timestamp: last?.timestamp || new Date().toISOString()
          };

          // Emit final message so subscribers update placeholders
          this.emit('messageUpdate', finalMessage);

          return {
            message: finalMessage,
            remainingMessages: Number(res.headers['x-dailylimit-remaining'] || 0)
          };
        } catch (fallbackErr) {
          // continue to outer error handling
          err = fallbackErr;
        }
      }
      // Only return error if request wasn't aborted
      if (!controller.signal.aborted) {
        if (err.response) {
          // Server responded with an error
          return {
            error: err.response.data.error || {
              title: 'Server error',
              what: err.response.data.message || 'An error occurred while processing your request.',
              action: 'Please try again.',
              code: 'SERVER_ERROR'
            }
          };
        } else if (err.request) {
          // Request was made but no response received
          return {
            error: {
              title: 'Network error — unable to reach server.',
              what: 'Connection failed or timed out.',
              action: 'Check your connection and try again.',
              code: 'NETWORK_FAILURE'
            }
          };
        }
      }
      throw err;
    } finally {
      this.pendingRequests.delete(clientMessageId);
    }
  }

  getRemainingMessages(): number {
    return Math.max(0, 20 - this.messageCount);
  }

  private abortRequest(clientMessageId: string) {
    const controller = this.pendingRequests.get(clientMessageId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(clientMessageId);
    }
  }

  abortAllRequests() {
    for (const controller of this.pendingRequests.values()) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }

  onMessageUpdate(listener: MessageUpdateListener) {
    this.messageUpdateListeners.add(listener);
    return () => this.messageUpdateListeners.delete(listener);
  }

  private emit(eventName: 'messageUpdate', message: Message) {
    if (eventName === 'messageUpdate') {
      this.messageUpdateListeners.forEach(listener => listener(message));
    }
  }
}