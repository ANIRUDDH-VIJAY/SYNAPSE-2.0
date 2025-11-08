# Quick Start Guide - Synapse UI Integration

Get your Synapse chatbot UI connected to your backend in under 30 minutes.

---

## 📋 Prerequisites

- Node.js 18+ installed
- React 18+ project
- Tailwind CSS configured
- Backend API ready (or use mock data)

---

## 🚀 Step 1: Install Dependencies

```bash
# If using this as a standalone project
npm install

# Core dependencies (if adding to existing project)
npm install lucide-react
npm install tailwind-merge
npm install class-variance-authority
npm install clsx
```

---

## 🎨 Step 2: Configure Tailwind CSS

Ensure your `tailwind.config.js` includes:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Import globals.css in your main file:

```typescript
// main.tsx or index.tsx
import './styles/globals.css';
```

---

## 📦 Step 3: Component Import Structure

```typescript
// Import individual components
import { Sidebar } from './components/chat/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { Header } from './components/chat/Header';
import { LoginForm } from './components/auth/LoginForm';

// Or import page-level components
import { ChatPage } from './components/pages/ChatPage';
import { LandingPage } from './components/pages/LandingPage';
```

---

## 🔥 Step 4: Minimal Working Example

### Option A: Using Page Components (Easiest)

```typescript
// App.tsx
import { useState } from 'react';
import { ChatPage } from './components/pages/ChatPage';
import { LandingPage } from './components/pages/LandingPage';
import './styles/globals.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data
  const mockChats = [
    { id: '1', text: 'How do I use React hooks?', time: '2 hours ago', isStarred: true },
    { id: '2', text: 'Explain TypeScript generics', time: 'Yesterday', isStarred: false },
    { id: '3', text: 'What is Tailwind CSS?', time: '2 days ago', isStarred: true },
  ];

  const handleSendOrStop = () => {
    if (isGenerating) {
      setIsGenerating(false);
    } else {
      setIsGenerating(true);
      // Simulate AI response
      setTimeout(() => {
        setIsGenerating(false);
        setMessage('');
      }, 2000);
    }
  };

  const handleToggleStar = (chatId: string) => {
    console.log('Toggle star for chat:', chatId);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="h-screen">
      {isAuthenticated ? (
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
          onOpenSettings={() => console.log('Open settings')}
          onOpenProfile={() => console.log('Open profile')}
          starredChats={mockChats.filter(c => c.isStarred)}
          allChats={mockChats}
          onToggleStar={handleToggleStar}
        />
      ) : (
        <LandingPage
          theme={theme}
          setTheme={setTheme}
          onGetStarted={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
```

**That's it!** Your app is now running with mock data.

---

### Option B: Using Individual Components (More Control)

```typescript
// App.tsx
import { useState } from 'react';
import { Sidebar } from './components/chat/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { Header } from './components/chat/Header';
import './styles/globals.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant' as const, content: 'Hello! How can I help you?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    }]);
    
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'This is a mock response. Connect to your backend for real responses!'
      }]);
    }, 1000);
  };

  return (
    <div className={`h-screen flex ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      {/* Sidebar */}
      <div className="w-80 hidden md:block">
        <Sidebar
          theme={theme}
          searchQuery=""
          onSearchChange={() => {}}
          starredChats={[]}
          allChats={[
            { id: '1', text: 'First chat', time: 'Now' }
          ]}
          onToggleStar={() => {}}
          onNewChat={() => {}}
        />
      </div>

      {/* Main area */}
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

export default App;
```

---

## 🔌 Step 5: Connect to Your Backend

Replace mock data with real API calls:

```typescript
// api/client.ts
const API_URL = 'http://localhost:3000/api'; // Your backend URL

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Get chats
  getChats: async (token: string) => {
    const response = await fetch(`${API_URL}/chats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch chats');
    return response.json();
  },

  // Send message
  sendMessage: async (token: string, chatId: string, content: string) => {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};
```

Update your App.tsx:

```typescript
import { useState, useEffect } from 'react';
import { api } from './api/client';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadChats();
    }
  }, [token]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await api.getChats(token!);
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('token', token);
      setToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Rest of your component...
}
```

---

## 🎯 Step 6: Add State Management (Optional)

For larger apps, use Zustand or Redux:

```bash
npm install zustand
```

```typescript
// store/useStore.ts
import { create } from 'zustand';

interface ChatStore {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  toggleStar: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  toggleStar: (chatId) => set((state) => ({
    chats: state.chats.map(c => 
      c.id === chatId ? { ...c, isStarred: !c.isStarred } : c
    )
  })),
}));
```

Use in components:

```typescript
import { useChatStore } from './store/useStore';

function App() {
  const { chats, toggleStar } = useChatStore();

  return (
    <Sidebar
      // ... other props
      allChats={chats}
      onToggleStar={toggleStar}
    />
  );
}
```

---

## 🧪 Step 7: Testing

Test with mock data first:

```typescript
// Mock data for testing
export const mockChats = [
  { id: '1', text: 'How does React work?', time: '5 min ago', isStarred: true },
  { id: '2', text: 'Explain async/await', time: '1 hour ago', isStarred: false },
  { id: '3', text: 'CSS Grid vs Flexbox', time: 'Yesterday', isStarred: true },
  { id: '4', text: 'What is TypeScript?', time: '2 days ago', isStarred: false },
];

export const mockMessages = [
  { id: '1', role: 'user' as const, content: 'Hello!', timestamp: '10:30 AM' },
  { id: '2', role: 'assistant' as const, content: 'Hi! How can I help you?', timestamp: '10:30 AM' },
];
```

---

## 🔧 Troubleshooting

### Components not showing?
```typescript
// Check that globals.css is imported
import './styles/globals.css';

// Verify Tailwind is configured
// Check browser console for errors
```

### Styling broken?
```bash
# Rebuild Tailwind
npm run build

# Clear cache
rm -rf node_modules/.cache
```

### TypeScript errors?
```bash
# Install types
npm install -D @types/react @types/react-dom

# Restart TypeScript server in VSCode
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## 📚 Next Steps

1. ✅ **Read INTEGRATION_GUIDE.md** - Full backend integration details
2. ✅ **Read COMPONENT_PROPS_REFERENCE.md** - Complete props documentation
3. ✅ **Implement authentication** - Connect login/signup to backend
4. ✅ **Add real-time chat** - Implement WebSocket or Server-Sent Events
5. ✅ **Deploy** - Deploy to Vercel, Netlify, or your platform

---

## 🎨 Customization

### Change colors:
Edit `styles/globals.css`:

```css
:root {
  --color-primary: 217 91% 60%;  /* Blue */
  --color-secondary: 239 84% 67%; /* Indigo */
}
```

### Change fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', sans-serif;
}
```

### Add features:
- Copy/paste messages
- Export chat history
- Image uploads
- Voice input
- Markdown rendering

---

## 💡 Pro Tips

1. **Use React DevTools** - Inspect component props
2. **Test responsive** - Use browser DevTools device mode
3. **Handle errors** - Show user-friendly error messages
4. **Add loading states** - Better UX during API calls
5. **Implement retry logic** - For failed API requests
6. **Add analytics** - Track user interactions
7. **Optimize performance** - Use React.memo for heavy components

---

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints secured with HTTPS
- [ ] Authentication tokens stored securely
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Responsive design tested on all devices
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Performance optimized (code splitting, lazy loading)
- [ ] SEO meta tags added
- [ ] Analytics integrated

---

## 📞 Support

For issues or questions:
- Check the documentation files
- Review component prop interfaces
- Test with mock data first
- Check browser console for errors

---

**You're ready to build!** 🎉

Start with the minimal example, test with mock data, then connect your backend step by step.
