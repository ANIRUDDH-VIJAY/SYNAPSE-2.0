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
      const api = (await import('./api')).default;
      const response = await api.post('/chat/message/stream', 
        { 
          text, 
          chatId: threadId,
          clientMessageId,
          retryWithFallback
        },
        {
          signal: controller.signal
        }
      );

      // Simple JSON response - no streaming
      const remainingMessages = Number(response.headers['x-dailylimit-remaining'] || 0);
      this.messageCount = 20 - remainingMessages;

      if (response.data?.messages && response.data.messages.length > 0) {
        const lastMessage = response.data.messages[response.data.messages.length - 1];
        return {
          message: {
            id: lastMessage.id,
            role: lastMessage.role,
            content: lastMessage.content,
            timestamp: lastMessage.timestamp
          },
          remainingMessages
        };
      }

      return {
        message: response.data.message,
        remainingMessages
      };
    } catch (err: any) {
      // If the streaming endpoint doesn't exist (404), fall back to the non-streaming endpoint
      if (err.response?.status === 404) {
        try {
          const api = (await import('./api')).default;
          const res = await api.post('/chat/message', { chatId: threadId, text, clientMessageId });
          const msgs = res.data?.messages || [];
          const last = msgs[msgs.length - 1];

          return {
            message: {
              id: last.id,
              role: last.role,
              content: last.content,
              timestamp: last.timestamp
            },
            remainingMessages: Number(res.headers['x-dailylimit-remaining'] || 0)
          };
        } catch (fallbackErr) {
          err = fallbackErr;
        }
      }

      // Return error response
      if (!controller.signal.aborted) {
        if (err.response) {
          return {
            error: err.response.data.error || {
              title: 'Server error',
              what: err.response.data.message || 'An error occurred while processing your request.',
              action: 'Please try again.',
              code: 'SERVER_ERROR'
            }
          };
        } else if (err.request) {
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