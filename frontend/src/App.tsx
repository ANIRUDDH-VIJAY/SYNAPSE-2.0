import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { ChatPage } from './components/pages/ChatPage';
import { SettingsModal } from './components/modals/SettingsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AuthModal } from './components/modals/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { authAPI, chatAPI } from './services/api';
import { ChatService } from './services/chatService';
import { getCsrfToken } from './services/api';

interface Chat {
  id: string;
  text: string;
  time: string;
}

export default function App() {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark' as 'light' | 'dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null as string | null);
  const [user, setUser] = useState(null as { id: string; name: string; email: string } | null);
  const [messages, setMessages] = useState([] as Array<{ id: string; clientMessageId?: string; role: 'user' | 'assistant'; content: string; timestamp?: string; status?: string; partialContent?: string; error?: any }>);
  
  const [starredChats, setStarredChats] = useState([] as Chat[]);
  const [allChats, setAllChats] = useState([] as Chat[]);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      alert('OAuth login failed. Please try again.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (oauthSuccess === 'success') {
      // Token is in HTTP-only cookie, fetch user data from backend
      authAPI.getMe()
        .then(response => {
          const userData = response.data;
          // Store only minimal user data (not full object)
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            name: userData.name,
            email: userData.email
          }));
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email
          });
          setIsLoggedIn(true);
          loadChatHistory();
        })
        .catch(err => {
          console.error('Error fetching user after OAuth:', err);
          alert('Login successful but failed to load user data. Please refresh.');
        })
        .finally(() => {
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  // Load user from localStorage on mount (verify with backend)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify token is still valid by fetching user from backend
        authAPI.getMe()
          .then(response => {
            // Update user data from backend (more secure, ensures data is current)
            const backendUser = response.data;
            setUser({
              id: backendUser.id,
              name: backendUser.name,
              email: backendUser.email
            });
            setIsLoggedIn(true);
            loadChatHistory();
          })
          .catch(err => {
            // Token invalid or expired, clear storage
            console.error('Token validation failed:', err);
            localStorage.removeItem('user');
            setUser(null);
            setIsLoggedIn(false);
          });
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  useEffect(() => {
    getCsrfToken();
  }, []);

  // Load chat history from API
  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory();
      const chats = response.data;
      
      // Format chats for display
      const formattedChats: Chat[] = chats.map((chat: any) => ({
        id: chat.id,
        text: chat.title || 'New Chat',
        time: formatTime(chat.updatedAt)
      }));
      
      // Separate starred and regular chats
      const starred = formattedChats.filter(chat => 
        chats.find((c: any) => c.id === chat.id)?.isStarred
      );
      const regular = formattedChats.filter(chat => 
        !chats.find((c: any) => c.id === chat.id)?.isStarred
      );
      
      setStarredChats(starred);
      setAllChats(regular);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return date.toLocaleDateString();
  };

  const handleSendOrStop = async () => {
    if (isGenerating) {
      // Stop generation
      setIsGenerating(false);
      return;
    }

    if (!message.trim()) return;

    // Check if user is logged in
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    // Prepare clientMessageId before creating messages so streaming updates can match
    const clientMessageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const userMessageId = `user-${clientMessageId}`;
    const aiMessageId = `ai-${clientMessageId}`;

    // Build user message with clientMessageId attached
    const userMessage = {
      id: userMessageId,
      clientMessageId,
      role: 'user' as const,
      content: String(message),
      timestamp: new Date().toLocaleTimeString()
    };

    // Add messages locally (user message + assistant placeholder)
    setMessages(prev => [...prev, userMessage, {
      id: aiMessageId,
      clientMessageId,
      role: 'assistant' as const,
      status: 'streaming',
      content: '',
      partialContent: 'Thinking...',
      timestamp: undefined
    }]);

    const messageText = message;
    setMessage('');
    setIsGenerating(true);

    try {
      // Ensure chat exists
      let chatId = currentChatId;
      if (!chatId) {
        const createResponse = await chatAPI.createChat();
        chatId = createResponse.data.chatId;
        setCurrentChatId(chatId);
      }

      // Send using ChatService. Pass clientMessageId equal to the user message id so server and client align.
      const chatService = ChatService.getInstance();
      const response = await chatService.sendMessage({
        text: messageText,
        threadId: chatId,
        clientMessageId: userMessageId
      });

      // Handle errors from service
      if (response?.error) {
        console.error('ChatService returned error:', response.error);
        setMessages(prev => prev.map(msg =>
          msg.clientMessageId === clientMessageId
            ? {
                ...msg,
                status: 'failed',
                error: {
                  code: response.error.code || 'SERVER_ERROR',
                  message: response.error.title || 'Failed to get response from server.'
                }
              }
            : msg
        ));
        setIsGenerating(false);
        await loadChatHistory();
        return;
      }

      // Compose final content from response
      let fullContent = '';
      if (response?.message?.content) {
        fullContent = String(response.message.content);
      } else if (response?.message?.partialContent) {
        fullContent = String(response.message.partialContent);
      }

      // Animate text word-by-word on the assistant placeholder (matched by clientMessageId)
      const words = fullContent.split(' ');
      let currentText = '';
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        setMessages(prev => prev.map(msg =>
          msg.clientMessageId === clientMessageId && msg.role === 'assistant'
            ? { ...msg, content: currentText, timestamp: new Date().toLocaleTimeString(), status: 'streaming' }
            : msg
        ));

        if (i < words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      // Finalize assistant message
      setMessages(prev => prev.map(msg =>
        msg.clientMessageId === clientMessageId && msg.role === 'assistant'
          ? { ...msg, content: fullContent, timestamp: new Date().toLocaleTimeString(), status: 'complete' }
          : msg
      ));

      setIsGenerating(false);

      // Refresh chat metadata/title
      await loadChatHistory();
    } catch (error: any) {
      console.error('Error sending message:', error);

      // Update placeholder to failed with appropriate message
      setMessages(prev => prev.map(msg =>
        msg.clientMessageId === clientMessageId && msg.role === 'assistant'
          ? {
              ...msg,
              status: 'failed',
              error: {
                code: error.response?.data?.code || (error.response?.status === 401 ? 'AUTH_REQUIRED' : 'UNKNOWN_ERROR'),
                message: error.response?.data?.error || error.message || 'Failed to send message'
              }
            }
          : msg
      ));

      if (error.response?.status === 401) {
        setIsAuthOpen(true);
      }

      setIsGenerating(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const userData = response.data.user || response.data;

      // Token is in HTTP-only cookie, store backend-returned user object in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user || response.data));

      // Update local state with minimal user fields
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email
      });
      setIsLoggedIn(true);
      await loadChatHistory();

      // Redirect to chat after successful login
      window.location.href = '/chat';
    } catch (error: any) {
      // If user not found, throw special error to trigger signup switch
      if (error.response?.status === 404 && error.response?.data?.error === 'USER_NOT_FOUND') {
        throw new Error('USER_NOT_FOUND');
      }
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      const userData = response.data.user || response.data;

      // Token is in HTTP-only cookie, store backend-returned user object in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user || response.data));

      // Update local state with minimal user fields
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email
      });
      setIsLoggedIn(true);
      await loadChatHistory();

      // Redirect to chat after successful signup
      window.location.href = '/chat';
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const handleLogout = async () => {
    // Call backend logout to clear cookies
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore errors, continue with local cleanup
    }
    
    // Clear user data
    localStorage.removeItem('user');
    
    setUser(null);
    setIsLoggedIn(false);
    setCurrentChatId(null);
    setStarredChats([]);
    setAllChats([]);
    setMessage('');
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleToggleStar = async (chatId: string, isStarred: boolean) => {
    try {
      await chatAPI.toggleStar(chatId);
      await loadChatHistory();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await chatAPI.deleteChat(chatId);
      await loadChatHistory();
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessage('');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      // Handle new chat creation
      if (chatId === 'new') {
        setCurrentChatId(null);
        setMessages([]);
        setMessage('');
        return;
      }

      setCurrentChatId(chatId);
      setMessages([]); // Clear messages first to prevent white screen
      setIsGenerating(false); // Stop any ongoing generation
      
      const response = await chatAPI.getChat(chatId);
      const chat = response.data;
      
      if (!chat || !chat.messages) {
        setMessages([]);
        return;
      }
      
      // Robust message formatting with proper content normalization
      const formattedMessages = (chat.messages || []).map((msg: any, index: number) => {
        // Normalize content to always be a string
        let normalizedContent = '';
        try {
          if (msg.content === null || msg.content === undefined) {
            normalizedContent = '';
          } else if (typeof msg.content === 'string') {
            normalizedContent = msg.content;
          } else if (typeof msg.content === 'object') {
            if (React.isValidElement(msg.content)) {
              normalizedContent = '';
            } else if (Array.isArray(msg.content?.parts)) {
              normalizedContent = msg.content.parts
                .map((p: any) => p?.text || '')
                .join(' ')
                .trim();
            } else if (msg.content.text) {
              normalizedContent = msg.content.text;
            } else {
              normalizedContent = JSON.stringify(msg.content);
            }
          } else {
            normalizedContent = String(msg.content);
          }
        } catch (err) {
          console.warn('Error normalizing message content:', err);
          normalizedContent = '[Error: Invalid message content]';
        }

        return {
          id: msg.id || msg._id?.toString() || `msg-${index}-${Date.now()}`,
          clientMessageId: msg.clientMessageId,
          role: (msg.role || 'user') as 'user' | 'assistant',
          content: normalizedContent,
          timestamp: msg.timestamp ? (typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp).toLocaleTimeString()) : undefined
        };
      });
      
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error loading chat:', error);
      setMessages([]);
      if (error.response?.status !== 404) {
        alert('Failed to load chat. Please try again.');
      }
    }
  };
  console.log("MESSAGES_STATE", messages);

  return (
    <ErrorBoundary>
      {isLoggedIn ? (
        <ChatPage
          theme={theme}
          setTheme={setTheme}
          message={message}
          setMessage={setMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGenerating={isGenerating}
          handleSendOrStop={handleSendOrStop}
          onLogout={handleLogout}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          starredChats={starredChats}
          allChats={allChats}
          onToggleStar={handleToggleStar}
          messages={messages}
          onResendMessage={async (messageId) => {
            // Find the failed message and its corresponding user message
            const failedMsgIndex = messages.findIndex(m => m.id === messageId);
            if (failedMsgIndex === -1) return;
            
            const userMsgIndex = failedMsgIndex - 1;
            if (userMsgIndex < 0 || messages[userMsgIndex].role !== 'user') return;
            
            // Remove the failed message and retry sending
            setMessages(prev => prev.filter(m => m.id !== messageId));
            setMessage(messages[userMsgIndex].content || '');
            handleSendOrStop();
          }}
          currentChatId={currentChatId}
          onDeleteChat={handleDeleteChat}
          onSelectChat={handleSelectChat}
          user={user}
        />
      ) : (
        <LandingPage
          theme={theme}
          message={message}
          setMessage={setMessage}
          isGenerating={isGenerating}
          handleSendOrStop={handleSendOrStop}
          onOpenAuth={handleOpenAuth}
        />
      )}

      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        theme={theme}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onClearHistory={async () => {
          setCurrentChatId(null);
          setMessages([]);
          await loadChatHistory();
        }}
      />

      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
        user={user}
        onUpdateUser={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }}
      />
    </ErrorBoundary>
  );
}
