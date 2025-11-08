# Component Usage Examples

Real-world examples of using Synapse UI components.

---

## 📋 Table of Contents

1. [Basic Chat Interface](#basic-chat-interface)
2. [Authentication Flow](#authentication-flow)
3. [With Backend API](#with-backend-api)
4. [With State Management](#with-state-management)
5. [Streaming Responses](#streaming-responses)
6. [Error Handling](#error-handling)

---

## 1. Basic Chat Interface

### Minimal Example - Individual Components

```typescript
import { useState } from 'react';
import { ChatWindow } from './components/chat/ChatWindow';
import { Sidebar } from './components/chat/Sidebar';
import { Header } from './components/chat/Header';

function BasicChatApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! How can I help you today?',
      timestamp: '10:30 AM'
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'This is a mock response. Connect your backend here!',
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }]);
    }, 1000);
  };

  return (
    <div className={`h-screen flex ${
      theme === 'light' ? 'bg-white' : 'bg-slate-900'
    }`}>
      {/* Sidebar */}
      <div className="w-80 hidden md:block">
        <Sidebar
          theme={theme}
          searchQuery=""
          onSearchChange={() => {}}
          starredChats={[]}
          allChats={[
            { id: '1', text: 'My first chat', time: 'Now' }
          ]}
          onToggleStar={() => {}}
          onNewChat={() => setMessages([])}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <Header
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          userName="Demo User"
          userEmail="demo@example.com"
        />

        <ChatWindow
          theme={theme}
          messages={messages}
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSend}
        />
      </div>
    </div>
  );
}
```

---

## 2. Authentication Flow

### Complete Auth Example

```typescript
import { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dialog, DialogContent } from './components/ui/dialog';

function AuthExample() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [theme] = useState<'light' | 'dark'>('dark');
  const [isOpen, setIsOpen] = useState(true);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      // Replace with your API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      setIsOpen(false);
      
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Validate passwords match
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword
        })
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      setIsOpen(false);
      
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={
        theme === 'light' ? 'bg-white' : 'bg-slate-900 border-slate-800'
      }>
        {mode === 'login' ? (
          <LoginForm
            theme={theme}
            email={loginEmail}
            password={loginPassword}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleLogin}
            onSwitchToSignup={() => setMode('signup')}
            loading={loginLoading}
            error={loginError}
          />
        ) : (
          <SignupForm
            theme={theme}
            name={signupName}
            email={signupEmail}
            password={signupPassword}
            confirmPassword={signupConfirmPassword}
            onNameChange={setSignupName}
            onEmailChange={setSignupEmail}
            onPasswordChange={setSignupPassword}
            onConfirmPasswordChange={setSignupConfirmPassword}
            onSubmit={handleSignup}
            onSwitchToLogin={() => setMode('login')}
            loading={signupLoading}
            error={signupError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 3. With Backend API

### API Client Setup

```typescript
// api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getChats() {
    const response = await fetch(`${API_URL}/chats`, {
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  }

  async getMessages(chatId: string) {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async sendMessage(chatId: string, content: string) {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async toggleStar(chatId: string) {
    const response = await fetch(`${API_URL}/chats/${chatId}/star`, {
      method: 'PATCH',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to toggle star');
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

### Using API Client

```typescript
import { useState, useEffect } from 'react';
import { api } from './api/client';
import { ChatWindow } from './components/chat/ChatWindow';

function ChatWithBackend() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId] = useState('current-chat-id');

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const data = await api.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await api.sendMessage(chatId, message);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatWindow
      theme="dark"
      messages={messages}
      message={message}
      onMessageChange={setMessage}
      onSendMessage={handleSend}
      isGenerating={loading}
    />
  );
}
```

---

## 4. With State Management (Zustand)

### Store Setup

```typescript
// store/chatStore.ts
import { create } from 'zustand';
import { api } from '../api/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  text: string;
  time: string;
  isStarred: boolean;
}

interface ChatStore {
  // State
  chats: Chat[];
  messages: Message[];
  currentChatId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentChatId: (id: string) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  toggleStar: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  chats: [],
  messages: [],
  currentChatId: null,
  loading: false,
  error: null,

  // Setters
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setCurrentChatId: (id) => set({ currentChatId: id }),

  // Actions
  loadChats: async () => {
    set({ loading: true, error: null });
    try {
      const chats = await api.getChats();
      set({ chats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load chats',
        loading: false 
      });
    }
  },

  loadMessages: async (chatId: string) => {
    set({ loading: true, error: null });
    try {
      const messages = await api.getMessages(chatId);
      set({ messages, currentChatId: chatId, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false 
      });
    }
  },

  sendMessage: async (content: string) => {
    const { currentChatId, messages } = get();
    if (!currentChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    set({ messages: [...messages, userMessage], loading: true });

    try {
      const response = await api.sendMessage(currentChatId, content);
      set(state => ({ 
        messages: [...state.messages, response],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message',
        loading: false 
      });
    }
  },

  toggleStar: async (chatId: string) => {
    try {
      await api.toggleStar(chatId);
      await get().loadChats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle star'
      });
    }
  }
}));
```

### Using Store

```typescript
import { useChatStore } from './store/chatStore';
import { ChatWindow } from './components/chat/ChatWindow';
import { Sidebar } from './components/chat/Sidebar';

function ChatWithStore() {
  const { 
    messages, 
    chats,
    loading,
    sendMessage,
    toggleStar,
    loadMessages 
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        theme="dark"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        starredChats={chats.filter(c => c.isStarred)}
        allChats={chats.filter(c => !c.isStarred)}
        onToggleStar={toggleStar}
        onNewChat={() => {}}
        onChatSelect={loadMessages}
      />

      <ChatWindow
        theme="dark"
        messages={messages}
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSend}
        isGenerating={loading}
      />
    </div>
  );
}
```

---

## 5. Streaming Responses

### SSE (Server-Sent Events)

```typescript
import { useState } from 'react';
import { ChatWindow } from './components/chat/ChatWindow';

function StreamingChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendStreaming = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsGenerating(true);

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant' as const,
      content: ''
    }]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage.content })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            // Update message with new chunk
            setMessages(prev => prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + data }
                : msg
            ));
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    setIsGenerating(false);
    // Implement abort logic
  };

  return (
    <ChatWindow
      theme="dark"
      messages={messages}
      message={message}
      onMessageChange={setMessage}
      onSendMessage={handleSendStreaming}
      onStopGeneration={handleStop}
      isGenerating={isGenerating}
    />
  );
}
```

---

## 6. Error Handling

### Comprehensive Error Handling

```typescript
import { useState } from 'react';
import { ChatWindow } from './components/chat/ChatWindow';
import { Alert, AlertDescription } from './components/ui/alert';

function ChatWithErrorHandling() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setError(null);
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: userMessage.content })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        } else {
          throw new Error('Failed to send message. Please try again.');
        }
      }

      const data = await response.json();
      setMessages(prev => [...prev, data]);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      
      // Remove the user message on error (optional)
      setMessages(prev => prev.slice(0, -1));
      setMessage(userMessage.content); // Restore the message
      
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <ChatWindow
        theme="dark"
        messages={messages}
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSend}
        isGenerating={isGenerating}
      />
    </div>
  );
}
```

---

## 🎯 Best Practices Summary

1. **Separate concerns** - Keep API logic separate from UI
2. **Handle errors** - Always show user-friendly error messages
3. **Loading states** - Show feedback during async operations
4. **Validate input** - Both client and server side
5. **Type safety** - Use TypeScript interfaces
6. **Clean up** - Cancel requests on unmount
7. **Optimize** - Memo expensive computations
8. **Test** - Start with mock data

---

**Happy coding!** 🚀
