# Synapse UI - Backend Integration Guide

## Overview

This guide explains how to integrate the Synapse chatbot UI components with your React + Node.js backend. All components are **stateless** and designed for easy data binding.

---

## 📁 Component Structure

```
components/
├── chat/                    # Chat-related components
│   ├── Sidebar.tsx         # Left sidebar with search & chat lists
│   ├── ChatList.tsx        # Starred & All chats sections
│   ├── ChatListItem.tsx    # Individual chat item
│   ├── Header.tsx          # Top navigation bar
│   ├── UserMenu.tsx        # User dropdown menu
│   ├── ChatWindow.tsx      # Main chat area
│   ├── MessageBubble.tsx   # Individual message
│   └── InputBar.tsx        # Message input field
│
├── auth/                    # Authentication components
│   ├── LoginForm.tsx       # Login form
│   └── SignupForm.tsx      # Signup form
│
├── modals/                  # Modal dialogs
│   ├── AuthModal.tsx       # Auth modal wrapper
│   ├── ProfileModal.tsx    # User profile modal
│   └── SettingsModal.tsx   # Settings modal
│
├── pages/                   # Page-level components
│   ├── ChatPage.tsx        # Main chat page
│   └── LandingPage.tsx     # Landing/welcome page
│
└── ui/                      # ShadCN UI components
    └── ...                  # Button, Input, etc.
```

---

## 🔌 Data Flow Architecture

### State Management Strategy

**All state should live in:**
1. **App.tsx** - Application-level state
2. **Backend API** - Persistent data
3. **State management library** (Redux, Zustand, etc.) - Optional

**Components are stateless** and receive:
- **Props** for data
- **Callbacks** for actions

---

## 📦 Core Component Interfaces

### 1. Sidebar Component

**Purpose:** Displays chat history with search and star functionality

```typescript
// components/chat/Sidebar.tsx

interface Chat {
  id: string;              // Unique chat identifier
  text: string;            // Chat preview text
  time: string;            // Display time (e.g., "2 hours ago")
  isStarred?: boolean;     // Star status
}

interface SidebarProps {
  theme: 'light' | 'dark';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  starredChats: Chat[];
  allChats: Chat[];
  onToggleStar: (chatId: string) => void;
  onNewChat: () => void;
  onChatSelect?: (chatId: string) => void;
  activeChatId?: string;
}
```

**Backend Integration:**
```typescript
// Fetch chats from API
const fetchChats = async () => {
  const response = await fetch('/api/chats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Toggle star status
const toggleStar = async (chatId: string) => {
  await fetch(`/api/chats/${chatId}/star`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};
```

---

### 2. ChatWindow Component

**Purpose:** Displays messages and input field

```typescript
// components/chat/ChatWindow.tsx

interface Message {
  id: string;               // Unique message ID
  role: 'user' | 'assistant'; // Message sender
  content: string;          // Message text
  timestamp?: string;       // Display timestamp
}

interface ChatWindowProps {
  theme: 'light' | 'dark';
  messages: Message[];
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}
```

**Backend Integration:**
```typescript
// Fetch messages for a chat
const fetchMessages = async (chatId: string) => {
  const response = await fetch(`/api/chats/${chatId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Send message (streaming)
const sendMessage = async (chatId: string, content: string) => {
  const response = await fetch(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  
  // Handle streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    // Update UI with chunk
  }
};
```

---

### 3. Header Component

**Purpose:** Top navigation with theme toggle and user menu

```typescript
// components/chat/Header.tsx

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}
```

---

### 4. LoginForm & SignupForm

**Purpose:** Authentication forms

```typescript
// components/auth/LoginForm.tsx

interface LoginFormProps {
  theme: 'light' | 'dark';
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToSignup: () => void;
  loading?: boolean;
  error?: string;
}

// components/auth/SignupForm.tsx

interface SignupFormProps {
  theme: 'light' | 'dark';
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string;
}
```

**Backend Integration:**
```typescript
// Login
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  return user;
};

// Signup
const handleSignup = async (name: string, email: string, password: string) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  return user;
};
```

---

## 🔄 Complete Integration Example

### App.tsx Structure

```typescript
import { useState, useEffect } from 'react';
import { ChatPage } from './components/pages/ChatPage';
import { LandingPage } from './components/pages/LandingPage';

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Chat state
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and load user data
      verifyToken(token);
    }
  }, []);
  
  // Fetch chats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated]);
  
  // Fetch messages when chat is selected
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);
  
  // API functions
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

    }
  };
  
  const fetchChats = async () => {
    const response = await fetch('/api/chats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setChats(data);
  };
  
  const fetchMessages = async (chatId: string) => {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setMessages(data);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsGenerating(true);
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    try {
      // Send to backend
      const response = await fetch(`/api/chats/${activeChatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
      });
      
      const assistantMessage = await response.json();
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleToggleStar = async (chatId: string) => {
    await fetch(`/api/chats/${chatId}/star`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchChats();
  };
  
  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
    setChats([]);
    setMessages([]);
  };
  
  return (
    <div className="App">
      {isAuthenticated ? (
        <ChatPage
          theme={theme}
          setTheme={setTheme}
          message={message}
          setMessage={setMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGenerating={isGenerating}
          handleSendOrStop={handleSendMessage}
          onLogout={handleLogout}
          starredChats={chats.filter(c => c.isStarred)}
          allChats={chats}
          onToggleStar={handleToggleStar}
          messages={messages}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
        />
      ) : (
        <LandingPage
          theme={theme}
          setTheme={setTheme}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
```

---

## 🗄️ Suggested Backend API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Chats
- `GET /api/chats` - Get all chats for user
- `POST /api/chats` - Create new chat
- `DELETE /api/chats/:id` - Delete chat
- `PATCH /api/chats/:id/star` - Toggle star

### Messages
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message (supports streaming)
- `DELETE /api/messages/:id` - Delete message

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile
- `GET /api/user/settings` - Get user settings
- `PATCH /api/user/settings` - Update settings

---

## 🎨 Styling Notes

- All styling uses **Tailwind CSS**
- No inline styles or CSS-in-JS
- Theme is controlled via `theme` prop (`'light'` | `'dark'`)
- Colors follow blue-indigo gradient scheme
- Responsive breakpoint: `md:` (768px)

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- Sidebar visible by default
- Can be collapsed with toggle button
- Full chat window width

### Mobile (<768px)
- Sidebar hidden by default
- Opens as drawer/sheet on menu click
- Modals become full-screen
- Touch-optimized UI

---

## 🔒 Security Considerations

1. **Token Storage:** Store JWT in localStorage or httpOnly cookies
2. **API Calls:** Always include Authorization header
3. **Input Validation:** Validate on backend
4. **CORS:** Configure properly for your domain
5. **Rate Limiting:** Implement on backend

---

## 🚀 Next Steps

1. **Set up backend API** with suggested endpoints
2. **Connect authentication** flows
3. **Implement chat functionality** with real-time streaming
4. **Add error handling** and loading states
5. **Test responsive behavior** on all devices
6. **Deploy and monitor**

---

## 📞 Component Usage Examples

### Using Sidebar Component

```typescript
import { Sidebar } from './components/chat/Sidebar';

<Sidebar
  theme={theme}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  starredChats={starredChats}
  allChats={allChats}
  onToggleStar={handleToggleStar}
  onNewChat={handleNewChat}
  onChatSelect={handleChatSelect}
  activeChatId={activeChatId}
/>
```

### Using ChatWindow Component

```typescript
import { ChatWindow } from './components/chat/ChatWindow';

<ChatWindow
  theme={theme}
  messages={messages}
  message={currentMessage}
  onMessageChange={setCurrentMessage}
  onSendMessage={handleSend}
  onStopGeneration={handleStop}
  isGenerating={isGenerating}
  placeholder="Ask me anything..."
/>
```

### Using LoginForm Component

```typescript
import { LoginForm } from './components/auth/LoginForm';

<LoginForm
  theme={theme}
  email={email}
  password={password}
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
  onSubmit={handleLoginSubmit}
  onSwitchToSignup={() => setAuthMode('signup')}
  loading={isLoading}
  error={error}
/>
```

---

## 📚 Additional Resources

- **Tailwind CSS:** https://tailwindcss.com/docs
- **ShadCN UI:** https://ui.shadcn.com
- **React:** https://react.dev
- **Lucide Icons:** https://lucide.dev

---

## 🐛 Troubleshooting

### Issue: Components not rendering
- Check that all props are provided
- Verify theme value is 'light' or 'dark'
- Check console for errors

### Issue: Styling broken
- Ensure Tailwind CSS is configured
- Check globals.css is imported
- Verify no conflicting CSS

### Issue: API calls failing
- Check Authorization header
- Verify CORS configuration
- Check network tab in DevTools

---

**Ready to integrate!** All components are production-ready and fully typed with TypeScript. 🎉
