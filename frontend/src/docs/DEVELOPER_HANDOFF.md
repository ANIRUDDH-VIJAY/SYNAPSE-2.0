# Synapse Chatbot - Developer Handoff Guide

Version: 1.0.0  
Last Updated: November 3, 2025

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Design System](#design-system)
4. [Components](#components)
5. [Implementation Notes](#implementation-notes)
6. [API Integration](#api-integration)
7. [Accessibility Checklist](#accessibility-checklist)
8. [Testing Recommendations](#testing-recommendations)
9. [Deployment Notes](#deployment-notes)

---

## 🎯 Project Overview

**Synapse** is an AI chatbot application with a modern, dual-theme interface (Dark/Light). The application features:

- 🎨 Comprehensive design system with design tokens
- 🌗 Dark and Light theme support
- 📱 Responsive layouts (Mobile, Tablet, Desktop)
- ♿ Full accessibility compliance (WCAG 2.1 AA)
- 🔐 Authentication flow with modals
- 💬 Real-time chat interface with streaming support
- ⭐ Thread management (star, archive, delete)
- ⚙️ User settings and profile management

---

## 📁 File Structure

```
/synapse-chatbot
├── /design-tokens
│   └── tokens.json                 # Complete design token set
├── /icons
│   ├── icon-send.svg
│   ├── icon-star-outline.svg
│   ├── icon-star-filled.svg
│   ├── icon-search.svg
│   ├── icon-stop.svg
│   ├── icon-new-chat.svg
│   ├── icon-settings.svg
│   ├── icon-user.svg
│   ├── icon-logout.svg
│   ├── icon-trash.svg
│   ├── icon-archive.svg
│   ├── icon-sun.svg
│   ├── icon-moon.svg
│   ├── icon-copy.svg
│   └── icon-synapse-logo.svg
├── /docs
│   ├── API_CONTRACT.md             # API endpoint specifications
│   ├── COMPONENT_GUIDE.md          # Component usage guide
│   └── DEVELOPER_HANDOFF.md        # This file
├── /components
│   ├── /figma
│   │   └── ImageWithFallback.tsx
│   ├── /modals
│   │   ├── AuthModal.tsx           # Login/Signup modal
│   │   ├── ProfileModal.tsx        # User profile modal
│   │   └── SettingsModal.tsx       # App settings modal
│   ├── /pages
│   │   ├── ChatPage.tsx            # Main chat interface
│   │   └── LandingPage.tsx         # Landing/hero page
│   └── /ui
│       └── [shadcn components]     # UI component library
├── /styles
│   └── globals.css                 # Global styles + CSS variables
└── App.tsx                         # Main application entry
```

---

## 🎨 Design System

### Design Tokens

All design tokens are defined in `/design-tokens/tokens.json` and implemented as CSS custom properties in `/styles/globals.css`.

#### Token Categories

| Category | Examples | Usage |
|----------|----------|-------|
| **Colors** | `--bg`, `--primary`, `--text` | Backgrounds, text, accents |
| **Typography** | `--text-base`, `--font-weight-medium` | Font sizes, weights |
| **Spacing** | `--space-4`, `--space-6` | Padding, margins, gaps |
| **Radii** | `--radius-md`, `--radius-lg` | Border radius |
| **Shadows** | `--shadow-md`, `--shadow-glow-lg` | Box shadows, glows |
| **Motion** | `--motion-default`, `--motion-ease` | Transitions, animations |
| **Layout** | `--sidebar-width`, `--header-height` | Component dimensions |

### CSS Variables Reference

#### Light Theme
```css
:root {
  /* Backgrounds */
  --bg: #ffffff;
  --surface-1: #f8fafc;
  --surface-2: #f1f5f9;
  
  /* Colors */
  --primary: #4f46e5;
  --text: #0f172a;
  --subtext: #475569;
  --border: #e2e8f0;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

#### Dark Theme
```css
.dark {
  /* Backgrounds */
  --bg: #0b1220;
  --surface-1: #0f1a2b;
  --surface-2: #1a2332;
  
  /* Colors */
  --primary: #4f46e5;
  --text: #e6eefc;
  --subtext: #94a3b8;
  --border: #334155;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}
```

### Theme Toggle Implementation

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('dark');

// Apply theme to document
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
```

---

## 🧩 Components

### Key Component Specifications

#### 1. App Shell (Desktop)

**Layout:**
- Sidebar: 320px fixed width
- Header: 64px fixed height
- Main content: Flexbox fill remaining space
- Footer input: Anchored to bottom

```tsx
<div className="flex h-screen">
  <aside className="w-80 bg-surface-1 border-r border-border">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 flex flex-col">
    <header className="h-16 border-b border-border">
      {/* Header */}
    </header>
    <div className="flex-1 overflow-y-auto">
      {/* Content */}
    </div>
    <footer className="p-6 border-t border-border">
      {/* Input area */}
    </footer>
  </main>
</div>
```

#### 2. Send/Stop Button

**Behavior:**
- Default state: Send icon with glow effect
- Generating state: Stop icon (square)
- On click: Toggle between sending and stopping

```tsx
<Button
  onClick={handleSendOrStop}
  className={`
    transition-all duration-220 ease-[cubic-bezier(0.2,0.8,0.2,1)]
    ${isGenerating 
      ? 'bg-danger hover:bg-danger-dark' 
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 glow-primary'
    }
  `}
>
  {isGenerating ? (
    <Square className="w-4 h-4" />
  ) : (
    <Send className="w-4 h-4" />
  )}
</Button>
```

**CSS for Glow:**
```css
.glow-primary {
  box-shadow: 0 0 20px var(--glow);
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--glow); }
  50% { box-shadow: 0 0 30px var(--glow); }
}
```

#### 3. Settings Modal

**Size:** 800px (medium)  
**Sections:** Model, Behaviour, Account & Privacy

**Key Controls:**
- Model Select: Dropdown with "Recommended" badge
- Response Length: Slider with labels + presets
- Temperature: Slider (0.0-1.0) + numeric input
- Toggles: Streaming, Code highlighting, Auto-save, Send with Enter

**Footer:**
- Left: "Unsaved changes" indicator (conditional)
- Right: Cancel, Reset, Save buttons

```tsx
<DialogFooter className="flex justify-between">
  <div>
    {hasChanges && (
      <Badge variant="outline">Unsaved changes</Badge>
    )}
  </div>
  <div className="flex gap-2">
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="ghost" onClick={onReset}>
      Reset to defaults
    </Button>
    <Button onClick={onSave} disabled={!hasChanges}>
      Save changes
    </Button>
  </div>
</DialogFooter>
```

#### 4. Auth Modal

**Tabs:** Login / Sign Up  
**Features:**
- Email/password fields
- Show/hide password toggle
- Social OAuth buttons (Google, GitHub)
- Inline validation
- Terms of Service links

```tsx
<Tabs defaultValue="login">
  <TabsList>
    <TabsTrigger value="login">Login</TabsTrigger>
    <TabsTrigger value="signup">Sign Up</TabsTrigger>
  </TabsList>
  <TabsContent value="login">
    {/* Login form */}
  </TabsContent>
  <TabsContent value="signup">
    {/* Signup form */}
  </TabsContent>
</Tabs>
```

#### 5. Star Toggle

**States:**
- Unstarred: Outline star icon
- Starred: Filled yellow star
- Hover: Scale + shadow effect

```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => toggleStar(threadId)}
  className="transition-transform hover:scale-110"
>
  {isStarred ? (
    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
  ) : (
    <Star className="w-4 h-4" />
  )}
</Button>
```

**API Integration:**
```tsx
const toggleStar = async (threadId: string) => {
  try {
    if (isStarred) {
      await fetch(`/api/threads/${threadId}/star`, { method: 'DELETE' });
    } else {
      await fetch(`/api/threads/${threadId}/star`, { method: 'POST' });
    }
    setIsStarred(!isStarred);
  } catch (error) {
    toast.error('Failed to update star status');
  }
};
```

#### 6. Prompt Chips (Auto-send)

**Behavior:**
- Click chip → auto-populate input → auto-send
- Hover: Lift effect + border highlight

```tsx
const examplePrompts = [
  "Explain quantum computing",
  "Write a React component",
  "Debug this code"
];

<div className="flex gap-2 flex-wrap">
  {examplePrompts.map((prompt) => (
    <button
      key={prompt}
      onClick={() => {
        setMessage(prompt);
        handleSendMessage(prompt);
      }}
      className="chip"
    >
      {prompt}
    </button>
  ))}
</div>
```

```css
.chip {
  padding: 0.5rem 1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 9999px;
  transition: all 120ms var(--motion-ease);
}

.chip:hover {
  background: var(--surface-3);
  border-color: var(--primary);
  transform: translateY(-2px);
}
```

---

## 💻 Implementation Notes

### State Management

**App-level State:**
```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('dark');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [message, setMessage] = useState('');
const [isGenerating, setIsGenerating] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

**Settings State:**
```tsx
const [settings, setSettings] = useState({
  model: 'synapse-v1-text',
  responseLength: 'medium',
  maxTokens: 512,
  temperature: 0.7,
  streamResponses: true,
  codeHighlight: true,
  autoSave: '30d',
  sendWithEnter: true,
  allowConversationOverride: true
});
```

### Loading States

**Display loading indicators for:**
1. API calls (fetch data)
2. Message generation (streaming)
3. Settings save operation
4. Login/signup process

```tsx
{isLoading ? (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Loading...</span>
  </div>
) : (
  <YourComponent />
)}
```

### Error Handling

**Toast Notifications:**
```tsx
import { toast } from 'sonner';

// Success
toast.success('Settings saved successfully');

// Error
toast.error('Failed to save settings');

// Info
toast.info('Processing your request...');

// With custom duration
toast.success('Saved!', { duration: 2000 });
```

**Error Boundaries:**
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Optimistic Updates

**For better UX, update UI immediately:**
```tsx
const handleStarToggle = async (threadId: string) => {
  // Optimistic update
  setThreads(threads.map(t => 
    t.id === threadId ? { ...t, starred: !t.starred } : t
  ));
  
  try {
    await updateStarStatus(threadId);
  } catch (error) {
    // Rollback on error
    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, starred: !t.starred } : t
    ));
    toast.error('Failed to update');
  }
};
```

### Streaming Implementation

**Using Fetch API:**
```tsx
const streamMessage = async (message: string) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, stream: true })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let content = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'token') {
          content += data.content;
          setStreamingContent(content);
        }
      }
    }
  }
};
```

---

## 🔌 API Integration

See `/docs/API_CONTRACT.md` for complete API specifications.

### Quick Reference

**Authentication:**
```tsx
// Login
POST /api/auth/login
Body: { email, password }

// Signup
POST /api/auth/signup
Body: { name, email, password }
```

**Settings:**
```tsx
// Get settings
GET /api/user/settings

// Update settings (partial)
PUT /api/user/settings
Body: { theme: 'dark', temperature: 0.8 }
```

**Threads:**
```tsx
// List threads
GET /api/threads?filter=starred

// Star thread
POST /api/threads/:threadId/star

// Unstar thread
DELETE /api/threads/:threadId/star
```

**Messages:**
```tsx
// Send message
POST /api/threads/:threadId/messages
Body: { content: string, stream: boolean }
```

### API Helper Functions

```tsx
// api/client.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // ... put, delete methods
};
```

---

## ♿ Accessibility Checklist

### ✅ Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus states are clearly visible
- [ ] Escape key closes modals
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work on sliders and selects

### ✅ Screen Reader Support

- [ ] All images have `alt` attributes
- [ ] Icon buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements
- [ ] ARIA live regions announce dynamic content
- [ ] Modal has `aria-labelledby` and `aria-describedby`
- [ ] Loading states use `aria-busy`

### ✅ Color & Contrast

- [ ] Text contrast meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] UI elements have 3:1 contrast ratio
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators are visible in both themes

### ✅ Motion & Animation

- [ ] Respect `prefers-reduced-motion` media query
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ✅ Forms

- [ ] Form validation provides clear error messages
- [ ] Error messages are associated with inputs (aria-describedby)
- [ ] Required fields are marked with `aria-required`
- [ ] Form submission success/failure is announced

---

## 🧪 Testing Recommendations

### Unit Tests

**Test components in isolation:**
```tsx
// Button.test.tsx
describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Tests

**Test user workflows:**
```tsx
// Login.test.tsx
describe('Login Flow', () => {
  it('allows user to login successfully', async () => {
    render(<App />);
    
    // Click login button
    fireEvent.click(screen.getByText('Login / Sign Up'));
    
    // Fill in credentials
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright/Cypress)

**Test critical paths:**
```typescript
// e2e/chat.spec.ts
test('user can send a message and receive response', async ({ page }) => {
  await page.goto('/');
  
  // Login
  await page.click('text=Login / Sign Up');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button:has-text("Login")');
  
  // Send message
  await page.fill('[placeholder="Type your message..."]', 'Hello AI');
  await page.click('button[aria-label="Send message"]');
  
  // Wait for response
  await page.waitForSelector('.message-assistant');
  
  // Verify message appeared
  expect(await page.textContent('.message-user')).toContain('Hello AI');
});
```

### Accessibility Testing

**Use axe-core for automated a11y testing:**
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🚀 Deployment Notes

### Environment Variables

```env
# .env.production
REACT_APP_API_URL=https://api.synapse.ai/v1
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Build Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['./src/components/ui'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

### Performance Checklist

- [ ] Code splitting implemented
- [ ] Images optimized and lazy-loaded
- [ ] Fonts preloaded
- [ ] CSS purged of unused styles
- [ ] Bundle size analyzed
- [ ] Lighthouse score > 90

### Browser Support

**Target browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Polyfills needed:**
- None (modern browsers only)

---

## 📝 Additional Resources

- **Design Tokens:** `/design-tokens/tokens.json`
- **API Documentation:** `/docs/API_CONTRACT.md`
- **Component Guide:** `/docs/COMPONENT_GUIDE.md`
- **Icons:** `/icons/*.svg`

---

## 🤝 Support & Questions

For technical questions or clarifications:
1. Check the documentation files first
2. Review the design tokens and component guide
3. Inspect the existing component implementations
4. Contact the design team for visual clarifications

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0  
**Prepared by:** Synapse Design Team
