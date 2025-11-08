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
          threadId,
          clientMessageId,
          stream: true,
          retryWithFallback
        },
        {
          signal: controller.signal
        }
      );

      // Handle streaming response
      const remainingMessages = Number(response.headers['x-dailylimit-remaining'] || 0);
      this.messageCount = 20 - remainingMessages;

      // Configure response handling for streaming
      const data = response.data;
      if (typeof data === 'string') {
        const lines = data.split('\n');
        let finalContent = '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk: StreamChunk = JSON.parse(line.slice(6));
              
              if (chunk.type === 'token' && chunk.content) {
                finalContent += chunk.content;
                // Update the placeholder message with accumulated content
                const streamingMessage: Message = {
                  id: `ai-pending-${clientMessageId}`,
                  clientMessageId,
                  role: 'assistant',
                  status: 'streaming',
                  partialContent: finalContent
                };
                // Emit streaming update event
                this.emit('messageUpdate', streamingMessage);
              } else if (chunk.type === 'done') {
                // Send one final update to transition from streaming to done
                const finalMessage: Message = {
                  id: `ai-${clientMessageId}`,
                  clientMessageId,
                  role: 'assistant',
                  content: finalContent,
                  status: 'done',
                  timestamp: new Date().toISOString()
                };

                // Emit the final message state
                this.emit('messageUpdate', finalMessage);

                return {
                  message: finalMessage,
                  remainingMessages
                };
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e);
            }
          }
        }
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