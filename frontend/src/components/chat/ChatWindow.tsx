// src/components/chat/ChatWindow.tsx
import React from "react";
import { ScrollArea } from '../ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { ThinkingBubble } from './ThinkingBubble';
import { ErrorBanner, type ErrorDetails } from './ErrorBanner';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getSafeMarkdownString } from '../../lib/sanitize';

export interface Message {
  id: string;
  clientMessageId?: string; // For linking user messages to AI responses
  role: 'user' | 'assistant';
  content?: string;
  partialContent?: string;
  timestamp?: string;
  status?: 'streaming' | 'failed' | 'complete' | 'done';
  error?: {
    code: string;
    message: string;
  };
}

// ErrorCode type not exported from ErrorBanner; no local usage — removed unused import

interface ChatWindowProps {
  theme: 'light' | 'dark';
  messages: Message[];
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onResendMessage?: (messageId: string) => void;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
  error?: ErrorDetails;
  onDismissError?: () => void;
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function ChatWindow({
  theme,
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onResendMessage,
  onStopGeneration,
  isGenerating = false,
  error,
  onDismissError,
  placeholder = 'Type your message...',
  emptyStateTitle = 'Start a new conversation',
  emptyStateDescription = 'Ask me anything or start typing to begin.',
}: ChatWindowProps) {
  // Debug log
  React.useEffect(() => {
    console.log("CHATWINDOW_MESSAGES", messages);
  }, [messages]);
  const isLight = theme === 'light';
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [expandedMessages, setExpandedMessages] = React.useState<Set<string>>(new Set());

  // Monitor scroll position
  const handleScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setIsAtBottom(Math.abs(scrollHeight - clientHeight - scrollTop) < 10);
  }, []);

  // Auto-scroll to bottom only if already at bottom
  React.useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [hasLongContent, setHasLongContent] = React.useState<{ [key: string]: boolean }>({});
  
  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process messages to ensure content is valid and handle streaming state
  const safeMessages = messages.map(m => {
    // Handle streaming messages
    if (m.status === 'streaming') {
      return {
        ...m,
        content: m.partialContent || '...'
      };
    }
    
    // Handle failed messages
    if (m.status === 'failed') {
      return {
        ...m,
        content: m.error?.message || 'Failed to send message'
      };
    }

    // Handle daily limit exceeded
    if (m.error?.code === 'DAILY_MESSAGE_LIMIT') {
      return {
        ...m,
        content: '[Daily message limit reached]\n• What happened: You used your 20 messages for today.\n• What you can do: Try again tomorrow.'
      };
    }

    // Normal message processing
    return {
      ...m,
      content: typeof m.content === 'string' ? m.content : String(m.content || '')
    };
  });


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {error && (
        <div className="sticky top-0 z-10 px-4 pt-4">
          <ErrorBanner error={error} theme={theme} onDismiss={onDismissError} />
        </div>
      )}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {safeMessages.length === 0 && !isGenerating ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ${isLight ? 'shadow-lg' : 'shadow-blue-500/20 shadow-xl'}`}>
                  <span className="text-2xl text-white">S</span>
                </div>
                <h2 className={`text-xl mb-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{emptyStateTitle}</h2>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{emptyStateDescription}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4 max-w-4xl mx-auto w-full">
              {safeMessages.map(msg => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  theme={theme}
                  isExpanded={expandedMessages.has(msg.id)}
                  onRetry={msg.status === 'failed' ? () => onResendMessage?.(msg.id) : undefined}
                  onToggleExpand={() => {
                    setExpandedMessages(prev => {
                      const next = new Set(prev);
                      if (next.has(msg.id)) {
                        next.delete(msg.id);
                      } else {
                        next.add(msg.id);
                      }
                      return next;
                    });
                  }}
                />
              ))}
              {/* Streaming placeholder is rendered as a message with status 'streaming' so no separate global ThinkingBubble is needed */}
            </div>
          )}
        </div>
      </div>

      <InputBar
        theme={theme}
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={isGenerating}
        placeholder={placeholder}
      />
    </div>
  );
}
export default ChatWindow;
