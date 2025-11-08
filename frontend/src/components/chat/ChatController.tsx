import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../../services/chatService';
import { type Message } from './ChatWindow';
import { type ErrorDetails } from './ErrorBanner';

interface ChatState {
  messages: Message[];
  currentMessage: string;
  isGenerating: boolean;
  threadId?: string;
  error?: ErrorDetails;
  remainingMessages: number;
}

interface ChatControllerProps {
  children: (props: {
    messages: Message[];
    message: string;
    isGenerating: boolean;
    error?: ErrorDetails;
    remainingMessages: number;
    onMessageChange: (message: string) => void;
    onSendMessage: () => void;
    onStopGeneration: () => void;
    onDismissError: () => void;
  }) => React.ReactNode;
}

export function ChatController({ children }: ChatControllerProps) {
  const [state, setState] = React.useState<ChatState>({
    messages: [],
    currentMessage: '',
    isGenerating: false,
    remainingMessages: 20
  });
  
  // Load chat messages when a chat is opened
  const loadChatMessages = React.useCallback(async (chatId: string) => {
    try {
      const api = (await import('../../services/api')).default;
      const response = await api.get(`/chat/${chatId}`);
      if (response.data && response.data.messages) {
        setState(prev => ({
          ...prev,
          messages: response.data.messages,
          isGenerating: false
        }));
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      setState(prev => ({
        ...prev,
        error: {
          title: 'Failed to load chat',
          what: 'Could not load chat messages',
          action: 'Please try again',
          code: 'LOAD_ERROR'
        }
      }));
    }
  }, []);

  const chatService = React.useMemo(() => ChatService.getInstance(), []);

  React.useEffect(() => {
    // Subscribe to streaming updates
    const unsubscribe = chatService.onMessageUpdate((message) => {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.clientMessageId === message.clientMessageId) {
            // Preserve the existing ID for the placeholder message
            return {
              ...message,
              id: m.id
            };
          }
          return m;
        })
      }));
    });

    return () => {
      chatService.abortAllRequests();
      unsubscribe();
    };
  }, [chatService]);

  const handleMessageChange = React.useCallback((message: string) => {
    setState(prev => ({ ...prev, currentMessage: message }));
  }, []);

  const handleSendMessage = React.useCallback(async () => {
    if (!state.currentMessage.trim()) return;
    if (state.remainingMessages <= 0) {
      setState(prev => ({
        ...prev,
        error: {
          title: 'Daily message limit reached (20).',
          what: 'You have reached your daily message limit.',
          action: 'Try again tomorrow or upgrade your plan.',
          code: 'DAILY_MESSAGE_LIMIT'
        }
      }));
      return;
    }

    const clientMessageId = uuidv4();
    const userMessage: Message = {
      id: `user-${clientMessageId}`,
      clientMessageId,
      role: 'user',
      content: state.currentMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // If this is the first message, generate a thread title
    if (!state.threadId) {
      // We'll implement title generation later
    }

    // Add user message and AI placeholder in one update
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages.filter(m => m.id !== `user-${clientMessageId}` && m.id !== `ai-pending-${clientMessageId}`),
        userMessage,
        // Add single AI placeholder with client ID reference
        {
          id: `ai-pending-${clientMessageId}`,
          clientMessageId,
          role: 'assistant',
          status: 'streaming',
          partialContent: ''
        }
      ],
      currentMessage: '',
      isGenerating: true,
      error: undefined
    }));

    const response = await chatService.sendMessage({
      text: userMessage.content,
      threadId: state.threadId,
      clientMessageId: userMessage.id,
      retryWithFallback: false
    });

    if (response.error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: response.error,
        remainingMessages: response.remainingMessages ?? prev.remainingMessages
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m => {
        // Replace the streaming message with the final version
        if (m.clientMessageId === response.message?.clientMessageId) {
          return response.message;
        }
        return m;
      }),
      isGenerating: false,
      remainingMessages: response.remainingMessages ?? prev.remainingMessages
    }));
  }, [state.currentMessage, state.threadId, state.remainingMessages, chatService]);

  const handleStopGeneration = React.useCallback(() => {
    chatService.abortAllRequests();
    setState(prev => ({ ...prev, isGenerating: false }));
  }, [chatService]);

  const handleDismissError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  return children({
    messages: state.messages,
    message: state.currentMessage,
    isGenerating: state.isGenerating,
    error: state.error,
    remainingMessages: state.remainingMessages,
    onMessageChange: handleMessageChange,
    onSendMessage: handleSendMessage,
    onStopGeneration: handleStopGeneration,
    onDismissError: handleDismissError
  });
}