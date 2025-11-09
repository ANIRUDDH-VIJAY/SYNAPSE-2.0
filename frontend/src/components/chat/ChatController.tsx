// src/components/chat/ChatController.tsx
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../../services/chatService';
import { chatAPI } from '../../services/api';
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
  currentChatId?: string | null;
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

export function ChatController({ currentChatId, children }: ChatControllerProps) {
  const [state, setState] = React.useState<ChatState>({
    messages: [],
    currentMessage: '',
    isGenerating: false,
    remainingMessages: 20
  });

  // Sync threadId with the currently selected chat id from parent
  React.useEffect(() => {
    // Only update threadId if it's different to prevent infinite loop
    setState(prev => {
      if (prev.threadId !== currentChatId) {
        return { ...prev, threadId: currentChatId || null };
      }
      return prev;
    });
  }, [currentChatId]);

  const chatService = React.useMemo(() => ChatService.getInstance(), []);

  const handleMessageChange = React.useCallback((message: string) => {
    setState(prev => ({ ...prev, currentMessage: message }));
  }, []);

  const handleSendMessage = React.useCallback(async () => {
    if (!state.currentMessage.trim()) return;

    // STEP 1: Ensure chat exists
    let threadId = state.threadId;
    if (!threadId) {
      const createRes = await chatAPI.createChat();   // ✅ ensures DB chat exists
      threadId = createRes.data.chatId;
      setState(prev => ({ ...prev, threadId }));
    }

    const clientMessageId = uuidv4();

    const userMessage: Message = {
      id: `user-${clientMessageId}`,
      clientMessageId,
      role: 'user',
      content: state.currentMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // STEP 2: Add user + placeholder AI message
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        userMessage,
        { id: `ai-${clientMessageId}`, clientMessageId, role: 'assistant', status: 'streaming', partialContent: '' }
      ],
      currentMessage: '',
      isGenerating: true,
      error: undefined
    }));

    // STEP 3: Call streaming ChatService
    const response = await chatService.sendMessage({
      text: userMessage.content,
      threadId,
      clientMessageId
    });

    // STEP 4: Handle errors cleanly
    if (response.error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: response.error
      }));
      return;
    }

    // STEP 5: Finalize streamed assistant message
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m =>
        m.clientMessageId === response.message.clientMessageId
          ? { ...response.message, status: 'done' }
          : m
      ),
      isGenerating: false
    }));
  }, [state.currentMessage, state.threadId, chatService]);

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
