# Synapse Chatbot - Component Usage Guide

Version: 1.0.0  
Last Updated: November 3, 2025

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Variants](#component-variants)
3. [Layout Components](#layout-components)
4. [Interactive Components](#interactive-components)
5. [Accessibility Guidelines](#accessibility-guidelines)
6. [Animation Specifications](#animation-specifications)

---

## Design Tokens

All components use CSS custom properties (variables) for consistent theming. Reference `/design-tokens/tokens.json` for the complete token set.

### Usage Example

```css
.my-component {
  background: var(--surface-1);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition: all var(--motion-default) var(--motion-ease);
}

.my-component:hover {
  box-shadow: var(--shadow-md);
}
```

### Token Categories

#### Colors
- `--bg`, `--surface-1`, `--surface-2`, `--surface-3` - Background layers
- `--primary`, `--primary-400`, `--primary-600` - Brand colors
- `--text`, `--subtext`, `--text-muted` - Text colors
- `--border`, `--focus-ring` - UI element colors

#### Typography
- `--text-{size}` - Font sizes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- `--font-weight-{weight}` - Font weights (normal, medium, semibold, bold)
- `--line-height-{height}` - Line heights (tight, normal, relaxed)

#### Spacing
- `--space-{number}` - Spacing scale (1-16 in increments)

#### Motion
- `--motion-fast`, `--motion-default`, `--motion-slow` - Durations
- `--motion-ease`, `--motion-ease-in`, `--motion-ease-out`, `--motion-bounce` - Easing functions

---

## Component Variants

### Button

#### Variants

**Primary Button**
```tsx
<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
  Primary Action
</Button>
```

CSS:
```css
.button-primary {
  background: linear-gradient(to right, var(--primary-600), var(--primary));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--motion-default) var(--motion-ease);
  box-shadow: var(--shadow-md);
}

.button-primary:hover {
  background: linear-gradient(to right, var(--primary-700), var(--primary-600));
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.button-primary:active {
  transform: translateY(0);
}
```

**Secondary Button**
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```

**Ghost Button**
```tsx
<Button variant="ghost">
  Ghost Action
</Button>
```

**Icon Button**
```tsx
<Button size="icon" className="rounded-xl">
  <Send className="w-4 h-4" />
</Button>
```

#### States
- **Default:** Normal state
- **Hover:** Slight lift effect + enhanced shadow
- **Active:** Pressed state
- **Focus:** Focus ring visible for keyboard navigation
- **Disabled:** Reduced opacity, no interaction

---

### Input

#### Text Input

```tsx
<Input
  type="text"
  placeholder="Enter text..."
  className="bg-surface-1 border-border focus:border-primary"
/>
```

CSS:
```css
.input-text {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--text);
  font-size: var(--text-base);
  transition: border-color var(--motion-default) var(--motion-ease);
}

.input-text:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring-opacity);
}

.input-text::placeholder {
  color: var(--text-muted);
}

.input-text:disabled {
  background: var(--surface-2);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Input with Icon

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
  <Input className="pl-9" placeholder="Search..." />
</div>
```

#### Textarea

```tsx
<Textarea
  placeholder="Enter message..."
  rows={4}
  className="resize-none"
/>
```

---

### Toggle/Switch

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

CSS:
```css
.switch {
  width: 44px;
  height: 24px;
  background: var(--muted);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--motion-default) var(--motion-ease);
}

.switch[data-state="checked"] {
  background: var(--primary);
}

.switch-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform var(--motion-default) var(--motion-ease);
}

.switch[data-state="checked"] .switch-thumb {
  transform: translateX(20px);
}
```

---

### Slider

```tsx
<Slider
  value={[temperature]}
  onValueChange={(value) => setTemperature(value[0])}
  min={0}
  max={1}
  step={0.1}
/>
```

CSS:
```css
.slider-track {
  height: 6px;
  background: var(--surface-2);
  border-radius: var(--radius-full);
}

.slider-range {
  background: var(--primary);
  height: 100%;
  border-radius: var(--radius-full);
}

.slider-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border: 2px solid var(--primary);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--motion-fast) var(--motion-ease);
}

.slider-thumb:hover {
  transform: scale(1.1);
}

.slider-thumb:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-ring-opacity);
}
```

---

### Modal/Dialog

#### Sizes
- **Small (sm):** 400px width
- **Medium (md):** 800px width
- **Large (lg):** 1100px width

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[800px]">
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

CSS:
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: var(--z-modal);
  animation: fadeIn var(--motion-default) var(--motion-ease);
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 85vh;
  overflow-y: auto;
  animation: scaleIn var(--motion-default) var(--motion-ease);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

---

### Card

```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Feature Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

CSS:
```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--motion-default) var(--motion-ease);
}

.card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
}
```

#### Feature Card (3-up Grid)

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card className="hover:scale-105 transition-transform">
    <CardHeader>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-6 h-6 text-primary" />
      </div>
      <CardTitle>Ask Questions</CardTitle>
    </CardHeader>
    <CardContent>
      Get instant answers to any question
    </CardContent>
  </Card>
</div>
```

---

### Avatar

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Sizes
- `xs`: 24px
- `sm`: 32px
- `md`: 40px (default)
- `lg`: 56px

---

### Badge/Pill

```tsx
<Badge variant="default">Model Active</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="outline">Pro</Badge>
```

CSS:
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
}

.badge-default {
  background: var(--primary);
  color: white;
}

.badge-secondary {
  background: var(--surface-2);
  color: var(--subtext);
}
```

---

### Toast Notification

```tsx
import { toast } from 'sonner';

toast.success('Settings saved successfully');
toast.error('Failed to save settings');
toast.info('Processing your request...');
```

CSS:
```css
.toast {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-lg);
  animation: slideIn var(--motion-default) var(--motion-ease);
}

.toast-success {
  border-left: 4px solid var(--success);
}

.toast-error {
  border-left: 4px solid var(--danger);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## Layout Components

### App Shell

```tsx
<div className="flex h-screen">
  {/* Sidebar - 320px */}
  <aside className="w-80 border-r border-border bg-surface-1">
    {/* Sidebar content */}
  </aside>
  
  {/* Main Area */}
  <main className="flex-1 flex flex-col">
    {/* Header - 64px */}
    <header className="h-16 border-b border-border px-6 flex items-center">
      {/* Header content */}
    </header>
    
    {/* Content */}
    <div className="flex-1 overflow-y-auto">
      {/* Page content */}
    </div>
    
    {/* Footer Input */}
    <div className="p-6 border-t border-border">
      {/* Input area */}
    </div>
  </main>
</div>
```

### Responsive Layout

```tsx
// Mobile: Collapsible sidebar
<Sheet>
  <SheetTrigger asChild>
    <Button size="icon" variant="ghost">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-80">
    {/* Sidebar content */}
  </SheetContent>
</Sheet>
```

---

## Interactive Components

### Send/Stop Button Toggle

```tsx
<Button
  onClick={handleSendOrStop}
  className={`glow-primary ${isGenerating ? 'bg-danger' : 'bg-primary'}`}
>
  {isGenerating ? (
    <Square className="w-4 h-4" />
  ) : (
    <Send className="w-4 h-4" />
  )}
</Button>
```

CSS for Glow Effect:
```css
.glow-primary {
  box-shadow: 0 0 20px var(--glow);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px var(--glow);
  }
  50% {
    box-shadow: 0 0 30px var(--glow);
  }
}
```

### Star Toggle

```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleStarToggle(threadId)}
>
  {isStarred ? (
    <Star className="w-4 h-4 fill-current text-yellow-500" />
  ) : (
    <Star className="w-4 h-4" />
  )}
</Button>
```

### Prompt Chips (Auto-send)

```tsx
<div className="flex gap-2 flex-wrap">
  {examplePrompts.map((prompt) => (
    <button
      key={prompt}
      onClick={() => handleAutoSend(prompt)}
      className="chip"
    >
      {prompt}
    </button>
  ))}
</div>
```

CSS:
```css
.chip {
  padding: var(--space-2) var(--space-4);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--motion-fast) var(--motion-ease);
}

.chip:hover {
  background: var(--surface-3);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.chip:active {
  transform: translateY(0);
}
```

---

## Accessibility Guidelines

### Keyboard Navigation

All interactive elements must be keyboard accessible:

1. **Tab Order:** Logical flow through the interface
2. **Enter/Space:** Activate buttons and toggles
3. **Arrow Keys:** Navigate sliders and dropdowns
4. **Escape:** Close modals and dialogs

### Focus States

```css
.focusable:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### ARIA Labels

```tsx
// Button without visible text
<Button aria-label="Send message">
  <Send className="w-4 h-4" />
</Button>

// Toggle state
<Switch
  aria-label="Enable streaming"
  aria-checked={isStreaming}
/>

// Modal
<Dialog
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <DialogTitle id="modal-title">Settings</DialogTitle>
</Dialog>
```

### Color Contrast

- **Body Text:** Minimum 4.5:1 contrast ratio
- **Large Text (18px+):** Minimum 3:1 contrast ratio
- **UI Elements:** Minimum 3:1 contrast ratio

### Screen Reader Support

```tsx
// Status announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// Loading state
<Button disabled aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

---

## Animation Specifications

### Button Hover/Active

```css
.button {
  transition: all 150ms var(--motion-ease);
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: translateY(0);
  transition-duration: 50ms;
}
```

### Modal Open/Close

```css
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.modal-content {
  animation: modalFadeIn 180ms var(--motion-ease);
}
```

### Message Arrival

```css
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.message-assistant {
  animation: slideInFromLeft 180ms var(--motion-ease);
}

.message-user {
  animation: slideInFromRight 180ms var(--motion-ease);
}
```

### Streaming/Typing Indicator

```tsx
<div className="flex gap-1">
  <span className="dot animate-bounce" style={{ animationDelay: '0ms' }} />
  <span className="dot animate-bounce" style={{ animationDelay: '150ms' }} />
  <span className="dot animate-bounce" style={{ animationDelay: '300ms' }} />
</div>
```

CSS:
```css
.dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}
```

### Send Button Glow Pulse

```css
.send-button {
  box-shadow: 0 0 15px var(--glow);
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 15px var(--glow);
  }
  50% {
    box-shadow: 0 0 25px var(--glow);
  }
}

.send-button:hover {
  box-shadow: 0 0 30px var(--glow);
  animation: none;
}
```

---

## Responsive Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: >= 1024px */
@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Wide Desktop: >= 1440px */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

---

## Code Block Styling

```tsx
<pre className="code-block">
  <code className="language-javascript">
    {codeString}
  </code>
</pre>
```

CSS:
```css
.code-block {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
}

.code-block code {
  color: var(--text);
}

/* Syntax highlighting (example) */
.token.keyword {
  color: #c678dd;
}

.token.string {
  color: #98c379;
}

.token.function {
  color: #61afef;
}
```

---

## Best Practices

1. **Always use design tokens** instead of hard-coded values
2. **Implement proper focus states** for keyboard navigation
3. **Provide loading states** for async operations
4. **Use semantic HTML** elements when possible
5. **Test with screen readers** to ensure accessibility
6. **Implement responsive designs** that work on all screen sizes
7. **Optimize animations** for reduced motion preferences
8. **Maintain consistent spacing** using the spacing scale
9. **Follow naming conventions** for CSS classes and components
10. **Document custom components** with usage examples

---

For questions or clarifications, refer to the design tokens file or API contract documentation.
