# Component Props Reference

Complete TypeScript interface reference for all Synapse UI components.

---

## 🗂️ Type Definitions

### Common Types

```typescript
// Theme type used across all components
type Theme = 'light' | 'dark';

// Chat object structure
interface Chat {
  id: string;              // Unique identifier (UUID recommended)
  text: string;            // Chat preview text (first message or title)
  time: string;            // Display time (e.g., "2 hours ago", "Yesterday")
  isStarred?: boolean;     // Star status (optional, can be derived)
}

// Message object structure
interface Message {
  id: string;              // Unique message identifier
  role: 'user' | 'assistant'; // Sender role
  content: string;         // Message content (supports markdown)
  timestamp?: string;      // ISO string or formatted time
}

// User object structure
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;         // Avatar URL (optional)
}
```

---

## 📦 Chat Components

### Sidebar

**File:** `/components/chat/Sidebar.tsx`

```typescript
interface SidebarProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  searchQuery: string;                       // Required: Current search text
  onSearchChange: (query: string) => void;   // Required: Search input handler
  starredChats: Chat[];                      // Required: List of starred chats
  allChats: Chat[];                          // Required: List of all chats
  onToggleStar: (chatId: string) => void;    // Required: Star toggle handler
  onNewChat: () => void;                     // Required: New chat button handler
  onChatSelect?: (chatId: string) => void;   // Optional: Chat selection handler
  activeChatId?: string;                     // Optional: Currently active chat ID
}
```

**Usage Example:**
```typescript
<Sidebar
  theme="dark"
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  starredChats={chats.filter(c => c.isStarred)}
  allChats={chats}
  onToggleStar={toggleStar}
  onNewChat={createNewChat}
  onChatSelect={selectChat}
  activeChatId={currentChatId}
/>
```

---

### ChatList

**File:** `/components/chat/ChatList.tsx`

```typescript
interface ChatListProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  starredChats: Chat[];                      // Required: Starred chats array
  allChats: Chat[];                          // Required: All chats array
  onToggleStar: (chatId: string) => void;    // Required: Star toggle handler
  onChatSelect?: (chatId: string) => void;   // Optional: Chat click handler
  activeChatId?: string;                     // Optional: Active chat ID
  onDeleteChat?: (chatId: string) => void;   // Optional: Delete handler
}
```

**Usage Example:**
```typescript
<ChatList
  theme="light"
  starredChats={starred}
  allChats={all}
  onToggleStar={handleStar}
  onChatSelect={handleSelect}
  activeChatId={activeId}
  onDeleteChat={handleDelete}
/>
```

---

### ChatListItem

**File:** `/components/chat/ChatListItem.tsx`

```typescript
interface ChatListItemProps {
  chat: Chat;                                // Required: Chat object
  theme: Theme;                              // Required: 'light' | 'dark'
  isStarred: boolean;                        // Required: Star status
  isActive?: boolean;                        // Optional: Active state
  onToggleStar: () => void;                  // Required: Star handler
  onSelect?: () => void;                     // Optional: Click handler
  onDelete?: () => void;                     // Optional: Delete handler
}
```

**Usage Example:**
```typescript
<ChatListItem
  chat={chatData}
  theme="dark"
  isStarred={chat.isStarred}
  isActive={chat.id === activeId}
  onToggleStar={() => toggleStar(chat.id)}
  onSelect={() => selectChat(chat.id)}
  onDelete={() => deleteChat(chat.id)}
/>
```

---

### Header

**File:** `/components/chat/Header.tsx`

```typescript
interface HeaderProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  onThemeToggle: () => void;                 // Required: Theme toggle handler
  onMenuClick?: () => void;                  // Optional: Mobile menu handler
  onBackClick?: () => void;                  // Optional: Back button handler
  showBackButton?: boolean;                  // Optional: Show back button
  showMenuButton?: boolean;                  // Optional: Show menu button
  userName?: string;                         // Optional: User display name
  userEmail?: string;                        // Optional: User email
  onProfileClick?: () => void;               // Optional: Profile menu handler
  onSettingsClick?: () => void;              // Optional: Settings menu handler
  onLogout?: () => void;                     // Optional: Logout handler
}
```

**Usage Example:**
```typescript
<Header
  theme="dark"
  onThemeToggle={toggleTheme}
  onMenuClick={openMobileMenu}
  showMenuButton={true}
  userName="John Doe"
  userEmail="john@example.com"
  onProfileClick={openProfile}
  onSettingsClick={openSettings}
  onLogout={handleLogout}
/>
```

---

### UserMenu

**File:** `/components/chat/UserMenu.tsx`

```typescript
interface UserMenuProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  userName?: string;                         // Optional: User name (default: "User")
  userEmail?: string;                        // Optional: User email
  userAvatar?: string;                       // Optional: Avatar URL
  onProfileClick?: () => void;               // Optional: Profile click handler
  onSettingsClick?: () => void;              // Optional: Settings click handler
  onLogout?: () => void;                     // Optional: Logout handler
}
```

**Usage Example:**
```typescript
<UserMenu
  theme="light"
  userName="Jane Smith"
  userEmail="jane@example.com"
  userAvatar="/avatars/jane.jpg"
  onProfileClick={openProfile}
  onSettingsClick={openSettings}
  onLogout={logout}
/>
```

---

### ChatWindow

**File:** `/components/chat/ChatWindow.tsx`

```typescript
interface ChatWindowProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  messages: Message[];                       // Required: Messages array
  message: string;                           // Required: Current input value
  onMessageChange: (message: string) => void; // Required: Input change handler
  onSendMessage: () => void;                 // Required: Send message handler
  onStopGeneration?: () => void;             // Optional: Stop generation handler
  isGenerating?: boolean;                    // Optional: Generation state
  placeholder?: string;                      // Optional: Input placeholder
  emptyStateTitle?: string;                  // Optional: Empty state title
  emptyStateDescription?: string;            // Optional: Empty state description
}
```

**Usage Example:**
```typescript
<ChatWindow
  theme="dark"
  messages={messageHistory}
  message={currentInput}
  onMessageChange={setCurrentInput}
  onSendMessage={sendMessage}
  onStopGeneration={stopGeneration}
  isGenerating={generating}
  placeholder="Type your question..."
  emptyStateTitle="Welcome to Synapse"
  emptyStateDescription="Start chatting now!"
/>
```

---

### MessageBubble

**File:** `/components/chat/MessageBubble.tsx`

```typescript
interface MessageBubbleProps {
  message: Message;                          // Required: Message object
  theme: Theme;                              // Required: 'light' | 'dark'
  userName?: string;                         // Optional: User name (default: "You")
  userAvatar?: string;                       // Optional: User avatar URL
}
```

**Usage Example:**
```typescript
<MessageBubble
  message={msg}
  theme="light"
  userName="Alice"
  userAvatar="/avatars/alice.jpg"
/>
```

---

### InputBar

**File:** `/components/chat/InputBar.tsx`

```typescript
interface InputBarProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  message: string;                           // Required: Input value
  onMessageChange: (message: string) => void; // Required: Input handler
  onSendMessage: () => void;                 // Required: Send handler
  onStopGeneration?: () => void;             // Optional: Stop handler
  isGenerating?: boolean;                    // Optional: Generation state
  placeholder?: string;                      // Optional: Placeholder text
  disabled?: boolean;                        // Optional: Disabled state
}
```

**Usage Example:**
```typescript
<InputBar
  theme="dark"
  message={input}
  onMessageChange={setInput}
  onSendMessage={send}
  onStopGeneration={stop}
  isGenerating={loading}
  placeholder="Ask anything..."
  disabled={false}
/>
```

---

## 🔐 Authentication Components

### LoginForm

**File:** `/components/auth/LoginForm.tsx`

```typescript
interface LoginFormProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  email: string;                             // Required: Email input value
  password: string;                          // Required: Password input value
  onEmailChange: (email: string) => void;    // Required: Email change handler
  onPasswordChange: (password: string) => void; // Required: Password change handler
  onSubmit: (e: React.FormEvent) => void;    // Required: Form submit handler
  onSwitchToSignup: () => void;              // Required: Switch to signup handler
  loading?: boolean;                         // Optional: Loading state
  error?: string;                            // Optional: Error message
}
```

**Usage Example:**
```typescript
<LoginForm
  theme="light"
  email={email}
  password={password}
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
  onSubmit={handleLogin}
  onSwitchToSignup={() => setMode('signup')}
  loading={isLoading}
  error={loginError}
/>
```

---

### SignupForm

**File:** `/components/auth/SignupForm.tsx`

```typescript
interface SignupFormProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  name: string;                              // Required: Name input value
  email: string;                             // Required: Email input value
  password: string;                          // Required: Password input value
  confirmPassword: string;                   // Required: Confirm password value
  onNameChange: (name: string) => void;      // Required: Name change handler
  onEmailChange: (email: string) => void;    // Required: Email change handler
  onPasswordChange: (password: string) => void; // Required: Password change handler
  onConfirmPasswordChange: (password: string) => void; // Required: Confirm password handler
  onSubmit: (e: React.FormEvent) => void;    // Required: Form submit handler
  onSwitchToLogin: () => void;               // Required: Switch to login handler
  loading?: boolean;                         // Optional: Loading state
  error?: string;                            // Optional: Error message
}
```

**Usage Example:**
```typescript
<SignupForm
  theme="dark"
  name={name}
  email={email}
  password={password}
  confirmPassword={confirmPassword}
  onNameChange={setName}
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
  onConfirmPasswordChange={setConfirmPassword}
  onSubmit={handleSignup}
  onSwitchToLogin={() => setMode('login')}
  loading={isLoading}
  error={signupError}
/>
```

---

## 🎭 Modal Components

### ProfileModal

**File:** `/components/modals/ProfileModal.tsx`

```typescript
interface ProfileModalProps {
  open: boolean;                             // Required: Modal open state
  onClose: () => void;                       // Required: Close handler
  theme: Theme;                              // Required: 'light' | 'dark'
}
```

**Usage Example:**
```typescript
<ProfileModal
  open={isProfileOpen}
  onClose={() => setIsProfileOpen(false)}
  theme="dark"
/>
```

**Note:** This modal is currently hardcoded with demo data. You should modify it to accept user data props:

```typescript
// Suggested enhanced interface
interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  user?: User;                               // User data
  onSave?: (userData: Partial<User>) => void; // Save handler
}
```

---

### SettingsModal

**File:** `/components/modals/SettingsModal.tsx`

```typescript
interface SettingsModalProps {
  open: boolean;                             // Required: Modal open state
  onClose: () => void;                       // Required: Close handler
  theme: Theme;                              // Required: 'light' | 'dark'
}
```

**Usage Example:**
```typescript
<SettingsModal
  open={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
  theme="light"
/>
```

**Note:** This modal is currently hardcoded. Suggested enhancement:

```typescript
// Suggested enhanced interface
interface Settings {
  model: string;
  responseLength: number;
  creativity: number;
  codeHighlighting: boolean;
  autoSave: boolean;
  sendWithEnter: boolean;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  settings?: Settings;
  onSave?: (settings: Settings) => void;
}
```

---

### AuthModal

**File:** `/components/modals/AuthModal.tsx`

```typescript
interface AuthModalProps {
  open: boolean;                             // Required: Modal open state
  onClose: () => void;                       // Required: Close handler
  theme: Theme;                              // Required: 'light' | 'dark'
  onLogin: (email: string, password: string) => Promise<void>; // Required: Login handler
  onSignup: (name: string, email: string, password: string) => Promise<void>; // Required: Signup handler
}
```

**Usage Example:**
```typescript
<AuthModal
  open={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  theme="dark"
  onLogin={handleLogin}
  onSignup={handleSignup}
/>
```

---

## 📄 Page Components

### ChatPage

**File:** `/components/pages/ChatPage.tsx`

```typescript
interface ChatPageProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  setTheme: (theme: Theme) => void;          // Required: Theme setter
  message: string;                           // Required: Current message input
  setMessage: (message: string) => void;     // Required: Message setter
  searchQuery: string;                       // Required: Search query
  setSearchQuery: (query: string) => void;   // Required: Search setter
  isGenerating: boolean;                     // Required: Generation state
  handleSendOrStop: () => void;              // Required: Send/stop handler
  onLogout: () => void;                      // Required: Logout handler
  onOpenSettings: () => void;                // Required: Open settings handler
  onOpenProfile: () => void;                 // Required: Open profile handler
  starredChats: Chat[];                      // Required: Starred chats
  allChats: Chat[];                          // Required: All chats
  onToggleStar: (chatId: string, isStarred: boolean) => void; // Required: Star toggle
}
```

---

### LandingPage

**File:** `/components/pages/LandingPage.tsx`

```typescript
interface LandingPageProps {
  theme: Theme;                              // Required: 'light' | 'dark'
  setTheme: (theme: Theme) => void;          // Required: Theme setter
  onGetStarted: () => void;                  // Required: Get started handler
}
```

---

## 🎨 Styling Props

All components support the following styling approach:

- **No inline styles** - All styling via Tailwind classes
- **Theme-aware** - Components adapt to `theme` prop
- **Responsive** - Mobile-first design with breakpoints
- **Accessible** - ARIA labels and keyboard navigation

---

## 🔄 Event Handlers

### Common Patterns

```typescript
// Simple click handlers
onClick?: () => void;

// Input change handlers
onChange: (value: string) => void;

// Form submit handlers
onSubmit: (e: React.FormEvent) => void;

// Async handlers
onSave: (data: Data) => Promise<void>;

// Conditional handlers (optional)
onDelete?: (id: string) => void;
```

---

## ✅ Validation Rules

### Email
- Must be valid email format
- Required for login/signup

### Password
- Minimum 8 characters (enforced on backend)
- Required for login/signup

### Chat ID
- String format (UUID recommended)
- Must be unique

### Message Content
- Cannot be empty string
- Trimmed before sending

---

## 🚨 Error Handling

Components accept optional `error` prop for displaying errors:

```typescript
interface ComponentWithError {
  error?: string;  // Error message to display
}
```

Display errors in a consistent format:
```typescript
{error && (
  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
    {error}
  </div>
)}
```

---

## 📱 Responsive Behavior Props

Some components have responsive-specific props:

```typescript
interface ResponsiveProps {
  showMenuButton?: boolean;    // Show mobile menu button
  showBackButton?: boolean;    // Show mobile back button
  isMobileDrawerOpen?: boolean; // Mobile drawer state
}
```

---

## 🎯 Best Practices

1. **Always provide required props** - TypeScript will enforce this
2. **Use callbacks for state changes** - Keep components stateless
3. **Handle loading states** - Show feedback during async operations
4. **Validate inputs** - Both client and server side
5. **Provide meaningful defaults** - For optional props
6. **Type everything** - Use provided interfaces

---

**All props are fully typed with TypeScript for maximum safety!** ✨
