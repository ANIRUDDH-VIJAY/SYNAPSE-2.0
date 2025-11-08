# Synapse UI - Architecture Documentation

Complete architectural overview of the Synapse chatbot UI component library.

---

## 🏗️ Architecture Overview

### Design Philosophy

Synapse UI follows a **stateless, component-based architecture** designed for maximum flexibility and backend integration:

1. **Presentation Components** - All components are UI-only (no business logic)
2. **Props-Driven** - All data flows through props
3. **Callback Pattern** - Actions bubble up through callbacks
4. **Type-Safe** - Full TypeScript support throughout
5. **Theme-Aware** - Light/Dark modes built-in
6. **Responsive-First** - Mobile, tablet, desktop optimized

---

## 📂 Complete File Structure

```
synapse-ui/
│
├── 📄 App.tsx                          # Root component with state
├── 📄 main.tsx                         # Application entry point
├── 📄 index.html                       # HTML template
│
├── 📁 components/                      # All React components
│   │
│   ├── 📁 chat/                        # ⭐ NEW: Chat UI components
│   │   ├── Sidebar.tsx                 # Chat history sidebar
│   │   ├── ChatList.tsx                # Starred & all chats lists
│   │   ├── ChatListItem.tsx            # Individual chat item
│   │   ├── Header.tsx                  # Top navigation bar
│   │   ├── UserMenu.tsx                # User dropdown menu
│   │   ├── ChatWindow.tsx              # Main chat area
│   │   ├── MessageBubble.tsx           # Individual message
│   │   └── InputBar.tsx                # Message input field
│   │
│   ├── 📁 auth/                        # ⭐ NEW: Authentication forms
│   │   ├── LoginForm.tsx               # Login form component
│   │   └── SignupForm.tsx              # Signup form component
│   │
│   ├── 📁 modals/                      # Modal dialog components
│   │   ├── AuthModal.tsx               # Authentication modal
│   │   ├── ProfileModal.tsx            # User profile modal
│   │   └── SettingsModal.tsx           # Settings modal
│   │
│   ├── 📁 pages/                       # Full-page components
│   │   ├── ChatPage.tsx                # Main chat interface
│   │   └── LandingPage.tsx             # Landing/welcome page
│   │
│   ├── 📁 figma/                       # Figma integration utilities
│   │   └── ImageWithFallback.tsx       # Image component with fallback
│   │
│   └── 📁 ui/                          # ShadCN UI components
│       ├── button.tsx                  # Button component
│       ├── input.tsx                   # Input component
│       ├── dialog.tsx                  # Dialog/modal component
│       ├── dropdown-menu.tsx           # Dropdown menu
│       ├── avatar.tsx                  # Avatar component
│       ├── scroll-area.tsx             # Scrollable area
│       ├── sheet.tsx                   # Drawer/sheet component
│       ├── textarea.tsx                # Textarea component
│       ├── label.tsx                   # Form label
│       ├── switch.tsx                  # Toggle switch
│       ├── slider.tsx                  # Slider component
│       ├── select.tsx                  # Select dropdown
│       ├── badge.tsx                   # Badge component
│       ├── use-mobile.ts               # Mobile detection hook
│       └── ... (other ShadCN components)
│
├── 📁 styles/                          # Styling files
│   └── globals.css                     # Global styles & Tailwind
│
├── 📁 icons/                           # SVG icon assets
│   ├── icon-send.svg
│   ├── icon-star-filled.svg
│   ├── icon-synapse-logo.svg
│   └── ... (other icons)
│
├── 📁 docs/                            # Additional documentation
│   ├── COMPONENT_GUIDE.md              # Component usage guide
│   ├── API_CONTRACT.md                 # API contract specs
│   ├── DEVELOPER_HANDOFF.md            # Developer handoff doc
│   ├── ACCESSIBILITY_CHECKLIST.md      # A11y guidelines
│   └── README.md                       # Docs overview
│
├── 📁 design-tokens/                   # Design system tokens
│   └── tokens.json                     # Color, spacing, etc.
│
├── 📁 guidelines/                      # Design guidelines
│   └── Guidelines.md                   # Design system guide
│
├── 📄 ⭐ README_INTEGRATION.md          # Main integration README
├── 📄 ⭐ QUICK_START.md                 # Quick start guide
├── 📄 ⭐ INTEGRATION_GUIDE.md           # Full integration guide
├── 📄 ⭐ COMPONENT_PROPS_REFERENCE.md   # Props documentation
├── 📄 ⭐ EXAMPLE_USAGE.md               # Usage examples
├── 📄 ⭐ ARCHITECTURE.md                # This file
│
├── 📄 package.json                     # Dependencies
├── 📄 tsconfig.json                    # TypeScript config
├── 📄 tailwind.config.js               # Tailwind config
└── 📄 vite.config.ts                   # Vite config

⭐ = NEW documentation files for backend integration
```

---

## 🔄 Data Flow Architecture

### Top-Down Data Flow

```
┌─────────────────────────────────────────┐
│           App.tsx (State)               │
│  • Authentication state                 │
│  • Theme preference                     │
│  • Chat data                            │
│  • Messages                             │
│  • UI state (modals, etc.)             │
└────────────┬────────────────────────────┘
             │
             ├──→ Props ──→ Components
             │
             └──→ Callbacks ←── User Actions
```

### Component Communication

```
User Action → Component → Callback → Parent → State Update → Re-render → Component
```

**Example:**
```
1. User clicks send button
2. InputBar calls onSendMessage()
3. Callback goes to ChatWindow
4. ChatWindow calls parent's handleSend()
5. App.tsx updates messages state
6. New messages prop flows down to ChatWindow
7. MessageBubble components render new messages
```

---

## 🧩 Component Hierarchy

### Visual Component Tree

```
App
│
├── LandingPage (if not authenticated)
│   ├── Header
│   └── AuthModal
│       ├── LoginForm
│       └── SignupForm
│
└── ChatPage (if authenticated)
    │
    ├── Desktop Layout (≥768px)
    │   ├── Sidebar
    │   │   ├── Logo & Search
    │   │   └── ChatList
    │   │       ├── Starred Section
    │   │       │   └── ChatListItem[]
    │   │       └── All Chats Section
    │   │           └── ChatListItem[]
    │   │
    │   └── Main Area
    │       ├── Header
    │       │   ├── Theme Toggle
    │       │   └── UserMenu
    │       │
    │       └── ChatWindow
    │           ├── Messages Area
    │           │   └── MessageBubble[]
    │           └── InputBar
    │
    └── Mobile Layout (<768px)
        ├── Header (with menu button)
        ├── Sheet (Drawer)
        │   └── Sidebar content
        └── ChatWindow
            ├── Messages Area
            │   └── MessageBubble[]
            └── InputBar
```

---

## 📊 State Management

### Application State

```typescript
interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // UI State
  theme: 'light' | 'dark';
  isMobileDrawerOpen: boolean;
  activeModal: 'none' | 'auth' | 'settings' | 'profile';

  // Chat State
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  searchQuery: string;

  // Input State
  currentMessage: string;
  isGenerating: boolean;
}
```

### State Location Options

**1. Component State (useState)**
```typescript
// Good for: Simple apps, prototypes
const [messages, setMessages] = useState([]);
```

**2. Context API**
```typescript
// Good for: Moderate apps, theme state
const { theme, setTheme } = useTheme();
```

**3. Zustand**
```typescript
// Good for: Most apps, recommended
const { chats, loadChats } = useChatStore();
```

**4. Redux**
```typescript
// Good for: Large apps, complex state
const messages = useSelector(state => state.chat.messages);
```

---

## 🔌 Integration Points

### Where Backend Connects

#### 1. Authentication

```typescript
// Login/Signup
LoginForm → onSubmit → API.login() → Store token → Update auth state

// Token verification
App mount → Check localStorage → API.verify() → Restore session
```

#### 2. Chat List

```typescript
// Load chats
ChatPage mount → API.getChats() → Update chats state → Pass to Sidebar

// Star/Unstar
ChatListItem → onToggleStar → API.toggleStar() → Reload chats
```

#### 3. Messages

```typescript
// Load messages
Chat selection → API.getMessages(chatId) → Update messages → Pass to ChatWindow

// Send message
InputBar → onSendMessage → API.sendMessage() → Append to messages
```

#### 4. Real-time Updates

```typescript
// WebSocket connection
ChatPage → Establish WS → Listen for events → Update state on events

// Server-Sent Events
API.streamMessage() → Read chunks → Update message content progressively
```

---

## 🎨 Styling Architecture

### Tailwind CSS Strategy

#### 1. Global Styles (`styles/globals.css`)

```css
/* Design tokens */
:root {
  --color-primary: ...;
  --spacing-unit: ...;
}

/* Base typography */
h1, h2, h3 { ... }
p { ... }

/* Utility classes */
.glass-effect { ... }
```

#### 2. Component Styles

```typescript
// Inline Tailwind classes
<div className="flex items-center gap-2 px-4 py-2">

// Conditional styling
<div className={`
  ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}
  ${isActive ? 'border-blue-500' : 'border-transparent'}
`}>

// Dynamic Tailwind (avoid!)
// ❌ className={`text-${color}-500`}  // Doesn't work!
// ✅ className={color === 'blue' ? 'text-blue-500' : 'text-red-500'}
```

#### 3. Theme System

```typescript
// Theme prop passed to all components
theme: 'light' | 'dark'

// Components adapt styling based on theme
const isLight = theme === 'light';

<div className={isLight ? 'bg-white' : 'bg-slate-900'}>
```

---

## 📱 Responsive Strategy

### Breakpoint System

| Breakpoint | Screen Size | Layout |
|------------|-------------|--------|
| `< 768px` | Mobile | Drawer navigation, full-screen modals |
| `768px - 1024px` | Tablet | Collapsible sidebar |
| `> 1024px` | Desktop | Sidebar open by default |

### Implementation

```typescript
// Tailwind breakpoints
<div className="hidden md:block">         {/* Desktop only */}
<div className="md:hidden">               {/* Mobile only */}
<div className="w-full md:w-80">         {/* Responsive width */}

// useIsMobile hook
const isMobile = useIsMobile();  // < 768px

// Conditional rendering
{isMobile ? <MobileView /> : <DesktopView />}
```

---

## 🔒 Security Architecture

### Security Boundaries

```
Frontend (This UI)
├── Input validation (basic)
├── XSS prevention (React escaping)
└── Token storage (localStorage)
          ↓
    [ API Calls ]
          ↓
Backend (Your Responsibility)
├── Authentication
├── Authorization
├── Input validation (strict)
├── Rate limiting
├── SQL injection prevention
└── Business logic
```

### Best Practices

1. **Never trust frontend** - Validate everything on backend
2. **Store tokens securely** - Consider httpOnly cookies
3. **Use HTTPS** - Always in production
4. **Sanitize input** - On backend before storage
5. **Rate limit** - Prevent abuse

---

## 🚀 Performance Optimization

### Built-in Optimizations

1. **Code Splitting**
   ```typescript
   // Lazy load modals
   const ProfileModal = lazy(() => import('./modals/ProfileModal'));
   ```

2. **Memo Components**
   ```typescript
   // Prevent unnecessary re-renders
   export const MessageBubble = React.memo(MessageBubbleComponent);
   ```

3. **Virtual Scrolling** (if needed)
   ```typescript
   // For large message lists
   import { useVirtual } from 'react-virtual';
   ```

4. **Debounced Search**
   ```typescript
   // Reduce API calls
   const debouncedSearch = useMemo(
     () => debounce(search, 300),
     []
   );
   ```

---

## 🧪 Testing Strategy

### Component Testing

```typescript
// Example test structure
describe('ChatWindow', () => {
  it('renders empty state', () => {
    render(<ChatWindow theme="dark" messages={[]} ... />);
    expect(screen.getByText(/start a new conversation/i)).toBeInTheDocument();
  });

  it('sends message on button click', () => {
    const handleSend = jest.fn();
    render(<ChatWindow onSendMessage={handleSend} ... />);
    // ... trigger send
    expect(handleSend).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
// Test full flow
describe('Chat Flow', () => {
  it('allows user to send and receive messages', async () => {
    // Mock API
    mockApi.sendMessage.mockResolvedValue({ ... });
    
    // Render app
    render(<App />);
    
    // Interact
    const input = screen.getByPlaceholderText(/type your message/i);
    await userEvent.type(input, 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
```

---

## 📈 Scalability Considerations

### Current Architecture Supports:

✅ **Hundreds of chats** - Virtualize if needed  
✅ **Thousands of messages** - Paginate & virtual scroll  
✅ **Multiple themes** - Easily extensible  
✅ **New features** - Component-based, easy to add  
✅ **Different backends** - API client abstraction  
✅ **Internationalization** - Add i18n wrapper  

### Future Enhancements:

- Message search/filtering
- File uploads
- Voice messages
- Video chat
- Collaborative features
- Plugin system

---

## 🎯 Design Patterns Used

1. **Composition** - Build complex UIs from simple components
2. **Props Pattern** - Data flows top-down
3. **Callback Pattern** - Events bubble up
4. **Render Props** - Flexible component customization
5. **Controlled Components** - Form inputs controlled by React
6. **Container/Presenter** - Logic vs presentation separation

---

## 📚 Technology Decisions

| Choice | Reason |
|--------|--------|
| **React** | Industry standard, large ecosystem |
| **TypeScript** | Type safety, better DX |
| **Tailwind** | Utility-first, no CSS files, fast |
| **ShadCN** | Accessible, customizable, owned code |
| **Vite** | Fast builds, modern tooling |
| **Stateless Components** | Easy backend integration |

---

## 🔄 Migration Path

### From This UI to Production

```
1. Install & Test
   ├── npm install
   ├── Test with mock data
   └── Verify all features work

2. Customize
   ├── Update design tokens
   ├── Modify components as needed
   └── Add your branding

3. Backend Integration
   ├── Create API client
   ├── Connect authentication
   ├── Connect chat endpoints
   └── Test with real data

4. Add Features
   ├── Implement your business logic
   ├── Add custom components
   └── Extend functionality

5. Production
   ├── Environment variables
   ├── Error tracking
   ├── Analytics
   └── Deploy
```

---

## 📖 Related Documentation

- **[README_INTEGRATION.md](./README_INTEGRATION.md)** - Main overview
- **[QUICK_START.md](./QUICK_START.md)** - Get started fast
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Backend integration
- **[COMPONENT_PROPS_REFERENCE.md](./COMPONENT_PROPS_REFERENCE.md)** - All props
- **[EXAMPLE_USAGE.md](./EXAMPLE_USAGE.md)** - Code examples

---

**Architecture designed for flexibility, scalability, and ease of integration.** 🎯
