# Synapse UI - Component-Based Architecture

> **Production-ready React + Tailwind chatbot UI for full-stack integration**

A fully modular, stateless UI component library for building ChatGPT-like applications with your own backend.

---

## 🎯 Overview

This is a complete chatbot UI built with:
- ✅ **React 18+** with TypeScript
- ✅ **Tailwind CSS** for styling
- ✅ **Stateless components** - Easy backend integration
- ✅ **ShadCN UI** components
- ✅ **Responsive design** - Mobile, tablet, desktop
- ✅ **Light/Dark themes** with different layouts
- ✅ **Accessibility** - WCAG compliant

---

## 📖 Documentation

### Quick Links

| Document | Purpose | For |
|----------|---------|-----|
| **[QUICK_START.md](./QUICK_START.md)** | Get started in 30 minutes | Beginners |
| **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** | Complete backend integration guide | Developers |
| **[COMPONENT_PROPS_REFERENCE.md](./COMPONENT_PROPS_REFERENCE.md)** | Full TypeScript interface docs | All |

---

## 🏗️ Architecture

### Design Principles

1. **Stateless UI** - Components only handle presentation
2. **Props-driven** - All data passed via props
3. **Callback pattern** - Actions handled via callbacks
4. **Type-safe** - Full TypeScript support
5. **Reusable** - Small, composable components

### Component Hierarchy

```
App.tsx (State Management)
├── LandingPage (Unauthenticated)
│   └── AuthModal
│       ├── LoginForm
│       └── SignupForm
│
└── ChatPage (Authenticated)
    ├── Sidebar (Desktop/Mobile)
    │   ├── SearchBar
    │   └── ChatList
    │       └── ChatListItem
    │
    ├── Header
    │   └── UserMenu
    │
    └── ChatWindow
        ├── MessageBubble
        └── InputBar
```

---

## 📦 Component Categories

### 🗨️ Chat Components (`/components/chat/`)

Core chat interface components:

- **Sidebar** - Chat history with search and star functionality
- **ChatList** - Displays starred and all chats
- **ChatListItem** - Individual chat preview
- **Header** - Top navigation bar
- **UserMenu** - User dropdown menu
- **ChatWindow** - Main chat area
- **MessageBubble** - Individual message display
- **InputBar** - Message input with send/stop button

### 🔐 Auth Components (`/components/auth/`)

Authentication interface:

- **LoginForm** - Email/password login
- **SignupForm** - User registration

### 🪟 Modal Components (`/components/modals/`)

Overlay dialogs:

- **AuthModal** - Authentication modal wrapper
- **ProfileModal** - User profile management
- **SettingsModal** - App settings

### 📄 Page Components (`/components/pages/`)

Full-page layouts:

- **LandingPage** - Welcome page for unauthenticated users
- **ChatPage** - Main chat interface

---

## 🚀 Quick Start

### 1. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Basic Usage

```typescript
import { ChatWindow } from './components/chat/ChatWindow';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    // Your backend logic here
    console.log('Sending:', input);
  };

  return (
    <ChatWindow
      theme="dark"
      messages={messages}
      message={input}
      onMessageChange={setInput}
      onSendMessage={handleSend}
    />
  );
}
```

### 3. Connect to Backend

```typescript
// Example API integration
const sendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  return response.json();
};
```

---

## 🎨 Features

### ✨ UI Features

- ✅ Dual theme (Light/Dark) with distinct designs
- ✅ Glassmorphic effects in dark mode
- ✅ Professional gradient layouts in light mode
- ✅ Smooth animations and transitions
- ✅ Responsive mobile/tablet/desktop layouts
- ✅ Collapsible sidebar
- ✅ Full-screen modals on mobile
- ✅ Star/unstar chats
- ✅ Search functionality
- ✅ User profile and settings

### 🔧 Developer Features

- ✅ TypeScript for type safety
- ✅ Modular component architecture
- ✅ No prop drilling - clean data flow
- ✅ Easy to customize
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Example implementations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| ShadCN UI | Component library |
| Lucide React | Icons |
| Vite | Build tool |

---

## 📁 Project Structure

```
synapse-ui/
├── components/
│   ├── chat/              # Chat UI components
│   ├── auth/              # Auth forms
│   ├── modals/            # Modal dialogs
│   ├── pages/             # Page layouts
│   └── ui/                # ShadCN components
│
├── styles/
│   └── globals.css        # Global styles & tokens
│
├── icons/                 # SVG icons
│
├── docs/                  # Additional documentation
│   ├── COMPONENT_GUIDE.md
│   ├── API_CONTRACT.md
│   └── DEVELOPER_HANDOFF.md
│
├── QUICK_START.md         # Getting started guide
├── INTEGRATION_GUIDE.md   # Backend integration
├── COMPONENT_PROPS_REFERENCE.md  # Props documentation
│
└── App.tsx                # Root component
```

---

## 🔌 Backend Requirements

Your backend should provide:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Token verification

### Chats
- `GET /api/chats` - List user chats
- `POST /api/chats` - Create new chat
- `PATCH /api/chats/:id/star` - Toggle star
- `DELETE /api/chats/:id` - Delete chat

### Messages
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message (supports streaming)

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete API specifications.

---

## 🎯 Integration Workflow

```
1. Start with mock data → Test UI works
2. Create API client → Define endpoints
3. Add state management → Redux/Zustand (optional)
4. Connect authentication → Login/signup flows
5. Connect chat API → Send/receive messages
6. Add streaming → Real-time responses
7. Handle errors → User-friendly messages
8. Test & deploy → Production ready!
```

---

## 💡 Usage Examples

### Example 1: Simple Chat

```typescript
import { ChatWindow } from './components/chat/ChatWindow';

<ChatWindow
  theme="dark"
  messages={[
    { id: '1', role: 'assistant', content: 'Hello!' }
  ]}
  message=""
  onMessageChange={setMessage}
  onSendMessage={sendMessage}
/>
```

### Example 2: Full Chat Page

```typescript
import { ChatPage } from './components/pages/ChatPage';

<ChatPage
  theme={theme}
  setTheme={setTheme}
  message={message}
  setMessage={setMessage}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  isGenerating={false}
  handleSendOrStop={handleSend}
  onLogout={logout}
  onOpenSettings={openSettings}
  onOpenProfile={openProfile}
  starredChats={starred}
  allChats={all}
  onToggleStar={toggleStar}
/>
```

### Example 3: Authentication

```typescript
import { LoginForm } from './components/auth/LoginForm';

<LoginForm
  theme="light"
  email={email}
  password={password}
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
  onSubmit={handleLogin}
  onSwitchToSignup={switchMode}
/>
```

---

## 🎨 Customization

### Change Theme Colors

Edit `styles/globals.css`:

```css
:root {
  /* Primary colors (Blue-Indigo scheme) */
  --color-primary-500: 59 130 246;
  --color-primary-600: 37 99 235;
  
  /* Update to your brand colors */
  --color-primary-500: YOUR_COLOR;
}
```

### Modify Components

All components accept theme and styling props:

```typescript
// Components use Tailwind classes
<MessageBubble
  message={msg}
  theme="dark"
  // Styling handled automatically
/>
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (Drawer navigation)
- **Tablet**: 768px - 1024px (Collapsible sidebar)
- **Desktop**: > 1024px (Sidebar open by default)

### Mobile Optimizations

- Full-screen modals instead of dialogs
- Drawer-based navigation
- Touch-optimized UI elements
- Reduced animations for performance

---

## ♿ Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus management
- ✅ Color contrast (WCAG AA)

---

## 🧪 Testing

```bash
# Run tests (if you add them)
npm test

# Type checking
npm run type-check

# Lint
npm run lint
```

---

## 📊 Performance

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized re-renders
- ✅ Efficient state updates
- ✅ Minimal bundle size

---

## 🔒 Security

**Important**: This is a UI-only library. Security measures to implement:

1. **Authentication**: Store tokens securely (httpOnly cookies recommended)
2. **API calls**: Always use HTTPS
3. **Input validation**: Validate on backend
4. **XSS protection**: Sanitize user input
5. **CORS**: Configure properly

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag 'dist' folder to Netlify
```

---

## 📚 Learn More

- **[Quick Start Guide](./QUICK_START.md)** - Get running in 30 minutes
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Full backend integration
- **[Props Reference](./COMPONENT_PROPS_REFERENCE.md)** - Complete API docs

---

## 🤝 Contributing

This UI is designed to be:
- Modified to fit your needs
- Extended with new features
- Integrated with any backend
- Customized for your brand

---

## 📝 License

MIT License - Use freely in your projects!

---

## 🎯 Next Steps

1. **Read** [QUICK_START.md](./QUICK_START.md) to get running
2. **Review** [COMPONENT_PROPS_REFERENCE.md](./COMPONENT_PROPS_REFERENCE.md) for prop interfaces
3. **Follow** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) to connect your backend
4. **Customize** styles and components for your brand
5. **Deploy** and enjoy!

---

**Built with ❤️ for seamless full-stack integration**

Happy coding! 🚀
